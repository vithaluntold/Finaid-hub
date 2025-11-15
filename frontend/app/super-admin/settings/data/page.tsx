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

  Database,

  AlertTriangle,
  Clock,
  
  Download,
 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InviteAdminDialog } from "@/components/super-admin/DialogPopups/invite-admin-dialog";
import { ContentList } from "@/components/super-admin/content-list";

export default function Data() {
  return (
    <>
      {/* Data Management Settings */}
      <TabsContent value="data">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>
                Manage system backups and restoration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the system will automatically create backups
                  according to the schedule
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-retention">
                  Backup Retention (days)
                </Label>
                <Input
                  id="backup-retention"
                  type="number"
                  defaultValue="30"
                  min="1"
                  max="365"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-storage">Backup Storage Location</Label>
                <Select defaultValue="cloud">
                  <SelectTrigger id="backup-storage">
                    <SelectValue placeholder="Select storage location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="both">Both Local and Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  View Backup History
                </Button>
                <Button>
                  <Database className="mr-2 h-4 w-4" />
                  Create Manual Backup
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Export system data for analysis or migration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Data to Export</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-users" />
                    <Label htmlFor="export-users">Users & Permissions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-accounting-firms" />
                    <Label htmlFor="export-accounting-firms">Accounting Firms</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-content" />
                    <Label htmlFor="export-content">Educational Content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-analytics" />
                    <Label htmlFor="export-analytics">Analytics Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-settings" />
                    <Label htmlFor="export-settings">System Settings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-logs" />
                    <Label htmlFor="export-logs">System Logs</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="export-format">Export Format</Label>
                <Select defaultValue="json">
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-destructive/5">
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-destructive/20 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">Clear System Cache</div>
                    <div className="text-sm text-muted-foreground">
                      This will clear all cached data and might temporarily slow
                      down the system
                    </div>
                  </div>
                  <Button variant="outline">Clear Cache</Button>
                </div>
              </div>

              <div className="rounded-md border border-destructive/20 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">Reset Analytics Data</div>
                    <div className="text-sm text-muted-foreground">
                      This will delete all analytics data. This action cannot be
                      undone.
                    </div>
                  </div>
                  <Button variant="outline">Reset Analytics</Button>
                </div>
              </div>

              <div className="rounded-md border border-destructive/20 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                      Reset System
                    </div>
                    <div className="text-sm text-muted-foreground">
                      This will reset the entire system to its default state.
                      All data will be permanently deleted.
                    </div>
                  </div>
                  <Button variant="destructive">Reset System</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
}
