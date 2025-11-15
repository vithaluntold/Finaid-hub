"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Bot } from "lucide-react"

interface FinaidSelectionProps {
  onNext: () => void
  onBack: () => void
  accountingPackage: string
  updateFormData: (data: any) => void
}

export function FinaidSelection({ onNext, onBack, accountingPackage, updateFormData }: FinaidSelectionProps) {
  const [selectedFinaids, setSelectedFinaids] = useState([])
  const [error, setError] = useState("")

  // Sample Fin(Ai)ds data - in a real app, this would come from an API based on the accounting package
  const finaids = [
    {
      id: "bookkeeping",
      name: "S(Ai)m",
      description: "Automated bookkeeping assistant",
      features: ["Transaction categorization", "Reconciliation", "Financial statements"],
      compatibleWith: ["quickbooks", "xero", "zoho", "freshbooks", "sage"],
    },
    {
      id: "tax",
      name: "Qu(Ai)ncy",
      description: "Tax preparation assistant",
      features: ["Tax planning", "Deduction finder", "Compliance checks"],
      compatibleWith: ["quickbooks", "xero", "sap", "netsuite", "oracle", "sage"],
    },
    {
      id: "reporting",
      name: "Z(Ai)ck",
      description: "Financial reporting assistant",
      features: ["Custom reports", "Data visualization", "Trend analysis"],
      compatibleWith: ["quickbooks", "zoho", "sap", "netsuite", "oracle"],
    },
    {
      id: "communication",
      name: "(Ai)dam",
      description: "Client communication assistant",
      features: ["Automated updates", "Query handling", "Document requests"],
      compatibleWith: ["quickbooks", "xero", "zoho", "freshbooks", "sap", "netsuite", "oracle", "sage"],
    },
    {
      id: "audit",
      name: "(Ai)udrey",
      description: "Audit preparation assistant",
      features: ["Audit trail", "Document organization", "Compliance verification"],
      compatibleWith: ["sap", "netsuite", "oracle", "sage"],
    },
  ]

  // Filter Fin(Ai)ds based on selected accounting package
  const compatibleFinaids = finaids.filter((finaid) => finaid.compatibleWith.includes(accountingPackage))

  const handleToggleFinaid = (finaidId) => {
    setSelectedFinaids((prev) => {
      if (prev.includes(finaidId)) {
        return prev.filter((id) => id !== finaidId)
      } else {
        return [...prev, finaidId]
      }
    })

    if (error) setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (selectedFinaids.length === 0) {
      setError("Please select at least one Fin(Ai)d")
      return
    }

    updateFormData(selectedFinaids)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Fin(Ai)d Selection</h2>
        <p className="text-muted-foreground">
          Select the Fin(Ai)ds you want to connect to this client
          {accountingPackage && ` for ${accountingPackage.charAt(0).toUpperCase() + accountingPackage.slice(1)}`}
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {compatibleFinaids.map((finaid) => (
          <Card
            key={finaid.id}
            className={`cursor-pointer transition-colors ${
              selectedFinaids.includes(finaid.id) ? "border-primary" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle>{finaid.name}</CardTitle>
                </div>
                <Checkbox
                  checked={selectedFinaids.includes(finaid.id)}
                  onCheckedChange={() => handleToggleFinaid(finaid.id)}
                  id={`finaid-${finaid.id}`}
                />
              </div>
              <CardDescription>{finaid.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Features:</Label>
                <ul className="text-sm pl-5 list-disc">
                  {finaid.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button type="submit">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

