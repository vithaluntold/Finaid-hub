import { DashboardLayout } from "@/components/dashboard-layout";
import { EmployeeManagement } from "@/components/accounting-firm-owner/employee-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EmployeesPage() {
  return (
    <DashboardLayout userType="accounting_firm_owner">
      <div className="flex flex-col gap-6">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Accountant Management</h1>
        </div> */}
        <Card>
          {/* <CardHeader>
            <CardTitle>Accountants</CardTitle>
            <CardDescription>
              Manage your firm's Accountants and their permissions
            </CardDescription>
          </CardHeader> */}
          <CardContent>
            <EmployeeManagement />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
