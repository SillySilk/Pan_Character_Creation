// Background Generator — Central Casting table-driven background steps.
// Character sheet building (identity/skills/feats/equipment/languages) lives in
// DNDCharacterSheet.tsx; this wizard runs only after the sheet is ready.

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { useGenerationStore } from '../../stores/generationStore'
import { StreamlinedYouthSelector } from '../tables/youth/StreamlinedYouthSelector'
import { StreamlinedOccupationSelector } from '../tables/Occupations/StreamlinedOccupationSelector'
import { StreamlinedAdulthoodSelector } from '../tables/adulthood/StreamlinedAdulthoodSelector'
import { StreamlinedPersonalitySelector } from '../tables/Personality/StreamlinedPersonalitySelector'
import { MiscellaneousSelector } from '../tables/Miscellaneous'
import { ContactSelector } from '../tables/Contacts'
import { SpecialSelector } from '../tables/Special'
import { CharacterPreview } from '../ui/CharacterPreview'
import { PrintableCharacterSheet } from '../dnd/PrintableCharacterSheet'
import { UndoRedoManager } from './UndoRedoManager'
import { useGenerationHistory } from '../../hooks/useGenerationHistory'

interface GenerationWizardProps {
  onComplete?: () => void
  onCancel?: () => void
  className?: string
}

type GenerationStep =
  | 'youth'
  | 'occupations'
  | 'adulthood'
  | 'personality'
  | 'miscellaneous'
  | 'contacts'
  | 'special'
  | 'finalize'
  | 'complete'

interface StepConfig {
  id: GenerationStep
  title: string
  description: string
  icon: string
  component?: React.ComponentType<any>
}

// Phase grouping for the nav — purely visual, does not affect the state machine
const PHASES = [
  {
    id: 'early',
    label: 'Early Life',
    icon: '🌱',
    stepIds: ['youth', 'occupations', 'adulthood'],
  },
  {
    id: 'inner',
    label: 'Inner Life',
    icon: '💭',
    stepIds: ['personality', 'miscellaneous', 'contacts', 'special'],
  },
  {
    id: 'review',
    label: 'Review',
    icon: '✨',
    stepIds: ['finalize', 'complete'],
  },
] as const

// Single clickable step pill inside a phase card
function StepChip({
  step,
  status,
  canNavigate,
  onClick,
}: {
  step: StepConfig
  status: 'completed' | 'current' | 'pending'
  canNavigate: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={() => canNavigate && onClick()}
      disabled={!canNavigate}
      title={step.description}
      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
        status === 'completed'
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : status === 'current'
          ? 'bg-amber-200 text-amber-900 border border-amber-500 shadow-sm'
          : canNavigate
          ? 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
      }`}
    >
      <span className="text-sm">{step.icon}</span>
      <span>{step.title}</span>
      {status === 'completed' && <span className="text-green-600">✓</span>}
    </button>
  )
}

export function GenerationWizard({ onComplete, onCancel, className = '' }: GenerationWizardProps) {
  const [currentStep, setCurrentStep] = useState<GenerationStep>('youth')
  const [completedSteps, setCompletedSteps] = useState<Set<GenerationStep>>(new Set())
  const { character, createNewCharacter, finalizeCharacter } = useCharacterStore()
  const { 
    resetGeneration 
  } = useGenerationStore()
  
  const { saveToHistory } = useGenerationHistory({
    maxHistorySize: 50,
    enableKeyboardShortcuts: true,
    autoSave: true,
    debounceMs: 1000
  })

  const steps: StepConfig[] = [
    {
      id: 'youth',
      title: 'Youth Development',
      description: 'Childhood and adolescent experiences shape your character',
      icon: '🌱',
      component: StreamlinedYouthSelector
    },
    {
      id: 'occupations',
      title: 'Professional Training',
      description: 'Learn a trade that defines your skills and specialization',
      icon: '🔨',
      component: StreamlinedOccupationSelector
    },
    {
      id: 'adulthood',
      title: 'Life Experience',
      description: 'Major events that forge your mature character',
      icon: '🎭',
      component: StreamlinedAdulthoodSelector
    },
    {
      id: 'personality',
      title: 'Core Identity',
      description: 'The values and traits that define who you truly are',
      icon: '💭',
      component: StreamlinedPersonalitySelector
    },
    {
      id: 'miscellaneous',
      title: 'Special Events',
      description: 'Unusual encounters and circumstances',
      icon: '🌟'
    },
    {
      id: 'contacts',
      title: 'Relationships',
      description: 'Allies, enemies, and connections',
      icon: '👥'
    },
    {
      id: 'special',
      title: 'Special Items',
      description: 'Unique possessions and gifts',
      icon: '💎'
    },
    {
      id: 'finalize',
      title: 'Finalize',
      description: 'Review and complete character',
      icon: '✅'
    }
  ]

  useEffect(() => {
    // Initialize generation if starting fresh
    if (!character) {
      createNewCharacter()
    }
    
    // Generation wizard is now self-contained
  }, [])

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const getCurrentStepConfig = () => {
    return steps[getCurrentStepIndex()]
  }

  const handleStepComplete = () => {
    const currentIndex = getCurrentStepIndex()
    const newCompleted = new Set(completedSteps)
    newCompleted.add(currentStep)
    setCompletedSteps(newCompleted)

    // Save to history
    const currentStepConfig = getCurrentStepConfig()
    saveToHistory(
      'Step Complete',
      `Completed ${currentStepConfig.title}: ${currentStepConfig.description}`,
      { stepId: currentStep, stepIndex: currentIndex }
    )

    // Move to next step
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      setCurrentStep(nextStep.id)
    } else {
      // Generation complete
      setCurrentStep('complete')
      if (onComplete) {
        onComplete()
      }
    }
  }

  const handleStepNavigation = (stepId: GenerationStep) => {
    setCurrentStep(stepId)
  }

  const handleRestart = () => {
    resetGeneration()
    setCurrentStep('youth')
    setCompletedSteps(new Set())
  }

  const handleCancel = () => {
    if (window.confirm('Cancel character generation? All progress will be lost.')) {
      resetGeneration()
      if (onCancel) {
        onCancel()
      }
    }
  }

  const getStepStatus = (stepId: GenerationStep) => {
    if (completedSteps.has(stepId)) return 'completed'
    if (stepId === currentStep) return 'current'
    return 'pending'
  }

  const canNavigateToStep = (stepId: GenerationStep) => {
    const stepIndex = steps.findIndex(s => s.id === stepId)
    const currentIndex = getCurrentStepIndex()
    
    // Can navigate to current step, completed steps, or the next step
    return stepIndex <= currentIndex + 1 || completedSteps.has(stepId)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b-2 border-amber-600 shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎲</div>
              <div>
                <h1 className="text-2xl font-bold text-amber-800">Background Generator</h1>
                <p className="text-parchment-700">Roll your character's story through the Central Casting tables</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <UndoRedoManager 
                maxHistorySize={50}
                onUndo={(entry) => {
                  console.log('Undoing action:', entry.action)
                }}
                onRedo={(entry) => {
                  console.log('Redoing action:', entry.action)
                }}
              />
              <div className="h-6 w-px bg-gray-300" />
              <button
                onClick={handleRestart}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
              >
                🔄 Restart
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-amber-100 border-b border-amber-200">
        <div className="max-w-screen-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-800">
              Step {getCurrentStepIndex() + 1} of {steps.length}
            </span>
            <span className="text-sm text-amber-700">
              {Math.round((completedSteps.size / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2">
            <div 
              className="bg-amber-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Navigation - grouped into 3 phases */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 py-3">
          <div className="flex items-stretch gap-3">
            {PHASES.map(phase => {
              const phaseSteps = steps.filter(s => (phase.stepIds as readonly string[]).includes(s.id))
              if (phaseSteps.length === 0) return null
              const allDone = phaseSteps.every(s => getStepStatus(s.id) === 'completed')
              const anyCurrent = phaseSteps.some(s => getStepStatus(s.id) === 'current')
              const cardClasses = anyCurrent
                ? 'border-amber-500 bg-amber-50'
                : allDone
                ? 'border-green-400 bg-green-50'
                : 'border-parchment-300 bg-white'

              return (
                <div key={phase.id} className={`flex-1 rounded-lg border-2 px-3 py-2 ${cardClasses}`}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-base">{phase.icon}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                      {phase.label}
                    </span>
                    {allDone && <span className="text-green-600 text-xs ml-auto">✓ done</span>}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {phaseSteps.map(step => (
                      <StepChip
                        key={step.id}
                        step={step}
                        status={getStepStatus(step.id)}
                        canNavigate={canNavigateToStep(step.id)}
                        onClick={() => handleStepNavigation(step.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Persistent Character Preview - Mobile/Tablet View */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-amber-800 mb-2 list-none flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform">▶</span>
              Character Preview
            </summary>
            <div className="mt-2">
              <CharacterPreview character={character ?? {}} compact />
            </div>
          </details>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Step Content */}
            <div>
              {currentStep === 'youth' && (
                <div className="bg-white rounded-lg p-3">
                  <StreamlinedYouthSelector onStepComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'occupations' && (
                <div className="bg-white rounded-lg p-3">
                  <StreamlinedOccupationSelector onStepComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'adulthood' && (
                <div className="bg-white rounded-lg p-3">
                  <StreamlinedAdulthoodSelector onStepComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'personality' && (
                <div className="bg-white rounded-lg p-3">
                  <StreamlinedPersonalitySelector onStepComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'miscellaneous' && (
                <div className="bg-white rounded-lg p-3">
                  <MiscellaneousSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'contacts' && (
                <div className="bg-white rounded-lg p-3">
                  <ContactSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'special' && (
                <div className="bg-white rounded-lg p-3">
                  <SpecialSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'finalize' && (
                <div className="bg-white rounded-lg p-3">
                  <PrintableCharacterSheet onBack={() => setCurrentStep('special')} />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => { finalizeCharacter(); handleStepComplete() }}
                      className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium"
                    >
                      Finalize &amp; Complete Character
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 'complete' && (
                <CompleteStep onFinish={onComplete} />
              )}
            </div>

            {/* Character Preview Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pr-1">
                <CharacterPreview character={character ?? {}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



// Complete Step Component
function CompleteStep({ onFinish }: { onFinish?: () => void }) {
  const { character } = useCharacterStore()
  
  return (
    <div className="bg-white rounded-lg border-2 border-amber-600 p-8 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-amber-800 mb-4">Character Saved!</h2>
      <p className="text-parchment-700 text-lg mb-6">
        <span className="font-semibold">{character?.name || 'Your character'}</span> has been successfully saved to your character roster! 
        Their unique story and abilities are now preserved and ready for your adventures.
      </p>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center gap-2 text-amber-800 mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Finalization Complete</span>
        </div>
        <p className="text-amber-700 text-sm">
          Your character is now saved in your roster with completion timestamp and can be accessed anytime from the Character Library.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onFinish}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View Character Sheet
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Another Character
        </button>
      </div>
    </div>
  )
}