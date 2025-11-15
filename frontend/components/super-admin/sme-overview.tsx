"use client"

import {
  Line,
  LineChart,
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
    companies: 180,
    finAids: 800,
    revenue: 90000,
  },
  {
    name: "Feb",
    companies: 195,
    finAids: 900,
    revenue: 100000,
  },
  {
    name: "Mar",
    companies: 205,
    finAids: 950,
    revenue: 110000,
  },
  {
    name: "Apr",
    companies: 215,
    finAids: 1000,
    revenue: 120000,
  },
  {
    name: "May",
    companies: 225,
    finAids: 1100,
    revenue: 135000,
  },
  {
    name: "Jun",
    companies: 235,
    finAids: 1180,
    revenue: 145000,
  },
  {
    name: "Jul",
    companies: 248,
    finAids: 1245,
    revenue: 156789,
  },
]

export function SmeOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="companies"
          name="SME Companies"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line yAxisId="left" type="monotone" dataKey="finAids" name="Fin(Ai)ds Deployed" stroke="#82ca9d" />
        <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  )
}

