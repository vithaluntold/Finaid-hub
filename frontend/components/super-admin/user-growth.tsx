"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    users: 1200,
    newUsers: 120,
  },
  {
    name: "Feb",
    users: 1350,
    newUsers: 150,
  },
  {
    name: "Mar",
    users: 1500,
    newUsers: 150,
  },
  {
    name: "Apr",
    users: 1650,
    newUsers: 150,
  },
  {
    name: "May",
    users: 1750,
    newUsers: 100,
  },
  {
    name: "Jun",
    users: 1820,
    newUsers: 70,
  },
  {
    name: "Jul",
    users: 1893,
    newUsers: 73,
  },
]

export function UserGrowth() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="users" name="Total Users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

