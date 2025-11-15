"use client";

import { useEffect, useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon, CheckCircle, XCircle, FileText, Edit } from "lucide-react";
import { User } from "@/types";
import { backendBaseURL } from "@/assets/constants/constant";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { CompleteAccountingFirmOwnerProfile } from "../admin/DialogPopups/complete-accounting-firm-owner-profile";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Sample subscriber data
// const allSubscribers = [
//   {
//     id: "SUB-001",
//     name: "Acme Inc",
//     status: "active",
//     email: "contact@acmeinc.com",
//     billingCycle: "Monthly",
//     revenue: "$1,200",
//     activationDate: "2023-10-15",
//     nextBillDate: "2023-11-15",
//     contactName: "John Smith",
//     phone: "+1 (555) 123-4567",
//     address: "123 Business Ave, Suite 100, San Francisco, CA 94107",
//     plan: "Enterprise",
//     finAidsDeployed: 12,
//   },
//   {
//     id: "SUB-002",
//     name: "Globex Corporation",
//     status: "active",
//     email: "info@globex.com",
//     billingCycle: "Annual",
//     revenue: "$12,000",
//     activationDate: "2023-09-01",
//     nextBillDate: "2024-09-01",
//     contactName: "Jane Doe",
//     phone: "+1 (555) 987-6543",
//     address: "456 Corporate Blvd, New York, NY 10001",
//     plan: "Enterprise Plus",
//     finAidsDeployed: 25,
//   },
//   {
//     id: "SUB-003",
//     name: "Initech",
//     status: "inactive",
//     email: "support@initech.com",
//     billingCycle: "Monthly",
//     revenue: "$800",
//     activationDate: "2023-08-22",
//     nextBillDate: "2023-09-22",
//     contactName: "Michael Bolton",
//     phone: "+1 (555) 222-3333",
//     address: "789 Office Space Lane, Austin, TX 78701",
//     plan: "Professional",
//     finAidsDeployed: 5,
//   },
//   {
//     id: "SUB-004",
//     name: "Umbrella Corp",
//     status: "active",
//     email: "info@umbrella.com",
//     billingCycle: "Quarterly",
//     revenue: "$3,600",
//     activationDate: "2023-07-10",
//     nextBillDate: "2023-10-10",
//     contactName: "Albert Wesker",
//     phone: "+1 (555) 444-5555",
//     address: "100 Research Pkwy, Raccoon City, IL 60601",
//     plan: "Enterprise",
//     finAidsDeployed: 18,
//   },
//   {
//     id: "SUB-005",
//     name: "Stark Industries",
//     status: "pending",
//     email: "contact@stark.com",
//     billingCycle: "Monthly",
//     revenue: "$2,500",
//     activationDate: "2023-10-28",
//     nextBillDate: "2023-11-28",
//     contactName: "Tony Stark",
//     phone: "+1 (555) 777-8888",
//     address: "200 Innovation Dr, Malibu, CA 90265",
//     plan: "Enterprise Plus",
//     finAidsDeployed: 0,
//   },
//   {
//     id: "SUB-006",
//     name: "Wayne Enterprises",
//     status: "active",
//     email: "info@wayne.com",
//     billingCycle: "Annual",
//     revenue: "$15,000",
//     activationDate: "2023-06-15",
//     nextBillDate: "2024-06-15",
//     contactName: "Bruce Wayne",
//     phone: "+1 (555) 999-0000",
//     address: "1007 Mountain Drive, Gotham City, NJ 07101",
//     plan: "Enterprise Plus",
//     finAidsDeployed: 30,
//   },
//   {
//     id: "SUB-007",
//     name: "Oscorp Industries",
//     status: "active",
//     email: "contact@oscorp.com",
//     billingCycle: "Monthly",
//     revenue: "$1,800",
//     activationDate: "2023-09-05",
//     nextBillDate: "2023-10-05",
//     contactName: "Norman Osborn",
//     phone: "+1 (555) 111-2222",
//     address: "5th Avenue, New York, NY 10018",
//     plan: "Professional",
//     finAidsDeployed: 8,
//   },
//   {
//     id: "SUB-008",
//     name: "Cyberdyne Systems",
//     status: "inactive",
//     email: "info@cyberdyne.com",
//     billingCycle: "Quarterly",
//     revenue: "$4,500",
//     activationDate: "2023-05-20",
//     nextBillDate: "2023-08-20",
//     contactName: "Miles Dyson",
//     phone: "+1 (555) 333-4444",
//     address: "18144 El Camino Real, Sunnyvale, CA 94087",
//     plan: "Enterprise",
//     finAidsDeployed: 0,
//   },
// ];

interface SubscribersListProps {
  filterStatus?: "active" | "inactive" | "pending";
  allAccountingOwners?: any[];
  isLoading?: boolean;
}

export function SubscribersList({
  filterStatus,
  allAccountingOwners,
  isLoading,
}: SubscribersListProps) {
  const router = useRouter();
  // const { showToast } = useToast();
  // const [allAccountingOwners, setAllAccountingOwners] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState<
    User | null
  >(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  // Filter subscribers based on status if filterStatus is provided
  const subscribers = filterStatus
    ? allAccountingOwners?.filter((sub) => sub?.status === filterStatus)
    : allAccountingOwners;

  const handleViewDetails = (subscriber: User) => {
    setSelectedSubscriber(subscriber);
    setIsDetailsOpen(true);
  };

  const toggleSubscriberStatus = (subscriberId: string) => {
    // In a real application, this would update the accounting firms status in the database
    console.log(`Toggling status for accounting firms ${subscriberId}`);
  };

  // functions

  // async function getAllAccountingOwners() {
  //   setIsLoading(true);

  //   try {
  //     const response = await axios.get(
  //       `${backendBaseURL}/api/v1/users/accounting-owner`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
  //         },
  //       }
  //     );

  //     if (response?.data?.data?.length > 0) {
  //       setAllAccountingOwners(response?.data?.data);
  //     }

  //     setIsLoading(false);
  //     console.log(response, "Get all accounting firm owners response");
  //   } catch (error) {
  //     showToast({
  //       title: "Error",
  //       description: error?.response?.data?.message,
  //     });
  //     setIsLoading(false);
  //     console.log("All accounting firm owners error", error);
  //   }
  // }

  // // renderings

  // useEffect(() => {

  //   if (localStorage.getItem("accessToken")) {
  //     getAllAccountingOwners();
  //   }
  // }, [localLoading]);

  return (
    <>
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
            ? [...Array(3)].map((eachItem, index) => {
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
                      </div>
                    </TableCell> */}
                  </TableRow>
                );
              })
            : (subscribers && subscribers.length > 0) &&
              subscribers.map((subscriber: User) => (
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
                        className="pointer-events-none opacity-50"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(subscriber)}
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {/* Accounting Firm Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Accounting Firm Details</DialogTitle>
            <DialogDescription>
              Detailed information about the accounting firm
            </DialogDescription>
          </DialogHeader>

          {selectedSubscriber && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`/placeholder.svg?height=64&width=64`}
                      alt={selectedSubscriber?.name}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedSubscriber?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedSubscriber?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedSubscriber?.email}
                    </p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          selectedSubscriber?.status === "active"
                            ? "default"
                            : selectedSubscriber?.status === "inactive"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {selectedSubscriber?.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="font-medium">Contact Name:</dt>
                          <dd>{selectedSubscriber?.contactName}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Email:</dt>
                          <dd>{selectedSubscriber?.email}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Phone:</dt>
                          <dd>{selectedSubscriber?.phone}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Address:</dt>
                          <dd className="text-right">
                            {selectedSubscriber?.address}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        License Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="font-medium">License ID:</dt>
                          <dd>{selectedSubscriber?.id}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Plan:</dt>
                          <dd>{selectedSubscriber?.plan}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Billing Cycle:</dt>
                          <dd>{selectedSubscriber?.billingCycle}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Activation Date:</dt>
                          <dd>{selectedSubscriber?.activationDate}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Next Bill Date:</dt>
                          <dd>{selectedSubscriber?.nextBillDate}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Usage Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-medium">Fin(Ai)ds Deployed:</dt>
                        <dd>{selectedSubscriber?.finAidsDeployed}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Monthly Revenue:</dt>
                        <dd>{selectedSubscriber?.revenue}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      View past invoices and payment history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>INV-001</TableCell>
                          <TableCell>2023-10-15</TableCell>
                          <TableCell>{selectedSubscriber?.revenue}</TableCell>
                          <TableCell>
                            <Badge variant="default">Paid</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>INV-002</TableCell>
                          <TableCell>2023-09-15</TableCell>
                          <TableCell>{selectedSubscriber?.revenue}</TableCell>
                          <TableCell>
                            <Badge variant="default">Paid</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>INV-003</TableCell>
                          <TableCell>2023-08-15</TableCell>
                          <TableCell>{selectedSubscriber?.revenue}</TableCell>
                          <TableCell>
                            <Badge variant="default">Paid</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>KYC Documents</CardTitle>
                    <CardDescription>
                      View and manage accounting firm documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span>Business Registration Certificate</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span>Tax ID Documentation</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span>Authorized Signatory ID</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <CompleteAccountingFirmOwnerProfile
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        setLocalLoading={setLocalLoading}
      />
    </>
  );
}
