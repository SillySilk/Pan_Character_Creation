// Step Navigation Component for PanCasting Generation Wizard

import React from 'react'

interface Step {
  id: string
  title: string
  description: string
  icon: string
}

interface StepNavigationProps {
  steps: Step[]
  currentStep: string
  completedSteps: Set<string>
  onStepClick: (stepId: string) => void
  canNavigateToStep: (stepId: string) => boolean
  className?: string
}

export function StepNavigation({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  canNavigateToStep,
  className = ''
}: StepNavigationProps) {
  
  const getStepStatus = (stepId: string) => {
    if (completedSteps.has(stepId)) return 'completed'
    if (stepId === currentStep) return 'current'
    return 'pending'
  }

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Desktop Navigation */}
      <div className="hidden md:block overflow-x-auto">
        <div className="flex space-x-1 p-2 min-w-max">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const canNavigate = canNavigateToStep(step.id)
            
            return (
              <button
                key={step.id}
                onClick={() => canNavigate && onStepClick(step.id)}
                disabled={!canNavigate}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap min-w-0 ${
                  status === 'completed'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : status === 'current'
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-400'
                    : canNavigate
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="text-lg flex-shrink-0">{step.icon}</span>
                <span className="truncate">{step.title}</span>
                {status === 'completed' && <span className="text-green-600 flex-shrink-0">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{steps[getCurrentStepIndex()]?.icon}</span>
            <div>
              <h2 className="font-semibold text-gray-800">
                {steps[getCurrentStepIndex()]?.title}
              </h2>
              <p className="text-sm text-gray-600">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </p>
            </div>
          </div>
          
          {/* Mobile Step Indicator */}
          <div className="flex items-center gap-1">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full ${
                  getStepStatus(step.id) === 'completed'
                    ? 'bg-green-500'
                    : getStepStatus(step.id) === 'current'
                    ? 'bg-amber-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Progress Bar Component
interface StepProgressProps {
  totalSteps: number
  completedSteps: number
  currentStepIndex: number
  className?: string
}

export function StepProgress({ 
  totalSteps, 
  completedSteps, 
  currentStepIndex, 
  className = '' 
}: StepProgressProps) {
  const progressPercentage = (completedSteps / totalSteps) * 100
  
  return (
    <div className={`bg-amber-100 border-b border-amber-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-amber-800">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <span className="text-sm text-amber-700">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-amber-200 rounded-full h-2">
          <div 
            className="bg-amber-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Breadcrumb Navigation Component
interface BreadcrumbProps {
  steps: Step[]
  currentStep: string
  onStepClick: (stepId: string) => void
  canNavigateToStep: (stepId: string) => boolean
  className?: string
}

export function StepBreadcrumb({
  steps,
  currentStep,
  onStepClick,
  canNavigateToStep,
  className = ''
}: BreadcrumbProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep)
  const breadcrumbSteps = steps.slice(0, currentIndex + 1)
  
  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {breadcrumbSteps.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 && (
            <span className="text-gray-400">→</span>
          )}
          <button
            onClick={() => canNavigateToStep(step.id) && onStepClick(step.id)}
            disabled={!canNavigateToStep(step.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              step.id === currentStep
                ? 'bg-amber-100 text-amber-800 font-medium'
                : canNavigateToStep(step.id)
                ? 'text-blue-600 hover:bg-blue-50'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{step.icon}</span>
            <span>{step.title}</span>
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}