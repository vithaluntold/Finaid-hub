"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample integrations data
const integrations = [
  {
    id: "int-001",
    name: "QuickBooks",
    description: "Connect your QuickBooks account for seamless data sync",
    icon: "💼",
    category: "Accounting",
    connected: true,
  },
  {
    id: "int-002",
    name: "Xero",
    description: "Integrate with Xero accounting software",
    icon: "📊",
    category: "Accounting",
    connected: false,
  },
  {
    id: "int-003",
    name: "Stripe",
    description: "Process payments and manage licenses",
    icon: "💳",
    category: "Payments",
    connected: false,
  },
  {
    id: "int-004",
    name: "Google Drive",
    description: "Store and access documents in Google Drive",
    icon: "📁",
    category: "Storage",
    connected: true,
  },
  {
    id: "int-005",
    name: "Dropbox",
    description: "Sync files with your Dropbox account",
    icon: "📦",
    category: "Storage",
    connected: false,
  },
  {
    id: "int-006",
    name: "Slack",
    description: "Get notifications and updates in Slack",
    icon: "💬",
    category: "Communication",
    connected: false,
  },
];

export function MarketplaceIntegrations({ searchQuery = "" }: { searchQuery?: string }) {
  const { showToast } = useToast();
  const [selectedIntegration, setSelectedIntegration] = useState<
    (typeof integrations)[0] | null
  >(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(() => {
    // Load from localStorage on initial mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectedIntegrations');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return new Set(parsed);
        } catch {
          return new Set(integrations.filter(int => int.connected).map(int => int.id));
        }
      }
    }
    return new Set(integrations.filter(int => int.connected).map(int => int.id));
  });

  // Save to localStorage whenever connectedIntegrations changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('connectedIntegrations', JSON.stringify([...connectedIntegrations]));
    }
  }, [connectedIntegrations]);

  const handleViewDetails = (integration: (typeof integrations)[0]) => {
    setSelectedIntegration(integration);
    setIsDetailsOpen(true);
  };

  const handleConnect = (integrationId: string, integrationName: string) => {
    setConnectedIntegrations(prev => new Set([...prev, integrationId]));
    if (selectedIntegration?.id === integrationId) {
      setSelectedIntegration({...selectedIntegration, connected: true});
    }
    showToast({
      title: "Connected",
      description: `${integrationName} has been connected successfully`,
    });
  };

  // Filter integrations based on search query
  const filteredIntegrations = integrations.filter((integration) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      integration.name.toLowerCase().includes(query) ||
      integration.description.toLowerCase().includes(query) ||
      integration.category.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {filteredIntegrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No integrations found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{integration.name}</h3>
                    {connectedIntegrations.has(integration.id) && (
                      <Badge variant="outline" className="ml-2">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {integration.description}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {integration.category}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(integration)}
              >
                Details
              </Button>
              <Button 
                size="sm" 
                disabled={connectedIntegrations.has(integration.id)}
                onClick={() => handleConnect(integration.id, integration.name)}
              >
                {connectedIntegrations.has(integration.id) ? "Connected" : "Connect"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {/* Integration Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Integration Details</DialogTitle>
            <DialogDescription>View and connect integration</DialogDescription>
          </DialogHeader>

          {selectedIntegration && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="setup">Setup Guide</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-3xl">
                    {selectedIntegration.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h2 className="text-2xl font-bold">
                        {selectedIntegration.name}
                      </h2>
                      {selectedIntegration.connected && (
                        <Badge variant="outline" className="ml-2">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{selectedIntegration.category}</span>
                      <span>•</span>
                      <a href="#" className="text-primary flex items-center">
                        Visit website <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none dark:prose-invert">
                  <p>{selectedIntegration.description}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam euismod, nisl eget aliquam ultricies, nunc nisl
                    aliquet nunc, quis aliquam nisl nunc quis nisl.
                  </p>
                  <h3>Benefits</h3>
                  <ul>
                    <li>Seamless data synchronization</li>
                    <li>Reduced manual data entry</li>
                    <li>Real-time updates</li>
                    <li>Improved accuracy</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 pt-4">
                <div className="prose max-w-none dark:prose-invert">
                  <h3>Key Features</h3>
                  <ul>
                    <li>Bi-directional data sync</li>
                    <li>Automated reconciliation</li>
                    <li>Custom field mapping</li>
                    <li>Error handling and notifications</li>
                    <li>Detailed audit logs</li>
                  </ul>

                  <h3>Data Synced</h3>
                  <ul>
                    <li>Client information</li>
                    <li>Transactions</li>
                    <li>Invoices and bills</li>
                    <li>Chart of accounts</li>
                    <li>Financial reports</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="setup" className="space-y-4 pt-4">
                <div className="prose max-w-none dark:prose-invert">
                  <h3>Setup Instructions</h3>
                  <ol>
                    <li>Click the "Connect" button below</li>
                    <li>Sign in to your {selectedIntegration.name} account</li>
                    <li>Authorize Fin(Ai)d Hub to access your data</li>
                    <li>Configure sync settings</li>
                    <li>Start using the integration</li>
                  </ol>

                  <h3>Requirements</h3>
                  <ul>
                    <li>Active {selectedIntegration.name} account</li>
                    <li>Admin access to both platforms</li>
                    <li>Internet connection</li>
                  </ul>

                  <h3>Support</h3>
                  <p>
                    If you need help setting up this integration, please contact
                    our support team at support@finaidhub.com.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={connectedIntegrations.has(selectedIntegration?.id || '')}
              onClick={() => selectedIntegration && handleConnect(selectedIntegration.id, selectedIntegration.name)}
            >
              {connectedIntegrations.has(selectedIntegration?.id || '') ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Connected
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
