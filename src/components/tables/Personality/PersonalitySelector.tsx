// Personality & Values Selection Component - Simplified to follow Youth pattern

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { PersonalityTable } from './PersonalityTable'

interface PersonalitySelectorProps {
  onComplete?: () => void
}

export function PersonalitySelector({ onComplete }: PersonalitySelectorProps) {
  const [selectedCoreValues, setSelectedCoreValues] = useState<any>(null)
  const [selectedPersonalityTraits, setSelectedPersonalityTraits] = useState<any>(null)
  const [showContinueButton, setShowContinueButton] = useState(false)
  
  const { character, updateCharacter } = useCharacterStore()
  const { nextStep } = useGenerationStore()

  // Simplified: just two tables
  const tables = [
    { id: '501', name: 'Core Values', category: 'values' },
    { id: '502', name: 'Personality Traits', category: 'traits' }
  ]

  // Check if character already has personality values (state restoration)
  useEffect(() => {
    console.log('🟡 PersonalitySelector: Character check:', { 
      values: character.values,
      personalityTraits: character.personalityTraits
    })
    
    if (character.values) {
      console.log('🟡 PersonalitySelector: Setting selected core values:', character.values)
      setSelectedCoreValues({ result: character.values.mostValuedConcept || 'Core Values Selected', ...character.values })
    }
    
    if (character.personalityTraits && character.personalityTraits.length > 0) {
      const trait = character.personalityTraits[0]
      console.log('🟡 PersonalitySelector: Setting selected personality traits:', trait)
      setSelectedPersonalityTraits({ result: trait.name || trait.result, ...trait })
    }
  }, [character])

  const handleCoreValuesSelection = (result: any) => {
    console.log('🏁 PersonalitySelector: Core values selection result:', result)
    setSelectedCoreValues(result.entry)
    
    // Update character with core values
    if (result.character) {
      console.log('🔄 PersonalitySelector: Updating character with core values:', result.character)
      updateCharacter(result.character)
    }
  }

  const handlePersonalityTraitsSelection = (result: any) => {
    console.log('🏁 PersonalitySelector: Personality traits selection result:', result)
    setSelectedPersonalityTraits(result.entry)
    
    // Update character with personality traits
    if (result.character) {
      console.log('🔄 PersonalitySelector: Updating character with personality traits:', result.character)
      updateCharacter(result.character)
    }
    
    setShowContinueButton(true)
  }

  // Check if all personality aspects are complete
  useEffect(() => {
    if (selectedCoreValues && selectedPersonalityTraits) {
      setShowContinueButton(true)
    } else {
      setShowContinueButton(false)
    }
  }, [selectedCoreValues, selectedPersonalityTraits])

  const handleContinue = () => {
    nextStep()
    if (onComplete) {
      onComplete()
    }
  }

  const handleRerollValues = () => {
    setSelectedCoreValues(null)
    setShowContinueButton(false)
  }

  const handleRerollTraits = () => {
    setSelectedPersonalityTraits(null)
    setShowContinueButton(false)
  }

  const getCoreValuesDisplayName = () => {
    if (!selectedCoreValues) return 'Unknown'
    return selectedCoreValues.result || selectedCoreValues.name || 'Unknown'
  }

  const getPersonalityTraitsDisplayName = () => {
    if (!selectedPersonalityTraits) return 'Unknown'
    return selectedPersonalityTraits.result || selectedPersonalityTraits.name || 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Values & Beliefs</h2>
        <p className="text-parchment-700">
          Discover the core values, beliefs, and personality traits that define your character
        </p>
      </div>

      {/* Core Values Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-parchment-800">
            Step 1: Core Values & Motivations
          </h3>
          {selectedCoreValues && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">Selected:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                  {getCoreValuesDisplayName()}
                </span>
              </div>
              <button
                onClick={handleRerollValues}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300 ml-3"
                title="Re-roll core values"
              >
                🔄 Re-roll
              </button>
            </div>
          )}
        </div>

        {!selectedCoreValues && (
          <PersonalityTable 
            tableId="501" 
            onComplete={handleCoreValuesSelection}
          />
        )}
      </div>

      {/* Personality Traits Selection */}
      {selectedCoreValues && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-parchment-800">
              Step 2: Personality Traits
            </h3>
            {selectedPersonalityTraits && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">Selected:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                    {getPersonalityTraitsDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleRerollTraits}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300 ml-3"
                  title="Re-roll personality traits"
                >
                  🔄 Re-roll
                </button>
              </div>
            )}
          </div>

          {!selectedPersonalityTraits && (
            <PersonalityTable 
              tableId="502" 
              onComplete={handlePersonalityTraitsSelection}
            />
          )}
        </div>
      )}

      {/* Summary */}
      {selectedCoreValues && selectedPersonalityTraits && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3">
            Values & Beliefs Complete
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-green-700">Core Values:</span>
              <p className="text-green-600">{getCoreValuesDisplayName()}</p>
              {selectedCoreValues.description && (
                <p className="text-green-500 text-sm">{selectedCoreValues.description}</p>
              )}
            </div>
            <div>
              <span className="font-medium text-green-700">Personality:</span>
              <p className="text-green-600">{getPersonalityTraitsDisplayName()}</p>
              {selectedPersonalityTraits.description && (
                <p className="text-green-500 text-sm">{selectedPersonalityTraits.description}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-green-700">
                Review your values and personality above. You can re-roll either aspect if desired.
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleContinue}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Complete Character Generation →
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-medium transition-colors border border-amber-300"
                title="Start character generation over"
              >
                🔄 Restart Generation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}