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
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  EyeIcon,
  Edit,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  Trash2,
  User2,
} from "lucide-react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TiUserAdd } from "react-icons/ti";
import { useToast } from "@/hooks/use-toast";

export function SubscriptionsList() {
  const { showToast } = useToast();
  const [selectedLicense, setSelectedLicense] = useState<null>(null);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [allFinaidLicenses, setAllFinaidLicenses] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountantList, setAccountantList] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  const handleViewDetails = (license: (typeof licenses)[0]) => {
    setSelectedLicense(license);
    setIsDetailsOpen(true);
  };

  const handleEditSubscription = (license: (typeof licenses)[0]) => {
    setSelectedLicense(license);
    setIsEditOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "assigned":
        return <CheckCircle className="h-4 w-4 text-cyan-500" />;
      case "active":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "available":
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-amber-100 text-amber-700";
      case "assigned":
        return "bg-cyan-100 text-cyan-700";
      case "available":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  // functions

  async function getAllFinaidLicenses() {
    setIsLoadingLicenses(true);

    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/licenses/my-licenses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      const licenses = response?.data?.licenses || [];

      if (licenses.length > 0) {
        // Get finaid_profile_id from each license
        const enrichedLicenses = await Promise.all(
          licenses.map(async (license) => {
            if (!license?.finaid_profile_id) return license;

            try {
              const profileResponse = await axios.get(
                `${backendBaseURL}/api/v1/finaid-profiles/filter?finaid_profile_id=${license.finaid_profile_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage?.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );

              const profileData =
                profileResponse?.data?.data?.length > 0
                  ? profileResponse?.data?.data[0]
                  : {};

              return {
                ...license,
                finaid_profile_name: profileData?.name || "",
                finaid_profile_image: profileData?.image || "",
              };
            } catch (profileError) {
              console.error(
                "Failed to fetch profile for ID:",
                license.finaid_profile_id,
                profileError
              );
              return license;
            }
          })
        );

        console.log(enrichedLicenses, "enrichedLicenses sds");

        setSelectedLicense(enrichedLicenses[0]);
        setAllFinaidLicenses(enrichedLicenses);
      } else {
        setAllFinaidLicenses([]);
      }

      setIsLoadingLicenses(false);
      console.log(response, "Get all finaid licenses response");
    } catch (error) {
      setIsLoadingLicenses(false);
      console.log("Get all finaid licenses error", error);
    }
  }

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

  async function assignLicenseAccountant() {
    let payload = {
      user_id: selectedLicense?.accountant_ID,
      license_key: selectedLicense?.license_key,
    };

    setIsLoading(true);
    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/licenses/assign`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "Assign license API response");
      if (response?.data?.status === "Success") {
        showToast({
          title: "Assigned Successfully!",
          description: response?.data?.message,
        });
        setIsAssignOpen(false);
        setLocalLoading((prev) => !prev);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to assign license!",
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showToast({
        title: "Error",
        description: "Error while trying to assign license!",
      });
      setIsAssignOpen(false);
      console.log(error, "Assign license error");
    }
  }

  // renderings

  useEffect(() => {
    getAllFinaidLicenses();
    getAllAccountants();
  }, [localLoading]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Billing Cycle</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Next Billing</TableHead>
            <TableHead>Assigned to</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingLicenses
            ? [...Array(3)]?.map((eachItem, index) => {
                return (
                  <TableRow key={"loading" + index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Skeleton width={40} height={40} circle />
                        <div>
                          <div>
                            <Skeleton width={100} height={15} />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <Skeleton width={80} height={12} />
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
                    <TableCell>
                      <Skeleton width={100} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} height={15} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton width={60} height={15} />
                        <Skeleton width={60} height={15} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            : allFinaidLicenses?.length > 0 &&
              allFinaidLicenses?.map((license) => (
                <TableRow key={license?._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={license?.finaid_profile_image}
                          alt={license?.finaid_profile_name}
                        />
                        <AvatarFallback>
                          {license?.finaid_profile_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{license?.finaid_profile_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {license?.finaid_profile_id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{license?.license_type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        license?.status === "active" ? "default" : "outline"
                      }
                      className={`flex items-center gap-1 px-2 py-1 w-max ${getStatusStyle(
                        license?.status
                      )}`}
                    >
                      {getStatusIcon(license?.status)}
                      <span className="capitalize">{license?.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{license?.frequency}</TableCell>
                  <TableCell>{license?.amount}</TableCell>
                  <TableCell>{license?.validity_days}</TableCell>
                  <TableCell>
                    {`${
                      license?.user?.first_name ? license?.user?.first_name : ""
                    } ${
                      license?.user?.last_name ? license?.user?.last_name : ""
                    } (${license?.user?.email ? license?.user?.email : "-"})`}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(license)}
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(license?.status === "active" ||
                            license?.status === "available") && (
                            <DropdownMenuItem
                              onClick={() => {
                                setIsAssignOpen(true);
                                setSelectedLicense(license);
                              }}
                            >
                              <TiUserAdd className="h-4 w-4" />
                              Assign License
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          // onClick={() => handleViewDetails(client)}
                          >
                            <User2 className="h-4 w-4" />
                            Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {/* License Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>License Details</DialogTitle>
            <DialogDescription>View license information</DialogDescription>
          </DialogHeader>

          {selectedLicense && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger
                  className="pointer-events-none opacity-40"
                  value="billing"
                >
                  Billing History
                </TabsTrigger>
                <TabsTrigger
                  className="pointer-events-none opacity-40"
                  value="usage"
                >
                  Usage
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedLicense?.finaid_profile_image}
                      alt={selectedLicense?.finaid_profile_name}
                    />
                    <AvatarFallback>
                      {selectedLicense?.finaid_profile_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedLicense?.finaid_profile_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          selectedLicense?.status === "active"
                            ? "default"
                            : selectedLicense?.status === "inactive"
                            ? "destructive"
                            : "outline"
                        }
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(selectedLicense?.status)}
                        <span className="capitalize">
                          {selectedLicense?.status}
                        </span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedLicense?.finaid_profile_id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Plan</div>
                    <div>{selectedLicense?.license_type}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Billing Cycle</div>
                    <div>{selectedLicense?.frequency}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Amount</div>
                    <div>{selectedLicense?.amount}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Next Billing Date</div>
                    <div>{selectedLicense?.validity_days}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Start Date</div>
                    <div>{selectedLicense?.validity_days}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Status</div>
                    <Badge
                      variant={
                        selectedLicense?.status === "active"
                          ? "default"
                          : selectedLicense?.status === "inactive"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {selectedLicense?.status}
                    </Badge>
                  </div>
                </div>

                {/* <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleEditSubscription(selectedLicense)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit License
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Renew License
                  </Button>
                </div> */}
              </TabsContent>

              <TabsContent value="billing" className="space-y-4 pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>INV-001</TableCell>
                      <TableCell>2023-11-15</TableCell>
                      <TableCell>{selectedLicense?.amount}</TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>INV-002</TableCell>
                      <TableCell>2023-10-15</TableCell>
                      <TableCell>{selectedLicense?.amount}</TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>INV-003</TableCell>
                      <TableCell>2023-09-15</TableCell>
                      <TableCell>{selectedLicense?.amount}</TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="usage" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Usage Summary</h3>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Users</div>
                        <div className="text-2xl font-bold">12/15</div>
                        <div className="text-xs text-muted-foreground">
                          80% of limit
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Storage</div>
                        <div className="text-2xl font-bold">45.2 GB</div>
                        <div className="text-xs text-muted-foreground">
                          45% of limit
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">API Calls</div>
                        <div className="text-2xl font-bold">125,430</div>
                        <div className="text-xs text-muted-foreground">
                          25% of limit
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Feature Usage</h3>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium">
                            Fin(Ai)ds Deployed
                          </div>
                          <div className="text-sm">8/10</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium">
                            Client Accounts
                          </div>
                          <div className="text-sm">24/50</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: "48%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium">
                            Reports Generated
                          </div>
                          <div className="text-sm">156/500</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: "31%" }}
                          ></div>
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

      {/* Edit License Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit License</DialogTitle>
            <DialogDescription>Update license details</DialogDescription>
          </DialogHeader>

          {selectedLicense && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plan</Label>
                <Select defaultValue={selectedLicense?.license_type}>
                  <SelectTrigger id="edit-plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-billing-cycle">Billing Cycle</Label>
                <Select defaultValue={selectedLicense?.frequency}>
                  <SelectTrigger id="edit-billing-cycle">
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedLicense?.status}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  defaultValue={
                    selectedLicense?.amount
                      ? selectedLicense?.amount?.toString()?.replace("$", "")
                      : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-next-billing">Next Billing Date</Label>
                <Input
                  id="edit-next-billing"
                  type="date"
                  defaultValue={selectedLicense?.validity_days}
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

      {/* Assign License Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign License to Accountant</DialogTitle>
            {/* <DialogDescription>Update license details</DialogDescription> */}
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="select-accountant">Select Accountant</Label>
              <Select
                // defaultValue={selectedAccountant}
                onValueChange={(value) => {
                  console.log(value, "select value change");
                  setSelectedLicense((prev) => {
                    return { ...prev, accountant_ID: value?._id };
                  });
                }}
              >
                <SelectTrigger id="select-accountant">
                  <SelectValue placeholder="Select Accountant" />
                </SelectTrigger>
                <SelectContent>
                  {accountantList?.length > 0 &&
                    accountantList?.map((eachAccountant) => {
                      return (
                        <SelectItem value={eachAccountant}>
                          {eachAccountant?.first_name
                            ? eachAccountant?.first_name
                            : " " + eachAccountant?.last_name
                            ? eachAccountant?.last_name
                            : "" +
                              `(${
                                eachAccountant?.email
                                  ? eachAccountant?.email
                                  : ""
                              })`}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => setIsAssignOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => assignLicenseAccountant()}
            >
              {isLoading ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
