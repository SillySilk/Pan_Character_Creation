// Wizard Layout Component for PanCasting

import React from 'react'
import { CharacterSummary } from '../character/CharacterSummary'
import { StepNavigation, StepProgress } from './StepNavigation'
import { ProgressTracker } from './ProgressTracker'
import { NavigationControls } from './NavigationControls'

interface Step {
  id: string
  title: string
  description: string
  icon: string
}

interface WizardLayoutProps {
  steps: Step[]
  currentStep: string
  completedSteps: Set<string>
  onStepClick: (stepId: string) => void
  canNavigateToStep: (stepId: string) => boolean
  onRestart?: () => void
  onCancel?: () => void
  onNext?: () => void
  onBack?: () => void
  canGoNext?: boolean
  canGoBack?: boolean
  children: React.ReactNode
  showCharacterSummary?: boolean
  showNavigationControls?: boolean
  className?: string
}

export function WizardLayout({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  canNavigateToStep,
  onRestart,
  onCancel,
  onNext,
  onBack,
  canGoNext = true,
  canGoBack = true,
  children,
  showCharacterSummary = true,
  showNavigationControls = true,
  className = ''
}: WizardLayoutProps) {
  
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const getCurrentStep = () => {
    return steps[getCurrentStepIndex()]
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b-2 border-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎲</div>
              <div>
                <h1 className="text-2xl font-bold text-amber-800">PanCasting Generator</h1>
                <p className="text-parchment-700">Create your character's unique story</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {onRestart && (
                <button
                  onClick={onRestart}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
                  title="Restart Generation"
                >
                  🔄 Restart
                </button>
              )}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <StepProgress
        totalSteps={steps.length}
        completedSteps={completedSteps.size}
        currentStepIndex={getCurrentStepIndex()}
      />

      {/* Step Navigation */}
      <StepNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={onStepClick}
        canNavigateToStep={canNavigateToStep}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className={`grid ${showCharacterSummary ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {/* Step Content */}
            <div className={showCharacterSummary ? 'lg:col-span-2' : 'col-span-1'}>
              {/* Step Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{getCurrentStep()?.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-amber-800">
                      {getCurrentStep()?.title}
                    </h2>
                    <p className="text-parchment-700">
                      {getCurrentStep()?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[500px]">
                {children}
              </div>

              {/* Navigation Controls */}
              {showNavigationControls && (onNext || onBack) && (
                <div className="mt-6">
                  <NavigationControls
                    canGoBack={canGoBack}
                    canGoNext={canGoNext}
                    onBack={onBack}
                    onNext={onNext}
                  />
                </div>
              )}
            </div>

            {/* Character Summary Sidebar */}
            {showCharacterSummary && (
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                  <CharacterSummary showFullDetails={false} />
                  
                  {/* Enhanced Progress Tracker */}
                  <ProgressTracker
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    totalSteps={steps.length}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <span>PanCasting Character Generator</span>
              <span>•</span>
              <span>Powered by Central Casting Tables</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600">🎲</span>
              <span>Step {getCurrentStepIndex() + 1} of {steps.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wizard Step Container Component
interface WizardStepProps {
  title?: string
  description?: string
  icon?: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function WizardStep({ 
  title, 
  description, 
  icon, 
  children, 
  actions, 
  className = '' 
}: WizardStepProps) {
  return (
    <div className={`bg-white rounded-lg border-2 border-amber-600 overflow-hidden ${className}`}>
      {/* Step Header */}
      {(title || description || icon) && (
        <div className="bg-amber-50 border-b border-amber-200 p-6">
          <div className="flex items-center gap-3">
            {icon && <span className="text-3xl">{icon}</span>}
            <div>
              {title && <h3 className="text-xl font-bold text-amber-800">{title}</h3>}
              {description && <p className="text-parchment-700 mt-1">{description}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="p-6">
        {children}
      </div>

      {/* Step Actions */}
      {actions && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end gap-3">
            {actions}
          </div>
        </div>
      )}
    </div>
  )
}