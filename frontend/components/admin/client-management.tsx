"use client";

import { useState } from "react";
import Link from "next/link";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  EyeIcon,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  BarChart,
  Settings,
  Clock,
  PlusCircle,
  Search,
} from "lucide-react";
import moment from "moment";
import { usePathname } from "next/navigation";
import Skeleton from "react-loading-skeleton";

// Mock data for clients
const clients = [
  {
    id: "CLT-001",
    name: "Acme Corporation",
    contactName: "John Smith",
    email: "john@acmecorp.com",
    industry: "Technology",
    status: "active",
    finAidsDeployed: 5,
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "CLT-002",
    name: "Globex Inc",
    contactName: "Jane Doe",
    email: "jane@globex.com",
    industry: "Manufacturing",
    status: "active",
    finAidsDeployed: 3,
    joinDate: "2023-02-20",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "CLT-003",
    name: "Initech",
    contactName: "Michael Bolton",
    email: "michael@initech.com",
    industry: "Finance",
    status: "inactive",
    finAidsDeployed: 0,
    joinDate: "2023-03-10",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

interface ClientManagementProps {
  filterStatus?: "active" | "inactive" | "pending";
  allClients: [];
  isLoading: boolean;
}

export function ClientManagement({
  allClients,
  isLoading,
  filterStatus,
}: ClientManagementProps) {
  const pathname = usePathname();
  const [selectedClient, setSelectedClient] = useState<
    (typeof allClients)[0] | null
  >(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter clients based on status if filterStatus is provided
  const filteredClientsBase = filterStatus
    ? allClients?.filter((client) => client.status === filterStatus)
    : allClients;

  const filteredClients =
    filteredClientsBase?.length > 0
      ? filteredClientsBase?.filter(
          (client) =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.contactName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.industry.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : filteredClientsBase;

  const handleViewDetails = (client: (typeof clients)[0]) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const handleEditClient = (client: (typeof clients)[0]) => {
    setSelectedClient(client);
    setIsEditOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    // In a real application, this would delete the client from the database
    console.log(`Deleting client ${clientId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          {/* <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
          <Link
            href={
              pathname?.includes("/accountant/")
                ? "/accountant/clients/onboarding"
                : pathname?.includes("/accounting-firm-owner/")
                ? "/accounting-firm-owner/clients/onboarding"
                : "/admin/clients/onboarding"
            }
          >
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Finaid License</TableHead>
                <TableHead>Profile ID</TableHead>
                <TableHead>User ID</TableHead>
                {/* <TableHead>Fin(Ai)ds</TableHead> */}
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)]?.map((_, index) => {
                  return (
                    <TableRow key={"clientloading" + index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton width={32} height={32} circle />
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton width={65} height={15} />
                          <Skeleton width={65} height={15} />
                          <Skeleton width={65} height={15} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : filteredClients?.length > 0 ? (
                filteredClients?.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell>
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="font-medium hover:underline"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={client.avatar}
                              alt={client.name}
                            />
                            <AvatarFallback>
                              {client.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{client.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {client.contactName}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    {/* <TableCell>
                        <div>{client.contactName}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.email}
                        </div>
                      </TableCell> */}
                    <TableCell>{client?.finaid_license_id}</TableCell>
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
                      {client?.profile_id}
                    </TableCell>
                    <TableCell>{client?.user_id}</TableCell>
                    <TableCell>
                      {moment(client?.created_at).format("MMMM Do YYYY")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          // onClick={() => handleViewDetails(client)}
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          // onClick={() => handleEditClient(client)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClient(client.id)}
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
                  <TableCell colSpan={6} className="text-center py-4">
                    No clients found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Client Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              View client information and activity
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="finaid">Fin(Ai)ds</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedClient.avatar}
                      alt={selectedClient.name}
                    />
                    <AvatarFallback>
                      {selectedClient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedClient.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          selectedClient.status === "active"
                            ? "default"
                            : selectedClient.status === "inactive"
                            ? "destructive"
                            : "outline"
                        }
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(selectedClient.status)}
                        <span className="capitalize">
                          {selectedClient.status}
                        </span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedClient.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Contact Name</div>
                    <div>{selectedClient.contactName}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Email</div>
                    <div>{selectedClient.email}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Phone</div>
                    <div>{selectedClient.phone}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Industry</div>
                    <div>{selectedClient.industry}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Join Date</div>
                    <div>{selectedClient.joinDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      Fin(Ai)ds Deployed
                    </div>
                    <div>{selectedClient.finAidsDeployed}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleEditClient(selectedClient)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Client
                  </Button>
                  <Button variant="outline">
                    <BarChart className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Settings
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="finaid" className="space-y-4 pt-4">
                {selectedClient.finAidsDeployed > 0 ? (
                  <div className="space-y-4">
                    {Array.from({ length: selectedClient.finAidsDeployed }).map(
                      (_, index) => (
                        <div key={index} className="rounded-md border p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                                <span className="font-medium text-primary">
                                  F{index + 1}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {index === 0
                                    ? "S(Ai)m"
                                    : index === 1
                                    ? "Qu(Ai)ncy"
                                    : index === 2
                                    ? "Z(Ai)ck"
                                    : "(Ai)dam"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {index === 0
                                    ? "Bookkeeping Assistant"
                                    : index === 1
                                    ? "Tax Preparation Assistant"
                                    : index === 2
                                    ? "Financial Reporting Assistant"
                                    : "Client Communication Assistant"}
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Active
                            </Badge>
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Deployed:</span>{" "}
                              {
                                new Date(
                                  new Date(selectedClient.joinDate).getTime() +
                                    index * 7 * 24 * 60 * 60 * 1000
                                )
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </div>
                            <div>
                              <span className="font-medium">
                                Tasks Completed:
                              </span>{" "}
                              {Math.floor(Math.random() * 100) + 50}
                            </div>
                            <div>
                              <span className="font-medium">Accuracy:</span>{" "}
                              {Math.floor(Math.random() * 10) + 90}%
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button variant="outline" size="sm">
                              Manage Fin(Ai)d
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <h3 className="text-lg font-medium">
                      No Fin(Ai)ds Deployed
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This client doesn't have any Fin(Ai)ds deployed yet.
                    </p>
                    <Button className="mt-4">Deploy Fin(Ai)d</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Client Agreement</div>
                          <div className="text-xs text-muted-foreground">
                            PDF • 2.4 MB • Uploaded on {selectedClient.joinDate}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            Financial Statements
                          </div>
                          <div className="text-xs text-muted-foreground">
                            PDF • 5.1 MB • Uploaded on{" "}
                            {
                              new Date(
                                new Date(selectedClient.joinDate).getTime() +
                                  15 * 24 * 60 * 60 * 1000
                              )
                                .toISOString()
                                .split("T")[0]
                            }
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Tax Documents</div>
                          <div className="text-xs text-muted-foreground">
                            ZIP • 8.7 MB • Uploaded on{" "}
                            {
                              new Date(
                                new Date(selectedClient.joinDate).getTime() +
                                  30 * 24 * 60 * 60 * 1000
                              )
                                .toISOString()
                                .split("T")[0]
                            }
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full">Upload New Document</Button>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Settings className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          Fin(Ai)d Configuration Updated
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {/* {
                            new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split("T")[0]
                          }{" "} */}
                          • By John Doe
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Document Uploaded</div>
                        <div className="text-xs text-muted-foreground">
                          {/* {
                            new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split("T")[0]
                          }{" "} */}
                          • By Jane Smith
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <BarChart className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          Monthly Report Generated
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {/* {
                            new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split("T")[0]
                          }{" "} */}
                          • Automated
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium">Client Onboarded</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedClient.joinDate} • By Emily Davis
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update client information</DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Company Name</Label>
                <Input id="edit-name" defaultValue={selectedClient.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact Name</Label>
                <Input
                  id="edit-contact"
                  defaultValue={selectedClient.contactName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={selectedClient.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" defaultValue={selectedClient.phone} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-industry">Industry</Label>
                <Select defaultValue={selectedClient.industry}>
                  <SelectTrigger id="edit-industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Pharmaceuticals">
                      Pharmaceuticals
                    </SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedClient.status}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Add notes about this client..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
