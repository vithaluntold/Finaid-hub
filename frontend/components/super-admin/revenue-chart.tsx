"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    revenue: 120000,
  },
  {
    name: "Feb",
    revenue: 140000,
  },
  {
    name: "Mar",
    revenue: 160000,
  },
  {
    name: "Apr",
    revenue: 180000,
  },
  {
    name: "May",
    revenue: 200000,
  },
  {
    name: "Jun",
    revenue: 220000,
  },
  {
    name: "Jul",
    revenue: 234567,
  },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
        <Legend />
        <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

