"use client";

export const dynamic = 'force-dynamic';

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscribersList } from "@/components/admin/subscribers-list";
import { SubscriptionStats } from "@/components/super-admin/subscription-stats";
import { BillingOverview } from "@/components/super-admin/billing-overview";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { CreateAccountingFirm } from "@/components/admin/DialogPopups/create-accounting-firm";
import { useEffect, useState } from "react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Skeleton from "react-loading-skeleton";

export default function SubscribersPage() {
  const { showToast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allAccountingOwners, setAllAccountingOwners] = useState([]);

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
        setAllAccountingOwners(response?.data?.data);
      }

      setIsLoading(false);
      console.log(response, "Get all accounting firm owners response");
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message || "An error occurred",
      });
      setIsLoading(false);
      console.log("All accounting firm owners error", error);
    }
  }

  // renderings

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      getAllAccountingOwners();
    }
  }, [localLoading]);

  return (
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Accounting Firms
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
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton width={100} height={15} />
                ) : allAccountingOwners?.length ? (
                  allAccountingOwners?.length
                ) : (
                  ""
                )}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                +24 from last month
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Accounting Firms
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
                  <Skeleton width={100} height={15} />
                ) : allAccountingOwners?.length ? (
                  allAccountingOwners?.length
                ) : (
                  ""
                )}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                +18 from last month
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
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
              <div className="text-2xl font-bold">$0</div>
              {/* <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. License Value
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
              <div className="text-2xl font-bold">$0</div>
              {/* <p className="text-xs text-muted-foreground">
                +5.2% from last month
              </p> */}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">All Accounting Firms</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </div> */}

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="flex justify-between gap-2 flex-row">
                <div>
                  <CardTitle className="mb-2">
                    All Accounting Firm Owners
                  </CardTitle>
                  <CardDescription>
                    Interact with an accounting firm owner’s profile by clicking
                    on the eye icon
                  </CardDescription>
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                  <Button
                    className=""
                    onClick={() => setIsCreateDialogOpen((prev) => !prev)}
                  >
                    Add New Accounting Firm
                  </Button>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SubscribersList
                  allAccountingOwners={allAccountingOwners}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Accounting Firms</CardTitle>
                <CardDescription>
                  View and manage currently active accounting firms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscribersList
                  allAccountingOwners={allAccountingOwners}
                  isLoading={isLoading}
                  filterStatus="active"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Accounting Firms</CardTitle>
                <CardDescription>
                  View and manage accounting firms with pending status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscribersList
                  allAccountingOwners={allAccountingOwners}
                  isLoading={isLoading}
                  filterStatus="pending"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inactive Accounting Firms</CardTitle>
                <CardDescription>
                  View and manage inactive accounting firms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscribersList
                  allAccountingOwners={allAccountingOwners}
                  isLoading={isLoading}
                  filterStatus="inactive"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>License Statistics</CardTitle>
              <CardDescription>
                Breakdown of license types and plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionStats />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Overview</CardTitle>
              <CardDescription>
                Monthly billing and revenue trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BillingOverview />
            </CardContent>
          </Card>
        </div> */}
      </div>
      <CreateAccountingFirm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        setLocalLoading={setLocalLoading}
      />
    </DashboardLayout>
  );
}
