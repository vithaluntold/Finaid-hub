"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, BarChart, Zap, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react"

interface ClientFinaidsProps {
  client: any
}

export function ClientFinaids({ client }: ClientFinaidsProps) {
  const [finaids, setFinaids] = useState(
    [
      {
        id: "finaid-1",
        name: "S(Ai)m",
        description: "Bookkeeping Assistant",
        status: "active",
        speed: 75,
        llm: "gpt-4o",
        lastExecution: "10 minutes ago",
        tasksCompleted: 1245,
        accuracy: 98.7,
      },
      {
        id: "finaid-2",
        name: "Qu(Ai)ncy",
        description: "Tax Preparation Assistant",
        status: "active",
        speed: 60,
        llm: "gpt-4o",
        lastExecution: "2 hours ago",
        tasksCompleted: 876,
        accuracy: 99.2,
      },
      {
        id: "finaid-3",
        name: "Z(Ai)ck",
        description: "Financial Reporting Assistant",
        status: "inactive",
        speed: 80,
        llm: "claude-3-opus",
        lastExecution: "2 days ago",
        tasksCompleted: 542,
        accuracy: 97.5,
      },
      {
        id: "finaid-4",
        name: "(Ai)dam",
        description: "Client Communication Assistant",
        status: "active",
        speed: 90,
        llm: "claude-3-sonnet",
        lastExecution: "35 minutes ago",
        tasksCompleted: 932,
        accuracy: 96.8,
      },
      {
        id: "finaid-5",
        name: "P(Ai)ge",
        description: "Payroll Assistant",
        status: "active",
        speed: 70,
        llm: "gpt-4o",
        lastExecution: "1 day ago",
        tasksCompleted: 324,
        accuracy: 99.5,
      },
    ].slice(0, client.finAidsDeployed),
  )

  const handleStatusChange = (id: string, checked: boolean) => {
    setFinaids(
      finaids.map((finaid) => (finaid.id === id ? { ...finaid, status: checked ? "active" : "inactive" } : finaid)),
    )
  }

  const handleSpeedChange = (id: string, value: number[]) => {
    setFinaids(finaids.map((finaid) => (finaid.id === id ? { ...finaid, speed: value[0] } : finaid)))
  }

  const handleLLMChange = (id: string, value: string) => {
    setFinaids(finaids.map((finaid) => (finaid.id === id ? { ...finaid, llm: value } : finaid)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Deployed Fin(Ai)ds</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Deploy New Fin(Ai)d
        </Button>
      </div>

      {finaids.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {finaids.map((finaid) => (
            <Card key={finaid.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <span className="font-medium text-primary">{finaid.name.charAt(0)}</span>
                    </div>
                    <div>
                      <CardTitle>{finaid.name}</CardTitle>
                      <CardDescription>{finaid.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={finaid.status === "active" ? "default" : "secondary"}
                      className={`flex items-center gap-1 ${
                        finaid.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100/80"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
                      }`}
                    >
                      {finaid.status === "active" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      <span className="capitalize">{finaid.status}</span>
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={finaid.status === "active"}
                        onCheckedChange={(checked) => handleStatusChange(finaid.id, checked)}
                        id={`status-${finaid.id}`}
                      />
                      <Label htmlFor={`status-${finaid.id}`}>
                        {finaid.status === "active" ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="performance" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="performance" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Tasks Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{finaid.tasksCompleted}</div>
                          <p className="text-xs text-muted-foreground">Since deployment</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Accuracy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{finaid.accuracy}%</div>
                          <p className="text-xs text-muted-foreground">Based on reviews</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Last Execution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{finaid.lastExecution}</div>
                          <p className="text-xs text-muted-foreground">Running normally</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Button variant="outline" className="w-full">
                      <BarChart className="mr-2 h-4 w-4" />
                      View Detailed Analytics
                    </Button>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Execution Speed</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[finaid.speed]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => handleSpeedChange(finaid.id, value)}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{finaid.speed}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Higher speeds may consume more resources but complete tasks faster
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>LLM Model</Label>
                        <Select value={finaid.llm} onValueChange={(value) => handleLLMChange(finaid.id, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select LLM model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                            <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                            <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                            <SelectItem value="llama-3">Llama 3</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Different models have different capabilities and costs
                        </p>
                      </div>

                      <div className="rounded-md bg-amber-50 p-3 text-amber-800">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-800" />
                          <div>
                            <p className="font-medium">Important Note</p>
                            <p className="text-sm">
                              Changing these settings will affect all future executions. Current running tasks will
                              complete with previous settings.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button>
                        <Settings className="mr-2 h-4 w-4" />
                        Save Settings
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="logs" className="space-y-4 pt-4">
                    <div className="rounded-md border">
                      <div className="p-4">
                        <h3 className="font-medium">Recent Activity Logs</h3>
                      </div>
                      <div className="max-h-80 overflow-auto">
                        <div className="border-t p-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Task Completed</span>
                            <span className="text-xs text-muted-foreground">10 minutes ago</span>
                          </div>
                          <p className="mt-1 text-muted-foreground">Successfully processed invoice #INV-2023-0042</p>
                        </div>
                        <div className="border-t p-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Task Started</span>
                            <span className="text-xs text-muted-foreground">15 minutes ago</span>
                          </div>
                          <p className="mt-1 text-muted-foreground">Started processing new invoice</p>
                        </div>
                        <div className="border-t p-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Configuration Updated</span>
                            <span className="text-xs text-muted-foreground">2 hours ago</span>
                          </div>
                          <p className="mt-1 text-muted-foreground">LLM model changed to {finaid.llm}</p>
                        </div>
                        <div className="border-t p-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Task Completed</span>
                            <span className="text-xs text-muted-foreground">3 hours ago</span>
                          </div>
                          <p className="mt-1 text-muted-foreground">Successfully reconciled bank accounts</p>
                        </div>
                        <div className="border-t p-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Task Started</span>
                            <span className="text-xs text-muted-foreground">3 hours ago</span>
                          </div>
                          <p className="mt-1 text-muted-foreground">Started bank reconciliation process</p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      View Full Activity Log
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <Zap className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">No Fin(Ai)ds Deployed</h3>
          <p className="mt-2 text-muted-foreground">
            This client doesn't have any Fin(Ai)ds deployed yet. Deploy your first Fin(Ai)d to start automating tasks.
          </p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Deploy Fin(Ai)d
          </Button>
        </Card>
      )}
    </div>
  )
}

