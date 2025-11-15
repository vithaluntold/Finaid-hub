"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Download, Search } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface ClientActivityLogProps {
  client: any
}

export function ClientActivityLog({ client }: ClientActivityLogProps) {
  const [date, setDate] = useState<Date>()

  // Sample activity log data
  const activityLogs = [
    {
      id: "log-001",
      type: "finaid",
      action: "Task Completed",
      description: "S(Ai)m successfully processed invoice #INV-2023-0042",
      timestamp: "2023-06-15T10:30:00Z",
      user: "System",
      finaid: "S(Ai)m",
    },
    {
      id: "log-002",
      type: "finaid",
      action: "Task Started",
      description: "S(Ai)m started processing new invoice",
      timestamp: "2023-06-15T10:25:00Z",
      user: "System",
      finaid: "S(Ai)m",
    },
    {
      id: "log-003",
      type: "user",
      action: "Settings Updated",
      description: "Updated LLM model for Qu(Ai)ncy to GPT-4o",
      timestamp: "2023-06-15T09:15:00Z",
      user: "John Smith",
      finaid: "Qu(Ai)ncy",
    },
    {
      id: "log-004",
      type: "system",
      action: "Maintenance",
      description: "System maintenance performed",
      timestamp: "2023-06-14T22:00:00Z",
      user: "System",
      finaid: null,
    },
    {
      id: "log-005",
      type: "finaid",
      action: "Task Completed",
      description: "Z(Ai)ck generated monthly financial report",
      timestamp: "2023-06-14T16:45:00Z",
      user: "System",
      finaid: "Z(Ai)ck",
    },
    {
      id: "log-006",
      type: "user",
      action: "Document Uploaded",
      description: "Uploaded new tax documents",
      timestamp: "2023-06-14T14:30:00Z",
      user: "Jane Doe",
      finaid: null,
    },
    {
      id: "log-007",
      type: "finaid",
      action: "Error",
      description: "P(Ai)ge encountered an error processing payroll",
      timestamp: "2023-06-14T11:20:00Z",
      user: "System",
      finaid: "P(Ai)ge",
    },
    {
      id: "log-008",
      type: "user",
      action: "Fin(Ai)d Deployed",
      description: "Deployed new Fin(Ai)d: (Ai)dam",
      timestamp: "2023-06-13T15:10:00Z",
      user: "John Smith",
      finaid: "(Ai)dam",
    },
  ]

  const getActionColor = (action: string) => {
    switch (action) {
      case "Task Completed":
        return "bg-green-100 text-green-800"
      case "Task Started":
        return "bg-blue-100 text-blue-800"
      case "Error":
        return "bg-red-100 text-red-800"
      case "Settings Updated":
        return "bg-purple-100 text-purple-800"
      case "Maintenance":
        return "bg-amber-100 text-amber-800"
      case "Document Uploaded":
        return "bg-indigo-100 text-indigo-800"
      case "Fin(Ai)d Deployed":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "PPpp") // Format: "Jan 1, 2023, 12:00 PM"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>View all activity for this client</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search logs..." className="pl-8" />
              </div>

              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="finaid">Fin(Ai)d</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Activity</TabsTrigger>
                <TabsTrigger value="finaid">Fin(Ai)d</TabsTrigger>
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="rounded-md border">
                  <div className="divide-y">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="p-4">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-2">
                            <div className={`rounded-full px-2 py-1 text-xs font-medium ${getActionColor(log.action)}`}>
                              {log.action}
                            </div>
                            {log.finaid && (
                              <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                {log.finaid}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</div>
                        </div>
                        <p className="mt-2">{log.description}</p>
                        <div className="mt-1 text-sm text-muted-foreground">By: {log.user}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="finaid" className="mt-4">
                <div className="rounded-md border">
                  <div className="divide-y">
                    {activityLogs
                      .filter((log) => log.type === "finaid")
                      .map((log) => (
                        <div key={log.id} className="p-4">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className={`rounded-full px-2 py-1 text-xs font-medium ${getActionColor(log.action)}`}
                              >
                                {log.action}
                              </div>
                              {log.finaid && (
                                <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                  {log.finaid}
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</div>
                          </div>
                          <p className="mt-2">{log.description}</p>
                          <div className="mt-1 text-sm text-muted-foreground">By: {log.user}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              {/* Similar content for other tabs */}
              <TabsContent value="user" className="mt-4">
                <div className="rounded-md border">
                  <div className="divide-y">
                    {activityLogs
                      .filter((log) => log.type === "user")
                      .map((log) => (
                        <div key={log.id} className="p-4">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className={`rounded-full px-2 py-1 text-xs font-medium ${getActionColor(log.action)}`}
                              >
                                {log.action}
                              </div>
                              {log.finaid && (
                                <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                  {log.finaid}
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</div>
                          </div>
                          <p className="mt-2">{log.description}</p>
                          <div className="mt-1 text-sm text-muted-foreground">By: {log.user}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="system" className="mt-4">
                <div className="rounded-md border">
                  <div className="divide-y">
                    {activityLogs
                      .filter((log) => log.type === "system")
                      .map((log) => (
                        <div key={log.id} className="p-4">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className={`rounded-full px-2 py-1 text-xs font-medium ${getActionColor(log.action)}`}
                              >
                                {log.action}
                              </div>
                              {log.finaid && (
                                <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                  {log.finaid}
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</div>
                          </div>
                          <p className="mt-2">{log.description}</p>
                          <div className="mt-1 text-sm text-muted-foreground">By: {log.user}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

