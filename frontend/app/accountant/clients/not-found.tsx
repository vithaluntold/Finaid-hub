import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ClientNotFound() {
  return (
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <Link href="/admin/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-bold">Client Not Found</h2>
              <p className="text-muted-foreground mt-2">The requested client could not be found.</p>
              <Link href="/admin/clients" className="mt-6">
                <Button>View All Clients</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

