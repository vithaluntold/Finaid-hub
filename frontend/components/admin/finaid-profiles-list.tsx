"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  Edit,
  Trash2,
  FileText,
  Video,
  BookOpen,
  BarChart,
  Music,
  File,
  Mail,
} from "lucide-react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";

interface ContentListProps {
  contentType?: "article" | "video" | "course" | "audio" | "document";
}

export function FinaidProfilesList({ contentType }: ContentListProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedContent, setSelectedContent] = useState<null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allFinaidProfileList, setAllFinaidProfileList] = useState([]);

  // functions

  async function getAllFinaidProfileList() {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/finaid-profiles`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.data?.length > 0) {
        setAllFinaidProfileList(response?.data?.data);
      }

      setIsLoading(false);
      console.log(response, "Get all finaid profile response");
    } catch (error) {
      setIsLoading(false);
      console.log("All finaid profile error", error);
    }
  }

  const deleteFinaidProfile = async (id) => {
    setIsLoading(true);

    try {
      let response = await axios.delete(
        `${backendBaseURL}/api/v1/finaid-profiles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(response, "Delete Finaid Profile API response");
      if (response?.status === 200) {
        showToast({
          title: "Deleted Successfully!",
          description: response?.data?.message,
        });
        window.location.reload();
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to delete Finaid!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Error while trying to delete Finaid!");
    }
  };

  // renderings

  useEffect(() => {
    if (localStorage?.getItem("accessToken")) {
      getAllFinaidProfileList();
    }
  }, []);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile Pic</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Input Type</TableHead>
            <TableHead>Output Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <Skeleton width={50} height={50} circle />
                  </Avatar>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium">
                      {" "}
                      <Skeleton width={100} height={15} />
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton width={100} height={15} />
              </TableCell>
              <TableCell>
                <Skeleton width={100} height={15} />
              </TableCell>
              <TableCell>
                <Skeleton width={80} height={15} />
              </TableCell>
              <TableCell>
                {" "}
                <Skeleton width={70} height={15} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Skeleton width={30} height={15} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Skeleton width={30} height={15} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : allFinaidProfileList?.length > 0 ? (
            allFinaidProfileList.map((item) => (
              <TableRow
                key={item._id}
                // onClick={() =>
                // router.push(`/super-admin/settings/admins/${item.email}`)
                // }
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item?.image} alt={item?.name} />
                      <AvatarFallback>{item?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium">{item?.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item?.platform}</TableCell>
                <TableCell>{item?.model}</TableCell>
                <TableCell>{item?.integration}</TableCell>
                <TableCell>
                  {moment(item?.created_at).format("MMMM Do YYYY")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteFinaidProfile(item?._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <div className="my-4 mx-4">No list found!</div>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
