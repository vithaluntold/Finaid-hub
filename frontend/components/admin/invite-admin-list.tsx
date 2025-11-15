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
  UserRoundPen,
} from "lucide-react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface ContentListProps {
  contentType?: "article" | "video" | "course" | "audio" | "document";
}

export function InviteAdminList({ contentType }: ContentListProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedContent, setSelectedContent] = useState<null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allAdminList, setAllAdminList] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  // Filter content based on type if contentType is provided

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "course":
        return <BookOpen className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      case "document":
        return <File className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // functions

  async function getAllAdminList() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/admins/users/by-superadmin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      console.log(response, "get all admins");

      if (response?.data?.data?.length > 0) {
        setAllAdminList(response?.data?.data);
      }

      setIsLoading(false);
      // console.log(response, "Get all admin response");
    } catch (error) {
      setIsLoading(false);
      console.log("Invite user error", error);
    }
  }

  async function reinviteUser(id) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendBaseURL}/api/v1/users/resend-invite/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      console.log(response, "reinvite admin");

      if (response?.data?.status === "Success") {
        showToast({
          title: response?.data?.message,
          description: response?.data?.message,
        });
      } else {
        showToast({
          title: "Error",
          description: "Unable to reset password!",
        });
      }
      setIsLoading(false);
      // console.log(response, "Get all admin response");
    } catch (error) {
      setIsLoading(false);
      console.log("Invite user error", error);
    }
  }

  // renderings

  useEffect(() => {
    let userdata = localStorage.getItem("userDetails")
      ? JSON.parse(localStorage.getItem("userDetails"))
      : "";
    if (userdata) {
      setUserDetails(userdata);
    }
  }, []);

  useEffect(() => {
    if (userDetails?.email) {
      getAllAdminList();
    }
  }, [userDetails?.email]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
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
                {" "}
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
          ) : allAdminList?.length > 0 ? (
            allAdminList.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/userprofile/${item?._id}`} className="hover:underline">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{item.first_name}</div>
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>{item.last_name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {moment(item.created_at).format("MMMM Do YYYY")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/admins/${item.email}`)}
                    >
                      <UserRoundPen className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => reinviteUser(item?._id)}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Resend Invite</span>
                    </Button>
                    {/* <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No admins found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Content Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Content Details</DialogTitle>
            <DialogDescription>
              View and manage content details
            </DialogDescription>
          </DialogHeader>

          {selectedContent && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedContent.thumbnail}
                      alt={selectedContent.title}
                    />
                    <AvatarFallback className="text-lg">
                      {getContentTypeIcon(selectedContent.type)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedContent.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      By {selectedContent.author} •{" "}
                      {selectedContent.publishDate}
                    </p>
                    <div className="mt-1 flex gap-2">
                      <Badge variant="outline" className="capitalize">
                        {selectedContent.type}
                      </Badge>
                      <Badge
                        variant={
                          selectedContent.status === "published"
                            ? "default"
                            : selectedContent.status === "draft"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {selectedContent.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="text-sm font-semibold mb-2">Description</h4>
                    <p className="text-sm">{selectedContent.description}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {selectedContent.views.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total Views
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {selectedContent.avgEngagement}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Avg. Engagement
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {selectedContent.category}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Category
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    {selectedContent.type === "video" ? (
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                        <span className="sr-only">Video content</span>
                      </div>
                    ) : selectedContent.type === "audio" ? (
                      <div className="bg-muted rounded-md p-6 flex items-center justify-center">
                        <Music className="h-12 w-12 text-muted-foreground" />
                        <span className="sr-only">Audio content</span>
                      </div>
                    ) : selectedContent.type === "document" ? (
                      <div className="bg-muted rounded-md p-6 flex items-center justify-center">
                        <File className="h-12 w-12 text-muted-foreground" />
                        <span className="sr-only">Document content</span>
                      </div>
                    ) : (
                      <div className="prose max-w-none dark:prose-invert">
                        <p>{selectedContent.content}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                      <div className="text-center">
                        <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Content analytics visualization
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
