// Race Selection Component for Heritage Tables

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { TableService } from '../../../services/tableService'
import { HeritageTable } from './HeritageTable'

interface RaceSelectorProps {
  onRaceSelected?: (race: any) => void
  onComplete?: () => void
}

export function RaceSelector({ onRaceSelected, onComplete }: RaceSelectorProps) {
  const [selectedRace, setSelectedRace] = useState<any>(null)
  const [selectedCulture, setSelectedCulture] = useState<any>(null)
  const [selectedSocialStatus, setSelectedSocialStatus] = useState<any>(null)
  const [selectedBirthCircumstances, setSelectedBirthCircumstances] = useState<any>(null)
  const [showContinueButton, setShowContinueButton] = useState(false)
  
  const { character } = useCharacterStore()
  const { nextStep } = useGenerationStore()

  // Check if character already has heritage selections made
  useEffect(() => {
    console.log('🟡 RaceSelector: Character check:', { 
      race: character.race, 
      culture: character.culture, 
      socialStatus: character.socialStatus, 
      birthCircumstances: character.birthCircumstances 
    })
    
    if (character.race && character.race.name && character.race.name.trim()) {
      console.log('🟡 RaceSelector: Setting selected race:', character.race)
      setSelectedRace({ result: character.race.name, ...character.race })
    }
    
    if (character.culture && character.culture.name && character.culture.name !== 'Unknown') {
      console.log('🟡 RaceSelector: Setting selected culture:', character.culture)
      setSelectedCulture({ result: character.culture.name, ...character.culture })
    }
    
    if (character.socialStatus && character.socialStatus.level && character.socialStatus.level !== 'Comfortable') {
      console.log('🟡 RaceSelector: Setting selected social status:', character.socialStatus)
      setSelectedSocialStatus({ result: character.socialStatus.level, ...character.socialStatus })
    }
    
    if (character.birthCircumstances && character.birthCircumstances.legitimacy && character.birthCircumstances.legitimacy !== 'Legitimate') {
      console.log('🟡 RaceSelector: Setting selected birth circumstances:', character.birthCircumstances)
      setSelectedBirthCircumstances({ result: character.birthCircumstances.legitimacy, ...character.birthCircumstances })
    }
  }, [character])

  const handleRaceSelection = (result: any) => {
    console.log('🏁 RaceSelector: Race selection result:', result)
    setSelectedRace(result.entry)
    
    // Update character with the race
    if (result.character) {
      console.log('🔄 RaceSelector: Updating character with race:', result.character.race)
    }
    
    if (onRaceSelected) {
      onRaceSelected(result)
    }
  }

  const handleCultureSelection = (result: any) => {
    console.log('🏁 RaceSelector: Culture selection result:', result)
    setSelectedCulture(result.entry)
    
    // Update character with the culture
    if (result.character) {
      console.log('🔄 RaceSelector: Updating character with culture:', result.character.culture)
    }
  }

  const handleSocialStatusSelection = (result: any) => {
    console.log('🏁 RaceSelector: Social status selection result:', result)
    setSelectedSocialStatus(result.entry)
    
    // Update character with the social status
    if (result.character) {
      console.log('🔄 RaceSelector: Updating character with social status:', result.character.socialStatus)
    }
  }

  const handleBirthCircumstancesSelection = (result: any) => {
    console.log('🏁 RaceSelector: Birth circumstances selection result:', result)
    setSelectedBirthCircumstances(result.entry)
    
    // Update character with the birth circumstances
    if (result.character) {
      console.log('🔄 RaceSelector: Updating character with birth circumstances:', result.character.birthCircumstances)
    }
  }

  // Check if all heritage selections are complete
  useEffect(() => {
    if (selectedRace && selectedCulture && selectedSocialStatus && selectedBirthCircumstances) {
      setShowContinueButton(true)
    } else {
      setShowContinueButton(false)
    }
  }, [selectedRace, selectedCulture, selectedSocialStatus, selectedBirthCircumstances])

  const handleContinue = () => {
    nextStep()
    if (onComplete) {
      onComplete()
    }
  }

  const handleRerollRace = () => {
    setSelectedRace(null)
    setShowContinueButton(false)
  }

  const handleRerollCulture = () => {
    setSelectedCulture(null)
    setShowContinueButton(false)
  }

  const handleRerollSocialStatus = () => {
    setSelectedSocialStatus(null)
    setShowContinueButton(false)
  }

  const handleRerollBirthCircumstances = () => {
    setSelectedBirthCircumstances(null)
    setShowContinueButton(false)
  }

  const getRaceDisplayName = () => {
    if (!selectedRace) return 'Unknown'
    return selectedRace.result || selectedRace.name || 'Unknown'
  }

  const getCultureDisplayName = () => {
    if (!selectedCulture) return 'Unknown'
    return selectedCulture.result || selectedCulture.name || 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Heritage & Birth</h2>
        <p className="text-parchment-700">
          Determine your character's racial heritage and cultural background
        </p>
      </div>

      {/* Race Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-parchment-800">
            Step 1: Racial Heritage
          </h3>
          {selectedRace && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">Selected:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                  {getRaceDisplayName()}
                </span>
              </div>
              <button
                onClick={handleRerollRace}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300"
                title="Re-roll race"
              >
                🔄 Re-roll
              </button>
            </div>
          )}
        </div>

        {!selectedRace && (
          <HeritageTable 
            tableId="101a" 
            onComplete={handleRaceSelection}
          />
        )}
      </div>

      {/* Culture Selection */}
      {selectedRace && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-parchment-800">
              Step 2: Cultural Background
            </h3>
            {selectedCulture && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">Selected:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                    {getCultureDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleRerollCulture}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300"
                  title="Re-roll culture"
                >
                  🔄 Re-roll
                </button>
              </div>
            )}
          </div>

          {!selectedCulture && (
            <HeritageTable 
              tableId="102" 
              onComplete={handleCultureSelection}
            />
          )}
        </div>
      )}

      {/* Social Status Selection */}
      {selectedCulture && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-parchment-800">
              Step 3: Social Status
            </h3>
            {selectedSocialStatus && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">Selected:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                    {selectedSocialStatus.result}
                  </span>
                </div>
                <button
                  onClick={handleRerollSocialStatus}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300"
                  title="Re-roll social status"
                >
                  🔄 Re-roll
                </button>
              </div>
            )}
          </div>

          {!selectedSocialStatus && (
            <HeritageTable 
              tableId="103" 
              onComplete={handleSocialStatusSelection}
            />
          )}
        </div>
      )}

      {/* Birth Circumstances Selection */}
      {selectedSocialStatus && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-parchment-800">
              Step 4: Birth Circumstances
            </h3>
            {selectedBirthCircumstances && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">Selected:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
                    {selectedBirthCircumstances.result}
                  </span>
                </div>
                <button
                  onClick={handleRerollBirthCircumstances}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300"
                  title="Re-roll birth circumstances"
                >
                  🔄 Re-roll
                </button>
              </div>
            )}
          </div>

          {!selectedBirthCircumstances && (
            <HeritageTable 
              tableId="104" 
              onComplete={handleBirthCircumstancesSelection}
            />
          )}
        </div>
      )}

      {/* Summary */}
      {selectedRace && selectedCulture && selectedSocialStatus && selectedBirthCircumstances && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3">
            Heritage & Birth Complete
          </h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="font-medium text-green-700">Race:</span>
              <p className="text-green-600">{getRaceDisplayName()}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Culture:</span>
              <p className="text-green-600">{getCultureDisplayName()}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Social Status:</span>
              <p className="text-green-600">{selectedSocialStatus?.result || 'Unknown'}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Birth Circumstances:</span>
              <p className="text-green-600">{selectedBirthCircumstances?.result || 'Unknown'}</p>
            </div>
          </div>
          
          {/* Character Progress Display */}
          <div className="bg-white border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>Character Progress</span>
            </h4>
            
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
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Personality Traits</h5>
                <div className="flex flex-wrap gap-2">
                  {character.personalityTraits.slice(0, 4).map((trait, index) => (
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
                  {character.personalityTraits.length > 4 && (
                    <div className="px-2 py-1 bg-gray-200 rounded text-sm text-gray-600">
                      +{character.personalityTraits.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-3 text-sm text-green-700 font-medium">
              Heritage Complete: {character?.name || 'Your character'} is ready for youth events
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-green-700">
                Review your heritage choices above. You can re-roll any table if desired.
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleContinue}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Continue to Youth Events →
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-medium transition-colors border border-amber-300"
                title="Start heritage generation over"
              >
                🔄 Restart Heritage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}