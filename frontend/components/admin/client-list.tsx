"use client";

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
import { EyeIcon, FileIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { Client, ClientListProps } from "@/types";

const clients = [
  {
    id: "CLT001",
    name: "Acme Corporation",
    contactName: "John Smith",
    email: "john@acmecorp.com",
    status: "active",
    booksCount: 3,
    finAidsDeployed: 5,
  },
  {
    id: "CLT002",
    name: "Globex Inc",
    contactName: "Jane Doe",
    email: "jane@globex.com",
    status: "active",
    booksCount: 2,
    finAidsDeployed: 3,
  },
  {
    id: "CLT003",
    name: "Initech",
    contactName: "Michael Bolton",
    email: "michael@initech.com",
    status: "inactive",
    booksCount: 1,
    finAidsDeployed: 0,
  },
  {
    id: "CLT004",
    name: "Umbrella Corp",
    contactName: "Alice Wong",
    email: "alice@umbrella.com",
    status: "active",
    booksCount: 4,
    finAidsDeployed: 7,
  },
  {
    id: "CLT005",
    name: "Stark Industries",
    contactName: "Tony Stark",
    email: "tony@stark.com",
    status: "pending",
    booksCount: 0,
    finAidsDeployed: 0,
  },
];

export function ClientList({
  filterStatus,
  allClients,
  isLoading,
  searchQuery,
}: ClientListProps) {
  const filteredClientsBase = filterStatus
    ? allClients?.filter((client: Client) => client.status === filterStatus)
    : allClients;

  const filteredClients =
    filteredClientsBase?.length > 0
      ? filteredClientsBase?.filter(
          (client: Client) =>
            client?.company_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            client?.company_owner_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            client?.company_id
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            client?.client_id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : filteredClientsBase;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Client ID</TableHead>
          <TableHead>Company ID</TableHead>
          {/* <TableHead>Fin(Ai)ds</TableHead> */}
          <TableHead>Join Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          [...Array(3)]?.map((_, index) => {
            return (
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
            );
          })
        ) : filteredClients?.length > 0 ? (
          filteredClients?.map((client: Client) => (
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
                    <div>{client?.company_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {client.company_id}
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
              <Link href={`/super-admin/userprofile/${client?._id}`}>
                <TableCell>{client?.company_owner_name}</TableCell>
              </Link>
              <TableCell>
                {/* <Badge
                  variant={
                    client.status === "active"
                      ? "default"
                      : client.status === "inactive"
                      ? "destructive"
                      : "outline"
                  }
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(client.status)}
                  <span className="capitalize">{client.status}</span>
                </Badge> */}
                {client?.client_id}
              </TableCell>
              <TableCell>{client?.company_id}</TableCell>
              <TableCell>
                {moment(client?.created_at).format("MMMM Do YYYY")}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No clients found. Try adjusting your search.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
