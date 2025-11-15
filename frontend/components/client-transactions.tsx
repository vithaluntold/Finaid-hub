"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

type Transaction = {
  id: string
  date: Date
  description: string
  type: "invoice" | "payment" | "credit" | "adjustment"
  amount: number
  status: "completed" | "pending" | "failed"
  reference: string
}

type ClientTransactionsProps = {
  clientId: string
}

export default function ClientTransactions({ clientId }: ClientTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [sortColumn, setSortColumn] = useState<keyof Transaction>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // In a real app, this would fetch from an API based on clientId
    const generateTransactions = () => {
      const types: Transaction["type"][] = ["invoice", "payment", "credit", "adjustment"]
      const statuses: Transaction["status"][] = ["completed", "pending", "failed"]

      const descriptions = {
        invoice: ["Monthly service fee", "Project milestone payment", "Consulting services", "Software license"],
        payment: ["Wire transfer payment", "Check payment", "ACH payment", "Credit card payment"],
        credit: ["Credit memo", "Refund issued", "Discount applied", "Overpayment credit"],
        adjustment: ["Late fee adjustment", "Currency adjustment", "Rounding adjustment", "Manual correction"],
      }

      const result: Transaction[] = []

      for (let i = 0; i < 25; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        const typeDescriptions = descriptions[type]

        const randomDate = new Date()
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90))

        const transaction: Transaction = {
          id: `${clientId}-txn-${i}`,
          date: randomDate,
          description: typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)],
          type,
          amount: Number.parseFloat((Math.random() * 10000 + 500).toFixed(2)),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          reference: type === "invoice" ? `INV-${1000 + i}` : `REF-${2000 + i}`,
        }

        result.push(transaction)
      }

      return result
    }

    setTransactions(generateTransactions())
  }, [clientId])

  const handleSort = (column: keyof Transaction) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc" ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()
    }

    if (sortColumn === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
    }

    const aValue = String(a[sortColumn]).toLowerCase()
    const bValue = String(b[sortColumn]).toLowerCase()

    return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTypeBadge = (type: Transaction["type"]) => {
    switch (type) {
      case "invoice":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Invoice
          </Badge>
        )
      case "payment":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Payment
          </Badge>
        )
      case "credit":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Credit
          </Badge>
        )
      case "adjustment":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Adjustment
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return null
    }
  }

  const getAmountDisplay = (transaction: Transaction) => {
    const isDebit = transaction.type === "invoice" || transaction.type === "adjustment"
    return (
      <div className="flex items-center justify-end">
        {isDebit ? (
          <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
        ) : (
          <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
        )}
        <span className={isDebit ? "text-red-600" : "text-green-600"}>{formatCurrency(transaction.amount)}</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-[120px]">
                    <Button variant="ghost" onClick={() => handleSort("date")} className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("reference")} className="flex items-center">
                      Reference
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("description")} className="flex items-center">
                      Description
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("amount")}
                      className="flex items-center justify-end"
                    >
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-mono text-sm">{transaction.reference}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                    <TableCell className="text-right">{getAmountDisplay(transaction)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
