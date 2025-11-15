"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Save,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import "react-loading-skeleton/dist/skeleton.css";

export default function SettingsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout userType="admin">
      <ScrollToTop />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          {/* <h1 className="text-3xl font-bold tracking-tight">Settings</h1> */}
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-7 lg:w-auto">
            <TabsTrigger
              value="account"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/settings/account")}
            >
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/settings/security")}
            >
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/settings/notifications")}
            >
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/settings/api")}
            >
              <Key className="h-4 w-4" />
              <span className="hidden md:inline">API</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/settings/appearance")}
            >
              <Palette className="h-4 w-4" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/settings/system")}
            >
              <Sliders className="h-4 w-4" />
              <span className="hidden md:inline">System</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/settings/data")}
            >
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Data</span>
            </TabsTrigger>
            {/* <TabsTrigger
              value="admins"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/settings/admins")}
            >
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Admins</span>
            </TabsTrigger> */}
          </TabsList>
          {children}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
