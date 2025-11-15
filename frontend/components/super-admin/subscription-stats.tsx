"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

const planData = [
  { name: "Enterprise Plus", value: 35, color: "#8884d8" },
  { name: "Enterprise", value: 40, color: "#82ca9d" },
  { name: "Professional", value: 25, color: "#ffc658" },
]

const cycleData = [
  { name: "Monthly", value: 60, color: "#8884d8" },
  { name: "Quarterly", value: 15, color: "#82ca9d" },
  { name: "Annual", value: 25, color: "#ffc658" },
]

export function SubscriptionStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2 text-center">License Plans</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={planData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {planData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-center">Billing Cycles</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={cycleData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }: { name: any; percent: any }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {cycleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

