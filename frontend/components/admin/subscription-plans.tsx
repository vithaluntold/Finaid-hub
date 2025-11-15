"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit, Plus, Trash2 } from "lucide-react";

// Sample plans data
const plans = [
  {
    id: "plan-001",
    name: "Basic",
    description: "For small businesses just getting started",
    monthlyPrice: 399,
    annualPrice: 3990,
    features: [
      "Up to 5 users",
      "10 GB storage",
      "Basic reporting",
      "2 Fin(Ai)ds",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "plan-002",
    name: "Professional",
    description: "For growing businesses with more needs",
    monthlyPrice: 799,
    annualPrice: 7990,
    features: [
      "Up to 15 users",
      "50 GB storage",
      "Advanced reporting",
      "5 Fin(Ai)ds",
      "Priority support",
      "API access",
    ],
    popular: true,
  },
  {
    id: "plan-003",
    name: "Enterprise",
    description: "For large organizations with complex requirements",
    monthlyPrice: 1299,
    annualPrice: 12990,
    features: [
      "Unlimited users",
      "500 GB storage",
      "Custom reporting",
      "Unlimited Fin(Ai)ds",
      "24/7 support",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    popular: false,
  },
];

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);

  const handleEditPlan = (plan: (typeof plans)[0]) => {
    setSelectedPlan(plan);
    setIsEditOpen(true);
  };

  const handleNewPlan = () => {
    setSelectedPlan(null);
    setIsNewPlanOpen(true);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleNewPlan}>
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.popular ? "border-primary" : ""}>
            {plan.popular && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                <Badge className="bg-primary">Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-3xl font-bold">
                  ${(plan.monthlyPrice / 100).toFixed(2)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <div>
                <span className="text-lg font-medium">
                  ${(plan.annualPrice / 100).toFixed(2)}
                </span>
                <span className="text-muted-foreground">/year</span>
                <span className="text-xs text-green-500 ml-2">
                  Save{" "}
                  {Math.round(
                    (1 - plan.annualPrice / (plan.monthlyPrice * 12)) * 100
                  )}
                  %
                </span>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditPlan(plan)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>Update license plan details</DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Plan Name</Label>
                <Input id="edit-name" defaultValue={selectedPlan.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  defaultValue={selectedPlan.description}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-monthly-price">Monthly Price ($)</Label>
                  <Input
                    id="edit-monthly-price"
                    type="number"
                    defaultValue={selectedPlan.monthlyPrice / 100}
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-annual-price">Annual Price ($)</Label>
                  <Input
                    id="edit-annual-price"
                    type="number"
                    defaultValue={selectedPlan.annualPrice / 100}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-features">Features (one per line)</Label>
                <Textarea
                  id="edit-features"
                  rows={5}
                  defaultValue={selectedPlan.features.join("\n")}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-popular"
                  defaultChecked={selectedPlan.popular}
                />
                <Label htmlFor="edit-popular">Mark as Popular</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Plan Dialog */}
      <Dialog open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>Add a new license plan</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-name">Plan Name</Label>
              <Input id="new-name" placeholder="e.g. Premium" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                placeholder="Brief description of the plan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-monthly-price">Monthly Price ($)</Label>
                <Input
                  id="new-monthly-price"
                  type="number"
                  placeholder="99.99"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-annual-price">Annual Price ($)</Label>
                <Input
                  id="new-annual-price"
                  type="number"
                  placeholder="999.99"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-features">Features (one per line)</Label>
              <Textarea
                id="new-features"
                rows={5}
                placeholder="Up to 10 users
25 GB storage
Advanced reporting"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="new-popular" />
              <Label htmlFor="new-popular">Mark as Popular</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPlanOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsNewPlanOpen(false)}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
