"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    name: "Bookkeeping Team",
    efficiency: 92,
    clientSatisfaction: 88,
    tasksCompleted: 156,
  },
  {
    name: "Tax Team",
    efficiency: 88,
    clientSatisfaction: 92,
    tasksCompleted: 132,
  },
  {
    name: "Audit Team",
    efficiency: 85,
    clientSatisfaction: 90,
    tasksCompleted: 98,
  },
  {
    name: "Advisory Team",
    efficiency: 90,
    clientSatisfaction: 95,
    tasksCompleted: 76,
  },
  {
    name: "Client Onboarding",
    efficiency: 82,
    clientSatisfaction: 86,
    tasksCompleted: 45,
  },
]

export function TeamPerformance() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Team Efficiency & Client Satisfaction</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="efficiency" name="Efficiency (%)" fill="#8884d8" />
            <Bar dataKey="clientSatisfaction" name="Client Satisfaction (%)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Tasks Completed (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasksCompleted" name="Tasks Completed" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

