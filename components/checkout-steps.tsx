"use client"

import { CheckCircle, Circle } from "lucide-react"

interface CheckoutStep {
  id: number
  title: string
  status: "completed" | "active" | "pending"
}

interface CheckoutStepsProps {
  steps: CheckoutStep[]
}

export function CheckoutSteps({ steps }: CheckoutStepsProps) {
  return (
    <div className="relative py-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex flex-col items-center">
            {/* Step Circle */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mb-3 relative z-10">
              {step.status === "completed" ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : step.status === "active" ? (
                <Circle className="w-8 h-8 text-black fill-black" />
              ) : (
                <Circle className="w-8 h-8 text-gray-400" />
              )}
            </div>

            {/* Step Title */}
            <p
              className={`text-sm font-medium text-center ${
                step.status === "pending" ? "text-gray-500" : "text-gray-900"
              }`}
            >
              {step.title}
            </p>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-6 left-1/2 w-full h-1 -z-0 ${
                  step.status === "completed" ? "bg-green-600" : "bg-gray-200"
                }`}
                style={{ width: "calc(100% - 2rem)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
