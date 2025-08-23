// Life Details Selection Component - Consolidated Relationships, Items & Events

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { LifeDetailsTable } from './LifeDetailsTable'

interface LifeDetailsSelectorProps {
  onComplete?: () => void
}

export function LifeDetailsSelector({ onComplete }: LifeDetailsSelectorProps) {
  const [selectedRelationship, setSelectedRelationship] = useState<any>(null)
  const [selectedSpecialItem, setSelectedSpecialItem] = useState<any>(null)  
  const [selectedLifeEvent, setSelectedLifeEvent] = useState<any>(null)
  const [showContinueButton, setShowContinueButton] = useState(false)
  
  const { character, updateCharacter } = useCharacterStore()
  const { nextStep } = useGenerationStore()

  // Three-tier system: Relationships → Special Items → Life Events
  const tables = [
    { id: '901', name: 'Important Relationships', category: 'relationships', icon: '🤝', description: 'Key people in your character\'s life' },
    { id: '902', name: 'Special Possessions', category: 'items', icon: '💎', description: 'Meaningful items and treasures' },
    { id: '903', name: 'Defining Life Events', category: 'events', icon: '⚡', description: 'Significant moments that shaped your character' }
  ]

  // Check if character already has life details (state restoration)
  useEffect(() => {
    console.log('🟡 LifeDetailsSelector: Character check:', { 
      relationships: character.relationships,
      specialItems: character.specialItems,
      lifeEvents: character.lifeEvents
    })
    
    if (character.relationships && character.relationships.length > 0) {
      const relationship = character.relationships[0]
      console.log('🟡 LifeDetailsSelector: Setting selected relationship:', relationship)
      setSelectedRelationship({ result: relationship.name || relationship.result, ...relationship })
    }
    
    if (character.specialItems && character.specialItems.length > 0) {
      const item = character.specialItems[0]
      console.log('🟡 LifeDetailsSelector: Setting selected special item:', item)
      setSelectedSpecialItem({ result: item.name || item.result, ...item })
    }
    
    if (character.lifeEvents && character.lifeEvents.length > 0) {
      const event = character.lifeEvents[0]
      console.log('🟡 LifeDetailsSelector: Setting selected life event:', event)
      setSelectedLifeEvent({ result: event.name || event.result, ...event })
    }
  }, [character])

  const handleRelationshipSelection = (result: any) => {
    console.log('🏁 LifeDetailsSelector: Relationship selection result:', result)
    setSelectedRelationship(result.entry)
    
    // Update character with relationship
    if (result.character) {
      console.log('🔄 LifeDetailsSelector: Updating character with relationship:', result.character)
      updateCharacter(result.character)
    }
  }

  const handleSpecialItemSelection = (result: any) => {
    console.log('🏁 LifeDetailsSelector: Special item selection result:', result)
    setSelectedSpecialItem(result.entry)
    
    // Update character with special item
    if (result.character) {
      console.log('🔄 LifeDetailsSelector: Updating character with special item:', result.character)
      updateCharacter(result.character)
    }
  }

  const handleLifeEventSelection = (result: any) => {
    console.log('🏁 LifeDetailsSelector: Life event selection result:', result)
    setSelectedLifeEvent(result.entry)
    
    // Update character with life event
    if (result.character) {
      console.log('🔄 LifeDetailsSelector: Updating character with life event:', result.character)
      updateCharacter(result.character)
    }
    
    setShowContinueButton(true)
  }

  // Check if all life details are complete
  useEffect(() => {
    if (selectedRelationship && selectedSpecialItem && selectedLifeEvent) {
      setShowContinueButton(true)
    } else {
      setShowContinueButton(false)
    }
  }, [selectedRelationship, selectedSpecialItem, selectedLifeEvent])

  const handleContinue = () => {
    nextStep()
    if (onComplete) {
      onComplete()
    }
  }

  const handleRerollRelationship = () => {
    setSelectedRelationship(null)
    setShowContinueButton(false)
  }

  const handleRerollItem = () => {
    setSelectedSpecialItem(null)
    setShowContinueButton(false)
  }

  const handleRerollEvent = () => {
    setSelectedLifeEvent(null)
    setShowContinueButton(false)
  }

  const getRelationshipDisplayName = () => {
    if (!selectedRelationship) return 'Unknown'
    return selectedRelationship.result || selectedRelationship.name || 'Unknown'
  }

  const getSpecialItemDisplayName = () => {
    if (!selectedSpecialItem) return 'Unknown'
    return selectedSpecialItem.result || selectedSpecialItem.name || 'Unknown'
  }

  const getLifeEventDisplayName = () => {
    if (!selectedLifeEvent) return 'Unknown'
    return selectedLifeEvent.result || selectedLifeEvent.name || 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Life Details</h2>
        <p className="text-parchment-700">
          Discover the important relationships, special possessions, and defining events that make your character unique
        </p>
      </div>

      {/* Relationship Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-parchment-800 flex items-center gap-2">
            <span className="text-xl">🤝</span>
            Step 1: Important Relationship
          </h3>
          {selectedRelationship && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">Selected:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                  {getRelationshipDisplayName()}
                </span>
              </div>
              <button
                onClick={handleRerollRelationship}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300 ml-3"
                title="Re-roll relationship"
              >
                🔄 Re-roll
              </button>
            </div>
          )}
        </div>

        {!selectedRelationship && (
          <LifeDetailsTable 
            tableId="901" 
            onComplete={handleRelationshipSelection}
          />
        )}
      </div>

      {/* Special Item Selection */}
      {selectedRelationship && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-parchment-800 flex items-center gap-2">
              <span className="text-xl">💎</span>
              Step 2: Special Possession
            </h3>
            {selectedSpecialItem && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">Selected:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                    {getSpecialItemDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleRerollItem}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300 ml-3"
                  title="Re-roll special item"
                >
                  🔄 Re-roll
                </button>
              </div>
            )}
          </div>

          {!selectedSpecialItem && (
            <LifeDetailsTable 
              tableId="902" 
              onComplete={handleSpecialItemSelection}
            />
          )}
        </div>
      )}

      {/* Life Event Selection */}
      {selectedRelationship && selectedSpecialItem && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-parchment-800 flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Step 3: Defining Life Event
            </h3>
            {selectedLifeEvent && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">Selected:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                    {getLifeEventDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleRerollEvent}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300 ml-3"
                  title="Re-roll life event"
                >
                  🔄 Re-roll
                </button>
              </div>
            )}
          </div>

          {!selectedLifeEvent && (
            <LifeDetailsTable 
              tableId="903" 
              onComplete={handleLifeEventSelection}
            />
          )}
        </div>
      )}

      {/* Summary */}
      {selectedRelationship && selectedSpecialItem && selectedLifeEvent && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3">
            Life Details Complete
          </h4>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span>🤝</span>
                <span className="font-medium text-green-700">Relationship:</span>
              </div>
              <p className="text-green-600 font-semibold">{getRelationshipDisplayName()}</p>
              {selectedRelationship.description && (
                <p className="text-green-500 text-sm">{selectedRelationship.description}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span>💎</span>
                <span className="font-medium text-green-700">Special Item:</span>
              </div>
              <p className="text-green-600 font-semibold">{getSpecialItemDisplayName()}</p>
              {selectedSpecialItem.description && (
                <p className="text-green-500 text-sm">{selectedSpecialItem.description}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span>⚡</span>
                <span className="font-medium text-green-700">Life Event:</span>
              </div>
              <p className="text-green-600 font-semibold">{getLifeEventDisplayName()}</p>
              {selectedLifeEvent.description && (
                <p className="text-green-500 text-sm">{selectedLifeEvent.description}</p>
              )}
            </div>
          </div>
          
          {/* Complete Character Progress Display */}
          <div className="mt-4 bg-white border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>Character Complete - Full Life Story</span>
            </h4>
            
            {/* Heritage Summary */}
            <div className="mb-3 p-3 bg-amber-50 rounded border-l-4 border-amber-500">
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
            
            {/* Life Events Summary */}
            <div className="mb-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <h5 className="font-medium text-blue-800 mb-2">Life Journey</h5>
              <div className="grid md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Youth:</span>
                  <span className="ml-1 text-blue-600">
                    {character?.youthEvents?.map(e => e.result).join(', ') || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Adult Event:</span>
                  <span className="ml-1 text-blue-600">
                    {character?.adulthoodEvents?.[0]?.result || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Life Event:</span>
                  <span className="ml-1 text-blue-600">{getLifeEventDisplayName()}</span>
                </div>
              </div>
            </div>
            
            {/* Skills & Occupations Summary */}
            <div className="mb-3 p-3 bg-green-50 rounded border-l-4 border-green-500">
              <h5 className="font-medium text-green-800 mb-2">Skills & Profession</h5>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-green-700 font-medium">Primary Occupation:</span>
                  <span className="ml-1 text-green-600">
                    {character?.occupations?.find(o => o.type === 'civilized')?.result || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Skills Count:</span>
                  <span className="ml-1 text-green-600">
                    {Object.keys(character?.skills || {}).length} skills developed
                  </span>
                </div>
              </div>
            </div>
            
            {/* Personality & Life Details */}
            <div className="mb-3 p-3 bg-purple-50 rounded border-l-4 border-purple-500">
              <h5 className="font-medium text-purple-800 mb-2">Character & Relationships</h5>
              <div className="grid md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-purple-700 font-medium">Core Values:</span>
                  <span className="ml-1 text-purple-600">
                    {character?.values?.mostValuedConcept || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-purple-700 font-medium">Relationship:</span>
                  <span className="ml-1 text-purple-600">{getRelationshipDisplayName()}</span>
                </div>
                <div>
                  <span className="text-purple-700 font-medium">Special Item:</span>
                  <span className="ml-1 text-purple-600">{getSpecialItemDisplayName()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-center text-sm text-green-700 font-medium bg-green-100 p-2 rounded">
              🎉 {character?.name || 'Your character'} is now fully developed with a complete life story!
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-green-700">
                Review your life details above. You can re-roll any aspect if desired.
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleContinue}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Finish Character Generation 🎯
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