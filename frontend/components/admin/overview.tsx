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
    clients: 30,
    finAids: 45,
    licenses: 20,
  },
  {
    name: "Feb",
    clients: 32,
    finAids: 50,
    licenses: 22,
  },
  {
    name: "Mar",
    clients: 35,
    finAids: 60,
    licenses: 24,
  },
  {
    name: "Apr",
    clients: 38,
    finAids: 75,
    licenses: 25,
  },
  {
    name: "May",
    clients: 42,
    finAids: 90,
    licenses: 28,
  },
  {
    name: "Jun",
    clients: 45,
    finAids: 105,
    licenses: 30,
  },
  {
    name: "Jul",
    clients: 48,
    finAids: 120,
    licenses: 32,
  },
]

export function AdminOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="clients"
          name="Clients"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
        />
        <Area
          type="monotone"
          dataKey="finAids"
          name="Fin(Ai)ds"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.3}
        />
        <Area
          type="monotone"
          dataKey="licenses"
          name="Licenses"
          stroke="#ffc658"
          fill="#ffc658"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

