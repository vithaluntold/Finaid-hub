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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { CreateFinaidProfile } from "@/components/admin/DialogPopups/create-finaid-profile";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { FinaidProfilesList } from "@/components/admin/finaid-profiles-list";
import { FinaidProfiles } from "@/components/admin/finaid-profiles";

export default function MarketplacePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allFinaidsList, setAllFinaidsList] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  // functions

  async function getAllFinaidList() {
    setIsLoading(true);

    try {
      const response = await axios.get(`${backendBaseURL}/api/v1/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
        },
      });

      if (response?.data?.data?.length > 0) {
        setAllFinaidsList(response?.data?.data);
      }

      setIsLoading(false);
      console.log(response, "Get all finaid profile list response");
    } catch (error) {
      setIsLoading(false);
      console.log("Get all finaids profile error", error);
    }
  }

  // renderings

  useEffect(() => {
    getAllFinaidList();
  }, [localLoading]);

  return (
    <DashboardLayout userType="accountant">
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="finaidprofiles" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="finaidprofiles">Finaid Profiles</TabsTrigger>
              {/* <TabsTrigger value="apps">Apps</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="installed">Installed</TabsTrigger> */}
            </TabsList>
            <div className="flex gap-2">
              <Button
                className=""
                onClick={() => setIsCreateDialogOpen((prev) => !prev)}
              >
                Add New Finaid Profile
              </Button>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
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
                <MarketplaceApps />
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
                <MarketplaceIntegrations />
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
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                            <path d="M12 3v6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            QuickBooks Integration
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Connected on Oct 15, 2023
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <path d="M12 2v20" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Payment Processing</h3>
                          <p className="text-sm text-muted-foreground">
                            Connected on Nov 2, 2023
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M7 7h10" />
                            <path d="M7 12h10" />
                            <path d="M7 17h10" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Document Management</h3>
                          <p className="text-sm text-muted-foreground">
                            Connected on Oct 28, 2023
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>
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
                  filters={{}}
                  localLoading={localLoading}
                  setLocalLoading={setLocalLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle>Finaid Profiles</CardTitle>
              <CardDescription>
                All Finaid Profiles for your Fin(Ai)d Hub
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FinaidProfilesList />
            </CardContent>
          </Card>
        </div> */}
      </div>
      <CreateFinaidProfile
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        setLocalLoading={setLocalLoading}
      />
    </DashboardLayout>
  );
}
