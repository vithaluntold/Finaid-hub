"use client";

export const dynamic = 'force-dynamic';

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
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InviteAdminDialog } from "@/components/super-admin/DialogPopups/invite-admin-dialog";
import { ContentList } from "@/components/super-admin/content-list";
import { InviteAdminList } from "@/components/admin/invite-admin-list";

export default function Admins() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      {/* Admins Settings */}
      <TabsContent value="admins">
        <div className="grid gap-6 justify-end">
          <Button
            className="mt-2"
            onClick={() => setIsCreateDialogOpen((prev) => !prev)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Invite New Admin
          </Button>
        </div>
        <TabsContent value="admins" className="space-y-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle>All Admin Members List</CardTitle>
              <CardDescription>
                Manage all admin's across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteAdminList />
            </CardContent>
          </Card>
        </TabsContent>
      </TabsContent>
      <InviteAdminDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}
