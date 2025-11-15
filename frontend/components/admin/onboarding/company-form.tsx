"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft, ChevronRight, Mail } from "lucide-react"

interface CompanyFormProps {
  onNext: () => void
  onBack: () => void
  updateFormData: (data: any) => void
}

export function CompanyForm({ onNext, onBack, updateFormData }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    natureOfBusiness: "",
    inviteSent: false,
  })

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    natureOfBusiness: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required"
      valid = false
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
      valid = false
    }

    if (!formData.natureOfBusiness.trim()) {
      newErrors.natureOfBusiness = "Nature of business is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      updateFormData(formData)
      onNext()
    }
  }

  const sendInvite = () => {
    if (validateForm()) {
      setFormData((prev) => ({
        ...prev,
        inviteSent: true,
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">Company Details</h2>
      <p className="text-muted-foreground">Enter the company information and send an invitation</p>

      {formData.inviteSent && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Invitation sent successfully! The company will be marked as inactive until they accept.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Company Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Acme Corporation" />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Company Address</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Business St, Suite 100, City, State, ZIP"
          rows={3}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="natureOfBusiness">Nature of Business</Label>
        <Input
          id="natureOfBusiness"
          name="natureOfBusiness"
          value={formData.natureOfBusiness}
          onChange={handleChange}
          placeholder="Technology, Manufacturing, Retail, etc."
        />
        {errors.natureOfBusiness && <p className="text-sm text-red-500">{errors.natureOfBusiness}</p>}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-x-2">
          {!formData.inviteSent && (
            <Button type="button" variant="outline" onClick={sendInvite}>
              <Mail className="mr-2 h-4 w-4" />
              Send Invite
            </Button>
          )}

          <Button type="submit">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}

