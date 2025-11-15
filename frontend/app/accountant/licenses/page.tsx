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
import { SubscriptionsList } from "@/components/accountant/subscriptions-list";
import { SubscriptionPlans } from "@/components/admin/subscription-plans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";

// Add interface for license type
interface License {
  _id: string;
  status: string;
  [key: string]: any;
}

export default function SubscriptionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [allFinaidLicenses, setAllFinaidLicenses] = useState([]);
  const [activeFinaidLicenses, setActiveFinaidLicenses] = useState(0);

  // functions

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

      if (licenses.length > 0) {
        let activeLicense = licenses?.filter(
          (eachLicense: License) => eachLicense?.status == "active"
        );
        setAllFinaidLicenses(licenses);
        setActiveFinaidLicenses(activeLicense?.length);
      } else {
        setAllFinaidLicenses([]);
        setActiveFinaidLicenses(0);
      }

      setIsLoading(false);
      console.log(response, "Get all finaid licenses response in lincenses");
    } catch (error) {
      setIsLoading(false);
      console.log("Get all finaid licenses error", error);
    }
  }

  // renderings

  useEffect(() => {
    getAllFinaidLicenses();
  }, []);

  return (
    <DashboardLayout userType="accountant">
      <div className="flex flex-col gap-6">
        {/* <div className="flex items-center justify-end">
          <h1 className="text-3xl font-bold tracking-tight">Licenses</h1>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Licenses..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New License
            </Button>
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton height={20} width={100} />
                ) : (
                  activeFinaidLicenses
                )}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                +4 from last month
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              {/* <p className="text-xs text-muted-foreground">
                +8.2% from last month
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
                +2.5% from last month
              </p> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Renewal Rate
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
              <div className="text-2xl font-bold">0%</div>
              {/* <p className="text-xs text-muted-foreground">
                +1.2% from last month
              </p> */}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="licenses" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
           
          </TabsList> */}

          <TabsContent value="licenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Accounting Firms’s Finaid Licenses</CardTitle>
                <CardDescription>Manage Your Licenses</CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriptionsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>License Plans</CardTitle>
                <CardDescription>
                  View and manage available license plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriptionPlans />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
                <CardDescription>
                  Configure billing settings and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure the payment methods you accept from clients
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="credit-card"
                          defaultChecked
                        />
                        <label htmlFor="credit-card">Credit Card</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="bank-transfer"
                          defaultChecked
                        />
                        <label htmlFor="bank-transfer">Bank Transfer</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="paypal" defaultChecked />
                        <label htmlFor="paypal">PayPal</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="stripe" defaultChecked />
                        <label htmlFor="stripe">Stripe</label>
                      </div>
                    </div>
                    <Button className="mt-4">Save Payment Methods</Button>
                  </div>

                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Billing Cycle</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Set your default billing cycle for new subscriptions
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="monthly"
                          name="billing-cycle"
                          defaultChecked
                        />
                        <label htmlFor="monthly">Monthly</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="quarterly"
                          name="billing-cycle"
                        />
                        <label htmlFor="quarterly">Quarterly</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" id="annual" name="billing-cycle" />
                        <label htmlFor="annual">Annual</label>
                      </div>
                    </div>
                    <Button className="mt-4">Save Billing Cycle</Button>
                  </div>

                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Invoice Settings</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure your invoice settings
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="auto-invoice"
                          defaultChecked
                        />
                        <label htmlFor="auto-invoice">
                          Automatically generate invoices
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="email-invoice"
                          defaultChecked
                        />
                        <label htmlFor="email-invoice">
                          Email invoices to clients
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="payment-reminder"
                          defaultChecked
                        />
                        <label htmlFor="payment-reminder">
                          Send payment reminders
                        </label>
                      </div>
                    </div>
                    <Button className="mt-4">Save Invoice Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
