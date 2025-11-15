"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash, Save } from "lucide-react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreateNewFinaidLicense } from "./DialogPopups/create-new-finaid-license";

// Sample apps data
const apps = [
  {
    id: "app-001",
    name: "Document Management",
    description: "Organize and manage all your client documents securely",
    icon: "📄",
    category: "Document Management",
    rating: 4.8,
    reviews: 124,
    price: "Free",
    installed: true,
  },
  {
    id: "app-002",
    name: "Client Portal",
    description: "Secure portal for client access to documents and reports",
    icon: "👥",
    category: "Client Management",
    rating: 4.9,
    reviews: 215,
    price: "$15/month",
    installed: false,
  },
  {
    id: "app-003",
    name: "Tax Planner",
    description: "Advanced tax planning and forecasting tools",
    icon: "📊",
    category: "Tax",
    rating: 4.7,
    reviews: 98,
    price: "$25/month",
    installed: false,
  },
  {
    id: "app-004",
    name: "Invoice Generator",
    description: "Create and send professional invoices to clients",
    icon: "📝",
    category: "Billing",
    rating: 4.6,
    reviews: 156,
    price: "$10/month",
    installed: false,
  },
  {
    id: "app-005",
    name: "Expense Tracker",
    description: "Track and categorize business expenses automatically",
    icon: "💰",
    category: "Expense Management",
    rating: 4.5,
    reviews: 87,
    price: "Free",
    installed: false,
  },
  {
    id: "app-006",
    name: "Client Onboarding",
    description: "Streamline the client onboarding process",
    icon: "🚀",
    category: "Client Management",
    rating: 4.8,
    reviews: 112,
    price: "$20/month",
    installed: false,
  },
];

export function FinaidProfiles({ filters, localLoading, setLocalLoading }) {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [selectedApp, setSelectedApp] = useState<(typeof apps)[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allFinaidProfileList, setAllFinaidProfileList] = useState([]);
  const [newFinaidProfile, setNewFinaidProfile] = useState({});
  const [imageTempURL, setImageTempURL] = useState("");
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userTypeGlobal, setUserTypeGlobal] = useState("");

  const [platformData, setPlatformData] = useState({});
  const [selectedPlatformKey, setSelectedPlatformKey] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const [allProfileLicenses, setAllProfileLicenses] = useState([]);

  // functions

  const getAllFinaidProfileList = async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim() !== "") {
        queryParams.append(key, value);
      }
    });

    const hasFilters = Array.from(queryParams).length > 0;

    const endpoint = hasFilters
      ? `${backendBaseURL}/api/v1/finaid-profiles/filter?${queryParams.toString()}`
      : `${backendBaseURL}/api/v1/finaid-profiles`;

    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response?.data?.data?.length > 0) {
        setAllFinaidProfileList(response?.data?.data);
      } else {
        setAllFinaidProfileList([]);
      }
      setIsLoading(false);
      console.log(response?.data?.data, "Fetched profiles");
      // Set your data here
    } catch (err) {
      setIsLoading(false);
      console.error("Error fetching profiles", err);
    }
  };

  async function getAllLicensesByProfileID(finaidID) {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/licensing-master/profile-id/${finaidID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.status === 200 && response?.data?.data?.length > 0) {
        setAllProfileLicenses(response?.data?.data);
        showToast({
          title: "Fetched!",
          description: "Fetched payment licenses successfully!",
        });
      }

      setIsLoading(false);
      console.log(response, "Get all licenses by profile id response");
    } catch (error) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log("All licenses by profile id error", error);
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
        setIsDetailsOpen(false);
        setLocalLoading((prev) => !prev);
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

  const deleteFinaidLicense = async (id) => {
    setIsLoading(true);
    setAllProfileLicenses([]);

    try {
      let response = await axios.delete(
        `${backendBaseURL}/api/v1/licensing-master/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(response, "Delete Finaid License API response");
      if (response?.status === 200) {
        showToast({
          title: "Deleted Successfully!",
          description: response?.data?.message,
        });
        // setIsDetailsOpen(false);
        setLocalLoading((prev) => !prev);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to delete Finaid License!",
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

  const updateFinaidProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();

    // Loop over the keys dynamically
    Object.entries(newFinaidProfile).forEach(([key, value]) => {
      if (key === "platform" || key === "model" || key === "integration") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      let response = await axios.put(
        `${backendBaseURL}/api/v1/finaid-profiles/${newFinaidProfile?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response, "Update Finaid Profile API response");
      if (response?.status === 200) {
        showToast({
          title: "Updated Successfully!",
          description: response?.data?.message,
        });
        setIsDetailsOpen(false);
        setLocalLoading((prev) => !prev);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to update Finaid!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Error while trying to update Finaid!");
    }
  };

  const handleFileChange = async (event: React.FormEvent) => {
    const file = event.target.files[0];
    if (file) {
      setImageTempURL(URL.createObjectURL(file)); // for preview if needed
      setNewFinaidProfile((prev) => {
        return { ...prev, image: file };
      });
    }
  };

  async function purchaseLicenseFinaid(purchaseLicense) {
    // console.log(purchaseLicense, "purchaseLicense");
    setIsLoading(true);
    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/licenses/purchase`,
        purchaseLicense,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "Purchase license API response");
      if (response?.data?.status === "Success") {
        showToast({
          title: "Purchased Successfully!",
          description: response?.data?.message,
        });
        // setLocalRefresh((prev) => !prev);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to Purchase license!",
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showToast({
        title: "Error",
        description: "Error while trying to Purchase license!",
      });
      console.log(error, "Purchase license error");
    }
  }

  // renderings

  useEffect(() => {
    // if (localStorage?.getItem("accessToken")) {
    getAllFinaidProfileList();
    // }
  }, [localLoading]);

  useEffect(() => {
    if (selectedApp?._id && selectedTab === "paymentlicenses") {
      getAllLicensesByProfileID(selectedApp?._id);
    }
  }, [localLoading, selectedTab]);

  const handleViewDetails = (app: (typeof apps)[0]) => {
    const platform = app?.platform ? JSON.parse(app?.platform) : {};
    const model = app?.model ? JSON.parse(app?.model) : {};
    const integration = app?.integration ? JSON.parse(app?.integration) : {};

    setSelectedApp(app);
    setNewFinaidProfile(app);
    setImageTempURL(app?.image);
    setIsDetailsOpen(true);

    // 🟢 FIX HERE: use platform.key, model.identifier, etc.
    setSelectedPlatformKey(platform?.key);
    setSelectedModel(model);
    setSelectedIntegration(integration);
  };

  // renderings

  // Fetch from API on mount
  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        const res = await axios.get(
          "https://finaid.marketsverse.com/api/v1/predictor/get-supported-configs"
        );
        // console.log(res, "test response");
        setPlatformData(res?.data?.data);
      } catch (err) {
        console.error("Error fetching platform data:", err);
      }
    };

    fetchPlatformData();

    const userTypeLocalStorage = localStorage.getItem("userType");
    if (userTypeLocalStorage) {
      setUserTypeGlobal(userTypeLocalStorage);
    }
  }, []);

  const currentPlatform = platformData[selectedPlatformKey];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-2xl"></div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      <Skeleton width={100} height={15} />
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    <Skeleton width={100} height={15} />
                    <Skeleton width={75} height={15} />
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center">
                      <Skeleton width={60} height={15} />
                    </div>
                    <span className="text-muted-foreground">
                      <Skeleton width={100} height={15} />
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    <Skeleton width={100} height={15} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
              <Button variant="ghost" size="sm">
                <Skeleton width={100} height={15} />
              </Button>
              <Button variant="ghost" size="sm">
                <Skeleton width={100} height={15} />
              </Button>
            </CardFooter>
          </Card>
        ) : allFinaidProfileList?.length > 0 ? (
          allFinaidProfileList.map((app) => (
            <Card key={app._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-2xl">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          app?.image
                            ? app?.image
                            : "/placeholder.svg?height=96&width=96"
                        }
                        alt="Profile"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{app?.name}</h3>
                      {/* {app.installed && (
                        <Badge variant="outline" className="ml-2">
                          <Check className="h-3 w-3 mr-1" />
                          Installed
                        </Badge>
                      )} */}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {app?.desc}
                    </p>
                    {/* <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="ml-1">{app.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({app.reviews} reviews)
                      </span>
                    </div> */}
                    <div className="text-sm font-medium">
                      Model -{" "}
                      {app?.platform ? JSON.parse(app?.platform)?.key : "-"}
                    </div>
                    <div className="text-sm font-medium">
                      Input Type -
                      {app?.model ? JSON.parse(app?.model).display_name : "-"}
                    </div>
                    <div className="text-sm font-medium">
                      Output Type -
                      {app?.integration
                        ? JSON.parse(app?.integration)?.display_options?.join(
                            " → "
                          )
                        : "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(app)}
                >
                  Details
                </Button>
                {/* <Button size="sm" disabled={app.installed}>
                  {app.installed ? "Installed" : "Install"}
                </Button> */}
              </CardFooter>
            </Card>
          ))
        ) : (
          "No Finaid profile found!"
        )}
      </div>

      {/* App Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Finaid Profile Details</DialogTitle>
            {/* <DialogDescription>View and install app</DialogDescription> */}
          </DialogHeader>

          {selectedApp && (
            <Tabs
              defaultValue="overview"
              onValueChange={(value) => {
                if (value === "overview") setSelectedTab("overview");
                else if (value === "profile") setSelectedTab("profile");
                else if (value === "paymentlicenses")
                  setSelectedTab("paymentlicenses");
              }}
              defaultValue="overview"
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="paymentlicenses">
                  Payment Licenses
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-3xl">
                    <Avatar className="h-14 w-14">
                      <AvatarImage
                        src={
                          selectedApp?.image
                            ? selectedApp?.image
                            : "/placeholder.svg?height=96&width=96"
                        }
                        alt="Profile"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h2 className="text-2xl font-bold">
                        {selectedApp?.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {moment(selectedApp?.created_at).format("MMMM Do YYYY")}{" "}
                      </span>
                      <span>{selectedApp?.category}</span>
                      <span>{selectedApp?.price}</span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none dark:prose-invert">
                  <p>{selectedApp?.description}</p>
                  <h3 className="font-bold my-2">About the Finaid</h3>
                  <p className="mb-4">{selectedApp?.desc}</p>
                  <h3 className="font-bold my-2">Specifications</h3>
                  <ul>
                    <li>
                      Model ={" "}
                      {selectedApp?.platform
                        ? JSON.parse(selectedApp?.platform)?.key
                        : "-"}
                    </li>
                    <li>
                      Input Type ={" "}
                      {selectedApp?.model
                        ? JSON.parse(selectedApp?.model).display_name
                        : "-"}
                    </li>
                    <li>
                      Output Type ={" "}
                      {selectedApp?.integration
                        ? JSON.parse(
                            selectedApp?.integration
                          )?.display_options?.join(" → ")
                        : "-"}
                    </li>
                  </ul>
                </div>

                {!(
                  userTypeGlobal === "accounting_firm_owner" ||
                  userTypeGlobal === "accountant"
                ) && (
                  <div className="flex">
                    <Button
                      className="ml-auto"
                      onClick={() => deleteFinaidProfile(selectedApp?._id)}
                      disabled={!selectedApp?._id || isLoading}
                    >
                      <>
                        <Trash className="mr-2 h-4 w-4" />
                        {isLoading ? "deleting..." : "Delete Profile"}
                      </>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Features Tab */}
              <TabsContent
                value="profile"
                className={`space-y-4 pt-4 ${
                  (userTypeGlobal === "accounting_firm_owner" ||
                    userTypeGlobal === "accountant") &&
                  "pointer-events-none"
                }`}
              >
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={
                          imageTempURL
                            ? imageTempURL
                            : "/placeholder.svg?height=96&width=96"
                        }
                        alt="Profile"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {!(
                      userTypeGlobal === "accounting_firm_owner" ||
                      userTypeGlobal === "accountant"
                    ) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Change Avatar
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-left">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newFinaidProfile.name}
                      onChange={(e) =>
                        setNewFinaidProfile((prev) => {
                          return { ...prev, name: e.target.value };
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-left">
                      Description
                    </Label>
                    <Textarea
                      className="col-span-3"
                      id="description"
                      value={newFinaidProfile.desc}
                      onChange={(e) =>
                        setNewFinaidProfile((prev) => {
                          return { ...prev, desc: e.target.value };
                        })
                      }
                      placeholder="Enter description here..."
                      rows={3}
                    />
                  </div>

                  {/* Platform Selector */}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="platform" className="text-right">
                      Select Platform
                    </Label>
                    {userTypeGlobal === "accounting_firm_owner" ||
                    userTypeGlobal === "accountant" ? (
                      <Input
                        id="name"
                        value={selectedPlatformKey}
                        onChange={(e) =>
                          setNewFinaidProfile((prev) => {
                            return { ...prev, name: e.target.value };
                          })
                        }
                        className="col-span-3"
                      />
                    ) : (
                      <Select
                        value={selectedPlatformKey}
                        onValueChange={(value) => {
                          setSelectedPlatformKey(value);
                          setSelectedModel(null);
                          setSelectedIntegration(null);

                          // Update full object in newFinaidProfile
                          setNewFinaidProfile((prev) => ({
                            ...prev,
                            platform: { key: value, ...platformData[value] },
                            // platform: { ...platformData[value] },
                            model: null,
                            integration: null,
                          }));
                        }}
                      >
                        <SelectTrigger id="platform" className="col-span-3">
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(platformData).map((key) => (
                            <SelectItem value={key} key={key}>
                              {key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Model Selector */}
                  <div
                    className={`grid grid-cols-4 items-center gap-4 ${
                      !currentPlatform?.models &&
                      "pointer-events-none opacity-30"
                    }`}
                  >
                    <Label htmlFor="model" className="text-right">
                      Select Model
                    </Label>
                    {userTypeGlobal === "accounting_firm_owner" ||
                    userTypeGlobal === "accountant" ? (
                      <Input
                        id="name"
                        value={selectedModel?.identifier}
                        onChange={(e) =>
                          setNewFinaidProfile((prev) => {
                            return { ...prev, name: e.target.value };
                          })
                        }
                        className="col-span-3"
                      />
                    ) : (
                      <Select
                        value={selectedModel?.identifier || ""}
                        onValueChange={(value) => {
                          const model = currentPlatform.models.find(
                            (m) => m.identifier === value
                          );
                          setSelectedModel(model);

                          // Update model in newFinaidProfile
                          setNewFinaidProfile((prev) => ({
                            ...prev,
                            model,
                          }));
                        }}
                      >
                        <SelectTrigger id="model" className="col-span-3">
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentPlatform?.models?.length > 0 &&
                            currentPlatform?.models.map((model) => (
                              <SelectItem
                                value={model.identifier}
                                key={model.identifier}
                              >
                                {model.display_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Integration Selector */}
                  <div
                    className={`grid grid-cols-4 items-center gap-4 ${
                      !currentPlatform?.integrations &&
                      "pointer-events-none opacity-30"
                    }`}
                  >
                    <Label htmlFor="integration" className="text-right">
                      Select Integration
                    </Label>
                    {userTypeGlobal === "accounting_firm_owner" ||
                    userTypeGlobal === "accountant" ? (
                      <Input
                        id="name"
                        value={selectedIntegration?.identifier}
                        onChange={(e) =>
                          setNewFinaidProfile((prev) => {
                            return { ...prev, name: e.target.value };
                          })
                        }
                        className="col-span-3"
                      />
                    ) : (
                      <Select
                        value={selectedIntegration?.identifier || ""}
                        onValueChange={(value) => {
                          const integration = currentPlatform.integrations.find(
                            (i) => i.identifier === value
                          );
                          setSelectedIntegration(integration);

                          // Update integration in newFinaidProfile
                          setNewFinaidProfile((prev) => ({
                            ...prev,
                            integration,
                          }));
                        }}
                      >
                        <SelectTrigger id="integration" className="col-span-3">
                          <SelectValue placeholder="Select Integration" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentPlatform?.integrations?.length > 0 &&
                            currentPlatform?.integrations?.map(
                              (integration) => (
                                <SelectItem
                                  value={integration.identifier}
                                  key={integration.identifier}
                                >
                                  {integration.display_options.join(" → ")}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="team-lead" className="text-left">
                      Select Model
                    </Label>
                    <Select
                      // value={newTeam.lead}
                      // onValueChange={(value) => setNewTeam({ ...newTeam, lead: value })}
                      placeholder={newFinaidProfile.platform}
                      value={newFinaidProfile.platform}
                      onValueChange={(value) =>
                        setNewFinaidProfile((prev) => {
                          return { ...prev, platform: value };
                        })
                      }
                    >
                      <SelectTrigger id="team-lead" className="col-span-3">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {allDropdown?.model_types?.map((eachItem) => {
                          return (
                            <SelectItem value={eachItem} key={eachItem?.id}>
                              {eachItem?.display_name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="team-lead" className="text-left">
                      Select Input Type
                    </Label>
                    <Select
                      // value={newTeam.lead}
                      // onValueChange={(value) => setNewTeam({ ...newTeam, lead: value })}
                      value={newFinaidProfile.model}
                      onValueChange={(value) =>
                        setNewFinaidProfile((prev) => {
                          return { ...prev, model: value };
                        })
                      }
                    >
                      <SelectTrigger id="team-lead" className="col-span-3">
                        <SelectValue placeholder="Select Input Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allDropdown?.input_types?.map((eachItem) => {
                          return (
                            <SelectItem value={eachItem} key={eachItem?.id}>
                              {eachItem?.display_name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="team-lead" className="text-left">
                      Select Output Type
                    </Label>
                    <Select
                      // value={newTeam.lead}
                      // onValueChange={(value) => setNewTeam({ ...newTeam, lead: value })}
                      value={newFinaidProfile.integration}
                      onValueChange={(value) =>
                        setNewFinaidProfile((prev) => {
                          return { ...prev, integration: value };
                        })
                      }
                    >
                      <SelectTrigger id="team-lead" className="col-span-3">
                        <SelectValue placeholder="Select Output Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allDropdown?.output_types?.map((eachItem) => {
                          return (
                            <SelectItem value={eachItem} key={eachItem?.id}>
                              {eachItem?.display_name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>

                {!(
                  userTypeGlobal === "accounting_firm_owner" ||
                  userTypeGlobal === "accountant"
                ) && (
                  <div className="flex">
                    <Button
                      className="ml-auto"
                      disabled={isLoading || !newFinaidProfile?._id}
                      onClick={updateFinaidProfile}
                    >
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Updating..." : "Save Profile"}
                      </>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* payment licenses Tab */}
              <TabsContent value="paymentlicenses" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isLoading ? (
                    <Card className="overflow-hidden">
                      <CardHeader className="flex justify-between border-t bg-muted/50 px-4 py-3">
                        <div className="text-md font-medium">
                          <Skeleton height={15} width={120} />
                        </div>
                        <p className="text-md line-clamp-2">
                          <Skeleton height={15} width={120} />
                        </p>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-start mt-2 space-x-4 justify-between">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">
                              <Skeleton height={15} width={140} />
                            </div>
                            <div className="text-sm font-medium">
                              <Skeleton height={15} width={125} />
                            </div>
                            <div className="text-sm font-medium">
                              <Skeleton height={15} width={110} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">
                              <Skeleton height={15} width={140} />
                            </div>
                            <div className="text-sm font-medium">
                              <Skeleton height={15} width={125} />
                            </div>
                            <div className="text-sm font-medium">
                              <Skeleton height={15} width={110} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : allProfileLicenses?.length > 0 ? (
                    allProfileLicenses?.map((app) => {
                      return (
                        <Card key={app._id} className="overflow-hidden">
                          <CardHeader className="flex justify-between border-t bg-muted/50 px-4 py-3">
                            <div className="text-md font-medium">
                              <span className="font-bold">Title:</span>{" "}
                              {app?.title}
                            </div>
                            <p className="text-md line-clamp-2">
                              <span className="font-bold text-black">
                                Description:
                              </span>{" "}
                              {app?.description}
                            </p>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="flex items-start mt-2">
                              <div className="space-y-2">
                                <div className="text-sm font-medium">
                                  <span className="font-bold">
                                    Profile ID:{" "}
                                  </span>
                                  {app?.finaid_profile_id}
                                </div>
                                <div className="text-sm font-medium">
                                  <span className="font-bold">Amount: </span>
                                  {app?.amount}
                                </div>
                                <div className="text-sm font-medium">
                                  <span className="font-bold">Currency: </span>
                                  {app?.currency}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-medium">
                                  <span className="font-bold">Frequency: </span>
                                  {app?.frequency}
                                </div>
                                <div className="text-sm font-medium">
                                  <span className="font-bold">Duration: </span>
                                  {app?.duration_in_days}
                                </div>
                                <div className="text-sm font-medium">
                                  <span className="font-bold">
                                    Request Limit:
                                  </span>{" "}
                                  {app?.request_limit}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          {userTypeGlobal === "accounting_firm_owner" && (
                            <div className="flex mb-3 mx-4">
                              <Button
                                // className="ml-auto"
                                disabled={isLoading || !newFinaidProfile?._id}
                                onClick={() =>
                                  purchaseLicenseFinaid({
                                    license_type: app?.title,
                                    validity_days: app?.duration_in_days,
                                    finaid_profile_id: app?.finaid_profile_id,
                                    frequency: app?.frequency,
                                    currency: app?.currency,
                                    amount: app?.amount,
                                  })
                                }
                              >
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  {isLoading ? "Loading..." : "Buy"}
                                </>
                              </Button>
                            </div>
                          )}
                          {!(
                            userTypeGlobal === "accounting_firm_owner" ||
                            userTypeGlobal === "accountant"
                          ) && (
                            <div className="flex mb-4 mr-4">
                              <Button
                                className="ml-auto"
                                onClick={() => deleteFinaidLicense(app?._id)}
                                disabled={!app?._id || isLoading}
                              >
                                <>
                                  <Trash className="mr-2 h-4 w-4" />
                                  {isLoading ? "deleting..." : "Delete License"}
                                </>
                              </Button>
                            </div>
                          )}
                        </Card>
                      );
                    })
                  ) : (
                    ""
                  )}
                </div>

                {!(
                  userTypeGlobal === "accounting_firm_owner" ||
                  userTypeGlobal === "accountant"
                ) && (
                  <div className="flex">
                    <Button
                      className="ml-auto"
                      disabled={isLoading || !newFinaidProfile?._id}
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Loading..." : "Add New Payment License"}
                      </>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              {/* <TabsContent value="reviews" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {[
                    {
                      name: "John Smith",
                      rating: 5,
                      date: "October 15, 2023",
                      comment:
                        "This app has completely transformed how we manage our client documents. Highly recommended!",
                    },
                    {
                      name: "Jane Doe",
                      rating: 4,
                      date: "September 28, 2023",
                      comment:
                        "Great app, but could use some improvements in the user interface. Overall, it has saved us a lot of time.",
                    },
                    {
                      name: "Robert Johnson",
                      rating: 5,
                      date: "October 5, 2023",
                      comment:
                        "Excellent support team! They helped us set everything up and were very responsive to our questions.",
                    },
                  ].map((review, index) => (
                    <div key={index} className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{review.name}</div>
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {review.date}
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent> */}
            </Tabs>
          )}
          <CreateNewFinaidLicense
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            setLocalLoading={setLocalLoading}
            finaidProfileID={selectedApp?._id}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
