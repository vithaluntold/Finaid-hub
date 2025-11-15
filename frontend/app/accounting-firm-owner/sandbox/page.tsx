"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Save,
  Download,
  Upload,
  RefreshCw,
  Code,
  FileText,
  Settings,
  Database,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function SandboxPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedFinaid, setSelectedFinaid] = useState("saim");

  const handleRunFinaid = () => {
    setIsRunning(true);
    // Simulate processing
    setTimeout(() => {
      setIsRunning(false);
    }, 2000);
  };

  return (
    <DashboardLayout userType="accounting_firm_owner">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          {/* <h1 className="text-3xl font-bold tracking-tight">Fin(Ai)d Sandbox</h1> */}
          <Button onClick={handleRunFinaid} disabled={isRunning}>
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Fin(Ai)d
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="code" className="space-y-4">
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Fin(Ai)d Code Editor</CardTitle>
                      <CardDescription>
                        Customize your Fin(Ai)d behavior
                      </CardDescription>
                    </div>
                    <Select
                      value={selectedFinaid}
                      onValueChange={setSelectedFinaid}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Fin(Ai)d" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saim">S(Ai)m</SelectItem>
                        <SelectItem value="quaincy">Qu(Ai)ncy</SelectItem>
                        <SelectItem value="zaick">Z(Ai)ck</SelectItem>
                        <SelectItem value="aidam">(Ai)dam</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border bg-muted/50 p-4 font-mono text-sm">
                      <pre className="text-xs md:text-sm">
                        {`// ${
                          selectedFinaid.charAt(0).toUpperCase() +
                          selectedFinaid.slice(1)
                        } Fin(Ai)d Configuration
import { FinaidAgent } from '@finaid/core';
import { AccountingRules } from '@finaid/accounting';

// Initialize the Fin(Ai)d agent
const ${selectedFinaid} = new FinaidAgent({
  name: "${selectedFinaid.charAt(0).toUpperCase() + selectedFinaid.slice(1)}",
  capabilities: [
    "bookkeeping",
    "reconciliation",
    "reporting"
  ],
  learningRate: 0.85,
  confidenceThreshold: 0.92
});

// Configure accounting rules
${selectedFinaid}.setRules(
  AccountingRules.standard(),
  AccountingRules.custom({
    // Custom rules can be defined here
    allowAutoCorrection: true,
    requireApproval: false
  })
);

// Define behavior for unknown transactions
${selectedFinaid}.onUnknownTransaction(async (transaction) => {
  // Analyze transaction details
  const category = await ${selectedFinaid}.classifyTransaction(transaction);
  
  // Suggest categorization
  return {
    suggestedCategory: category,
    confidence: ${selectedFinaid}.getConfidence(),
    requiresReview: ${selectedFinaid}.getConfidence() < 0.92
  };
});

export default ${selectedFinaid};`}
                      </pre>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <Code className="mr-2 h-4 w-4" />
                      Format Code
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </Button>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Data</CardTitle>
                    <CardDescription>
                      Manage test data for your Fin(Ai)d
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <span>sample_transactions.csv</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Replace
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <span>chart_of_accounts.json</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Replace
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <span>vendor_list.json</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Replace
                          </Button>
                        </div>
                      </div>
                      <Button className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Test Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="docs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Fin(Ai)d Documentation</CardTitle>
                    <CardDescription>
                      Learn how to customize and deploy your Fin(Ai)d
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md border p-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Getting Started
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Learn the basics of Fin(Ai)d configuration and
                          deployment.
                        </p>
                        <Button variant="link" className="px-0 mt-2">
                          Read Documentation
                        </Button>
                      </div>
                      <div className="rounded-md border p-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Code className="h-5 w-5 text-primary" />
                          API Reference
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Complete API reference for Fin(Ai)d development.
                        </p>
                        <Button variant="link" className="px-0 mt-2">
                          View API Docs
                        </Button>
                      </div>
                      <div className="rounded-md border p-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Examples
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Sample code and configurations for common use cases.
                        </p>
                        <Button variant="link" className="px-0 mt-2">
                          Browse Examples
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Execution Logs</CardTitle>
                    <CardDescription>
                      View logs from your Fin(Ai)d test runs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border bg-muted/50 p-4 font-mono text-xs h-[400px] overflow-y-auto">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:15]
                            </span>{" "}
                            Initializing S(Ai)m agent...
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:16]
                            </span>{" "}
                            Agent initialized successfully
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:17]
                            </span>{" "}
                            Loading test data from sample_transactions.csv...
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:18]
                            </span>{" "}
                            Loaded 256 transactions
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:19]
                            </span>{" "}
                            Processing transactions...
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:25]
                            </span>{" "}
                            Warning: 3 transactions require manual review
                            (confidence below threshold)
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:30]
                            </span>{" "}
                            Successfully processed 253/256 transactions
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:31]
                            </span>{" "}
                            Generating reports...
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:35]
                            </span>{" "}
                            Reports generated successfully
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              [2023-11-10 14:32:36]
                            </span>{" "}
                            Execution completed in 21s
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Fin(Ai)d Configuration</CardTitle>
                <CardDescription>
                  Configure your Fin(Ai)d settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="finaid-name">Fin(Ai)d Name</Label>
                    <Input
                      id="finaid-name"
                      value={
                        selectedFinaid.charAt(0).toUpperCase() +
                        selectedFinaid.slice(1)
                      }
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capabilities">Capabilities</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="capabilities">
                        <SelectValue placeholder="Select capabilities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Capabilities</SelectItem>
                        <SelectItem value="bookkeeping">
                          Bookkeeping Only
                        </SelectItem>
                        <SelectItem value="tax">Tax Only</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learning-rate">Learning Rate</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="learning-rate"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        defaultValue="0.85"
                        className="w-full"
                      />
                      <span className="text-sm font-medium">0.85</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confidence-threshold">
                      Confidence Threshold
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="confidence-threshold"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        defaultValue="0.92"
                        className="w-full"
                      />
                      <span className="text-sm font-medium">0.92</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-rules">Custom Rules</Label>
                    <Textarea
                      id="custom-rules"
                      placeholder="Enter custom rules in JSON format..."
                      className="font-mono text-sm"
                      rows={5}
                      defaultValue={`{
  "allowAutoCorrection": true,
  "requireApproval": false,
  "maxTransactionAmount": 10000
}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deployment-target">Deployment Target</Label>
                    <Select defaultValue="sandbox">
                      <SelectTrigger id="deployment-target">
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Apply Configuration
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
