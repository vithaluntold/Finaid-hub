"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    revenue: 18000,
    users: 120,
    finAids: 200,
  },
  {
    name: "Feb",
    revenue: 22000,
    users: 150,
    finAids: 250,
  },
  {
    name: "Mar",
    revenue: 28000,
    users: 180,
    finAids: 300,
  },
  {
    name: "Apr",
    revenue: 32000,
    users: 220,
    finAids: 350,
  },
  {
    name: "May",
    revenue: 39000,
    users: 280,
    finAids: 400,
  },
  {
    name: "Jun",
    revenue: 42000,
    users: 340,
    finAids: 450,
  },
  {
    name: "Jul",
    revenue: 45000,
    users: 380,
    finAids: 500,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="users" name="Users" fill="#82ca9d" />
        <Bar yAxisId="right" dataKey="finAids" name="Fin(Ai)ds" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  )
}

