"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample apps data (should match marketplace-apps.tsx)
const apps = [
  {
    id: "app-001",
    name: "Document Management",
    description: "Organize and manage all your client documents securely",
    icon: "📄",
    category: "Document Management",
    connectedDate: "Oct 28, 2023",
  },
  {
    id: "app-002",
    name: "Client Portal",
    description: "Secure portal for client access to documents and reports",
    icon: "👥",
    category: "Client Management",
    connectedDate: "Nov 2, 2023",
  },
  {
    id: "app-003",
    name: "Tax Planner",
    description: "Advanced tax planning and forecasting tools",
    icon: "📊",
    category: "Tax",
    connectedDate: "Oct 15, 2023",
  },
  {
    id: "app-004",
    name: "Invoice Generator",
    description: "Create and send professional invoices to clients",
    icon: "📝",
    category: "Billing",
    connectedDate: "Nov 5, 2023",
  },
  {
    id: "app-005",
    name: "Expense Tracker",
    description: "Track and categorize business expenses automatically",
    icon: "💰",
    category: "Expense Management",
    connectedDate: "Oct 20, 2023",
  },
  {
    id: "app-006",
    name: "Client Onboarding",
    description: "Streamline the client onboarding process",
    icon: "🚀",
    category: "Client Management",
    connectedDate: "Nov 1, 2023",
  },
];

export function InstalledItems({ searchQuery = "" }: { searchQuery?: string }) {
  const { showToast } = useToast();
  const [installedApps, setInstalledApps] = useState<Set<string>>(new Set());

  // Load installed apps from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('installedApps');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setInstalledApps(new Set(parsed));
        } catch {
          setInstalledApps(new Set());
        }
      }
    }
  }, []);

  const handleConfigure = (appId: string, appName: string) => {
    showToast({
      title: "Configure",
      description: `Opening configuration for ${appName}...`,
    });
    // Add your configuration logic here
    console.log(`Configure app: ${appId}`);
  };

  const handleUninstall = (appId: string, appName: string) => {
    const newInstalled = new Set(installedApps);
    newInstalled.delete(appId);
    setInstalledApps(newInstalled);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('installedApps', JSON.stringify([...newInstalled]));
    }

    showToast({
      title: "Uninstalled",
      description: `${appName} has been uninstalled successfully`,
    });
  };

  const installedAppsList = apps.filter(app => installedApps.has(app.id));

  // Filter installed apps based on search query
  const filteredInstalledApps = installedAppsList.filter((app) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.category.toLowerCase().includes(query)
    );
  });

  if (installedAppsList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-2">No apps installed yet</div>
        <p className="text-sm text-muted-foreground">
          Go to the Apps or Integrations tab to install apps
        </p>
      </div>
    );
  }

  if (filteredInstalledApps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-2">No matching apps found</div>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search terms
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredInstalledApps.map((app) => (
        <div key={app.id} className="rounded-md border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-2xl">
                {app.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{app.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {app.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {app.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Installed on {app.connectedDate}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConfigure(app.id, app.name)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUninstall(app.id, app.name)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Uninstall
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
