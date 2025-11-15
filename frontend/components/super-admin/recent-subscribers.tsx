"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon, CheckCircle, XCircle } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import Link from "next/link";

interface SubscribersListProps {
  allSubscribers?: any[];
  isLoading?: boolean;
}

export function RecentSubscribers({
  allSubscribers,
  isLoading,
}: SubscribersListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Created At</TableHead>
          {/* <TableHead className="text-right">Actions</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? [...Array(3)].map((_, index) => {
              return (
                <TableRow key={"loading" + index}>
                  <TableCell>
                    <Skeleton height={15} width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton height={15} width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton height={15} width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton height={15} width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton height={15} width={100} />
                  </TableCell>
                  {/* <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton height={15} width={50} />
                      <Skeleton height={15} width={50} />
                    </div>
                  </TableCell> */}
                </TableRow>
              );
            })
          : allSubscribers && allSubscribers.length > 0 ? (
            allSubscribers.map((subscriber) => (
              <TableRow key={subscriber?._id}>
                <TableCell className="hover:underline">
                  <Link href={`/super-admin/userprofile/${subscriber?._id}`}>
                    {subscriber?.first_name}
                  </Link>
                </TableCell>
                <TableCell>{subscriber?.last_name}</TableCell>
                <TableCell>{subscriber?.email}</TableCell>
                <TableCell>{subscriber?.mobile}</TableCell>
                <TableCell>
                  {subscriber?.created_at
                    ? moment(subscriber?.created_at).format("MMMM Do YYYY")
                    : "-"}
                </TableCell>
                {/* <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={() => toggleSubscriberStatus(subscriber?.id)}
                      title={
                        subscriber?.status === "active"
                          ? "Deactivate"
                          : "Activate"
                      }
                    >
                      {subscriber?.status === "active" ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={() => handleViewDetails(subscriber)}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </div>
                </TableCell> */}
              </TableRow>
            ))
          ) : null}
      </TableBody>
    </Table>
  );
}
