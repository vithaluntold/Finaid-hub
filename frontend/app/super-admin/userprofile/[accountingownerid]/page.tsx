"use client";

export const dynamic = 'force-dynamic';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientOverview from "@/components/client-overview";
import ClientTransactions from "@/components/client-transactions";
import ClientInvoices from "@/components/client-invoices";
import ClientDocuments from "@/components/client-documents";
import ClientCommunications from "@/components/client-communications";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import AccountantTable from "@/components/admin/accountant-table";
import ClientsTable from "@/components/admin/clients-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { backendBaseURL } from "@/assets/constants/constant";
import { useParams, useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import moment from "moment";

// In a real app, this would come from the database based on the ID
const clientData = {
  id: "client-001",
  name: "Acme Corporation",
  contactPerson: "John Smith",
  email: "john.smith@acmecorp.com",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, Suite 100, New York, NY 10001",
  website: "www.acmecorp.com",
  status: "active" as const,
  accountManager: "Sarah Johnson",
  clientSince: new Date(2022, 0, 15),
  industry: "Technology",
  companySize: "50-100 employees",
  paymentTerms: "Net 30",
  creditLimit: 50000,
  avatar: "/placeholder.svg?height=80&width=80&text=AC",
};

interface ProfileDetail {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  user_type?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ClientProfilePage() {
  const router = useRouter();
  const params = useParams();
  const accountingownerId = params?.accountingownerid as string;
  const [isLoading, setIsLoading] = useState(false);
  const [profileDetail, setProfileDetail] = useState<ProfileDetail>({});

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Inactive
          </Badge>
        );
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return null;
    }
  };

  /* functions */

  async function getProfileData(userID: string) {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/users/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.status === "Success") {
        setProfileDetail(response?.data?.data);
      }

      setIsLoading(false);
      console.log(response, "Get profile details response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "Get profile details error");
    }
  }

  /* renderings */

  useEffect(() => {
    console.log(params, "params");
    getProfileData(accountingownerId);
  }, []);

  return (
    <DashboardLayout userType="super_admin">
      <div className=" py-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* <Link href="/admin/accounting-firms"> */}
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            {/* </Link> */}
            <h1 className="text-3xl font-bold">Client Profile</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
            {/* <Button variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button> */}
          </div>
        </div>

        {/* Client Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={clientData.avatar || "/placeholder.svg"}
                    alt={profileDetail?.first_name}
                  />
                  <AvatarFallback className="text-lg">
                    {profileDetail?.first_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h2 className="text-2xl font-bold">
                        {isLoading ? (
                          <Skeleton width={100} height={25} />
                        ) : profileDetail?.first_name ? (
                          profileDetail?.first_name
                        ) : "" + " " + profileDetail?.last_name ? (
                          profileDetail?.last_name
                        ) : (
                          ""
                        )}
                      </h2>
                      {isLoading ? (
                        <Skeleton width={100} height={20} />
                      ) : (
                        getStatusBadge(profileDetail.status || 'inactive')
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground">
                      {isLoading ? (
                        <Skeleton width={100} height={10} />
                      ) : profileDetail?.user_type ? (
                        profileDetail?.user_type
                      ) : (
                        ""
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {isLoading ? (
                          <Skeleton width={100} height={10} />
                        ) : profileDetail?.email ? (
                          profileDetail?.email
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {isLoading ? (
                          <Skeleton width={100} height={10} />
                        ) : profileDetail?.mobile ? (
                          profileDetail?.mobile
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {isLoading ? (
                          <Skeleton width={100} height={10} />
                        ) : profileDetail?.created_at ? (
                          moment(profileDetail?.created_at).format(
                            "MMMM Do YYYY"
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </div> */}
                    {/* <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {" "}
                        {isLoading ? (
                          <Skeleton width={100} height={10} />
                        ) : profileDetail?.mobile ? (
                          profileDetail?.mobile
                        ) : (
                          ""
                        )}
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="text-sm text-muted-foreground">
                  Client Since
                </div>
                <div className="font-medium">
                  {isLoading ? (
                    <Skeleton width={100} height={10} />
                  ) : profileDetail?.created_at ? (
                    moment(profileDetail?.created_at).format("MMMM Do YYYY")
                  ) : (
                    ""
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Account Manager
                </div>
                <div className="font-medium">-</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
            <TabsTrigger value="accountants">Accountants</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview">
            <ClientOverview clientData={clientData} />
          </TabsContent>

          <TabsContent value="purchases">
            <ClientTransactions clientId={clientData.id} />
          </TabsContent>

          <TabsContent value="licenses">
            <ClientInvoices clientId={clientData.id} />
          </TabsContent>

          <TabsContent value="accountants">
            <AccountantTable />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsTable />
          </TabsContent>

          {/* <TabsContent value="documents">
            <ClientDocuments clientId={clientData.id} />
          </TabsContent> */}

          <TabsContent value="communications">
            <ClientCommunications clientId={clientData.id} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
