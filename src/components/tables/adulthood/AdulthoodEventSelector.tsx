// Adulthood Event Selection Component - Simplified to follow Youth pattern

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { AdulthoodTable } from './AdulthoodTable'

interface AdulthoodEventSelectorProps {
  onComplete?: () => void
}

export function AdulthoodEventSelector({ onComplete }: AdulthoodEventSelectorProps) {
  const [selectedAdultEvent, setSelectedAdultEvent] = useState<any>(null)
  const [showContinueButton, setShowContinueButton] = useState(false)
  
  const { character, updateCharacter } = useCharacterStore()
  const { nextStep } = useGenerationStore()

  // Check if character already has adult events (state restoration)
  useEffect(() => {
    console.log('🟡 AdulthoodEventSelector: Character check:', { 
      adulthoodEvents: character.adulthoodEvents
    })
    
    if (character.adulthoodEvents && Array.isArray(character.adulthoodEvents) && character.adulthoodEvents.length > 0) {
      const adultEvent = character.adulthoodEvents[0] // Get first adult event
      if (adultEvent) {
        console.log('🟡 AdulthoodEventSelector: Setting selected adult event:', adultEvent)
        setSelectedAdultEvent({ result: adultEvent.name || adultEvent.result, ...adultEvent })
        setShowContinueButton(true)
      }
    }
  }, [character])

  const handleAdultEventSelection = (result: any) => {
    console.log('🏁 AdulthoodEventSelector: Adult event selection result:', result)
    setSelectedAdultEvent(result.entry)
    
    // Update character with the adult event
    if (result.character) {
      console.log('🔄 AdulthoodEventSelector: Updating character with adult event:', result.character)
      updateCharacter(result.character)
    }
    
    setShowContinueButton(true)
  }

  const handleContinue = () => {
    nextStep()
    if (onComplete) {
      onComplete()
    }
  }

  const handleReroll = () => {
    setSelectedAdultEvent(null)
    setShowContinueButton(false)
  }

  const getAdultEventDisplayName = () => {
    if (!selectedAdultEvent) return 'Unknown'
    return selectedAdultEvent.result || selectedAdultEvent.name || 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Adult Life Events</h2>
        <p className="text-parchment-700">
          Significant events that shaped your character's adult years and current situation
        </p>
      </div>

      {/* Adult Event Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-parchment-800">
            Major Adult Life Event
          </h3>
          {selectedAdultEvent && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">Selected:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                  {getAdultEventDisplayName()}
                </span>
              </div>
              <button
                onClick={handleReroll}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300 ml-3"
                title="Re-roll adult event"
              >
                🔄 Re-roll
              </button>
            </div>
          )}
        </div>

        {!selectedAdultEvent && (
          <AdulthoodTable 
            tableId="419" 
            onComplete={handleAdultEventSelection}
          />
        )}
      </div>

      {/* Summary */}
      {selectedAdultEvent && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3">
            Adult Life Event Complete
          </h4>
          
          <div className="mb-4">
            <span className="font-medium text-green-700">Adult Event:</span>
            <p className="text-green-600">{getAdultEventDisplayName()}</p>
            {selectedAdultEvent.description && (
              <p className="text-green-500 text-sm mt-1">{selectedAdultEvent.description}</p>
            )}
          </div>
          
          {/* Comprehensive Character Progress Display */}
          <div className="mt-4 bg-white border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>Character Progress (Complete Life Story)</span>
            </h4>
            
            {/* Heritage Summary */}
            <div className="mb-4 p-3 bg-amber-50 rounded border-l-4 border-amber-500">
              <h5 className="font-medium text-amber-800 mb-2">Heritage & Birth</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-amber-700 font-medium">Race:</span>
                  <span className="ml-1 text-amber-600">{character?.race?.name || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-amber-700 font-medium">Culture:</span>
                  <span className="ml-1 text-amber-600">{character?.culture?.name || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-amber-700 font-medium">Social Status:</span>
                  <span className="ml-1 text-amber-600">{character?.socialStatus?.level || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-amber-700 font-medium">Birth:</span>
                  <span className="ml-1 text-amber-600">{character?.birthCircumstances?.legitimacy || 'Unknown'}</span>
                </div>
              </div>
            </div>
            
            {/* Youth Events Summary */}
            <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <h5 className="font-medium text-blue-800 mb-2">Youth Events</h5>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Childhood:</span>
                  <span className="ml-1 text-blue-600">
                    {character?.youthEvents?.find(e => e.eventType === 'childhood')?.result || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Adolescence:</span>
                  <span className="ml-1 text-blue-600">
                    {character?.youthEvents?.find(e => e.eventType === 'adolescence')?.result || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Occupations Summary */}
            <div className="mb-4 p-3 bg-green-50 rounded border-l-4 border-green-500">
              <h5 className="font-medium text-green-800 mb-2">Professional Development</h5>
              <div className="grid md:grid-cols-3 gap-2 text-sm">
                {character?.occupations?.find(occ => occ.type === 'apprenticeship') && (
                  <div>
                    <span className="text-green-700 font-medium">Apprenticeship:</span>
                    <span className="ml-1 text-green-600">
                      {character.occupations.find(occ => occ.type === 'apprenticeship')?.result || 'Unknown'}
                    </span>
                  </div>
                )}
                {character?.occupations?.find(occ => occ.type === 'civilized') && (
                  <div>
                    <span className="text-green-700 font-medium">Profession:</span>
                    <span className="ml-1 text-green-600">
                      {character.occupations.find(occ => occ.type === 'civilized')?.result || 'Unknown'}
                    </span>
                  </div>
                )}
                {character?.occupations?.filter(occ => occ.type === 'hobby').length > 0 && (
                  <div>
                    <span className="text-green-700 font-medium">Hobbies:</span>
                    <span className="ml-1 text-green-600">
                      {character.occupations.filter(occ => occ.type === 'hobby').map(h => h.result).filter(Boolean).join(', ') || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Adult Event Summary */}
            <div className="mb-4 p-3 bg-purple-50 rounded border-l-4 border-purple-500">
              <h5 className="font-medium text-purple-800 mb-2">Adult Life</h5>
              <div className="text-sm">
                <div>
                  <span className="text-purple-700 font-medium">Major Event:</span>
                  <span className="ml-1 text-purple-600">{getAdultEventDisplayName()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-green-700 font-medium">
              Life Story Complete: {character?.name || 'Your character'} is ready for personality and final details
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-green-700">
                Review your adult life event above. You can re-roll if desired.
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleContinue}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Continue to Values & Beliefs →
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