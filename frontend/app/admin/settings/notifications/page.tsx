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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InviteAdminDialog } from "@/components/super-admin/DialogPopups/invite-admin-dialog";
import { ContentList } from "@/components/super-admin/content-list";

export default function Notifications() {
  return (
    <>
      {/* Notifications Settings */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b">
                <div className="font-medium">Notification Type</div>
                <div className="font-medium text-center">Email</div>
                <div className="font-medium text-center">In-App</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
                <div>
                  <div className="font-medium">New Accounting Firm</div>
                  <div className="text-sm text-muted-foreground">
                    When a new accounting firms joins
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
                  <div className="font-medium">License Renewal</div>
                  <div className="text-sm text-muted-foreground">
                    When a license is renewed
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
                  <div className="font-medium">License Cancellation</div>
                  <div className="text-sm text-muted-foreground">
                    When a license is cancelled
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
                <div>
                  <div className="font-medium">Security Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Important security notifications
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
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
