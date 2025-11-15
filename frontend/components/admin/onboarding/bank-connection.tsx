"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft, CheckCircle2 } from "lucide-react"

interface BankConnectionProps {
  onComplete: () => void
  onBack: () => void
  updateFormData: (data: any) => void
}

export function BankConnection({ onComplete, onBack, updateFormData }: BankConnectionProps) {
  const [formData, setFormData] = useState({
    bankSync: false,
    automaticReports: false,
    reportFrequency: "monthly",
    dataBackup: false,
    backupFrequency: "weekly",
  })

  const handleToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateFormData(formData)
    // Use the onComplete prop to navigate, not directly to a specific client
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Advanced Setup</h2>
        <p className="text-muted-foreground">Configure additional features for this client</p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          <CheckCircle2 className="h-4 w-4 inline mr-2" />
          Authentication successful! Now you can set up advanced features.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Bank Synchronization</CardTitle>
          <CardDescription>Automatically sync transactions from the client's bank accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="bank-sync" className="flex flex-col space-y-1">
              <span>Enable Bank Sync</span>
              <span className="font-normal text-sm text-muted-foreground">Transactions will be imported daily</span>
            </Label>
            <Switch id="bank-sync" checked={formData.bankSync} onCheckedChange={() => handleToggle("bankSync")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automatic Reports</CardTitle>
          <CardDescription>Generate and send reports automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-reports" className="flex flex-col space-y-1">
              <span>Enable Automatic Reports</span>
              <span className="font-normal text-sm text-muted-foreground">
                Financial reports will be generated and sent automatically
              </span>
            </Label>
            <Switch
              id="auto-reports"
              checked={formData.automaticReports}
              onCheckedChange={() => handleToggle("automaticReports")}
            />
          </div>

          {formData.automaticReports && (
            <div className="flex items-center space-x-4">
              <Label htmlFor="report-frequency" className="min-w-[120px]">
                Report Frequency
              </Label>
              <Select
                value={formData.reportFrequency}
                onValueChange={(value) => handleChange("reportFrequency", value)}
              >
                <SelectTrigger id="report-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Backup</CardTitle>
          <CardDescription>Automatically backup client data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="data-backup" className="flex flex-col space-y-1">
              <span>Enable Data Backup</span>
              <span className="font-normal text-sm text-muted-foreground">
                Client data will be backed up automatically
              </span>
            </Label>
            <Switch id="data-backup" checked={formData.dataBackup} onCheckedChange={() => handleToggle("dataBackup")} />
          </div>

          {formData.dataBackup && (
            <div className="flex items-center space-x-4">
              <Label htmlFor="backup-frequency" className="min-w-[120px]">
                Backup Frequency
              </Label>
              <Select
                value={formData.backupFrequency}
                onValueChange={(value) => handleChange("backupFrequency", value)}
              >
                <SelectTrigger id="backup-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button type="submit">Complete Onboarding</Button>
      </div>
    </form>
  )
}

