import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientOnboardingWizard } from "@/components/admin/client-onboarding-wizard"

export default function AddClientPage() {
  return (
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Client Onboarding</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Client Onboarding</CardTitle>
            <CardDescription>
              Follow the steps below to onboard a new client to the Fin(Ai)d Hub platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientOnboardingWizard />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

