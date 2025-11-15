"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Users, Zap, Calendar, FileText } from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface ClientDashboardProps {
  client: any
}

export function ClientDashboard({ client }: ClientDashboardProps) {
  // Sample data for charts
  const performanceData = [
    { name: "Jan", uptime: 99.8, executions: 1240 },
    { name: "Feb", uptime: 99.9, executions: 1580 },
    { name: "Mar", uptime: 99.7, executions: 1890 },
    { name: "Apr", uptime: 99.9, executions: 2390 },
    { name: "May", uptime: 100, executions: 2780 },
    { name: "Jun", uptime: 99.8, executions: 3090 },
  ]

  const tokenData = [
    { name: "Jan", tokens: 125000 },
    { name: "Feb", tokens: 165000 },
    { name: "Mar", tokens: 190000 },
    { name: "Apr", tokens: 240000 },
    { name: "May", tokens: 280000 },
    { name: "Jun", tokens: 310000 },
  ]

  const savingsData = [
    { name: "Jan", hours: 42 },
    { name: "Feb", hours: 58 },
    { name: "Mar", hours: 75 },
    { name: "Apr", hours: 92 },
    { name: "May", hours: 110 },
    { name: "Jun", hours: 135 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Fin(Ai)ds</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.finAidsDeployed}</div>
            <p className="text-xs text-muted-foreground">
              {client.finAidsDeployed > 0 ? "All running normally" : "No Fin(Ai)ds deployed"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">512 hrs</div>
            <p className="text-xs text-muted-foreground">Approx. $25,600 saved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Uptime and execution count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="uptime" stroke="#8884d8" name="Uptime %" />
                <Line yAxisId="right" type="monotone" dataKey="executions" stroke="#82ca9d" name="Executions" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Token Consumption</CardTitle>
            <CardDescription>Monthly token usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={tokenData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tokens" fill="#8884d8" name="Tokens Used" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Savings</CardTitle>
          <CardDescription>Estimated hours saved by automation</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={savingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hours" stroke="#82ca9d" name="Hours Saved" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  icon: FileText,
                  title: "Invoice Generated",
                  time: "2 hours ago",
                  description: "Invoice #INV-2023-0042",
                },
                { icon: Calendar, title: "Meeting Scheduled", time: "Yesterday", description: "Quarterly Review" },
                {
                  icon: Activity,
                  title: "System Update",
                  time: "3 days ago",
                  description: "Fin(Ai)d performance improved",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                      <span className="text-sm text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{client.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      client.status === "active" ? "default" : client.status === "inactive" ? "destructive" : "outline"
                    }
                  >
                    <span className="capitalize">{client.status}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">Since {client.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Contact Name</div>
                <div>{client.contactName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Email</div>
                <div>{client.email}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Phone</div>
                <div>{client.phone}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Industry</div>
                <div>{client.industry}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Documents
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

