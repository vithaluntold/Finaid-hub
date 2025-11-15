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
import { Star, Download, Check } from "lucide-react";

// Sample apps data
const apps = [
  {
    id: "app-001",
    name: "Document Management",
    description: "Organize and manage all your client documents securely",
    icon: "📄",
    category: "Document Management",
    rating: 4.8,
    reviews: 124,
    price: "Free",
    installed: true,
  },
  {
    id: "app-002",
    name: "Client Portal",
    description: "Secure portal for client access to documents and reports",
    icon: "👥",
    category: "Client Management",
    rating: 4.9,
    reviews: 215,
    price: "$15/month",
    installed: false,
  },
  {
    id: "app-003",
    name: "Tax Planner",
    description: "Advanced tax planning and forecasting tools",
    icon: "📊",
    category: "Tax",
    rating: 4.7,
    reviews: 98,
    price: "$25/month",
    installed: false,
  },
  {
    id: "app-004",
    name: "Invoice Generator",
    description: "Create and send professional invoices to clients",
    icon: "📝",
    category: "Billing",
    rating: 4.6,
    reviews: 156,
    price: "$10/month",
    installed: false,
  },
  {
    id: "app-005",
    name: "Expense Tracker",
    description: "Track and categorize business expenses automatically",
    icon: "💰",
    category: "Expense Management",
    rating: 4.5,
    reviews: 87,
    price: "Free",
    installed: false,
  },
  {
    id: "app-006",
    name: "Client Onboarding",
    description: "Streamline the client onboarding process",
    icon: "🚀",
    category: "Client Management",
    rating: 4.8,
    reviews: 112,
    price: "$20/month",
    installed: false,
  },
];

export function MarketplaceApps({ searchQuery = "" }: { searchQuery?: string }) {
  const [selectedApp, setSelectedApp] = useState<(typeof apps)[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [installedApps, setInstalledApps] = useState<Set<string>>(() => {
    // Load from localStorage on initial mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('installedApps');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return new Set(parsed);
        } catch {
          return new Set(apps.filter(app => app.installed).map(app => app.id));
        }
      }
    }
    return new Set(apps.filter(app => app.installed).map(app => app.id));
  });

  // Save to localStorage whenever installedApps changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('installedApps', JSON.stringify([...installedApps]));
    }
  }, [installedApps]);

  const handleViewDetails = (app: (typeof apps)[0]) => {
    setSelectedApp(app);
    setIsDetailsOpen(true);
  };

  const handleInstall = (appId: string) => {
    setInstalledApps(prev => new Set([...prev, appId]));
    if (selectedApp?.id === appId) {
      setSelectedApp({...selectedApp, installed: true});
    }
  };

  // Filter apps based on search query
  const filteredApps = apps.filter((app) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.category.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {filteredApps.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No apps found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
          <Card key={app.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-2xl">
                  {app.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{app.name}</h3>
                    {installedApps.has(app.id) && (
                      <Badge variant="outline" className="ml-2">
                        <Check className="h-3 w-3 mr-1" />
                        Installed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {app.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span className="ml-1">{app.rating}</span>
                    </div>
                    <span className="text-muted-foreground">
                      ({app.reviews} reviews)
                    </span>
                  </div>
                  <div className="text-sm font-medium">{app.price}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(app)}
              >
                Details
              </Button>
              <Button 
                size="sm" 
                disabled={installedApps.has(app.id)}
                onClick={() => handleInstall(app.id)}
              >
                {installedApps.has(app.id) ? "Installed" : "Install"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {/* App Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>App Details</DialogTitle>
            <DialogDescription>View and install app</DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-3xl">
                    {selectedApp?.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h2 className="text-2xl font-bold">
                        {selectedApp?.name}
                      </h2>
                      {installedApps.has(selectedApp?.id || '') && (
                        <Badge variant="outline" className="ml-2">
                          <Check className="h-3 w-3 mr-1" />
                          Installed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="ml-1">{selectedApp?.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({selectedApp?.reviews} reviews)
                      </span>
                      <span>•</span>
                      <span>{selectedApp?.category}</span>
                      <span>•</span>
                      <span>{selectedApp?.price}</span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none dark:prose-invert">
                  <p>{selectedApp?.description}</p>
                  <h3>About the Developer</h3>
                  <p>
                    Developed by Fin(Ai)d Hub Partners, a trusted developer with
                    over 10 apps in the marketplace.
                  </p>
                  <h3>Requirements</h3>
                  <ul>
                    <li>Fin(Ai)d Hub Professional or Enterprise plan</li>
                    <li>Admin access to install</li>
                    <li>Compatible with all major browsers</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-4 pt-4">
                <div className="prose max-w-none dark:prose-invert">
                  <h3>Key Features</h3>
                  <ul>
                    <li>Seamless integration with Fin(Ai)d Hub</li>
                    <li>Automated workflows</li>
                    <li>Real-time notifications</li>
                    <li>Customizable templates</li>
                    <li>Advanced reporting</li>
                    <li>Role-based access control</li>
                  </ul>

                  <h3>Use Cases</h3>
                  <p>This app is perfect for accounting firms that need to:</p>
                  <ul>
                    <li>Streamline client communication</li>
                    <li>Automate repetitive tasks</li>
                    <li>Improve team collaboration</li>
                    <li>Enhance client experience</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {[
                    {
                      name: "John Smith",
                      rating: 5,
                      date: "October 15, 2023",
                      comment:
                        "This app has completely transformed how we manage our client documents. Highly recommended!",
                    },
                    {
                      name: "Jane Doe",
                      rating: 4,
                      date: "September 28, 2023",
                      comment:
                        "Great app, but could use some improvements in the user interface. Overall, it has saved us a lot of time.",
                    },
                    {
                      name: "Robert Johnson",
                      rating: 5,
                      date: "October 5, 2023",
                      comment:
                        "Excellent support team! They helped us set everything up and were very responsive to our questions.",
                    },
                  ].map((review, index) => (
                    <div key={index} className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{review.name}</div>
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {review.date}
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Footer */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={installedApps.has(selectedApp?.id || '')}
              onClick={() => selectedApp && handleInstall(selectedApp.id)}
            >
              {installedApps.has(selectedApp?.id || '') ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Installed
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Install App
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
