// Generation Wizard Component for PanCasting

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { useGenerationStore } from '../../stores/generationStore'
import { RaceSelector } from '../tables/heritage'
import { YouthEventSelector } from '../tables/youth'
import { OccupationSelector } from '../tables/Occupations'
import { AdulthoodEventSelector } from '../tables/adulthood'
import { PersonalitySelector } from '../tables/Personality'
import { StreamlinedYouthSelector } from '../tables/youth/StreamlinedYouthSelector'
import { StreamlinedOccupationSelector } from '../tables/occupations/StreamlinedOccupationSelector'
import { StreamlinedAdulthoodSelector } from '../tables/adulthood/StreamlinedAdulthoodSelector'
import { StreamlinedPersonalitySelector } from '../tables/personality/StreamlinedPersonalitySelector'
import { MiscellaneousSelector } from '../tables/Miscellaneous'
import { ContactSelector } from '../tables/Contacts'
import { SpecialSelector } from '../tables/Special'
import { MarkdownCharacterViewer } from '../character/MarkdownCharacterViewer'
import { ClassSelector } from '../dnd/ClassSelector'
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
  | 'class'
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
      id: 'class',
      title: 'D&D Class Selection',
      description: 'Choose your character class for D&D 3.5',
      icon: '⚔️',
      component: ClassSelector
    },
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
          <MarkdownCharacterViewer 
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
                  <StreamlinedYouthSelector onStepComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'occupations' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <StreamlinedOccupationSelector onStepComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'adulthood' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <StreamlinedAdulthoodSelector onStepComplete={handleStepComplete} />
                </div>
              )}
              
              {currentStep === 'personality' && (
                <div className="bg-white rounded-lg border-2 border-amber-600 p-6">
                  <StreamlinedPersonalitySelector onStepComplete={handleStepComplete} />
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
                <MarkdownCharacterViewer 
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
  const { character, rollAbilityScores } = useCharacterStore()
  const [statsRolled, setStatsRolled] = useState(false)
  
  // Check if stats have been rolled
  useEffect(() => {
    if (character && character.strength && character.dexterity && character.constitution && 
        character.intelligence && character.wisdom && character.charisma) {
      setStatsRolled(true)
    }
  }, [character])
  
  const handleRollStats = () => {
    rollAbilityScores()
    setStatsRolled(true)
  }
  
  return (
    <div className="bg-white rounded-lg border-2 border-amber-600 p-8 text-center">
      <div className="text-6xl mb-6">🎭</div>
      <h2 className="text-3xl font-bold text-amber-800 mb-4">Welcome to PanCasting</h2>
      <p className="text-parchment-700 text-lg mb-6 max-w-2xl mx-auto">
        Create a unique character with a rich backstory through table-driven generation. 
        Watch as dice rolls shape your character's life experiences, creating balanced strengths 
        and limitations that tell a compelling story.
      </p>

      {/* Character Creation Philosophy */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-emerald-800 mb-3">🎲 Balanced Character Development</h3>
        <div className="text-left max-w-2xl mx-auto">
          <div className="text-sm text-emerald-700 space-y-2">
            <p className="font-medium">Every roll shapes your character's unique story:</p>
            <ul className="space-y-1 text-xs ml-4">
              <li>• <strong>Realistic Tradeoffs:</strong> Specialization creates both strengths and limitations</li>
              <li>• <strong>Emergent Narrative:</strong> Random events build meaningful character backgrounds</li>
              <li>• <strong>Balanced Growth:</strong> No overpowered characters - every strength has a cost</li>
              <li>• <strong>Dice-Driven:</strong> Embrace the excitement of random generation</li>
            </ul>
          </div>
        </div>
      </div>
      
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
      
      {/* Step 1: Roll Stats (Primary Action) */}
      {!statsRolled ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-3">🎲 Step 1: Roll Your Character's Abilities</h3>
            <p className="text-blue-700 text-sm mb-4">
              Start by rolling your character's six ability scores (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma). 
              These form the foundation of your character and determine their natural talents and limitations.
            </p>
            <button
              onClick={handleRollStats}
              className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
            >
              🎲 Roll Ability Scores (3d6 each)
            </button>
          </div>
          <p className="text-gray-600 text-sm">Roll your stats first to begin character creation</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Show rolled stats */}
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">✅ Ability Scores Rolled!</h3>
            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div><strong>STR:</strong> {character?.strength || 0}</div>
              <div><strong>DEX:</strong> {character?.dexterity || 0}</div>
              <div><strong>CON:</strong> {character?.constitution || 0}</div>
              <div><strong>INT:</strong> {character?.intelligence || 0}</div>
              <div><strong>WIS:</strong> {character?.wisdom || 0}</div>
              <div><strong>CHA:</strong> {character?.charisma || 0}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRollStats}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                🎲 Re-roll Stats
              </button>
              <button
                onClick={onNext}
                className="flex-1 px-8 py-3 bg-amber-600 text-white rounded-lg text-lg font-medium hover:bg-amber-700 transition-colors"
              >
                Begin Character Creation →
              </button>
            </div>
          </div>
        </div>
      )}
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
  const { character, finalizeCharacter, getCharacterSummary } = useCharacterStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [finalizationError, setFinalizationError] = useState<string | null>(null)
  
  const handleFinalize = async () => {
    if (!character) return
    
    setIsProcessing(true)
    setFinalizationError(null)
    
    try {
      const success = finalizeCharacter()
      
      if (success) {
        console.log('🎉 Character successfully finalized and added to roster')
        onComplete()
      } else {
        setFinalizationError('Failed to finalize character. Please try again.')
      }
    } catch (error) {
      console.error('Finalization error:', error)
      setFinalizationError('An unexpected error occurred during finalization.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const getCompletionStats = () => {
    if (!character) return { completed: 0, total: 8 }
    
    let completed = 0
    const total = 8
    
    if (character.race?.name) completed++
    if (character.youthEvents?.length > 0) completed++
    if (character.occupations?.length > 0) completed++
    if (character.adulthoodEvents?.length > 0) completed++
    if (character.personalityTraits && (
      character.personalityTraits.lightside?.length > 0 ||
      character.personalityTraits.neutral?.length > 0 ||
      character.personalityTraits.darkside?.length > 0
    )) completed++
    if (character.miscellaneousEvents?.length > 0) completed++
    if ((character.npcs?.length || 0) + (character.companions?.length || 0) + (character.rivals?.length || 0) > 0) completed++
    if ((character.gifts?.length || 0) + (character.legacies?.length || 0) + (character.specialItems?.length || 0) > 0) completed++
    
    return { completed, total }
  }
  
  const { completed, total } = getCompletionStats()
  const completionPercentage = Math.round((completed / total) * 100)
  
  return (
    <div className="bg-white rounded-lg border-2 border-green-600 p-8">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🏁</div>
        <h2 className="text-3xl font-bold text-green-800 mb-4">Character Complete!</h2>
        <p className="text-green-700 mb-6">
          Your character's story has been generated. Review their details and finalize to save to your character roster.
        </p>
      </div>
      
      <div className="bg-green-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-green-800 mb-3">Character Summary</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="font-medium">Name:</span> {character?.name || 'Unnamed Character'}
          </div>
          <div>
            <span className="font-medium">Race:</span> {character?.race?.name || 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Culture:</span> {character?.culture?.name || 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Social Status:</span> {character?.socialStatus?.level || 'Unknown'}
          </div>
        </div>
        
        {/* Completion Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-800">Generation Progress</span>
            <span className="text-sm text-green-700">{completionPercentage}% Complete</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-xs text-green-600 mt-1">
            {completed} of {total} generation steps completed
          </div>
        </div>
        
        {/* Character Summary */}
        <div className="text-xs text-gray-600">
          {getCharacterSummary()}
        </div>
      </div>
      
      {finalizationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Finalization Error</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{finalizationError}</p>
        </div>
      )}
      
      <div className="text-center">
        <button
          onClick={handleFinalize}
          disabled={isProcessing}
          className={`px-8 py-3 rounded-lg text-lg font-medium transition-colors ${
            isProcessing
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Finalizing...
            </div>
          ) : (
            'Save to Character Roster'
          )}
        </button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          This will save your character to your personal roster where you can view, edit, and export them later.
        </p>
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