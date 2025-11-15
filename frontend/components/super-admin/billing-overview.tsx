"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    revenue: 45000,
    newSubscribers: 15,
  },
  {
    name: "Feb",
    revenue: 52000,
    newSubscribers: 18,
  },
  {
    name: "Mar",
    revenue: 58000,
    newSubscribers: 20,
  },
  {
    name: "Apr",
    revenue: 63000,
    newSubscribers: 22,
  },
  {
    name: "May",
    revenue: 68000,
    newSubscribers: 24,
  },
  {
    name: "Jun",
    revenue: 72000,
    newSubscribers: 21,
  },
  {
    name: "Jul",
    revenue: 78650,
    newSubscribers: 24,
  },
]

export function BillingOverview() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          formatter={(value, name) => {
            if (name === "revenue") return [`$${value}`, "Revenue"];
            return [value, "New Accounting Firms"];
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#8884d8" />
        <Bar
          yAxisId="right"
          dataKey="newSubscribers"
          name="New Accounting Firms"
          fill="#82ca9d"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

