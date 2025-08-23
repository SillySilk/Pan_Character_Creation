// Navigation Controls for PanCasting Generation Wizard

import React from 'react'

interface NavigationControlsProps {
  canGoBack: boolean
  canGoNext: boolean
  onBack?: () => void
  onNext?: () => void
  onSkip?: () => void
  nextLabel?: string
  backLabel?: string
  showSkip?: boolean
  isLoading?: boolean
  className?: string
}

export function NavigationControls({
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  onSkip,
  nextLabel = 'Next',
  backLabel = 'Back',
  showSkip = false,
  isLoading = false,
  className = ''
}: NavigationControlsProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Back Button */}
      <div>
        {canGoBack && onBack ? (
          <button
            onClick={onBack}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </button>
        ) : (
          <div></div>
        )}
      </div>

      {/* Center Actions */}
      <div className="flex items-center gap-3">
        {showSkip && onSkip && (
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip This Step
          </button>
        )}
      </div>

      {/* Next Button */}
      <div>
        {onNext && (
          <button
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                {nextLabel}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// Step Action Bar Component
interface StepActionBarProps {
  currentStep: number
  totalSteps: number
  onPrevious?: () => void
  onNext?: () => void
  onComplete?: () => void
  onCancel?: () => void
  canGoNext?: boolean
  isLastStep?: boolean
  isLoading?: boolean
  className?: string
}

export function StepActionBar({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete,
  onCancel,
  canGoNext = true,
  isLastStep = false,
  isLoading = false,
  className = ''
}: StepActionBarProps) {
  
  const isFirstStep = currentStep === 0
  
  return (
    <div className={`bg-gray-50 border-t border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left Side - Back Button */}
        <div>
          {!isFirstStep && onPrevious ? (
            <button
              onClick={onPrevious}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
          ) : (
            <div></div>
          )}
        </div>

        {/* Center - Step Indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
          )}
        </div>

        {/* Right Side - Next/Complete/Cancel */}
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
          
          {isLastStep && onComplete ? (
            <button
              onClick={onComplete}
              disabled={!canGoNext || isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Completing...
                </>
              ) : (
                <>
                  Complete
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          ) : onNext && (
            <button
              onClick={onNext}
              disabled={!canGoNext || isLoading}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Quick Navigation Component
interface QuickNavigationProps {
  steps: Array<{ id: string; title: string; icon: string }>
  currentStep: string
  completedSteps: Set<string>
  onStepClick: (stepId: string) => void
  canNavigateToStep: (stepId: string) => boolean
  className?: string
}

export function QuickNavigation({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  canNavigateToStep,
  className = ''
}: QuickNavigationProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">Quick Navigation</h3>
      <div className="grid grid-cols-2 gap-2">
        {steps.map(step => {
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = step.id === currentStep
          const canNavigate = canNavigateToStep(step.id)
          
          return (
            <button
              key={step.id}
              onClick={() => canNavigate && onStepClick(step.id)}
              disabled={!canNavigate}
              className={`flex items-center gap-2 p-2 rounded-md text-left text-sm transition-colors ${
                isCompleted
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : isCurrent
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : canNavigate
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              <span className="text-base">{step.icon}</span>
              <span className="flex-1 truncate">{step.title}</span>
              {isCompleted && (
                <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Navigation Breadcrumb Component
interface NavigationBreadcrumbProps {
  steps: Array<{ id: string; title: string; icon: string }>
  currentStep: string
  onStepClick: (stepId: string) => void
  canNavigateToStep: (stepId: string) => boolean
  className?: string
}

export function NavigationBreadcrumb({
  steps,
  currentStep,
  onStepClick,
  canNavigateToStep,
  className = ''
}: NavigationBreadcrumbProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep)
  const breadcrumbSteps = steps.slice(0, currentIndex + 1)
  
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {breadcrumbSteps.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
            <span className="hidden sm:inline">{step.title}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  )
}