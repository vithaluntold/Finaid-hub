"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function ClientOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      position: "",
      phone: "",
    },
    company: {
      name: "",
      address: "",
      natureOfBusiness: "",
      inviteSent: false,
    },
    accountingMethod: "",
    accountingPackage: "",
    selectedFinaids: [],
    advancedSetup: {
      bankSync: false,
      automaticReports: false,
      dataBackup: false,
    },
  });

  const steps = [
    { id: "contact", label: "Contact" },
    { id: "company", label: "Company" },
    { id: "method", label: "Method" },
    { id: "package", label: "Package" },
    { id: "finaids", label: "Fin(Ai)ds" },
    { id: "advanced", label: "Advanced" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      router.push("/accountant/clients");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSimpleChange = (section, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleFinaidToggle = (finaidName) => {
    setFormData((prev) => {
      const currentFinaids = prev.selectedFinaids || [];
      if (currentFinaids.includes(finaidName)) {
        return {
          ...prev,
          selectedFinaids: currentFinaids.filter((name) => name !== finaidName),
        };
      } else {
        return {
          ...prev,
          selectedFinaids: [...currentFinaids, finaidName],
        };
      }
    });
  };

  const sendInvite = () => {
    setFormData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        inviteSent: true,
      },
    }));
  };

  const accountingPackages = [
    "QuickBooks",
    "Zoho Books",
    "Xero",
    "FreshBooks",
    "SAP",
    "NetSuite",
    "Oracle",
    "Sage Accounting",
  ];

  const finaids = [
    {
      name: "Bookkeeper Fin(Ai)d",
      description: "Automates transaction categorization",
    },
    { name: "Invoicer Fin(Ai)d", description: "Creates and manages invoices" },
    { name: "Reporter Fin(Ai)d", description: "Generates financial reports" },
    { name: "Tax Fin(Ai)d", description: "Manages tax calculations" },
    { name: "Payroll Fin(Ai)d", description: "Handles payroll processing" },
    { name: "Inventory Fin(Ai)d", description: "Manages inventory tracking" },
  ];

  return (
    <DashboardLayout userType="accountant">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Client Onboarding
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Client Onboarding</CardTitle>
            <CardDescription>
              Follow the steps below to onboard a new client to the Fin(Ai)d Hub
              platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Progress indicator */}
              <div className="relative mb-12">
                {/* Progress bar */}
                <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"></div>

                {/* Step circles */}
                <ol className="relative z-10 flex justify-between">
                  {steps.map((step, index) => (
                    <li key={index} className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold
                          ${
                            index === currentStep
                              ? "border-primary bg-primary text-primary-foreground"
                              : index < currentStep
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted bg-background"
                          }`}
                      >
                        {index + 1}
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Step labels - positioned below with enough spacing */}
                <div className="relative mt-2 flex justify-between">
                  {steps.map((step, index) => (
                    <div key={index} className="w-8 text-center">
                      <span
                        className="absolute text-xs font-medium whitespace-nowrap"
                        style={{
                          transform: "translateX(-50%)",
                          left: `calc(${(index / (steps.length - 1)) * 100}%)`,
                          top: "10px",
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step content */}
              <Card>
                <CardContent className="pt-6">
                  {/* Contact Information */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold">Contact Information</h2>
                      <p className="text-muted-foreground">
                        Enter the primary contact details for this client
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.contact.firstName}
                            onChange={(e) =>
                              handleInputChange(
                                "contact",
                                "firstName",
                                e.target.value
                              )
                            }
                            placeholder="John"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.contact.lastName}
                            onChange={(e) =>
                              handleInputChange(
                                "contact",
                                "lastName",
                                e.target.value
                              )
                            }
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.contact.email}
                          onChange={(e) =>
                            handleInputChange(
                              "contact",
                              "email",
                              e.target.value
                            )
                          }
                          placeholder="john.doe@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={formData.contact.position}
                          onChange={(e) =>
                            handleInputChange(
                              "contact",
                              "position",
                              e.target.value
                            )
                          }
                          placeholder="CFO"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.contact.phone}
                          onChange={(e) =>
                            handleInputChange(
                              "contact",
                              "phone",
                              e.target.value
                            )
                          }
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  )}

                  {/* Company Details */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold">Company Details</h2>
                      <p className="text-muted-foreground">
                        Enter the company information and send an invitation
                      </p>

                      {formData.company.inviteSent && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                          Invitation sent successfully! The company will be
                          marked as inactive until they accept.
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={formData.company.name}
                          onChange={(e) =>
                            handleInputChange("company", "name", e.target.value)
                          }
                          placeholder="Acme Corporation"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyAddress">Company Address</Label>
                        <Textarea
                          id="companyAddress"
                          value={formData.company.address}
                          onChange={(e) =>
                            handleInputChange(
                              "company",
                              "address",
                              e.target.value
                            )
                          }
                          placeholder="123 Business St, Suite 100, City, State, ZIP"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="natureOfBusiness">
                          Nature of Business
                        </Label>
                        <Input
                          id="natureOfBusiness"
                          value={formData.company.natureOfBusiness}
                          onChange={(e) =>
                            handleInputChange(
                              "company",
                              "natureOfBusiness",
                              e.target.value
                            )
                          }
                          placeholder="Technology, Manufacturing, Retail, etc."
                        />
                      </div>

                      {!formData.company.inviteSent && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={sendInvite}
                        >
                          Send Invite
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Accounting Method */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold">Accounting Method</h2>
                      <p className="text-muted-foreground">
                        Select the accounting method used by this client
                      </p>

                      <RadioGroup
                        value={formData.accountingMethod}
                        onValueChange={(value) =>
                          handleSimpleChange("accountingMethod", value)
                        }
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash">Cash Basis</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="accrual" id="accrual" />
                          <Label htmlFor="accrual">Accrual Basis</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hybrid" id="hybrid" />
                          <Label htmlFor="hybrid">Hybrid Method</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Accounting Package */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold">Accounting Package</h2>
                      <p className="text-muted-foreground">
                        Select the accounting package used by this client
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {accountingPackages.map((pkg) => (
                          <div
                            key={pkg}
                            className={`border rounded-md p-4 cursor-pointer ${
                              formData.accountingPackage === pkg
                                ? "border-primary bg-primary/10"
                                : "border-gray-200"
                            }`}
                            onClick={() =>
                              handleSimpleChange("accountingPackage", pkg)
                            }
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                                {pkg.charAt(0)}
                              </div>
                              <div className="font-medium">{pkg}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fin(Ai)d Selection */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold">Fin(Ai)d Selection</h2>
                      <p className="text-muted-foreground">
                        Select the Fin(Ai)ds to deploy for this client with{" "}
                        {formData.accountingPackage ||
                          "the selected accounting package"}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {finaids.map((finaid) => (
                          <div
                            key={finaid.name}
                            className={`border rounded-md p-4 ${
                              formData.selectedFinaids.includes(finaid.name)
                                ? "border-primary"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{finaid.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {finaid.description}
                                </div>
                              </div>
                              <Checkbox
                                checked={formData.selectedFinaids.includes(
                                  finaid.name
                                )}
                                onCheckedChange={() =>
                                  handleFinaidToggle(finaid.name)
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advanced Setup */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold">Advanced Setup</h2>
                      <p className="text-muted-foreground">
                        Configure advanced features for this client
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between border p-4 rounded-md">
                          <div>
                            <div className="font-medium">Bank Sync</div>
                            <div className="text-sm text-muted-foreground">
                              Automatically sync transactions from bank accounts
                            </div>
                          </div>
                          <Checkbox
                            checked={formData.advancedSetup.bankSync}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                "advancedSetup",
                                "bankSync",
                                checked
                              )
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between border p-4 rounded-md">
                          <div>
                            <div className="font-medium">Automatic Reports</div>
                            <div className="text-sm text-muted-foreground">
                              Generate and send reports automatically
                            </div>
                          </div>
                          <Checkbox
                            checked={formData.advancedSetup.automaticReports}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                "advancedSetup",
                                "automaticReports",
                                checked
                              )
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between border p-4 rounded-md">
                          <div>
                            <div className="font-medium">Data Backup</div>
                            <div className="text-sm text-muted-foreground">
                              Automatically backup client data
                            </div>
                          </div>
                          <Checkbox
                            checked={formData.advancedSetup.dataBackup}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                "advancedSetup",
                                "dataBackup",
                                checked
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-8">
                    {currentStep > 0 ? (
                      <Button variant="outline" onClick={handleBack}>
                        Back
                      </Button>
                    ) : (
                      <div></div>
                    )}

                    <Button onClick={handleNext}>
                      {currentStep < steps.length - 1 ? "Next" : "Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
