import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportTickets } from "@/components/admin/support-tickets";
import { KnowledgeBase } from "@/components/admin/knowledge-base";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

export default function SupportPage() {
  return (
    <DashboardLayout userType="accounting_firm_owner">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          {/* <h1 className="text-3xl font-bold tracking-tight">Support</h1> */}
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search support..."
                className="pl-8"
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Support Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Open Tickets</div>
                <div className="text-3xl font-bold">12</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Pending Response</div>
                <div className="text-3xl font-bold">5</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Resolved Today</div>
                <div className="text-3xl font-bold">8</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Avg. Response Time</div>
                <div className="text-3xl font-bold">2.5h</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
            </CardFooter>
          </Card>

          <div className="md:col-span-3">
            <Tabs defaultValue="tickets" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                <TabsTrigger value="contact">Contact Support</TabsTrigger>
              </TabsList>

              <TabsContent value="tickets" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Support Tickets</CardTitle>
                    <CardDescription>
                      Manage support tickets from your clients and team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SupportTickets />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="knowledge" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Base</CardTitle>
                    <CardDescription>
                      Access helpful articles and documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <KnowledgeBase />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>
                      Get in touch with Fin(Ai)d Hub support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md border p-4">
                        <h3 className="text-lg font-medium">Email Support</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          For general inquiries and non-urgent issues
                        </p>
                        <p className="text-sm font-medium mt-2">
                          support@finaidhub.com
                        </p>
                      </div>

                      <div className="rounded-md border p-4">
                        <h3 className="text-lg font-medium">Phone Support</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          For urgent issues requiring immediate assistance
                        </p>
                        <p className="text-sm font-medium mt-2">
                          +1 (555) 123-4567
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Available Monday-Friday, 9am-5pm EST
                        </p>
                      </div>

                      <div className="rounded-md border p-4">
                        <h3 className="text-lg font-medium">Live Chat</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Chat with a support representative in real-time
                        </p>
                        <Button className="mt-2">Start Live Chat</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
