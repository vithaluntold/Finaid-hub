"use client";

import { useEffect, useState } from "react";
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
  DialogTrigger,
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
  UserPlus,
  LogIn,
  LoaderCircle,
  ShieldPlus,
  ShieldX,
  MoreVertical,
  PersonStanding,
  User2,
} from "lucide-react";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Add proper interfaces for type safety
interface Client {
  _id: string;
  id?: string;
  name: string;
  company_name?: string;
  company_owner_name?: string;
  company_id?: string;
  client_id?: string;
  contactName?: string;
  email: string;
  industry?: string;
  status: string;
  finAidsDeployed?: number;
  joinDate?: string;
  avatar?: string;
  [key: string]: any;
}

interface UserDetails {
  _id: string;
  [key: string]: any;
}

interface License {
  _id: string;
  assigned_to_user?: string;
  finaid_license_id?: string;
  finaid_profile_id?: string;
  [key: string]: any;
}

interface FinaidProfile {
  _id: string;
  name?: string;
  platform?: string;
  model?: string;
  integration?: string;
  [key: string]: any;
}

interface NewClientData {
  integrations: { provider: string; client_id: string; client_secret: string; }[];
  accountant?: string;
  finaid_license_id?: string;
  profile_id?: string;
  user_id?: string;
  platform?: string;
  finaid_profile_name?: string;
  [key: string]: any;
}

interface NewClientCompany {
  accountant_id?: string;
  company_name?: string;
  company_owner_name?: string;
  company_nature?: string;
  company_location?: string;
  client_id?: string;
  [key: string]: any;
}

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
  allClients: any[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  localLoading: boolean;
  searchQuery: string;
}

export function ClientManagement({
  isLoading,
  setIsLoading,
  filterStatus,
  localLoading,
  setLocalLoading,
  searchQuery,
}: ClientManagementProps) {
  const { showToast } = useToast();
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [allClientsLoading, setAllClientsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({} as UserDetails);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [newClient, setNewClient] = useState<NewClientData>({
    integrations: [
      {
        provider: "",
        client_id: "",
        client_secret: "",
      },
    ],
  });
  const [newClientCompany, setNewClientCompany] = useState<NewClientCompany>({});
  const [newClientResponse, setNewClientResponse] = useState<any>({});
  const [accountantList, setAccountantList] = useState<any[]>([]);
  const [allFinaidLicenses, setAllFinaidLicense] = useState<License[]>([]);
  const [allFinaidsList, setAllFinaidsList] = useState<FinaidProfile[]>([]);
  const [authticatedClients, setAuthticatedClients] = useState<any[]>([]);
  // const [allAccountingOwners, setAllAccountingOwners] = useState([]);

  // Filter clients based on status if filterStatus is provided
  const filteredClientsBase = filterStatus
    ? allClients?.filter((client: Client) => client.status === filterStatus)
    : allClients;

  const filteredClients =
    filteredClientsBase?.length > 0
      ? filteredClientsBase?.filter(
          (client: Client) =>
            (client?.company_name || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (client?.company_owner_name || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (client?.company_id || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (client?.client_id || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      : filteredClientsBase;

  const handleViewDetails = (client: Client) => {
    setIsDetailsOpen(true);
    getAuthDetailsClientID(client);
  };

  const handleEditClient = (client: Client) => {
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

  // functions

  async function getAuthDetailsClientID(client: Client) {
    console.log(client, "client");
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/clients/${client?._id}/auth-details`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.success) {
        setSelectedClient({ ...client, authDetails: response?.data?.data });
      } else {
        setSelectedClient(null);
      }
      setIsLoading(false);
      console.log(response, "Get auth details with client id response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "Get auth details with client id error");
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
      // console.log(response, "Get all accountants response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "Get all accountants error");
    }
  }

  async function getAllFinaidLicenses() {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/licenses/my-licenses/accountant`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      const licenses = response?.data?.licenses || [];

      let forSelectedUser = licenses?.filter(
        (eachLicense: License) => eachLicense?.assigned_to_user === newClient?.accountant
      );

      if (forSelectedUser.length > 0) {
        setAllFinaidLicense(forSelectedUser);
      } else {
        setAllFinaidLicense([]);
      }

      // console.log(
      //   response,
      //   "Get all finaid licenses response",
      //   newClient?.accountant,
      //   forSelectedUser
      // );
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log("Get all finaid licenses error", error);
    }
  }

  async function getAllFinaidProfiles() {
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
        // const ids = response?.data?.data?.map((profile) => profile._id);
        setAllFinaidsList(response?.data?.data);
      }

      setIsLoading(false);
      // console.log(response, "Get all finaid profile list response");
    } catch (error: any) {
      setIsLoading(false);
      console.log("Get all finaids profile error", error);
    }
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    newClient.user_id = userDetails?._id;

    // console.log(newClient, "newClient");

    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/clients`,
        newClient,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response, "Create New client response");
      if (response?.data?.success) {
        showToast({
          title: "Created Client Successfully!",
          description: response?.data?.message,
        });
        setNewClientResponse(response?.data?.data);
        setIsCreateOpen(false);
        setIsCreateCompanyOpen(true);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to Create New client!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Error while trying to Create New client!");
    }
  };

  const handleAddClientCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    newClientCompany.accountant_id = userDetails?._id;
    newClientCompany.company_name = newClientResponse?.name;
    newClientCompany.company_owner_name = newClientResponse?.owner_name;
    newClientCompany.company_nature = newClientResponse?.company_nature;
    newClientCompany.company_location = newClientResponse?.company_location;
    newClientCompany.client_id = newClientResponse?._id;

    // console.log(newClient, "newClient");

    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/client-companies`,
        newClientCompany,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response, "Create New client company response");
      if (response?.data?.data?._id) {
        showToast({
          title: "Created Client Company Successfully!",
          description: response?.data?.message,
        });
        setIsCreateCompanyOpen(false);
        setLocalLoading((prev) => !prev);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to Create New client company!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Error while trying to Create New client company!");
    }
  };

  // async function handleQuickbooksRedirect(clientID) {
  //   console.log(clientID, "handleQuickbooksRedirect");
  //   setIsLoading(true);
  //   try {
  //     const response = await axios({
  //       method: "get",
  //       url: `${backendBaseURL}/api/v1/quickbooks/redirect`,
  //       headers: {
  //         Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
  //         "Content-Type": "application/json",
  //       },
  //       data: {
  //         client_company_id: clientID,
  //       },
  //     });

  //     let redirect_url = response?.data?.redirect_url;
  //     if (redirect_url) {
  //       /* open popup window */
  //       const width = 600;
  //       const height = 700;
  //       const left = window.screenX + (window.innerWidth - width) / 2;
  //       const top = window.screenY + (window.innerHeight - height) / 2;

  //       const popup = window.open(
  //         redirect_url,
  //         "QuickBooks Connect",
  //         `width=${width},height=${height},top=${top},left=${left}`
  //       );

  //       if (!popup || popup.closed || typeof popup.closed === "undefined") {
  //         alert(
  //           "Popup was blocked! Please allow popups for this site to connect QuickBooks."
  //         );
  //         showToast({
  //           title: "Popup blocked!",
  //           description:
  //             "Popup blocked! Please enable popups for finaidhub.io in your browser settings to connect QuickBooks.",
  //         });
  //         return;
  //       }

  //       const allowedOrigins = [
  //         "http://localhost:3000",
  //         "https://finaidhub.io",
  //       ];

  //       setIsLoading(false);

  //       window.addEventListener("message", (event) => {
  //         // console.log(event, "event from listerner...");
  //         if (!allowedOrigins.includes(event.origin)) return;

  //         if (event.data === "quickbooks-auth-success") {
  //           console.log("✅ QuickBooks connected!");
  //         }
  //       });
  //     }
  //     console.log(response, "Handle quickbooks API response");
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.log(error?.message, "Handle quickbooks API error");
  //   }
  // }

  // async function handleAuthenticationCheck(clientID, objectID) {
  //   setIsLoading(true);

  //   try {
  //     const response = await axios.get(
  //       `${backendBaseURL}/api/v1/clients/${clientID}/auth-details`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
  //         },
  //       }
  //     );
  //     if (response?.data?.success) {
  //       setAuthticatedClients((prev) => {
  //         return [...prev, objectID];
  //       });
  //     }
  //     setIsLoading(false);
  //     // console.log(response, "handle Authentication Check response");
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.log("handle Authentication Check error", error);
  //   }
  // }

  async function getAllClients() {
    setAllClientsLoading(true);
    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/client-companies`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.length > 0) {
        setAllClients(response?.data);
      }

      setAllClientsLoading(false);
      console.log(response, "Get all clients response");
    } catch (error: any) {
      setAllClientsLoading(false);
      console.log(error?.message, "Get all clients error");
    }
  }

  // renderings

  useEffect(() => {
    const userDetailsString = localStorage.getItem("userDetails");
    let userdata = userDetailsString ? JSON.parse(userDetailsString) : null;
    if (userdata) {
      setUserDetails(userdata);
    }

    getAllAccountants();
    getAllFinaidProfiles();
    getAllClients();
    setNewClient((prev) => {
      return { ...prev, accountant: userdata?._id };
    });
    // getAllAccountingOwners();
  }, [localLoading]);

  useEffect(() => {
    setAllFinaidLicense([]);
    if (newClient?.accountant) {
      getAllFinaidLicenses();
    } else {
      setNewClient((prev) => {
        return {
          ...prev,
          finaid_license_id: "",
        };
      });
    }
  }, [newClient?.accountant]);

  useEffect(() => {
    if (newClient?.finaid_license_id) {
      let selectedFinaidLicense = allFinaidLicenses?.filter(
        (eachList) =>
          eachList?.finaid_license_id === newClient?.finaid_license_id
      );
      // console.log(selectedFinaidLicense, "selectedFinaidLicense", newClient);
      if (selectedFinaidLicense?.length > 0) {
        setNewClient((prev) => {
          return {
            ...prev,
            profile_id: selectedFinaidLicense[0]?.finaid_profile_id,
          };
        });
      }
    } else {
      setNewClient((prev) => {
        return {
          ...prev,
          profile_id: "",
        };
      });
    }
  }, [newClient?.finaid_license_id]);

  useEffect(() => {
    if (newClient?.profile_id) {
      let selectedFinaidProfile = allFinaidsList?.filter(
        (eachList) => eachList?._id === newClient?.profile_id
      );
      if (selectedFinaidProfile?.length > 0) {
        let platformField = selectedFinaidProfile[0]?.platform
          ? JSON.parse(selectedFinaidProfile[0]?.platform)
          : "";
        let model = selectedFinaidProfile[0]?.model
          ? JSON.parse(selectedFinaidProfile[0]?.model)
          : "";
        let integration = selectedFinaidProfile[0]?.integration
          ? JSON.parse(selectedFinaidProfile[0]?.integration)
          : "";

        // console.log(selectedFinaidProfile, "selectedFinaidProfile");

        setNewClient({
          ...newClient,
          integrations: [
            {
              ...newClient?.integrations[0],
              provider: platformField?.key,
            },
          ],
          platform: platformField?.key,
          model: model?.identifier,
          client_integration: integration?.identifier,
          finaid_profile_name: selectedFinaidProfile[0]?.name,
        });
      }
      // console.log(selectedFinaidProfile, "selectedFinaidProfile");
    }
  }, [newClient?.profile_id]);

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
          {/* <Link href={"/accounting-firm-owner/clients/onboarding"}> */}
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Client
          </Button>
          {/* </Link> */}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Company ID</TableHead>
                {/* <TableHead>Fin(Ai)ds</TableHead> */}
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allClientsLoading ? (
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
                  <EachClientRow
                    key={client._id}
                    client={client}
                    handleViewDetails={handleViewDetails}
                  />
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

          {/* {selectedClient && ( */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="auth-details">Auth Details</TabsTrigger>
              <TabsTrigger
                value="finaid"
                className="pointer-events-none opacity-30"
              >
                Fin(Ai)ds
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="pointer-events-none opacity-30"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="pointer-events-none opacity-30"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                {isLoading ? (
                  <Skeleton height={60} width={60} circle />
                ) : (
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedClient?.avatar}
                      alt={selectedClient?.company_name}
                    />
                    <AvatarFallback>
                      {selectedClient?.company_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h3 className="text-xl font-bold">
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.company_name
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      <>
                        {/* <Badge
                          variant={
                            selectedClient?.status === "active"
                              ? "default"
                              : selectedClient?.status === "inactive"
                              ? "destructive"
                              : "outline"
                          }
                          className="flex items-center gap-1"
                        >
                          {getStatusIcon(selectedClient?.status)}
                          <span className="capitalize">
                            {selectedClient?.status}
                          </span>
                        </Badge> */}
                        <span className="text-sm text-muted-foreground">
                          {selectedClient?.id}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Contact Name</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.company_owner_name
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Location</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.company_location
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Company ID</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.company_id
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Client ID</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.client_id
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Accountant ID</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.accountant_id
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Industry</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.company_nature
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Join Date</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.created_at
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Fin(Ai)ds Deployed</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.finAidsDeployed
                    )}
                  </div>
                </div>
                {/* <div className="space-y-1">
                    <div className="text-sm font-medium">
                      Fin(Ai)ds Deployed
                    </div>
                    <div>{selectedClient?.finAidsDeployed}</div>
                  </div> */}
              </div>

              <div className="flex gap-2 pt-4">
                {isLoading ? (
                  <Skeleton height={30} width={65} />
                ) : (
                  <Button
                    variant="outline"
                    // onClick={() => handleEditClient(selectedClient)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Client
                  </Button>
                )}
                {isLoading ? (
                  <Skeleton height={30} width={65} />
                ) : (
                  <Button variant="outline">
                    <BarChart className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                )}
                {isLoading ? (
                  <Skeleton height={30} width={65} />
                ) : (
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Settings
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="auth-details" className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold">Auth Details</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Client ID</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.authDetails?.client_id
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Name</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.authDetails?.client_name
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Provider</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.authDetails?.client_integrations?.length >
                        0 &&
                      selectedClient?.authDetails?.client_integrations[0]
                        ?.provider
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Client ID</div>
                  <div className="overflow-hidden">
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.authDetails?.client_integrations?.length >
                        0 &&
                      selectedClient?.authDetails?.client_integrations[0]
                        ?.client_id
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Client Secret</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      selectedClient?.authDetails?.client_integrations?.length >
                        0 &&
                      selectedClient?.authDetails?.client_integrations[0]
                        ?.client_secret
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Auth Status</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : selectedClient?.authDetails?.quickbooks?.auth_status ===
                      "authenticated" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Authenticated
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        Not authenticated
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Expires At</div>
                  <div>
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : selectedClient?.authDetails?.quickbooks?.expires_at ? (
                      moment(
                        selectedClient?.authDetails?.quickbooks?.expires_at
                      ).format("MMMM Do YYYY, h:mm:ss a")
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Access Token</div>
                  <div className="break-words line-clamp-3">
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : selectedClient?.authDetails?.quickbooks
                        ?.access_token ? (
                      selectedClient?.authDetails?.quickbooks?.access_token
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="finaid" className="space-y-4 pt-4">
              {(selectedClient?.finAidsDeployed || 0) > 0 ? (
                <div className="space-y-4">
                  {Array.from({
                    length: selectedClient?.finAidsDeployed || 0,
                  }).map((_, index) => (
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
                          {selectedClient?.joinDate &&
                            new Date(
                              new Date(selectedClient?.joinDate)?.getTime() +
                                index * 7 * 24 * 60 * 60 * 1000
                            )
                              ?.toISOString()
                              ?.split("T")[0]}
                        </div>
                        <div>
                          <span className="font-medium">Tasks Completed:</span>{" "}
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
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-8 text-center">
                  <h3 className="text-lg font-medium">No Fin(Ai)ds Deployed</h3>
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
                          PDF • 2.4 MB • Uploaded on {selectedClient?.joinDate}
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
                        <div className="font-medium">Financial Statements</div>
                        <div className="text-xs text-muted-foreground">
                          PDF • 5.1 MB • Uploaded on{" "}
                          {selectedClient?.joinDate &&
                            new Date(
                              new Date(selectedClient?.joinDate).getTime() +
                                15 * 24 * 60 * 60 * 1000
                            )
                              ?.toISOString()
                              ?.split("T")[0]}
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
                          {selectedClient?.joinDate &&
                            new Date(
                              new Date(selectedClient?.joinDate)?.getTime() +
                                30 * 24 * 60 * 60 * 1000
                            )
                              ?.toISOString()
                              ?.split("T")[0]}
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
                        {selectedClient?.joinDate} • By Emily Davis
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          {/* )} */}
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
                <Input id="edit-name" defaultValue={selectedClient?.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact Name</Label>
                <Input
                  id="edit-contact"
                  defaultValue={selectedClient?.contactName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={selectedClient?.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" defaultValue={selectedClient?.phone} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-industry">Industry</Label>
                <Select defaultValue={selectedClient?.industry}>
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
                <Select defaultValue={selectedClient?.status}>
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

      {/* Create client form */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            {/* <DialogDescription>
              Add a new accountant to your firm. They will receive an email
              invitation to set up their account.
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountant" className="text-right">
                Select Accountant
              </Label>
              <div className="col-span-3">
                <Select
                  value={newClient?.accountant}
                  onValueChange={(value) =>
                    setNewClient((prev) => {
                      return { ...prev, accountant: value };
                    })
                  }
                >
                  <SelectTrigger id="accountant">
                    <SelectValue placeholder="Select Accountant" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountantList?.length > 0 &&
                      accountantList?.map((eachAccountant) => {
                        return (
                          <SelectItem
                            key={eachAccountant?._id}
                            value={eachAccountant?._id}
                          >
                            {eachAccountant?.first_name +
                              " " +
                              eachAccountant?.last_name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
            </div> */}
            <div
              className={`grid grid-cols-4 items-center gap-4 relative ${
                newClient?.accountant && allFinaidLicenses?.length > 0
                  ? ""
                  : "pointer-events-none opacity-50"
              }`}
            >
              <Label htmlFor="license" className="text-right">
                Select License
              </Label>
              <div className="col-span-3">
                <Select
                  value={newClient?.finaid_license_id}
                  onValueChange={(value) =>
                    setNewClient((prev) => {
                      return { ...prev, finaid_license_id: value };
                    })
                  }
                >
                  <SelectTrigger id="license">
                    <SelectValue placeholder="Select License" />
                  </SelectTrigger>
                  <SelectContent>
                    {allFinaidLicenses?.length > 0 &&
                      allFinaidLicenses?.map((eachLicense, index) => {
                        return (
                          <SelectItem
                            key={eachLicense?._id || `license-${index}`}
                            value={eachLicense?.finaid_license_id || ""}
                          >
                            {eachLicense?.license_type}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    name: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profile_id" className="text-right">
                Select Profile ID
              </Label>
              <div className="col-span-3">
                <Select
                  value={newClient?.profile_id}
                  onValueChange={(value) =>
                    setNewClient((prev) => {
                      return { ...prev, profile_id: value };
                    })
                  }
                >
                  <SelectTrigger id="profile_id">
                    <SelectValue placeholder="Select Profile ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {allFinaidsList?.length > 0 &&
                      allFinaidsList?.map((eachFinaidProfile) => {
                        return (
                          <SelectItem
                            key={eachFinaidProfile?._id}
                            value={eachFinaidProfile?._id}
                          >
                            {eachFinaidProfile?.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
            </div> */}
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profile_id" className="text-right">
                Select Profile ID
              </Label>
              <div className="col-span-3">
                <Select
                  value={newClient?.profile_id}
                  onValueChange={(value) =>
                    setNewClient((prev) => {
                      return { ...prev, profile_id: value };
                    })
                  }
                >
                  <SelectTrigger id="profile_id">
                    <SelectValue placeholder="Select Profile ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {allFinaidsList?.length > 0 &&
                      allFinaidsList?.map((eachFinaidProfile) => {
                        return (
                          <SelectItem
                            key={eachFinaidProfile?._id}
                            value={eachFinaidProfile?._id}
                          >
                            {eachFinaidProfile?.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
            </div> */}
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company_id" className="text-right">
                Select Company ID
              </Label>
              <div className="col-span-3">
                <Select
                  value={newClient?.company_id}
                  onValueChange={(value) =>
                    setNewClient((prev) => {
                      return { ...prev, company_id: value };
                    })
                  }
                >
                  <SelectTrigger id="company_id">
                    <SelectValue placeholder="Select Company ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {allAccountingOwners?.length > 0 &&
                      allAccountingOwners?.map((eachFinaidProfile) => {
                        return (
                          <SelectItem
                            key={eachFinaidProfile?._id}
                            value={eachFinaidProfile?._id}
                          >
                            {eachFinaidProfile?.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
            </div> */}
            {newClient?.integrations?.length > 0 &&
              newClient?.integrations[0]?.provider === "quickbooks" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client_id" className="text-right">
                      Client ID
                    </Label>
                    <Input
                      id="client_id"
                      placeholder="Enter client id"
                      value={
                        newClient?.integrations?.length > 0
                          ? newClient?.integrations[0]?.client_id
                          : ""
                      }
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          integrations: [
                            {
                              ...newClient?.integrations[0],
                              client_id: e.target.value,
                            },
                          ],
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client_secret" className="text-right">
                      Client Secret
                    </Label>
                    <Input
                      id="client_secret"
                      placeholder="Enter client secret"
                      value={
                        newClient?.integrations?.length > 0
                          ? newClient?.integrations[0]?.client_secret
                          : ""
                      }
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          integrations: [
                            {
                              ...newClient?.integrations[0],
                              client_secret: e.target.value,
                            },
                          ],
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="owner_name" className="text-right">
                      Owner Name
                    </Label>
                    <Input
                      id="owner_name"
                      placeholder="Enter Owner Name"
                      value={newClient?.owner_name}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          owner_name: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company_nature" className="text-right">
                      Company Nature
                    </Label>
                    <Input
                      id="company_nature"
                      placeholder="Enter Company Nature"
                      value={newClient?.company_nature}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          company_nature: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company_location" className="text-right">
                      Company Location
                    </Label>
                    <Input
                      id="company_location"
                      placeholder="Enter Company Location"
                      value={newClient?.company_location}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          company_location: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              // onClick={() => setLocalLoading((prev) => !prev)}
              onClick={handleAddClient}
            >
              {isLoading ? "Adding..." : "Add Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create client company form */}
      <Dialog open={isCreateCompanyOpen} onOpenChange={setIsCreateCompanyOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Fill Client Company Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="realm_id" className="text-right">
                Enter Realm ID
              </Label>
              <Input
                id="realm_id"
                placeholder="Enter Realm ID"
                value={newClientCompany?.company_id}
                onChange={(e) =>
                  setNewClientCompany((prev) => {
                    return {
                      ...prev,
                      company_id: e.target.value,
                    };
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              // onClick={() => console.log(newClient, "new client")}
              onClick={handleAddClientCompany}
            >
              {isLoading ? "Adding..." : "Add Client Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const EachClientRow = ({ client, handleViewDetails }: { client: Client; handleViewDetails: (client: Client) => void }) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // functions

  async function handleQuickbooksRedirect(clientID: string) {
    console.log(clientID, "handleQuickbooksRedirect");
    setIsLoading(true);
    try {
      const response = await axios({
        method: "get",
        url: `${backendBaseURL}/api/v1/quickbooks/redirect?client_company_id=${clientID}`,
        headers: {
          Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      let redirect_url = response?.data?.redirect_url;
      if (redirect_url) {
        /* open popup window */
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;

        const popup = window.open(
          redirect_url,
          "QuickBooks Connect",
          `width=${width},height=${height},top=${top},left=${left}`
        );

        if (!popup || popup.closed || typeof popup.closed === "undefined") {
          alert(
            "Popup was blocked! Please allow popups for this site to connect QuickBooks."
          );
          showToast({
            title: "Popup blocked!",
            description:
              "Popup blocked! Please enable popups for finaidhub.io in your browser settings to connect QuickBooks.",
          });
          return;
        }

        const allowedOrigins = [
          "http://localhost:3000",
          "https://finaidhub.io",
        ];

        setIsLoading(false);

        window.addEventListener("message", (event) => {
          // console.log(event, "event from listerner...");
          if (!allowedOrigins.includes(event.origin)) return;

          if (event.data === "quickbooks-auth-success") {
            console.log("✅ QuickBooks connected!");
          }
        });
      }
      console.log(response, "Handle quickbooks API response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "Handle quickbooks API error");
    }
  }

  return (
    <TableRow key={client._id}>
      <TableCell>
        <Link
          href={`/accountant/clients/${client?._id}`}
          className="font-medium hover:underline"
        >
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
        </Link>
      </TableCell>
      {/* <TableCell>
      <div>{client.contactName}</div>
      <div className="text-sm text-muted-foreground">
        {client.email}
      </div>
    </TableCell> */}
      <Link href={`/accountant/userprofile/${client?.accountant_id}`}>
        <TableCell className="hover:underline">
          {client?.company_owner_name}
        </TableCell>
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
      <TableCell>{moment(client?.created_at).format("MMMM Do YYYY")}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {/* <Button
            variant="ghost"
            size="icon"
            // onClick={() => handleViewDetails(client)}
            onClick={() => handleAuthenticationCheck(client?._id, client?._id)}
          >
            {authticatedClients?.includes(client?._id) ? (
              <ShieldPlus className="h-4 w-4 text-green-500" />
            ) : (
              <ShieldX className="h-4 w-4 text-red-600" />
            )}
            <span className="sr-only">Authenticated</span>
          </Button> */}
          <Button
            variant="default"
            disabled={isLoading}
            // size="icon"
            // onClick={() => handleViewDetails(client)}
            onClick={() => handleQuickbooksRedirect(client?._id)}
          >
            {isLoading ? (
              <LoaderCircle className="h-4 w-4" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            <span>Authenticate</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewDetails(client)}>
                <User2 className="h-4 w-4" />
                Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
