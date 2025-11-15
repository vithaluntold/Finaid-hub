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

  Globe,
 
  Key,
 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InviteAdminDialog } from "@/components/super-admin/DialogPopups/invite-admin-dialog";
import { ContentList } from "@/components/super-admin/content-list";

export default function API() {
  return (
    <>
      {/* API Settings */}
      <TabsContent value="api">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">Production API Key</div>
                    <div className="text-sm text-muted-foreground">
                      Created on Oct 15, 2023
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value="••••••••••••••••••••••••••••••"
                      readOnly
                      className="font-mono text-sm w-full md:w-64"
                    />
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                  <Button variant="destructive" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">Development API Key</div>
                    <div className="text-sm text-muted-foreground">
                      Created on Nov 5, 2023
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value="••••••••••••••••••••••••••••••"
                      readOnly
                      className="font-mono text-sm w-full md:w-64"
                    />
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                  <Button variant="destructive" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>

              <Button>
                <Key className="mr-2 h-4 w-4" />
                Generate New API Key
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>
                Configure webhooks for real-time event notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">License Events</div>
                    <div className="text-sm text-muted-foreground">
                      https://example.com/webhooks/licenses
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Active</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">User Events</div>
                    <div className="text-sm text-muted-foreground">
                      https://example.com/webhooks/users
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Active</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <Button>
                <Globe className="mr-2 h-4 w-4" />
                Add Webhook
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OAuth Applications</CardTitle>
              <CardDescription>
                Manage OAuth applications for third-party integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">QuickBooks Integration</div>
                    <div className="text-sm text-muted-foreground">
                      Connected on Sep 10, 2023
                    </div>
                  </div>
                  <Badge>Connected</Badge>
                  <Button variant="destructive" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">Xero Integration</div>
                    <div className="text-sm text-muted-foreground">
                      Connected on Oct 22, 2023
                    </div>
                  </div>
                  <Badge>Connected</Badge>
                  <Button variant="destructive" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>

              <Button>
                <Globe className="mr-2 h-4 w-4" />
                Add OAuth Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
}
