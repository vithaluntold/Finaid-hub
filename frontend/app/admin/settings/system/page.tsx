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
import {

  RefreshCw,
 
  Mail,

  FileText,

} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InviteAdminDialog } from "@/components/super-admin/DialogPopups/invite-admin-dialog";
import { ContentList } from "@/components/super-admin/content-list";

export default function System() {
  return (
    <>
      {/* System Settings */}
      <TabsContent value="system">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage global system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input id="system-name" defaultValue="Fin(Ai)d Hub" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  defaultValue="support@finaidhub.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm text-muted-foreground">
                      When enabled, the system will be inaccessible to regular
                      users
                    </div>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="session-timeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="session-timeout"
                  type="number"
                  defaultValue="30"
                  min="5"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-upload-size">
                  Maximum Upload Size (MB)
                </Label>
                <Input
                  id="max-upload-size"
                  type="number"
                  defaultValue="50"
                  min="1"
                  max="500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-role">Default User Role</Label>
                <Select defaultValue="client">
                  <SelectTrigger id="default-role">
                    <SelectValue placeholder="Select default role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure email delivery settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.example.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" defaultValue="587" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp-encryption">Encryption</Label>
                  <Select defaultValue="tls">
                    <SelectTrigger id="smtp-encryption">
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-username">SMTP Username</Label>
                <Input
                  id="smtp-username"
                  defaultValue="noreply@finaidhub.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  defaultValue="••••••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" defaultValue="noreply@finaidhub.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" defaultValue="Fin(Ai)d Hub" />
              </div>

              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
              <CardDescription>View and manage your license</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">License Type:</span>
                    <span>Enterprise</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">License Key:</span>
                    <span className="font-mono">XXXX-XXXX-XXXX-XXXX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Issued To:</span>
                    <span>Fin(Ai)d Hub Inc.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Issued Date:</span>
                    <span>January 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Expiry Date:</span>
                    <span>January 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View License Details
                </Button>
                <Button>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Renew License
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
}
