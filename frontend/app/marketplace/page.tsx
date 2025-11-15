"use client";

import { useState } from "react";
// import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  // CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceApps } from "@/components/admin/marketplace-apps";
import { MarketplaceIntegrations } from "@/components/admin/marketplace-integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
// import { CreateFinaidProfile } from "@/components/admin/DialogPopups/create-finaid-profile";
// import { backendBaseURL } from "@/assets/constants/constant";
// import axios from "axios";
// import { FinaidProfilesList } from "@/components/admin/finaid-profiles-list";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FinaidProfilesPreLogin } from "@/components/pre-login/finaid-profiles";
import { useRouter } from "next/navigation";

export default function MarketplacePage() {
  const router = useRouter();
  const [localLoading, setLocalLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            {/* <SidebarTrigger /> */}
            <div
              className="flex items-center gap-2 px-2"
              onClick={() => router.push("/")}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  FH
                </span>
              </div>
              <div className="font-semibold">
                Fin<span className="text-primary">(Ai)</span>d Hub
              </div>
            </div>
            <div className="flex-1" />
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search marketplace..."
                className="pl-8"
                onChange={(event) => setSearchQuery(event?.target?.value)}
              />
            </div>
            <ModeToggle />
          </header>
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <Tabs defaultValue="finaidprofiles" className="space-y-4">
                <div className="flex justify-between items-center gap-2">
                  <TabsList>
                    <TabsTrigger value="finaidprofiles">
                      Finaid Profiles
                    </TabsTrigger>
                  </TabsList>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>

                <TabsContent value="finaidprofiles" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Finaid Profiles</CardTitle>
                      <CardDescription>
                        Browse all Finaid Profiles under your Fin(Ai)d Hub
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FinaidProfilesPreLogin
                        filters={""}
                        searchQuery={searchQuery}
                        localLoading={localLoading}
                        setLocalLoading={setLocalLoading}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
