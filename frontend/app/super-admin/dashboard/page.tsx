"use client";

export const dynamic = 'force-dynamic';

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/super-admin/overview";
import { RecentSubscribers } from "@/components/super-admin/recent-subscribers";
import { FinaidDeployment } from "@/components/super-admin/finaid-deployment";
import { useEffect, useState } from "react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Skeleton from "react-loading-skeleton";

export default function SuperAdminDashboard() {
  const { showToast } = useToast();
  const [allSubscribers, setAllSubscribers] = useState([]);
  const [allFinaidLicenses, setAllFinaidLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // functions

  async function getAllAccountingOwners() {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/users/accounting-owner`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.data?.length > 0) {
        setAllSubscribers(response?.data?.data);
      }

      setIsLoading(false);
      console.log(response, "Get all accounting firm owners response");
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log("All accounting firm owners error", error);
    }
  }

  async function getAllFinaidLicenses() {
    setIsLoading(true);

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
        setAllFinaidLicenses(licenses);
      } else {
        setAllFinaidLicenses([]);
      }

      setIsLoading(false);
      console.log(response, "Get all finaid licenses response");
    } catch (error) {
      setIsLoading(false);
      console.log("Get all finaid licenses error", error);
    }
  }

  // renderings

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      getAllAccountingOwners();
      getAllFinaidLicenses();
    }
  }, []);

  return (
    <DashboardLayout userType="super_admin">
      <div className="flex flex-col gap-6">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
        </div> */}
        <Tabs defaultValue="overview" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList> */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Firms
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Skeleton width={100} height={15} />
                    ) : allSubscribers?.length ? (
                      allSubscribers?.length
                    ) : (
                      ""
                    )}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +18.2% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Skeleton width={100} height={15} />
                    ) : allSubscribers?.length ? (
                      allSubscribers?.length
                    ) : (
                      ""
                    )}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                    +7.4% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Fin(Ai)ds Deployed
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Skeleton height={15} width={100} />
                    ) : (
                      allFinaidLicenses?.length
                    )}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                    +24.5% from last month
                  </p> */}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Fin(Ai)d Deployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <FinaidDeployment />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Accounting Firms</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentSubscribers
                    allSubscribers={allSubscribers}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Detailed analytics content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Reports and exportable data will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
