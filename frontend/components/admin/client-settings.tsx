"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Save,
  Trash2,
  UserPlus,
  Building,
  Key,
  Shield,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ClientSettingsProps {
  client: any;
}

export function ClientSettings({ client }: ClientSettingsProps) {
  const [formData, setFormData] = useState({
    companyName: client.name,
    contactName: client.contactName,
    email: client.email,
    phone: client.phone,
    industry: client.industry,
    status: client.status,
    address: "123 Business St, Suite 100",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "",
    website: "https://example.com",
    taxId: "XX-XXXXXXX",
    notes: "Client onboarded through referral program.",
  });
  const [allCountries, setAllCountries] = useState([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    let allCountriesStorage = localStorage.getItem("allCountries")
      ? JSON.parse(localStorage.getItem("allCountries"))
      : "";
    setAllCountries(allCountriesStorage);
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update the client's company details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      handleSelectChange("industry", value)
                    }
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
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
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      handleSelectChange("country", value)
                    }
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCountries?.length > 0 &&
                        allCountries?.map((eachCountry, index) => {
                          return (
                            <SelectItem key={eachCountry?.name + index} value={eachCountry?.name}>
                              {eachCountry?.name}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Primary Contact</CardTitle>
              <CardDescription>
                Update the primary contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    name="designation"
                    defaultValue="CFO"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-red-900">
                      Delete Client Account
                    </h4>
                    <p className="text-sm text-red-700">
                      This action cannot be undone. This will permanently delete
                      the client account and all associated data.
                    </p>
                    <Button variant="destructive" size="sm" className="mt-2">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Client
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Client Users</CardTitle>
                  <CardDescription>
                    Manage users who have access to this client account
                  </CardDescription>
                </div>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "John Smith",
                    email: "john@acmecorp.com",
                    role: "Admin",
                    avatar: "/placeholder.svg?height=40&width=40",
                  },
                  {
                    name: "Jane Doe",
                    email: "jane@acmecorp.com",
                    role: "Editor",
                    avatar: "/placeholder.svg?height=40&width=40",
                  },
                  {
                    name: "Robert Johnson",
                    email: "robert@acmecorp.com",
                    role: "Viewer",
                    avatar: "/placeholder.svg?height=40&width=40",
                  },
                ].map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select defaultValue={user.role.toLowerCase()}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Accounting Integrations</CardTitle>
              <CardDescription>
                Manage connections to accounting software
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "QuickBooks",
                    status: "Connected",
                    lastSync: "2 hours ago",
                    icon: <Building className="h-8 w-8" />,
                  },
                  {
                    name: "Xero",
                    status: "Not Connected",
                    lastSync: "Never",
                    icon: <Building className="h-8 w-8" />,
                  },
                  {
                    name: "Sage",
                    status: "Not Connected",
                    lastSync: "Never",
                    icon: <Building className="h-8 w-8" />,
                  },
                ].map((integration, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-md bg-primary/10 p-2">
                        {integration.icon}
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {integration.status === "Connected"
                            ? `Last synced: ${integration.lastSync}`
                            : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div>
                      {integration.status === "Connected" ? (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Sync Now
                          </Button>
                          <Button variant="outline" size="sm">
                            Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm">Connect</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Banking Integrations</CardTitle>
              <CardDescription>
                Manage connections to banking services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Chase Bank",
                    status: "Connected",
                    lastSync: "1 day ago",
                    icon: <Building className="h-8 w-8" />,
                  },
                  {
                    name: "Bank of America",
                    status: "Connected",
                    lastSync: "3 days ago",
                    icon: <Building className="h-8 w-8" />,
                  },
                  {
                    name: "Wells Fargo",
                    status: "Not Connected",
                    lastSync: "Never",
                    icon: <Building className="h-8 w-8" />,
                  },
                ].map((integration, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-md bg-primary/10 p-2">
                        {integration.icon}
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {integration.status === "Connected"
                            ? `Last synced: ${integration.lastSync}`
                            : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div>
                      {integration.status === "Connected" ? (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Sync Now
                          </Button>
                          <Button variant="outline" size="sm">
                            Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm">Connect</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security options for this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all client users
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out users after inactivity
                    </p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">IP Restrictions</Label>
                    <p className="text-sm text-muted-foreground">
                      Limit access to specific IP addresses
                    </p>
                  </div>
                  <Button variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow API access for this client
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">API Keys</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage API keys for this client
                      </p>
                    </div>
                    <Button size="sm">
                      <Key className="mr-2 h-4 w-4" />
                      Generate New Key
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="rounded-md bg-muted p-2 text-sm">
                      <div className="flex items-center justify-between">
                        <code>sk_live_1a2b3c4d5e6f7g8h9i0j</code>
                        <Button variant="ghost" size="sm">
                          Revoke
                        </Button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Created: Jan 15, 2023 • Last used: 2 days ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Fin(Ai)d Status Updates",
                        description:
                          "Get notified when a Fin(Ai)d status changes",
                      },
                      {
                        label: "Weekly Reports",
                        description: "Receive weekly performance reports",
                      },
                      {
                        label: "System Maintenance",
                        description: "Get notified about scheduled maintenance",
                      },
                      {
                        label: "Billing Updates",
                        description:
                          "Receive notifications about billing and invoices",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <Label>{item.label}</Label>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Switch defaultChecked={index !== 2} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">
                    Notification Recipients
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: "John Smith",
                        email: "john@acmecorp.com",
                        role: "Admin",
                      },
                      {
                        name: "Jane Doe",
                        email: "jane@acmecorp.com",
                        role: "Editor",
                      },
                    ].map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border p-4"
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select notifications" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Notifications
                              </SelectItem>
                              <SelectItem value="important">
                                Important Only
                              </SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="mt-4">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Recipient
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Bell className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
