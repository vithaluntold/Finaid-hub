"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, Calculator } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export function AccountingMethodForm({ initialData, onUpdate, onNext }) {
  const [selectedMethod, setSelectedMethod] = useState(initialData || "")
  const [error, setError] = useState("")

  const handleMethodChange = (value) => {
    setSelectedMethod(value)
    setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedMethod) {
      setError("Please select an accounting method")
      return
    }

    onUpdate(selectedMethod)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Accounting Method</h3>
        <p className="text-sm text-muted-foreground">Select the accounting method used by this client</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Choose Method of Accounting</h4>
        </div>

        <RadioGroup
          value={selectedMethod}
          onValueChange={handleMethodChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className={`cursor-pointer border-2 ${selectedMethod === "cash" ? "border-primary" : ""}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cash" id="cash" />
                <CardTitle className="text-base">Cash Basis</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Records income when received and expenses when paid. Simpler method suitable for small businesses.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer border-2 ${selectedMethod === "accrual" ? "border-primary" : ""}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="accrual" id="accrual" />
                <CardTitle className="text-base">Accrual Basis</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Records income when earned and expenses when incurred. More accurate picture of financial position.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer border-2 ${selectedMethod === "hybrid" ? "border-primary" : ""}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <CardTitle className="text-base">Hybrid Method</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Combines elements of both cash and accrual methods. Used in specific situations.
              </CardDescription>
            </CardContent>
          </Card>
        </RadioGroup>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

