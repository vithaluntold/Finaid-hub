"use client";

export const dynamic = 'force-dynamic';

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { ClientManagement } from "@/components/accountant/client-management";
import Skeleton from "react-loading-skeleton";

export default function ClientsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [localLoading, setLocalLoading] = useState(false);
  const [allClients, setAllClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
        setIsLoading(false);
      }

      console.log(response, "Get all clients response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "Get all clients error");
    }
  }

  const handleAddClient = () => {
    router.push("/accountant/clients/onboarding");
  };

  // renderings

  useEffect(() => {
    getAllClients();
  }, [localLoading]);

  return (
    <DashboardLayout
      userType="accountant"
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <div className="flex gap-2">
            {/* <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8"
              />
            </div> */}
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            {/* <Button onClick={handleAddClient}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clients
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
                  <Skeleton height={15} width={100} />
                ) : allClients?.length > 0 ? (
                  allClients?.length
                ) : (
                  ""
                )}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                +8 from last month
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
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton height={15} width={100} />
                ) : allClients?.length > 0 ? (
                  allClients?.length
                ) : (
                  ""
                )}
              </div>
              {/* <p className="text-xs text-muted-foreground">87.5% active rate</p> */}
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
                2.5 per client avg.
              </p> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Client Retention
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
              <div className="text-2xl font-bold">100%</div>
              {/* <p className="text-xs text-muted-foreground">
                +1.5% from last quarter
              </p> */}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  Manage your client accounts and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientManagement
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  localLoading={localLoading}
                  setLocalLoading={setLocalLoading}
                  searchQuery={searchQuery}
                  allClients={allClients}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Clients</CardTitle>
                <CardDescription>
                  View and manage active client accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientManagement
                  filterStatus="active"
                  localLoading={localLoading}
                  setLocalLoading={setLocalLoading}
                  searchQuery={searchQuery}
                  allClients={allClients}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inactive Clients</CardTitle>
                <CardDescription>
                  View and manage inactive client accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientManagement
                  filterStatus="inactive"
                  localLoading={localLoading}
                  setLocalLoading={setLocalLoading}
                  searchQuery={searchQuery}
                  allClients={allClients}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Clients</CardTitle>
                <CardDescription>
                  View and manage pending client accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientManagement
                  filterStatus="pending"
                  localLoading={localLoading}
                  setLocalLoading={setLocalLoading}
                  searchQuery={searchQuery}
                  allClients={allClients}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
