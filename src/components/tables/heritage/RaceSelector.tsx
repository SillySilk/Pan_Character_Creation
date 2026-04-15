// Race Selection Component for Heritage Tables

import { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { HeritageTable } from './HeritageTable'
import { getAbilityModifierSummary, getRaceByName } from '../../../data/dndRaces'

interface RaceSelectorProps {
  onRaceSelected?: (race: any) => void
  onComplete?: () => void
}

export function RaceSelector({ onRaceSelected, onComplete }: RaceSelectorProps) {
  const [selectedRace, setSelectedRace] = useState<any>(null)
  const [selectedCulture, setSelectedCulture] = useState<any>(null)
  const [selectedSocialStatus, setSelectedSocialStatus] = useState<any>(null)
  const [selectedBirthCircumstances, setSelectedBirthCircumstances] = useState<any>(null)
  const [_showContinueButton, setShowContinueButton] = useState(false)
  
  const { character, setDndRace } = useCharacterStore()
  const { nextStep } = useGenerationStore()

  // Check if character already has heritage selections made
  useEffect(() => {
    if (!character) return
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

    // Apply DnD racial ability score modifiers when race is determined via background
    const raceName: string = result.entry?.result || result.entry?.name || ''
    if (raceName) {
      const dndRace = getRaceByName(raceName)
      if (dndRace) {
        console.log('🎯 RaceSelector: Applying DnD racial modifiers for', dndRace.name)
        setDndRace(dndRace)
      }
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
  // Race is satisfied by either a rolled selection or a pre-selected race from the character sheet
  useEffect(() => {
    const raceReady = !!(selectedRace || (character?.raceSource === 'manual' && character?.dndRace))
    if (raceReady && selectedCulture && selectedSocialStatus && selectedBirthCircumstances) {
      setShowContinueButton(true)
    } else {
      setShowContinueButton(false)
    }
  }, [selectedRace, selectedCulture, selectedSocialStatus, selectedBirthCircumstances, character?.raceSource, character?.dndRace])

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

  // If race was manually selected on the character sheet, show a notice and treat as pre-selected
  const preSelectedRace = (character != null && character.raceSource === 'manual' && character.dndRace)
    ? character.dndRace
    : null

  // Step numbers adjust based on whether race was pre-selected
  const stepNum = (n: number) => preSelectedRace ? n - 1 : n

  // Reusable completed-step result card (newest rolls appear nearest the top)
  const CompletedResult = ({
    label, value, description, onReroll
  }: { label: string; value: string; description?: string; onReroll: () => void }) => (
    <div className="flex items-start justify-between gap-4 bg-green-50 border border-green-300 rounded-lg px-4 py-3">
      <div className="min-w-0">
        <span className="text-xs font-semibold uppercase tracking-wide text-green-700">{label}</span>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-bold text-green-900">{value}</span>
          {description && (
            <span className="text-sm text-green-700 italic">— {description}</span>
          )}
        </div>
      </div>
      <button
        onClick={onReroll}
        className="shrink-0 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors border border-amber-300"
      >
        🔄 Re-roll
      </button>
    </div>
  )

  const allDone = (selectedRace || preSelectedRace) && selectedCulture && selectedSocialStatus && selectedBirthCircumstances

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Heritage & Birth</h2>
        <p className="text-parchment-700">
          Determine your character's racial heritage and cultural background
        </p>
      </div>

      {/* ── CURRENT PENDING STEP (always at top) ─────────────────────── */}

      {/* Race roll — only shown when not pre-selected and not yet rolled */}
      {!preSelectedRace && !selectedRace && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-parchment-800">Step 1: Racial Heritage</h3>
          <HeritageTable tableId="101a" onComplete={handleRaceSelection} />
        </div>
      )}

      {/* Culture roll */}
      {(selectedRace || preSelectedRace) && !selectedCulture && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-parchment-800">Step {stepNum(2)}: Cultural Background</h3>
          <HeritageTable tableId="102" onComplete={handleCultureSelection} />
        </div>
      )}

      {/* Social status roll */}
      {selectedCulture && !selectedSocialStatus && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-parchment-800">Step {stepNum(3)}: Social Status</h3>
          <HeritageTable tableId="103" onComplete={handleSocialStatusSelection} />
        </div>
      )}

      {/* Birth circumstances roll */}
      {selectedSocialStatus && !selectedBirthCircumstances && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-parchment-800">Step {stepNum(4)}: Birth Circumstances</h3>
          <HeritageTable tableId="104" onComplete={handleBirthCircumstancesSelection} />
        </div>
      )}

      {/* ── COMPLETED RESULTS — newest first ─────────────────────────── */}

      {selectedBirthCircumstances && (
        <CompletedResult
          label={`Step ${stepNum(4)}: Birth Circumstances`}
          value={selectedBirthCircumstances.result}
          description={selectedBirthCircumstances.description}
          onReroll={handleRerollBirthCircumstances}
        />
      )}

      {selectedSocialStatus && (
        <CompletedResult
          label={`Step ${stepNum(3)}: Social Status`}
          value={selectedSocialStatus.result}
          description={selectedSocialStatus.description}
          onReroll={handleRerollSocialStatus}
        />
      )}

      {selectedCulture && (
        <CompletedResult
          label={`Step ${stepNum(2)}: Cultural Background`}
          value={getCultureDisplayName()}
          description={selectedCulture.description}
          onReroll={handleRerollCulture}
        />
      )}

      {selectedRace && !preSelectedRace && (
        <CompletedResult
          label="Step 1: Racial Heritage"
          value={getRaceDisplayName()}
          description={selectedRace.description}
          onReroll={handleRerollRace}
        />
      )}

      {/* ── SUMMARY when all steps done ──────────────────────────────── */}
      {allDone && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3">
            Heritage & Birth Complete
          </h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="font-medium text-green-700">Race:</span>
              <p className="text-green-600">
                {preSelectedRace ? preSelectedRace.name : getRaceDisplayName()}
                {preSelectedRace && <span className="text-xs text-blue-600 ml-1">(pre-selected)</span>}
              </p>
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
            {character && character.personalityTraits && (() => {
              const allTraits = [
                ...((character.personalityTraits as unknown as { lightside?: unknown[], neutral?: unknown[], darkside?: unknown[], exotic?: unknown[] }).lightside || []),
                ...((character.personalityTraits as unknown as { lightside?: unknown[], neutral?: unknown[], darkside?: unknown[], exotic?: unknown[] }).neutral || []),
                ...((character.personalityTraits as unknown as { lightside?: unknown[], neutral?: unknown[], darkside?: unknown[], exotic?: unknown[] }).darkside || []),
                ...((character.personalityTraits as unknown as { lightside?: unknown[], neutral?: unknown[], darkside?: unknown[], exotic?: unknown[] }).exotic || []),
              ] as Array<{ type?: string; name?: string }>
              return allTraits.length > 0 ? (
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Personality Traits</h5>
                  <div className="flex flex-wrap gap-2">
                    {allTraits.slice(0, 4).map((trait, index) => (
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
                    {allTraits.length > 4 && (
                      <div className="px-2 py-1 bg-gray-200 rounded text-sm text-gray-600">
                        +{allTraits.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              ) : null
            })()}
            
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

      {/* ── RACE PRE-SELECTED NOTICE — always at bottom ──────────────── */}
      {preSelectedRace && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚔️</span>
            <div>
              <h3 className="font-semibold text-blue-800 text-sm">
                Race Pre-Selected: {preSelectedRace.name}
              </h3>
              <p className="text-xs text-blue-700 mt-0.5">
                Chosen on your character sheet — race roll skipped.
              </p>
              {Object.keys(preSelectedRace.abilityModifiers).length > 0 && (
                <p className="text-xs font-mono text-blue-600 mt-1">
                  Racial modifiers: {getAbilityModifierSummary(preSelectedRace.abilityModifiers)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}