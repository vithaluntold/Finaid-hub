"use client";

import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Skeleton from "react-loading-skeleton";
import { CheckCircle, Edit, Mail, XCircle } from "lucide-react";

const AccountantTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accountantList, setAccountantList] = useState([]);

  // functions

  async function getAllAccountants() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/users/accountant/invited`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.data?.length > 0) {
        setAccountantList(response?.data?.data);
      }

      setIsLoading(false);
      console.log(response, "Get all accountants response");
    } catch (error) {
      setIsLoading(false);
      console.log(error?.message, "Get all accountants error");
    }
  }

  // renderings

  useEffect(() => {
    getAllAccountants();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
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
              <Skeleton width={70} height={15} />
            </TableCell>
            <TableCell>
              <Skeleton width={70} height={15} />
            </TableCell>
            <TableCell className="text-left">
              <div className="flex justify-start gap-2">
                <Button variant="ghost" size="icon">
                  <Skeleton width={50} height={15} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Skeleton width={50} height={15} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          accountantList && accountantList.length > 0 
          ? accountantList.map((accountant) => (
            <TableRow key={accountant?._id}>
              <TableCell>{accountant?.first_name}</TableCell>
              <TableCell>{accountant?.last_name}</TableCell>
              <TableCell>{accountant?.email}</TableCell>
              <TableCell>{accountant?.mobile}</TableCell>
              <TableCell>{accountant?.status}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {accountant.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      // onClick={() => handleSendInvite(accountant.id)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Send Invite
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => toggleEmployeeStatus(accountant.id)}
                    title={
                      accountant.status === "active" ? "Deactivate" : "Activate"
                    }
                  >
                    {accountant.status === "active" ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
          : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No accountants found.
                </TableCell>
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
};

export default AccountantTable;
