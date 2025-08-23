// Youth Event Selection Component - Simplified to follow Heritage pattern

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { YouthTable } from './YouthTable'

interface YouthEventSelectorProps {
  onComplete?: () => void
}

export function YouthEventSelector({ onComplete }: YouthEventSelectorProps) {
  const [selectedChildhoodEvent, setSelectedChildhoodEvent] = useState<any>(null)
  const [selectedAdolescenceEvent, setSelectedAdolescenceEvent] = useState<any>(null)
  const [showContinueButton, setShowContinueButton] = useState(false)
  
  const { character } = useCharacterStore()
  const { nextStep } = useGenerationStore()

  // Check if character already has youth events (state restoration)
  useEffect(() => {
    console.log('🟡 YouthEventSelector: Character check:', { 
      youthEvents: character.youthEvents
    })
    
    if (character.youthEvents && Array.isArray(character.youthEvents)) {
      const childhood = character.youthEvents.find(event => 
        event.category === 'childhood' || (event.ageRange && event.ageRange.max <= 12)
      )
      const adolescence = character.youthEvents.find(event => 
        event.category === 'adolescence' || (event.ageRange && event.ageRange.min >= 13)
      )
      
      if (childhood) {
        console.log('🟡 YouthEventSelector: Setting selected childhood event:', childhood)
        setSelectedChildhoodEvent({ result: childhood.name || childhood.result, ...childhood })
      }
      
      if (adolescence) {
        console.log('🟡 YouthEventSelector: Setting selected adolescence event:', adolescence)
        setSelectedAdolescenceEvent({ result: adolescence.name || adolescence.result, ...adolescence })
      }
    }
  }, [character])

  const handleChildhoodSelection = (result: any) => {
    console.log('🏁 YouthEventSelector: Childhood selection result:', result)
    setSelectedChildhoodEvent(result.entry)
    
    // Update character with the childhood event
    if (result.character) {
      console.log('🔄 YouthEventSelector: Updating character with childhood event:', result.character)
    }
  }

  const handleAdolescenceSelection = (result: any) => {
    console.log('🏁 YouthEventSelector: Adolescence selection result:', result)
    setSelectedAdolescenceEvent(result.entry)
    
    // Update character with the adolescence event
    if (result.character) {
      console.log('🔄 YouthEventSelector: Updating character with adolescence event:', result.character)
    }
  }

  // Check if all youth events are complete
  useEffect(() => {
    if (selectedChildhoodEvent && selectedAdolescenceEvent) {
      setShowContinueButton(true)
    } else {
      setShowContinueButton(false)
    }
  }, [selectedChildhoodEvent, selectedAdolescenceEvent])

  const handleContinue = () => {
    nextStep()
    if (onComplete) {
      onComplete()
    }
  }

  const handleRerollChildhood = () => {
    setSelectedChildhoodEvent(null)
    setShowContinueButton(false)
  }

  const handleRerollAdolescence = () => {
    setSelectedAdolescenceEvent(null)
    setShowContinueButton(false)
  }

  const getChildhoodDisplayName = () => {
    if (!selectedChildhoodEvent) return 'Unknown'
    return selectedChildhoodEvent.result || selectedChildhoodEvent.name || 'Unknown'
  }

  const getAdolescenceDisplayName = () => {
    if (!selectedAdolescenceEvent) return 'Unknown'
    return selectedAdolescenceEvent.result || selectedAdolescenceEvent.name || 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Youth & Development</h2>
        <p className="text-parchment-700">
          Experience the formative events that shaped your character's early years
        </p>
      </div>

      {/* Childhood Event Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-parchment-800">
            Step 1: Childhood Event (Ages 5-12)
          </h3>
          {selectedChildhoodEvent && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">Selected:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                  {getChildhoodDisplayName()}
                </span>
              </div>
              <button
                onClick={handleRerollChildhood}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300"
                title="Re-roll childhood event"
              >
                🔄 Re-roll
              </button>
            </div>
          )}
        </div>

        {!selectedChildhoodEvent && (
          <YouthTable 
            tableId="209" 
            eventType="childhood"
            onComplete={handleChildhoodSelection}
          />
        )}
      </div>

      {/* Adolescence Event Selection */}
      {selectedChildhoodEvent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-parchment-800">
              Step 2: Adolescence Event (Ages 13-17)
            </h3>
            {selectedAdolescenceEvent && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">Selected:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                    {getAdolescenceDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleRerollAdolescence}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300"
                  title="Re-roll adolescence event"
                >
                  🔄 Re-roll
                </button>
              </div>
            )}
          </div>

          {!selectedAdolescenceEvent && (
            <YouthTable 
              tableId="220" 
              eventType="adolescence"
              onComplete={handleAdolescenceSelection}
            />
          )}
        </div>
      )}

      {/* Summary */}
      {selectedChildhoodEvent && selectedAdolescenceEvent && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3">
            Youth Events Complete
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-green-700">Childhood Event:</span>
              <p className="text-green-600">{getChildhoodDisplayName()}</p>
              {selectedChildhoodEvent.description && (
                <p className="text-green-500 text-sm">{selectedChildhoodEvent.description}</p>
              )}
            </div>
            <div>
              <span className="font-medium text-green-700">Adolescence Event:</span>
              <p className="text-green-600">{getAdolescenceDisplayName()}</p>
              {selectedAdolescenceEvent.description && (
                <p className="text-green-500 text-sm">{selectedAdolescenceEvent.description}</p>
              )}
            </div>
          </div>
          
          {/* Cumulative Character Progress Display */}
          <div className="mt-4 bg-white border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>Character Progress (Heritage + Youth)</span>
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
                  <span className="ml-1 text-blue-600">{getChildhoodDisplayName()}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Adolescence:</span>
                  <span className="ml-1 text-blue-600">{getAdolescenceDisplayName()}</span>
                </div>
              </div>
            </div>
            
            {/* Core Attributes */}
            {character && character.attributes && Object.keys(character.attributes).length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Attributes</h5>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {Object.entries(character.attributes).map(([attr, value]) => (
                    <div key={attr} className="text-center bg-gray-50 rounded p-2">
                      <div className="text-xs font-medium text-gray-600 uppercase">{attr}</div>
                      <div className="font-bold text-gray-800">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Active Modifiers */}
            {character && character.activeModifiers && Object.keys(character.activeModifiers).length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Active Modifiers</h5>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(character.activeModifiers).map(([mod, value]) => (
                    <span 
                      key={mod}
                      className={`px-2 py-1 bg-blue-100 rounded text-sm font-medium ${
                        value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}
                    >
                      {mod}: {value > 0 ? '+' : ''}{value}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Personality Traits */}
            {character && character.personalityTraits && character.personalityTraits.length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Personality Traits</h5>
                <div className="flex flex-wrap gap-2">
                  {character.personalityTraits.slice(0, 6).map((trait, index) => (
                    <div key={index} className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                      <span>
                        {trait.type === 'Lightside' ? '😇' : 
                         trait.type === 'Darkside' ? '😈' : 
                         trait.type === 'Neutral' ? '😐' : 
                         trait.type === 'Exotic' ? '✨' : '❓'}
                      </span>
                      <span className="font-medium">{trait.name}</span>
                    </div>
                  ))}
                  {character.personalityTraits.length > 6 && (
                    <div className="px-2 py-1 bg-gray-200 rounded text-sm text-gray-600">
                      +{character.personalityTraits.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Skills */}
            {character && character.skills && Object.keys(character.skills).length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Skills</h5>
                <div className="grid md:grid-cols-2 gap-2">
                  {Object.entries(character.skills).slice(0, 6).map(([skillName, skillData]) => (
                    <div key={skillName} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                      <span className="font-medium">{skillName}</span>
                      <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-bold">
                        Rank {typeof skillData === 'object' ? skillData.rank : skillData}
                      </span>
                    </div>
                  ))}
                  {Object.keys(character.skills).length > 6 && (
                    <div className="bg-gray-200 p-2 rounded text-sm text-gray-600 text-center col-span-full">
                      +{Object.keys(character.skills).length - 6} more skills
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-3 text-sm text-green-700 font-medium">
              Heritage & Youth Complete: {character?.name || 'Your character'} is ready for occupations
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-green-700">
                Review your youth events above. You can re-roll any event if desired.
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleContinue}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Continue to Training & Skills →
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