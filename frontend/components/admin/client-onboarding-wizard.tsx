"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ClientOnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    "Contact Information",
    "Company Details",
    "Accounting Method",
    "Accounting Package",
    "Fin(Ai)d Selection",
    "Advanced Setup",
  ]

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      router.push("/admin/clients")
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                index === currentStep ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-sm">{step}</span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">{steps[currentStep]}</h2>

        <p className="mb-6">
          This is step {currentStep + 1} of the onboarding process: {steps[currentStep]}
        </p>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={goToPreviousStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}

          <Button onClick={goToNextStep}>{currentStep < steps.length - 1 ? "Next" : "Complete"}</Button>
        </div>
      </Card>
    </div>
  )
}

