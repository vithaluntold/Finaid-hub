"use client"

import { useState } from "react"
import { Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export function AccountingPackageForm({ initialData, onUpdate, onNext }) {
  const [selectedPackage, setSelectedPackage] = useState(initialData || "")
  const [error, setError] = useState("")

  const handlePackageSelect = (packageName) => {
    setSelectedPackage(packageName)
    setError("")

    // Update parent component state
    onUpdate(packageName)

    // Proceed to authentication
    onNext()
  }

  const accountingPackages = [
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Popular accounting software for small to medium businesses",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "zoho",
      name: "Zoho Books",
      description: "Cloud-based accounting software for growing businesses",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "xero",
      name: "Xero",
      description: "Online accounting software with powerful features",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "freshbooks",
      name: "FreshBooks",
      description: "Cloud accounting software designed for small business owners",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "sap",
      name: "SAP",
      description: "Enterprise resource planning software for large businesses",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "netsuite",
      name: "NetSuite",
      description: "Cloud-based business management suite",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "oracle",
      name: "Oracle",
      description: "Comprehensive financial management solution",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "sage",
      name: "Sage Accounting",
      description: "Accounting and business management software",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Accounting Package</h3>
        <p className="text-sm text-muted-foreground">Select the accounting package used by this client</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Choose Accounting Package</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accountingPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handlePackageSelect(pkg.name)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-3 flex items-center justify-center">
                  <img src={pkg.logo || "/placeholder.svg"} alt={pkg.name} className="max-w-full max-h-full" />
                </div>
                <CardTitle className="text-base mb-1">{pkg.name}</CardTitle>
                <CardDescription className="text-xs">{pkg.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Clicking on an accounting package will open the authentication page in a new tab. After authentication, you
          will be redirected back to continue the onboarding process.
        </p>
      </div>
    </div>
  )
}

