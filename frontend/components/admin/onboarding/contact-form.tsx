"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight } from "lucide-react"

interface ContactFormProps {
  onNext: () => void
  updateFormData: (data: any) => void
}

export function ContactForm({ onNext, updateFormData }: ContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    phone: "",
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    phone: "",
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
      valid = false
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
      valid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required"
      valid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">Contact Information</h2>
      <p className="text-muted-foreground">Enter the primary contact details for this client</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john.doe@example.com"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input id="position" name="position" value={formData.position} onChange={handleChange} placeholder="CFO" />
        {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

