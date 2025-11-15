"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceApps } from "@/components/admin/marketplace-apps";
import { MarketplaceIntegrations } from "@/components/admin/marketplace-integrations";
import { InstalledItems } from "@/components/admin/installed-items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { CreateFinaidProfile } from "@/components/admin/DialogPopups/create-finaid-profile";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { FinaidProfilesList } from "@/components/admin/finaid-profiles-list";
import { FinaidProfiles } from "@/components/admin/finaid-profiles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FinaidProfile {
  _id: string;
  name?: string;
  [key: string]: any;
}

interface PlatformModel {
  identifier: string;
  display_name: string;
  [key: string]: any;
}

interface PlatformData {
  [key: string]: {
    models?: PlatformModel[];
    [key: string]: any;
  };
}

export default function MarketplacePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    finaid_profile_id: "",
    status: "",
    user_id: "",
    model: "",
    platform: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [allFinaidsList, setAllFinaidsList] = useState<string[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  const [platformData, setPlatformData] = useState<PlatformData>({});
  const [selectedPlatformKey, setSelectedPlatformKey] = useState("");

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // functions

  // async function getAllFinaidList() {
  //   setIsLoading(true);

  //   try {
  //     const response = await axios.get(`${backendBaseURL}/api/v1/admin/users`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
  //       },
  //     });

  //     setIsLoading(false);
  //     console.log(response, "Get all finaid admins response");
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.log("Get all finaids profile error", error);
  //   }
  // }

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
        const ids = response?.data?.data?.map((profile: FinaidProfile) => profile._id);
        setAllFinaidsList(["All", ...ids]);
      }

      setIsLoading(false);
      // console.log(response, "Get all finaid profile list response");
    } catch (error) {
      setIsLoading(false);
      console.log("Get all finaids profile error", error);
    }
  }

  // renderings

  useEffect(() => {
    getAllFinaidProfiles();
    // getAllFinaidList();
  }, [localLoading]);

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
  }, []);

  const currentPlatform = platformData[selectedPlatformKey];

  return (
    <DashboardLayout userType="super_admin">
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="finaidprofiles" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="finaidprofiles">Finaid Profiles</TabsTrigger>
              <TabsTrigger value="apps">Apps</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="installed">Installed</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                className=""
                onClick={() => setIsCreateDialogOpen((prev) => !prev)}
              >
                Add New Finaid Profile
              </Button>

              <Button variant="outline" size="icon" className="relative">
                <div onClick={toggleDropdown}>
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </div>
                {isOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-64 rounded-md bg-white border shadow-lg p-4 space-y-2 top-10 flex flex-col">
                    <Select
                      value={filters?.finaid_profile_id}
                      onValueChange={(value) =>
                        setFilters((prev) => {
                          return {
                            ...prev,
                            finaid_profile_id: value === "All" ? "" : value,
                          };
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Profile ID" />
                      </SelectTrigger>
                      <SelectContent>
                        {allFinaidsList?.length > 0 &&
                          allFinaidsList?.map((eachItem, index) => {
                            return (
                              <SelectItem
                                key={eachItem + index}
                                value={eachItem}
                              >
                                {eachItem}
                              </SelectItem>
                            );
                          })}

                        {/* <SelectItem value="inactive">Inactive</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters?.status}
                      onValueChange={(value) =>
                        setFilters((prev) => {
                          return {
                            ...prev,
                            status: value === "all" ? "" : value,
                          };
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <input
                      type="text"
                      name="user_id"
                      value={filters.user_id}
                      onChange={handleChange}
                      placeholder="User ID"
                      className="w-full border px-2 py-1 rounded"
                    /> */}
                    <Select
                      value={filters?.platform}
                      onValueChange={(value) => {
                        setSelectedPlatformKey(value);
                        setFilters((prev) => {
                          return {
                            ...prev,
                            platform: value === "all" ? "" : value,
                          };
                        });
                      }}
                    >
                      <SelectTrigger id="platform" className="col-span-3">
                        <SelectValue placeholder="Select Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" key="all">
                          All
                        </SelectItem>
                        {Object.keys(platformData).map((key) => (
                          <SelectItem value={key} key={key}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters?.model}
                      onValueChange={(value) => {
                        const model = currentPlatform?.models?.find(
                          (m: PlatformModel) => m.identifier === value
                        );
                        // setSelectedModel(model);

                        console.log(model, "model");

                        // Update model in newFinaidProfile
                        setFilters((prev) => ({
                          ...prev,
                          model: model?.identifier || "",
                        }));
                      }}
                    >
                      <SelectTrigger id="model" className="col-span-3">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" key="all">
                          All
                        </SelectItem>
                        {currentPlatform?.models && currentPlatform?.models?.length > 0 &&
                          currentPlatform?.models.map((model: PlatformModel) => (
                            <SelectItem
                              value={model.identifier}
                              key={model.identifier}
                            >
                              {model.display_name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {/* <input
                      type="text"
                      name="model"
                      value={filters.model}
                      onChange={handleChange}
                      placeholder="Model"
                      className="w-full border px-2 py-1 rounded"
                    />
                    <input
                      type="text"
                      name="platform"
                      value={filters.platform}
                      onChange={handleChange}
                      placeholder="Platform"
                      className="w-full border px-2 py-1 rounded"
                    /> */}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFilters({
                            finaid_profile_id: "",
                            status: "",
                            user_id: "",
                            model: "",
                            platform: "",
                          });
                          setLocalLoading((prev) => !prev);
                          // getAllFinaidProfileList();
                          setIsOpen(false);
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setLocalLoading((prev) => !prev);
                          // getAllFinaidProfileList();
                          setIsOpen(false);
                        }}
                      >
                        Apply Filter
                      </Button>
                    </div>
                  </div>
                )}
              </Button>
            </div>
          </div>

          <TabsContent value="apps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Apps</CardTitle>
                <CardDescription>
                  Browse and install apps for your Fin(Ai)d Hub
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketplaceApps searchQuery={searchQuery} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect with other services and platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketplaceIntegrations searchQuery={searchQuery} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Installed Apps & Integrations</CardTitle>
                <CardDescription>
                  Manage your installed apps and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InstalledItems searchQuery={searchQuery} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finaidprofiles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Finaid Profiles</CardTitle>
                <CardDescription>
                  Browse all Finaid Profiles under your Fin(Ai)d Hub
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FinaidProfiles
                  localLoading={localLoading}
                  setLocalLoading={setLocalLoading}
                  filters={filters}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <CreateFinaidProfile
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        setLocalLoading={setLocalLoading}
      />
    </DashboardLayout>
  );
}
