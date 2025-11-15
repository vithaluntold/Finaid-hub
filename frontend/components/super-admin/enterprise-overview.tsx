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
    firms: 100,
    users: 1200,
    finAids: 2000,
    books: 3000,
  },
  {
    name: "Feb",
    firms: 110,
    users: 1350,
    finAids: 2200,
    books: 3300,
  },
  {
    name: "Mar",
    firms: 120,
    users: 1500,
    finAids: 2400,
    books: 3600,
  },
  {
    name: "Apr",
    firms: 125,
    users: 1650,
    finAids: 2600,
    books: 3900,
  },
  {
    name: "May",
    firms: 132,
    users: 1750,
    finAids: 2800,
    books: 4200,
  },
  {
    name: "Jun",
    firms: 138,
    users: 1820,
    finAids: 3000,
    books: 4500,
  },
  {
    name: "Jul",
    firms: 142,
    users: 1893,
    finAids: 3456,
    books: 5234,
  },
]

export function EnterpriseOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="firms" name="Active Firms" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="users" name="Users" stroke="#82ca9d" />
        <Line type="monotone" dataKey="finAids" name="Fin(Ai)ds" stroke="#ffc658" />
        <Line type="monotone" dataKey="books" name="Books" stroke="#ff8042" />
      </LineChart>
    </ResponsiveContainer>
  )
}

