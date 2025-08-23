// Generation Wizard Component for PanCasting

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { useGenerationStore } from '../../stores/generationStore'
import { RaceSelector } from '../tables/heritage'
import { YouthEventSelector } from '../tables/youth'
import { OccupationSelector } from '../tables/Occupations'
import { AdulthoodEventSelector } from '../tables/adulthood'
import { PersonalitySelector } from '../tables/Personality'
import { MiscellaneousSelector } from '../tables/Miscellaneous'
import { ContactSelector } from '../tables/Contacts'
import { SpecialSelector } from '../tables/Special'
import { ComprehensiveCharacterSheet } from '../character/ComprehensiveCharacterSheet'
import { UndoRedoManager } from './UndoRedoManager'
import { useGenerationHistory } from '../../hooks/useGenerationHistory'

interface GenerationWizardProps {
  onComplete?: () => void
  onCancel?: () => void
  className?: string
}

type GenerationStep = 
  | 'welcome'
  | 'heritage'
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

export function GenerationWizard({ onComplete, onCancel, className = '' }: GenerationWizardProps) {
  const [currentStep, setCurrentStep] = useState<GenerationStep>('welcome')
  const [completedSteps, setCompletedSteps] = useState<Set<GenerationStep>>(new Set())
  const { character, createNewCharacter } = useCharacterStore()
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
      id: 'welcome',
      title: 'Welcome',
      description: 'Begin your character\'s journey',
      icon: '🌟'
    },
    {
      id: 'heritage',
      title: 'Heritage & Birth',
      description: 'Determine race and cultural background',
      icon: '🏰',
      component: RaceSelector
    },
    {
      id: 'youth',
      title: 'Youth Events',
      description: 'Childhood and adolescent experiences',
      icon: '🌱',
      component: YouthEventSelector
    },
    {
      id: 'occupations',
      title: 'Training & Skills',
      description: 'Apprenticeships and professional development',
      icon: '⚔️',
      component: OccupationSelector
    },
    {
      id: 'adulthood',
      title: 'Adult Life',
      description: 'Major life events and experiences',
      icon: '🎭',
      component: AdulthoodEventSelector
    },
    {
      id: 'personality',
      title: 'Values & Beliefs',
      description: 'Core personality and motivations',
      icon: '💭'
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
    createNewCharacter()
    setCurrentStep('welcome')
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
        <div className="max-w-7xl mx-auto px-4 py-3">
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

      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 py-2">
            {steps.map((step, _index) => {
              const status = getStepStatus(step.id)
              const canNavigate = canNavigateToStep(step.id)
              
              return (
                <button
                  key={step.id}
                  onClick={() => canNavigate && handleStepNavigation(step.id)}
                  disabled={!canNavigate}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    status === 'completed'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : status === 'current'
                      ? 'bg-amber-100 text-amber-800 border-2 border-amber-400'
                      : canNavigate
                      ? 'text-gray-600 hover:bg-gray-100'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="text-lg">{step.icon}</span>
                  <span>{step.title}</span>
                  {status === 'completed' && <span className="text-green-600">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Persistent Character Sheet - Mobile/Tablet View */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ComprehensiveCharacterSheet 
            collapsible={true}
            className="mb-0"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Step Content */}
            <div className="lg:col-span-2">
              {currentStep === 'welcome' && (
                <WelcomeStep onNext={handleStepComplete} />
              )}
              
              {currentStep === 'heritage' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <RaceSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'youth' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  {console.log('🟡 Rendering YouthEventSelector, currentStep:', currentStep)}
                  <YouthEventSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'occupations' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <OccupationSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'adulthood' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <AdulthoodEventSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'personality' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <PersonalitySelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'miscellaneous' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <MiscellaneousSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'contacts' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <ContactSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'special' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <SpecialSelector onComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'finalize' && (
                <FinalizeStep onComplete={handleStepComplete} />
              )}
              
              {currentStep === 'complete' && (
                <CompleteStep onFinish={onComplete} />
              )}
            </div>

            {/* Character Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <ComprehensiveCharacterSheet 
                  collapsible={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Welcome Step Component
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="bg-white rounded-lg border-2 border-amber-600 p-8 text-center">
      <div className="text-6xl mb-6">🎭</div>
      <h2 className="text-3xl font-bold text-amber-800 mb-4">Welcome to PanCasting</h2>
      <p className="text-parchment-700 text-lg mb-6 max-w-2xl mx-auto">
        Create a unique character with a rich backstory using comprehensive character generation tables. 
        Each roll shapes your character's personality, skills, and life experiences, creating someone 
        truly memorable for your adventures.
      </p>
      
      <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl mb-2">🏰</div>
          <h3 className="font-semibold text-blue-800 mb-1">Rich Heritage</h3>
          <p className="text-blue-600 text-sm">Determine race, culture, and birth circumstances</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl mb-2">⚔️</div>
          <h3 className="font-semibold text-green-800 mb-1">Life Events</h3>
          <p className="text-green-600 text-sm">Experience formative events from youth to adulthood</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl mb-2">🎲</div>
          <h3 className="font-semibold text-purple-800 mb-1">Random Generation</h3>
          <p className="text-purple-600 text-sm">Let the dice create surprising and memorable characters</p>
        </div>
      </div>
      
      <button
        onClick={onNext}
        className="px-8 py-3 bg-amber-600 text-white rounded-lg text-lg font-medium hover:bg-amber-700 transition-colors"
      >
        Begin Character Creation
      </button>
    </div>
  )
}

// Placeholder Step Component for incomplete sections
function PlaceholderStep({ step, onNext }: { step: StepConfig; onNext: () => void }) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 p-8 text-center">
      <div className="text-6xl mb-4">{step.icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h2>
      <p className="text-gray-600 mb-6">{step.description}</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 text-sm">
          This section is not yet implemented. Click Continue to proceed to the next step.
        </p>
      </div>
      <button
        onClick={onNext}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Continue
      </button>
    </div>
  )
}

// Finalize Step Component
function FinalizeStep({ onComplete }: { onComplete: () => void }) {
  const { character } = useCharacterStore()
  
  return (
    <div className="bg-white rounded-lg border-2 border-green-600 p-8">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🏁</div>
        <h2 className="text-3xl font-bold text-green-800 mb-4">Character Complete!</h2>
        <p className="text-green-700 mb-6">
          Your character's story has been generated. Review their details and finalize when ready.
        </p>
      </div>
      
      <div className="bg-green-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-green-800 mb-3">Character Summary</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span> {character?.name || 'Unnamed Character'}
          </div>
          <div>
            <span className="font-medium">Race:</span> {character?.race?.name || 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Personality Traits:</span> {character?.personalityTraits?.length || 0}
          </div>
          <div>
            <span className="font-medium">Skills:</span> {character?.skills ? Object.keys(character.skills).length : 0}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
        >
          Finalize Character
        </button>
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
      <h2 className="text-3xl font-bold text-amber-800 mb-4">Generation Complete!</h2>
      <p className="text-parchment-700 text-lg mb-6">
        <span className="font-semibold">{character?.name || 'Your character'}</span> is ready for adventure! 
        Their unique story and abilities have been shaped through comprehensive character generation.
      </p>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={onFinish}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          View Character Sheet
        </button>
      </div>
    </div>
  )
}