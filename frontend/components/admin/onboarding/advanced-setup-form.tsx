"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, BanknoteIcon as Bank, FileText, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdvancedSetupForm({ initialData, onUpdate, onNext }) {
  const [formData, setFormData] = useState({
    bankSync: initialData?.bankSync || false,
    automaticReports: initialData?.automaticReports || false,
    dataBackup: initialData?.dataBackup || false,
    reportFrequency: initialData?.reportFrequency || "monthly",
    backupFrequency: initialData?.backupFrequency || "weekly",
  })

  const handleToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Advanced Setup</h3>
        <p className="text-sm text-muted-foreground">Configure advanced features for this client</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Bank className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Bank Sync</CardTitle>
                  <CardDescription>Automatically sync transactions from bank accounts</CardDescription>
                </div>
              </div>
              <Switch checked={formData.bankSync} onCheckedChange={() => handleToggle("bankSync")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Automatic Reports</CardTitle>
                  <CardDescription>Generate and send reports automatically</CardDescription>
                </div>
              </div>
              <Switch checked={formData.automaticReports} onCheckedChange={() => handleToggle("automaticReports")} />
            </div>

            {formData.automaticReports && (
              <div className="mt-4 pl-10">
                <Label htmlFor="reportFrequency" className="mb-2 block">
                  Report Frequency
                </Label>
                <Select
                  value={formData.reportFrequency}
                  onValueChange={(value) => handleSelectChange("reportFrequency", value)}
                >
                  <SelectTrigger id="reportFrequency" className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Data Backup</CardTitle>
                  <CardDescription>Automatically backup client data</CardDescription>
                </div>
              </div>
              <Switch checked={formData.dataBackup} onCheckedChange={() => handleToggle("dataBackup")} />
            </div>

            {formData.dataBackup && (
              <div className="mt-4 pl-10">
                <Label htmlFor="backupFrequency" className="mb-2 block">
                  Backup Frequency
                </Label>
                <Select
                  value={formData.backupFrequency}
                  onValueChange={(value) => handleSelectChange("backupFrequency", value)}
                >
                  <SelectTrigger id="backupFrequency" className="w-full">
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
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Complete Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

