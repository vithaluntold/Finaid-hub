"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Lock, LockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InviteAdminDialog } from "@/components/super-admin/DialogPopups/invite-admin-dialog";
import { ContentList } from "@/components/super-admin/content-list";
import { useToast } from "@/hooks/use-toast";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useRouter } from "next/navigation";

type ResetPassword = {
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
};

export default function Security() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [updatePasswordDetails, setUpdatePasswordDetails] =
    useState<ResetPassword>({});

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
    <>
      {/* Security Settings */}
      <TabsContent value="security">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="confirm-password">Confirm New Password</Label>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Authenticator App</div>
                  <div className="text-sm text-muted-foreground">
                    Use an authenticator app to generate one-time codes
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">SMS Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Receive a code via SMS to verify your identity
                  </div>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Email Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Receive a code via email to verify your identity
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login Sessions</CardTitle>
              <CardDescription>Manage your active sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Current Session</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Globe className="mr-1 h-4 w-4" />
                        San Francisco, CA • Chrome on macOS
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Started 2 hours ago
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Mobile Session</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Globe className="mr-1 h-4 w-4" />
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
                <Button variant="destructive" className="w-full">
                  Revoke All Other Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
}
