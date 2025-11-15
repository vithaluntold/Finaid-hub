"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, MoreHorizontal, Eye, Download, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Invoice = {
  id: string
  invoiceNumber: string
  date: Date
  dueDate: Date
  amount: number
  paidAmount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  description: string
}

type ClientInvoicesProps = {
  clientId: string
}

export default function ClientInvoices({ clientId }: ClientInvoicesProps) {
  const { showToast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [sortColumn, setSortColumn] = useState<keyof Invoice>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    description: "",
    amount: "",
    dueDate: "",
  })

  useEffect(() => {
    // In a real app, this would fetch from an API based on clientId
    const generateInvoices = () => {
      const statuses: Invoice["status"][] = ["draft", "sent", "paid", "overdue", "cancelled"]
      const descriptions = [
        "Monthly consulting services",
        "Project development - Phase 1",
        "Software maintenance",
        "Training services",
        "Custom integration work",
        "Support services",
        "License renewal",
      ]

      const result: Invoice[] = []

      for (let i = 0; i < 15; i++) {
        const invoiceDate = new Date()
        invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 180))

        const dueDate = new Date(invoiceDate)
        dueDate.setDate(dueDate.getDate() + 30)

        const amount = Number.parseFloat((Math.random() * 15000 + 1000).toFixed(2))
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const paidAmount = status === "paid" ? amount : status === "overdue" ? Math.random() * amount : 0

        const invoice: Invoice = {
          id: `${clientId}-inv-${i}`,
          invoiceNumber: `INV-${1000 + i}`,
          date: invoiceDate,
          dueDate,
          amount,
          paidAmount,
          status,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
        }

        result.push(invoice)
      }

      return result
    }

    setInvoices(generateInvoices())
  }, [clientId])

  const handleSort = (column: keyof Invoice) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortColumn === "date" || sortColumn === "dueDate") {
      const aTime = a[sortColumn].getTime()
      const bTime = b[sortColumn].getTime()
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime
    }

    if (sortColumn === "amount" || sortColumn === "paidAmount") {
      return sortDirection === "asc" ? a[sortColumn] - b[sortColumn] : b[sortColumn] - a[sortColumn]
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

  const handleCreateInvoice = () => {
    // Validate inputs
    if (!newInvoice.description.trim()) {
      showToast({ title: "Error", description: "Please enter a description" })
      return
    }
    if (!newInvoice.amount || isNaN(Number(newInvoice.amount)) || Number(newInvoice.amount) <= 0) {
      showToast({ title: "Error", description: "Please enter a valid amount" })
      return
    }
    if (!newInvoice.dueDate) {
      showToast({ title: "Error", description: "Please select a due date" })
      return
    }

    // Generate new invoice ID
    const newId = `INV-${String(invoices.length + 1).padStart(4, "0")}`
    const today = new Date()
    const dueDate = new Date(newInvoice.dueDate)

    // Create new invoice object
    const invoice: Invoice = {
      id: newId,
      invoiceNumber: newId,
      date: today,
      dueDate: dueDate,
      amount: Number(newInvoice.amount),
      paidAmount: 0,
      status: "draft",
      description: newInvoice.description,
    }

    // Add to invoices array
    setInvoices([invoice, ...invoices])

    // Show success toast
    showToast({ title: "Success", description: "Invoice created successfully" })

    // Close dialog and reset form
    setIsCreateDialogOpen(false)
    setNewInvoice({ description: "", amount: "", dueDate: "" })
  }

  const handleViewInvoice = (invoiceNumber: string) => {
    showToast({
      title: "Opening Invoice",
      description: `Opening invoice ${invoiceNumber}`,
    })
  }

  const handleDownloadInvoice = (invoiceNumber: string) => {
    showToast({
      title: "Download Started",
      description: `Downloading invoice ${invoiceNumber} as PDF`,
    })
  }

  const handleSendReminder = (invoiceNumber: string) => {
    showToast({
      title: "Reminder Sent",
      description: `Payment reminder sent for invoice ${invoiceNumber}`,
    })
  }

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Draft
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Sent
          </Badge>
        )
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  const getBalanceDue = (invoice: Invoice) => {
    return invoice.amount - invoice.paidAmount
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Invoices</CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("invoiceNumber")} className="flex items-center">
                      Invoice #
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <Button variant="ghost" onClick={() => handleSort("date")} className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <Button variant="ghost" onClick={() => handleSort("dueDate")} className="flex items-center">
                      Due Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
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
                  <TableHead className="text-right">Balance Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell className="text-right">
                      <span className={getBalanceDue(invoice) > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                        {formatCurrency(getBalanceDue(invoice))}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewInvoice(invoice.invoiceNumber)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice.invoiceNumber)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendReminder(invoice.invoiceNumber)}>
                            <Send className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new invoice for this client.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter invoice description..."
                value={newInvoice.description}
                onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setNewInvoice({ description: "", amount: "", dueDate: "" })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice}>
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
