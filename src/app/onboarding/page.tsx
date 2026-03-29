'use client'

import { useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { AccountStep } from '@/components/onboarding/account-step'
import { RanchStep } from '@/components/onboarding/ranch-step'
import { SpeciesStep } from '@/components/onboarding/species-step'
import { CorralesStep } from '@/components/onboarding/corrales-step'
import { CompletionStep } from '@/components/onboarding/completion-step'

const STEPS = [
  { title: 'Tu cuenta', description: 'Información personal' },
  { title: 'Tu rancho', description: 'Datos de tu unidad productiva' },
  { title: 'Tus especies', description: 'Selecciona las especies que manejas' },
  { title: 'Tus corrales', description: 'Configura tus instalaciones' },
  { title: '¡Listo!', description: 'Todo configurado' },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<Record<string, any>>({})

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleNext = (stepData?: Record<string, any>) => {
    if (stepData) {
      setData((prev) => ({ ...prev, ...stepData }))
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-2xl font-bold">HatoAI</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Paso {currentStep + 1} de {STEPS.length}: {STEPS[currentStep].title}
          </p>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Steps */}
        {currentStep === 0 && <AccountStep onNext={handleNext} />}
        {currentStep === 1 && <RanchStep onNext={handleNext} onBack={handleBack} />}
        {currentStep === 2 && <SpeciesStep onNext={handleNext} onBack={handleBack} />}
        {currentStep === 3 && <CorralesStep onNext={handleNext} onBack={handleBack} />}
        {currentStep === 4 && <CompletionStep data={data} />}
      </div>
    </div>
  )
}
