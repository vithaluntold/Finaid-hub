import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamManagement } from "@/components/admin/team-management"
import { TeamPerformance } from "@/components/admin/team-performance"

export default function TeamsPage() {
  return (
    <DashboardLayout userType="accountant">
      <div className="flex flex-col gap-6">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        </div> */}

        <Tabs defaultValue="teams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teams</CardTitle>
                <CardDescription>
                  Manage your firm's teams and their members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>
                  Monitor team performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamPerformance />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Assignments</CardTitle>
                <CardDescription>
                  Manage client and task assignments for teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Team assignment management interface will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

