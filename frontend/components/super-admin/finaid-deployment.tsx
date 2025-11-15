"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

const data = [
  { name: "S(Ai)m", value: 35, color: "#8884d8" },
  { name: "Qu(Ai)ncy", value: 25, color: "#82ca9d" },
  { name: "Z(Ai)ck", value: 20, color: "#ffc658" },
  { name: "(Ai)dam", value: 20, color: "#ff8042" },
]

export function FinaidDeployment() {
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
          label={({ name, percent }: { name: any; percent: any }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

