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
import { AdminOverview } from "@/components/admin/overview";
import { TeamMembers } from "@/components/admin/team-members";
import { ClientList } from "@/components/accounting-firm-owner/client-list";
import { useEffect, useState } from "react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

// Add interfaces for type safety
interface Accountant {
  _id: string;
  [key: string]: any;
}

interface License {
  _id: string;
  [key: string]: any;
}

interface Client {
  _id: string;
  [key: string]: any;
}

export default function AdminDashboard() {
  const [accountantList, setAccountantList] = useState<Accountant[]>([]);
  const [alFinaidLicenses, setAllFinaidLicenses] = useState<License[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
          licenses.map(async (license: License) => {
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

        // console.log(enrichedLicenses, "enrichedLicenses");

        // setSelectedLicense(enrichedLicenses[0]);
        setAllFinaidLicenses(enrichedLicenses);
      } else {
        setAllFinaidLicenses([]);
      }

      setIsLoading(false);
      // console.log(response, "Get all finaid licenses response");
    } catch (error) {
      setIsLoading(false);
      console.log("Get all finaid licenses error", error);
    }
  }

  async function getAllClients() {
    setIsLoading(true);
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

      setIsLoading(false);
      console.log(response, "Get all clients response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "Get all clients error");
    }
  }

  // renderings

  useEffect(() => {
    getAllAccountants();
    getAllFinaidLicenses();
    getAllClients();
  }, []);

  return (
    <DashboardLayout userType="accounting_firm_owner">
      <div className="flex flex-col gap-6">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div> */}
        <Tabs defaultValue="overview" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList> */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Accountants
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
                      <Skeleton height={25} width={100} />
                    ) : accountantList ? (
                      accountantList?.length
                    ) : (
                      "0"
                    )}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Clients
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
                  <div className="text-2xl font-bold">0</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +8 from last month
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
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +12 from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Licenses
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
                      <Skeleton height={25} width={100} />
                    ) : alFinaidLicenses ? (
                      alFinaidLicenses?.length
                    ) : (
                      "0"
                    )}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                    +4 from last month
                  </p> */}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>Monthly performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <AdminOverview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Active Accountants in your firm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamMembers accountantList={accountantList} />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Clients</CardTitle>
                  <CardDescription>
                    Recently added or updated clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientList
                    searchQuery={""}
                    allClients={allClients}
                    isLoading={isLoading}
                    filterStatus=""
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Team management interface will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Client management interface will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
