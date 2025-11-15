"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

const data = [
  { name: "Getting Started", value: 15, color: "#8884d8" },
  { name: "Tutorials", value: 25, color: "#82ca9d" },
  { name: "Advanced", value: 18, color: "#ffc658" },
  { name: "Tax", value: 12, color: "#ff8042" },
  { name: "Client Management", value: 10, color: "#0088fe" },
  { name: "Reporting", value: 8, color: "#00C49F" },
  { name: "Ethics", value: 5, color: "#FFBB28" },
  { name: "Integrations", value: 7, color: "#FF8042" },
]

export function ContentCategories() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} items`, "Content Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

