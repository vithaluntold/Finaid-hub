"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AccountingSetupProps {
  onNext: () => void
  onBack: () => void
  updateFormData: (data: any) => void
}

export function AccountingSetup({ onNext, onBack, updateFormData }: AccountingSetupProps) {
  const [method, setMethod] = useState("")
  const [package_, setPackage] = useState("")
  const [error, setError] = useState("")

  const accountingMethods = [
    {
      value: "cash",
      label: "Cash Basis",
      description: "Records revenue when cash is received and expenses when cash is paid.",
    },
    {
      value: "accrual",
      label: "Accrual Basis",
      description: "Records revenue when earned and expenses when incurred, regardless of when cash changes hands.",
    },
    {
      value: "hybrid",
      label: "Hybrid Method",
      description: "Combines elements of both cash and accrual methods for different aspects of the business.",
    },
  ]

  const accountingPackages = [
    { value: "quickbooks", label: "QuickBooks" },
    { value: "zoho", label: "Zoho Books" },
    { value: "xero", label: "Xero" },
    { value: "freshbooks", label: "FreshBooks" },
    { value: "sap", label: "SAP" },
    { value: "netsuite", label: "NetSuite" },
    { value: "oracle", label: "Oracle" },
    { value: "sage", label: "Sage Accounting" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!method) {
      setError("Please select an accounting method")
      return
    }

    if (!package_) {
      setError("Please select an accounting package")
      return
    }

    updateFormData({
      method,
      package: package_,
    })

    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Accounting Setup</h2>
        <p className="text-muted-foreground">Select the accounting method and software package</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-4">
        <Label className="text-base">Accounting Method</Label>
        <RadioGroup value={method} onValueChange={setMethod} className="space-y-3">
          {accountingMethods.map((item) => (
            <div key={item.value} className="flex items-start space-x-2">
              <RadioGroupItem value={item.value} id={`method-${item.value}`} className="mt-1" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor={`method-${item.value}`} className="font-medium">
                  {item.label}
                </Label>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Accounting Package</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {accountingPackages.map((item) => (
            <Card
              key={item.value}
              className={`cursor-pointer transition-colors ${
                package_ === item.value ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setPackage(item.value)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  {item.label.charAt(0)}
                </div>
                <span className="font-medium text-center">{item.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
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

