"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react";

type ClientData = {
  id: string;
  name: string;
  industry: string;
  companySize: string;
  paymentTerms: string;
  creditLimit: number;
};

type ClientOverviewProps = {
  clientData: ClientData;
};

export default function ClientOverview({ clientData }: ClientOverviewProps) {
  const { showToast } = useToast();
  
  // Dialog states
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isStatementDialogOpen, setIsStatementDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);

  // Form states
  const [invoiceForm, setInvoiceForm] = useState({
    description: "",
    amount: "",
    dueDate: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    invoiceNumber: "",
    amount: "",
    paymentDate: "",
    paymentMethod: "",
  });

  const [statementForm, setStatementForm] = useState({
    startDate: "",
    endDate: "",
    emailSubject: "",
    notes: "",
  });

  const [reminderForm, setReminderForm] = useState({
    message: "",
    sendDate: "",
  });

  // Handlers
  const handleCreateInvoice = () => {
    if (!invoiceForm.description || !invoiceForm.amount || !invoiceForm.dueDate) {
      showToast({ title: "Error", description: "Please fill in all required fields" });
      return;
    }
    
    showToast({ 
      title: "Success", 
      description: `Invoice created for ${clientData.name} - $${invoiceForm.amount}` 
    });
    setIsInvoiceDialogOpen(false);
    setInvoiceForm({ description: "", amount: "", dueDate: "" });
  };

  const handleRecordPayment = () => {
    if (!paymentForm.invoiceNumber || !paymentForm.amount || !paymentForm.paymentDate) {
      showToast({ title: "Error", description: "Please fill in all required fields" });
      return;
    }
    
    showToast({ 
      title: "Success", 
      description: `Payment of $${paymentForm.amount} recorded for ${clientData.name}` 
    });
    setIsPaymentDialogOpen(false);
    setPaymentForm({ invoiceNumber: "", amount: "", paymentDate: "", paymentMethod: "" });
  };

  const handleSendStatement = () => {
    if (!statementForm.startDate || !statementForm.endDate) {
      showToast({ title: "Error", description: "Please select date range" });
      return;
    }
    
    showToast({ 
      title: "Success", 
      description: `Statement sent to ${clientData.name}` 
    });
    setIsStatementDialogOpen(false);
    setStatementForm({ startDate: "", endDate: "", emailSubject: "", notes: "" });
  };

  const handleSendReminder = () => {
    if (!reminderForm.message) {
      showToast({ title: "Error", description: "Please enter a reminder message" });
      return;
    }
    
    showToast({ 
      title: "Success", 
      description: `Payment reminder sent to ${clientData.name}` 
    });
    setIsReminderDialogOpen(false);
    setReminderForm({ message: "", sendDate: "" });
  };

  // In a real app, this would come from an API
  const financialSummary = {
    totalInvoiced: 125000,
    totalPaid: 98000,
    outstandingBalance: 27000,
    overdueAmount: 5000,
    averagePaymentDays: 28,
    creditUtilization: 54, // percentage of credit limit used
    lastPaymentDate: new Date(2023, 5, 15),
    nextInvoiceDue: new Date(2023, 6, 30),
  };

  const recentActivity = [
    {
      id: 1,
      type: "payment",
      description: "Payment received - Invoice #INV-001",
      amount: 15000,
      date: new Date(2023, 5, 15),
    },
    {
      id: 2,
      type: "invoice",
      description: "Invoice sent - INV-002",
      amount: 8500,
      date: new Date(2023, 5, 10),
    },
    {
      id: 3,
      type: "communication",
      description: "Email sent - Payment reminder",
      amount: null,
      date: new Date(2023, 5, 8),
    },
    {
      id: 4,
      type: "payment",
      description: "Payment received - Invoice #INV-003",
      amount: 12000,
      date: new Date(2023, 4, 28),
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Financial Summary Cards */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoiced
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(financialSummary.totalInvoiced)}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Outstanding Balance
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(financialSummary.outstandingBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">
                  {formatCurrency(financialSummary.overdueAmount)} overdue
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(financialSummary.totalPaid)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg. payment: {financialSummary.averagePaymentDays} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Credit Utilization
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialSummary.creditUtilization}%
              </div>
              <Progress
                value={financialSummary.creditUtilization}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(clientData.creditLimit)} credit limit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start"
              onClick={() => setIsInvoiceDialogOpen(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsPaymentDialogOpen(true)}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsStatementDialogOpen(true)}
            >
              <TrendingDown className="mr-2 h-4 w-4" />
              Send Statement
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsReminderDialogOpen(true)}
            >
              <Clock className="mr-2 h-4 w-4" />
              Payment Reminder
            </Button>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">On Time</span>
                <Badge className="bg-green-500">85%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Late (1-30 days)</span>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  12%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Very Late (30+ days)</span>
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  3%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Details & Quick Actions */}
      <div className="space-y-6">
        {/* Client Details */}
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Industry
              </label>
              <p className="text-sm">{clientData.industry}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Company Size
              </label>
              <p className="text-sm">{clientData.companySize}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Payment Terms
              </label>
              <p className="text-sm">{clientData.paymentTerms}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Credit Limit
              </label>
              <p className="text-sm">
                {formatCurrency(clientData.creditLimit)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Payment
              </label>
              <p className="text-sm">
                {formatDate(financialSummary.lastPaymentDate)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Next Invoice Due
              </label>
              <p className="text-sm">
                {formatDate(financialSummary.nextInvoiceDue)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Create Invoice Dialog */}
    <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for {clientData.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="invoice-description">Description</Label>
            <Textarea
              id="invoice-description"
              placeholder="Services provided..."
              value={invoiceForm.description}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invoice-amount">Amount ($)</Label>
            <Input
              id="invoice-amount"
              type="number"
              placeholder="0.00"
              value={invoiceForm.amount}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invoice-duedate">Due Date</Label>
            <Input
              id="invoice-duedate"
              type="date"
              value={invoiceForm.dueDate}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateInvoice}>Create Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Record Payment Dialog */}
    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment received from {clientData.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="payment-invoice">Invoice Number</Label>
            <Input
              id="payment-invoice"
              placeholder="INV-001"
              value={paymentForm.invoiceNumber}
              onChange={(e) => setPaymentForm({ ...paymentForm, invoiceNumber: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payment-amount">Amount ($)</Label>
            <Input
              id="payment-amount"
              type="number"
              placeholder="0.00"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payment-date">Payment Date</Label>
            <Input
              id="payment-date"
              type="date"
              value={paymentForm.paymentDate}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Input
              id="payment-method"
              placeholder="Bank Transfer, Check, etc."
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRecordPayment}>Record Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Send Statement Dialog */}
    <Dialog open={isStatementDialogOpen} onOpenChange={setIsStatementDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Statement</DialogTitle>
          <DialogDescription>
            Send an account statement to {clientData.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="statement-start">Start Date</Label>
            <Input
              id="statement-start"
              type="date"
              value={statementForm.startDate}
              onChange={(e) => setStatementForm({ ...statementForm, startDate: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="statement-end">End Date</Label>
            <Input
              id="statement-end"
              type="date"
              value={statementForm.endDate}
              onChange={(e) => setStatementForm({ ...statementForm, endDate: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="statement-subject">Email Subject (Optional)</Label>
            <Input
              id="statement-subject"
              placeholder="Account Statement"
              value={statementForm.emailSubject}
              onChange={(e) => setStatementForm({ ...statementForm, emailSubject: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="statement-notes">Additional Notes (Optional)</Label>
            <Textarea
              id="statement-notes"
              placeholder="Any additional information..."
              value={statementForm.notes}
              onChange={(e) => setStatementForm({ ...statementForm, notes: e.target.value })}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsStatementDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendStatement}>Send Statement</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Payment Reminder Dialog */}
    <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Reminder</DialogTitle>
          <DialogDescription>
            Send a payment reminder to {clientData.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reminder-message">Reminder Message</Label>
            <Textarea
              id="reminder-message"
              placeholder="This is a friendly reminder about your outstanding balance..."
              value={reminderForm.message}
              onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
              rows={5}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reminder-date">Send Date (Optional)</Label>
            <Input
              id="reminder-date"
              type="date"
              value={reminderForm.sendDate}
              onChange={(e) => setReminderForm({ ...reminderForm, sendDate: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to send immediately
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendReminder}>Send Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
