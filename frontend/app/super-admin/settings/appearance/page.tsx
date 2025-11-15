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

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InviteAdminDialog } from "@/components/super-admin/DialogPopups/invite-admin-dialog";
import { ContentList } from "@/components/super-admin/content-list";

export default function Account() {
  return (
    <>
      {/* Appearance Settings */}
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>
              Customize the appearance of the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme Mode</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="border rounded-md p-2 cursor-pointer hover:border-primary">
                    <div className="w-full h-24 bg-white rounded-md"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="light-mode"
                      name="theme-mode"
                      defaultChecked
                    />
                    <Label htmlFor="light-mode" className="cursor-pointer">
                      Light
                    </Label>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="border rounded-md p-2 cursor-pointer hover:border-primary">
                    <div className="w-full h-24 bg-gray-900 rounded-md"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="dark-mode" name="theme-mode" />
                    <Label htmlFor="dark-mode" className="cursor-pointer">
                      Dark
                    </Label>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="border rounded-md p-2 cursor-pointer hover:border-primary">
                    <div className="w-full h-24 bg-gradient-to-b from-white to-gray-900 rounded-md"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="system-mode" name="theme-mode" />
                    <Label htmlFor="system-mode" className="cursor-pointer">
                      System
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="grid grid-cols-6 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  <span className="text-xs">Blue</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  <span className="text-xs">Purple</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500 cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  <span className="text-xs">Green</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-500 cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  <span className="text-xs">Red</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500 cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  <span className="text-xs">Orange</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-500 cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  <span className="text-xs">Gray</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Font Size</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <input type="radio" id="font-small" name="font-size" />
                  <Label htmlFor="font-small" className="cursor-pointer">
                    Small
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="font-medium"
                    name="font-size"
                    defaultChecked
                  />
                  <Label htmlFor="font-medium" className="cursor-pointer">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="font-large" name="font-size" />
                  <Label htmlFor="font-large" className="cursor-pointer">
                    Large
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Layout Density</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="density-compact"
                    name="layout-density"
                  />
                  <Label htmlFor="density-compact" className="cursor-pointer">
                    Compact
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="density-comfortable"
                    name="layout-density"
                    defaultChecked
                  />
                  <Label
                    htmlFor="density-comfortable"
                    className="cursor-pointer"
                  >
                    Comfortable
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="density-spacious"
                    name="layout-density"
                  />
                  <Label htmlFor="density-spacious" className="cursor-pointer">
                    Spacious
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Interface Animations</Label>
                <Switch id="animations" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
