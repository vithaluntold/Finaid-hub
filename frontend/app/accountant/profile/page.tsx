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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/admin/user-profile";
import { Lock, LockIcon } from "lucide-react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ResetPassword = {
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
};

export default function ProfilePage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [updatePasswordDetails, setUpdatePasswordDetails] =
    useState<ResetPassword>({});

  // functions

  const updateResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      updatePasswordDetails?.new_password !==
      updatePasswordDetails?.new_password_confirmation
    ) {
      showToast({
        title: "Error",
        description: "Passwords don't match!",
      });
      return;
    }

    setIsLoading(true);

    try {
      let response = await axios.put(
        `${backendBaseURL}/api/v1/users/2/update-password`,
        updatePasswordDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "Reset password api response");
      if (response?.status === 200) {
        showToast({
          title: response?.data?.message,
          description: response?.data?.message,
        });
        setUpdatePasswordDetails({});
        window.location.reload();
      } else {
        showToast({
          title: "Error",
          description: "Unable to reset password!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Reset password error");
    }
  };

  return (
    <DashboardLayout userType="accountant">
      <div className="flex flex-col gap-6">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <Button>Save Changes</Button>
        </div> */}

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <UserProfile />
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="johndoe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    title="Select your preferred language"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    title="Select your timezone"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="utc-8">Pacific Time (UTC-8)</option>
                    <option value="utc-5">Eastern Time (UTC-5)</option>
                    <option value="utc+0">UTC</option>
                    <option value="utc+1">Central European Time (UTC+1)</option>
                    <option value="utc+8">China Standard Time (UTC+8)</option>
                  </select>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Permanently delete your account and all of your content.
                  </p>
                  <Button variant="destructive" className="mt-4">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b">
                  <div className="font-medium">Notification Type</div>
                  <div className="font-medium text-center">Email</div>
                  <div className="font-medium text-center">In-App</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
                  <div>
                    <div className="font-medium">Client Updates</div>
                    <div className="text-sm text-muted-foreground">
                      When a client makes changes to their account
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
                  <div>
                    <div className="font-medium">Fin(Ai)d Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      When a Fin(Ai)d requires attention
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
                  <div>
                    <div className="font-medium">Team Activity</div>
                    <div className="text-sm text-muted-foreground">
                      When team members take actions
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch />
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
                  <div>
                    <div className="font-medium">System Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Important system updates and maintenance
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  <div>
                    <div className="font-medium">Marketing</div>
                    <div className="text-sm text-muted-foreground">
                      Product updates and announcements
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch />
                  </div>
                  <div className="flex justify-center items-center">
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security settings and devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <LockIcon className="h-4 w-4" />
                      </div>
                      <Input
                        id="current-password"
                        type="password"
                        className="pl-10"
                        value={updatePasswordDetails?.current_password}
                        onChange={(e) =>
                          setUpdatePasswordDetails((prev) => {
                            return {
                              ...prev,
                              current_password: e.target.value,
                            };
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <LockIcon className="h-4 w-4" />
                      </div>
                      <Input
                        id="new-password"
                        type="password"
                        className="pl-10"
                        value={updatePasswordDetails?.new_password}
                        onChange={(e) =>
                          setUpdatePasswordDetails((prev) => {
                            return {
                              ...prev,
                              new_password: e.target.value,
                            };
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <LockIcon className="h-4 w-4" />
                      </div>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="pl-10"
                        value={updatePasswordDetails?.new_password_confirmation}
                        onChange={(e) =>
                          setUpdatePasswordDetails((prev) => {
                            return {
                              ...prev,
                              new_password_confirmation: e.target.value,
                            };
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    className="mt-2"
                    onClick={updateResetPassword}
                    disabled={
                      !updatePasswordDetails?.current_password ||
                      !updatePasswordDetails?.new_password ||
                      !updatePasswordDetails?.new_password_confirmation ||
                      isLoading
                    }
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account by enabling
                    two-factor authentication.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">
                        Two-Factor Authentication
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Protect your account with an authentication app
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button variant="outline" className="mt-2">
                    Configure 2FA
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your active sessions across devices.
                  </p>

                  <div className="rounded-md border p-4 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Current Session</p>
                        <div className="text-sm text-muted-foreground">
                          San Francisco, CA • Chrome on macOS
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Started 2 hours ago
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>

                  <div className="rounded-md border p-4 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Mobile Session</p>
                        <div className="text-sm text-muted-foreground">
                          San Francisco, CA • Fin(Ai)d Hub App on iOS
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Started 1 day ago
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>

                  <Button variant="destructive" className="mt-2">
                    Revoke All Other Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
