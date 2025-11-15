"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpDown, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react"

type Transaction = {
  id: string
  date: Date
  description: string
  category: string
  amount: number
  type: "income" | "expense"
  status: "cleared" | "pending" | "reconciled"
}

type TransactionTableProps = {
  filter: "all" | "income" | "expenses" | "pending"
  ledgerId: string
}

export default function TransactionTable({ filter, ledgerId }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [sortColumn, setSortColumn] = useState<keyof Transaction>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // In a real app, this would fetch from an API based on the ledgerId
    const generateTransactions = () => {
      const categories = {
        income: ["Client Payment", "Consulting", "Interest", "Sales", "Refund"],
        expense: ["Office Supplies", "Software", "Utilities", "Rent", "Travel", "Marketing", "Salary"],
      }

      const descriptions = {
        income: [
          "Client payment - Project Alpha",
          "Monthly retainer - XYZ Corp",
          "Consulting services",
          "Product sales",
          "Interest income",
        ],
        expense: [
          "Office supplies from Staples",
          "Software subscription - Adobe",
          "Electricity bill",
          "Office rent",
          "Business travel - Conference",
          "Digital marketing campaign",
          "Employee salary",
        ],
      }

      const statuses = ["cleared", "pending", "reconciled"]

      const result: Transaction[] = []

      // Generate different number of transactions based on ledgerId to simulate different ledgers
      const transactionCount = ledgerId.includes("q1") ? 30 : ledgerId.includes("q2") ? 50 : 25

      // Generate random transactions over the last 30 days
      for (let i = 0; i < transactionCount; i++) {
        const type = Math.random() > 0.4 ? "expense" : "income"
        const categoryList = type === "income" ? categories.income : categories.expense
        const descriptionList = type === "income" ? descriptions.income : descriptions.expense

        const randomDate = new Date()
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30))

        const transaction: Transaction = {
          id: `${ledgerId}-tr-${i}`,
          date: randomDate,
          description: descriptionList[Math.floor(Math.random() * descriptionList.length)],
          category: categoryList[Math.floor(Math.random() * categoryList.length)],
          amount: Number.parseFloat((Math.random() * (type === "income" ? 5000 : 2000) + 100).toFixed(2)),
          type,
          status: statuses[Math.floor(Math.random() * statuses.length)] as "cleared" | "pending" | "reconciled",
        }

        result.push(transaction)
      }

      return result
    }

    setTransactions(generateTransactions())
  }, [ledgerId])

  const handleSort = (column: keyof Transaction) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedTransactions = [...transactions]
    .filter((transaction) => {
      if (filter === "all") return true
      if (filter === "income") return transaction.type === "income"
      if (filter === "expenses") return transaction.type === "expense"
      if (filter === "pending") return transaction.status === "pending"
      return true
    })
    .sort((a, b) => {
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

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "cleared":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Cleared
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "reconciled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Reconciled
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      <ScrollArea className="h-[calc(100vh-20rem)]">
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
                <Button variant="ghost" onClick={() => handleSort("description")} className="flex items-center">
                  Description
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("category")} className="flex items-center">
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort("amount")} className="flex items-center justify-end">
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {transaction.type === "income" ? (
                      <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Categorize</DropdownMenuItem>
                      <DropdownMenuItem>Split</DropdownMenuItem>
                      <DropdownMenuItem>Flag for review</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
