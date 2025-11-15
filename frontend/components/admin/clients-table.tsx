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
import moment from "moment";

interface Client {
  _id: string;
  name: string;
  company_location: string;
  owner_name: string;
  company_nature: string;
  user_id: string;
  created_at: string;
}

const ClientsTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientsList, setClientsList] = useState<Client[]>([]);

  // functions

  async function getAllClients() {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendBaseURL}/api/v1/clients`, {
        headers: {
          Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
        },
      });

      if (response?.data?.data?.length > 0) {
        setClientsList(response?.data?.data);
      }

      setIsLoading(false);
      console.log(response, "Get all clients response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "Get all clients error");
    }
  }

  // renderings

  useEffect(() => {
    getAllClients();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Company Nature</TableHead>
          <TableHead>User ID</TableHead>
          {/* <TableHead>Fin(Ai)ds</TableHead> */}
          <TableHead>Join Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && [...Array(3)]?.map((_, index) => (
          <TableRow key={"clientloading" + index}>
            <TableCell>
              <div className="flex items-center gap-2">
                {/* <Skeleton width={32} height={32} circle /> */}
                <div>
                  <div>
                    <Skeleton width={100} height={15} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Skeleton width={100} height={12} />
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
              <Skeleton width={100} height={15} />
            </TableCell>
            <TableCell>
              <Skeleton width={100} height={15} />
            </TableCell>
          </TableRow>
        ))}
        {!isLoading && clientsList?.length > 0 && clientsList?.map((client) => (
          <TableRow key={client._id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {/* <Avatar className="h-8 w-8">
                   <AvatarImage
                     src={client.avatar}
                     alt={client.name}
                   />
                   <AvatarFallback>
                     {client.name.charAt(0)}
                   </AvatarFallback>
                 </Avatar> */}
                <div>
                  <div>{client?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {client.company_location}
                  </div>
                </div>
              </div>
            </TableCell>
            {/* <TableCell>
               <div>{client.contactName}</div>
               <div className="text-sm text-muted-foreground">
                 {client.email}
               </div>
             </TableCell> */}
            <TableCell>{client?.owner_name}</TableCell>
            <TableCell>{client?.company_nature}</TableCell>
            <TableCell>{client?.user_id}</TableCell>
            <TableCell>
              {moment(client?.created_at).format("MMMM Do YYYY")}
            </TableCell>
          </TableRow>
        ))}
        {!isLoading && clientsList?.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No clients found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
