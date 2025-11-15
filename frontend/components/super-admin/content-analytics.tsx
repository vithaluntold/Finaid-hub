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
    views: 12000,
    engagement: 3.2,
  },
  {
    name: "Feb",
    views: 15000,
    engagement: 3.5,
  },
  {
    name: "Mar",
    views: 18000,
    engagement: 3.8,
  },
  {
    name: "Apr",
    views: 22000,
    engagement: 4.0,
  },
  {
    name: "May",
    views: 28000,
    engagement: 4.2,
  },
  {
    name: "Jun",
    views: 35000,
    engagement: 4.3,
  },
  {
    name: "Jul",
    views: 45200,
    engagement: 4.5,
  },
]

export function ContentAnalytics() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          formatter={(value, name) => {
            if (name === "views") return [value.toLocaleString(), "Views"]
            return [`${value}m`, "Avg. Engagement"]
          }}
        />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="views" name="Views" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="engagement" name="Avg. Engagement (minutes)" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

