import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import StudioComponent from "@/components/general/studio";

// This would typically come from a database
const getClient = (id: string) => {
  // Special case: if the ID is "onboarding", return null to trigger the notFound()
  if (id === "onboarding") {
    return null;
  }

  const clients = [
    {
      id: "CLT-001",
      name: "Acme Corporation",
      contactName: "John Smith",
      email: "john@acmecorp.com",
      phone: "+1 (555) 123-4567",
      industry: "Technology",
      status: "active",
      finAidsDeployed: 5,
      joinDate: "2023-01-15",
    },
    {
      id: "CLT-002",
      name: "Globex Inc",
      contactName: "Jane Doe",
      email: "jane@globex.com",
      phone: "+1 (555) 987-6543",
      industry: "Manufacturing",
      status: "active",
      finAidsDeployed: 3,
      joinDate: "2023-02-20",
    },
  ];

  return clients.find((client) => client.id === id);
};

export default async function ClientPage({
  params,
}: {
  params: { clientId: string };
}) {
  const resolvedParams = await params;

  const clientID = resolvedParams?.clientId;

  return (
    <DashboardLayout userType="accountant">
      <StudioComponent clientId={clientID} />
    </DashboardLayout>
  );
}
