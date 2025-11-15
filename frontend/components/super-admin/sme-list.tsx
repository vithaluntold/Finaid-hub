"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EyeIcon } from "lucide-react"

const smeCompanies = [
  {
    id: "SME001",
    name: "TechNova Solutions",
    industry: "Technology",
    finAidsDeployed: 12,
    automationRate: "92%",
    status: "active",
  },
  {
    id: "SME002",
    name: "Green Leaf Organics",
    industry: "Agriculture",
    finAidsDeployed: 8,
    automationRate: "85%",
    status: "active",
  },
  {
    id: "SME003",
    name: "Bright Spark Electronics",
    industry: "Manufacturing",
    finAidsDeployed: 10,
    automationRate: "88%",
    status: "active",
  },
  {
    id: "SME004",
    name: "Coastal Shipping Co.",
    industry: "Logistics",
    finAidsDeployed: 7,
    automationRate: "76%",
    status: "active",
  },
  {
    id: "SME005",
    name: "Urban Eats Catering",
    industry: "Food Service",
    finAidsDeployed: 5,
    automationRate: "65%",
    status: "active",
  },
]

export function SmeList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Fin(Ai)ds</TableHead>
          <TableHead>Automation</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {smeCompanies.map((company) => (
          <TableRow key={company.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={company.name} />
                  <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>{company.name}</div>
              </div>
            </TableCell>
            <TableCell>{company.industry}</TableCell>
            <TableCell>{company.finAidsDeployed}</TableCell>
            <TableCell>{company.automationRate}</TableCell>
            <TableCell>
              <Badge
                variant={
                  company.status === "active" ? "default" : company.status === "inactive" ? "destructive" : "outline"
                }
              >
                {company.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <EyeIcon className="h-4 w-4" />
                <span className="sr-only">View details</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

