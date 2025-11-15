"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export function FinaidSelectionForm({ initialData, accountingPackage, onUpdate, onNext }) {
  const [selectedFinaids, setSelectedFinaids] = useState(initialData || [])
  const [error, setError] = useState("")
  const [relevantFinaids, setRelevantFinaids] = useState([])

  // Filter Fin(Ai)ds based on selected accounting package
  useEffect(() => {
    // In a real application, this would come from an API
    const allFinaids = [
      {
        id: "bookkeeper",
        name: "Bookkeeper Fin(Ai)d",
        description: "Automates transaction categorization and reconciliation",
        packages: ["QuickBooks", "Xero", "Zoho Books", "FreshBooks", "Sage Accounting"],
        features: [
          "Automatic transaction categorization",
          "Bank reconciliation",
          "Receipt matching",
          "Journal entry creation",
        ],
      },
      {
        id: "invoicer",
        name: "Invoicer Fin(Ai)d",
        description: "Creates and manages invoices and payments",
        packages: ["QuickBooks", "Xero", "Zoho Books", "FreshBooks", "NetSuite", "Sage Accounting"],
        features: [
          "Automated invoice generation",
          "Payment tracking",
          "Late payment reminders",
          "Payment reconciliation",
        ],
      },
      {
        id: "reporter",
        name: "Reporter Fin(Ai)d",
        description: "Generates financial reports and insights",
        packages: ["QuickBooks", "Xero", "SAP", "NetSuite", "Oracle", "Sage Accounting"],
        features: [
          "P&L statement generation",
          "Balance sheet preparation",
          "Cash flow analysis",
          "Financial ratio calculations",
        ],
      },
      {
        id: "tax",
        name: "Tax Fin(Ai)d",
        description: "Manages tax calculations and filings",
        packages: ["QuickBooks", "Xero", "SAP", "NetSuite", "Oracle"],
        features: ["Tax calculation", "Filing reminders", "Deduction finder", "Tax document organization"],
      },
      {
        id: "payroll",
        name: "Payroll Fin(Ai)d",
        description: "Handles payroll processing and compliance",
        packages: ["QuickBooks", "Xero", "SAP", "NetSuite", "Oracle", "Sage Accounting"],
        features: ["Payroll processing", "Tax withholding", "Direct deposit", "Compliance reporting"],
      },
      {
        id: "inventory",
        name: "Inventory Fin(Ai)d",
        description: "Manages inventory tracking and ordering",
        packages: ["QuickBooks", "Xero", "SAP", "NetSuite", "Oracle", "Zoho Books"],
        features: ["Inventory tracking", "Reorder alerts", "Valuation", "Purchase orders"],
      },
      {
        id: "expense",
        name: "Expense Fin(Ai)d",
        description: "Tracks and categorizes business expenses",
        packages: ["QuickBooks", "Xero", "FreshBooks", "SAP", "NetSuite", "Oracle", "Zoho Books", "Sage Accounting"],
        features: ["Receipt scanning", "Expense categorization", "Approval workflows", "Reimbursement tracking"],
      },
      {
        id: "forecast",
        name: "Forecast Fin(Ai)d",
        description: "Provides financial forecasting and budgeting",
        packages: ["QuickBooks", "Xero", "SAP", "NetSuite", "Oracle"],
        features: ["Cash flow forecasting", "Budget creation", "Scenario planning", "Trend analysis"],
      },
    ]

    // Filter Fin(Ai)ds relevant to the selected accounting package
    if (accountingPackage) {
      const filtered = allFinaids.filter((finaid) => finaid.packages.includes(accountingPackage))
      setRelevantFinaids(filtered)
    } else {
      setRelevantFinaids(allFinaids)
    }
  }, [accountingPackage])

  const handleToggleFinaid = (finaidName) => {
    setSelectedFinaids((prev) => {
      if (prev.includes(finaidName)) {
        return prev.filter((name) => name !== finaidName)
      } else {
        return [...prev, finaidName]
      }
    })
    setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (selectedFinaids.length === 0) {
      setError("Please select at least one Fin(Ai)d")
      return
    }

    onUpdate(selectedFinaids)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Fin(Ai)d Selection</h3>
        <p className="text-sm text-muted-foreground">
          Select the Fin(Ai)ds to deploy for this client with {accountingPackage}
        </p>
      </div>

      {relevantFinaids.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relevantFinaids.map((finaid) => (
            <Card
              key={finaid.id}
              className={`relative cursor-pointer border-2 ${
                selectedFinaids.includes(finaid.name) ? "border-primary" : ""
              }`}
              onClick={() => handleToggleFinaid(finaid.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-base">{finaid.name}</CardTitle>
                  <Checkbox
                    checked={selectedFinaids.includes(finaid.name)}
                    onCheckedChange={() => handleToggleFinaid(finaid.name)}
                    className="h-5 w-5"
                  />
                </div>
                <CardDescription className="mb-3">{finaid.description}</CardDescription>
                <div className="space-y-1">
                  {finaid.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p>No Fin(Ai)ds available for the selected accounting package.</p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

