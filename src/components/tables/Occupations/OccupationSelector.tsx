// Occupation Selection Component with Skill Calculations

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { OccupationTable } from './OccupationTable'

interface OccupationSelectorProps {
  onComplete?: () => void
}

export function OccupationSelector({ onComplete }: OccupationSelectorProps) {
  const [currentPhase, setCurrentPhase] = useState<'apprenticeship' | 'civilized' | 'hobbies' | 'completed'>('apprenticeship')
  const [apprenticeships, setApprenticeships] = useState<any[]>([])
  const [civilizedOccupations, setCivilizedOccupations] = useState<any[]>([])
  const [hobbies, setHobbies] = useState<any[]>([])
  const [showHobbyTable, setShowHobbyTable] = useState(false)
  
  const { character, updateCharacter } = useCharacterStore()
  const { nextStep } = useGenerationStore()

  // Check existing occupations and determine workflow
  useEffect(() => {
    if (character.occupations) {
      const apprenticeshipOccs = character.occupations.filter(occ => 
        occ.type === 'apprenticeship' || occ.category === 'apprenticeship'
      )
      const civilizedOccs = character.occupations.filter(occ => 
        occ.type === 'civilized' || occ.category === 'civilized'
      )
      const hobbyOccs = character.occupations.filter(occ => 
        occ.type === 'hobby' || occ.category === 'hobby'
      )
      
      setApprenticeships(apprenticeshipOccs)
      setCivilizedOccupations(civilizedOccs)
      setHobbies(hobbyOccs)
      
      // Check if character had an Apprenticeship Offer in youth events
      const hasApprenticeshipOffer = character.youthEvents?.some(event => 
        event.result === 'Apprenticeship Offer' || event.name === 'Apprenticeship Offer'
      )
      
      // Determine current phase based on apprenticeship availability
      if (hasApprenticeshipOffer && apprenticeshipOccs.length === 0) {
        // Character had apprenticeship offer, start with apprenticeship
        setCurrentPhase('apprenticeship')
      } else if (civilizedOccs.length === 0) {
        // Skip to civilized occupation (professional career)
        setCurrentPhase('civilized')
      } else if (hobbyOccs.length < 2) { // Allow multiple hobbies
        setCurrentPhase('hobbies')
      } else {
        setCurrentPhase('completed')
      }
    }
  }, [character])

  const handleApprenticeshipComplete = (result: any) => {
    const newApprenticeships = [...apprenticeships, result]
    setApprenticeships(newApprenticeships)
    
    // Update character store
    const updatedOccupations = [...(character.occupations || []), {
      ...result.entry,
      type: 'apprenticeship',
      category: 'apprenticeship'
    }]
    updateCharacter({ ...character, occupations: updatedOccupations })
    
    // Move to civilized occupation phase
    setTimeout(() => {
      setCurrentPhase('civilized')
    }, 1000)
  }

  const handleCivilizedComplete = (result: any) => {
    console.log('🔍 OccupationSelector: Civilized profession selected:', result)
    
    const newCivilized = [...civilizedOccupations, result]
    setCivilizedOccupations(newCivilized)
    
    // Update character store
    const occupation = {
      ...result.entry,
      type: 'civilized',
      category: 'professional'
    }
    const updatedOccupations = [...(character.occupations || []), occupation]
    
    console.log('🔍 OccupationSelector: Updating character with occupations:', updatedOccupations)
    updateCharacter({ ...character, occupations: updatedOccupations })
    
    // Move to hobbies phase
    setTimeout(() => {
      setCurrentPhase('hobbies')
    }, 1000)
  }

  const handleHobbyComplete = (result: any) => {
    const newHobbies = [...hobbies, result]
    setHobbies(newHobbies)
    setShowHobbyTable(false)
    
    // Update character store
    const updatedOccupations = [...(character.occupations || []), {
      ...result.entry,
      type: 'hobby',
      category: 'hobby'
    }]
    updateCharacter({ ...character, occupations: updatedOccupations })
    
    // Check if we should complete or allow more hobbies (using updated array)
    if (newHobbies.length >= 1) {
      setTimeout(() => {
        setCurrentPhase('completed')
        if (onComplete) {
          onComplete()
        } else {
          nextStep()
        }
      }, 1000)
    }
  }

  const addAnotherHobby = () => {
    setShowHobbyTable(true)
  }

  const skipToComplete = () => {
    setCurrentPhase('completed')
    if (onComplete) {
      onComplete()
    } else {
      nextStep()
    }
  }

  const handleContinue = () => {
    nextStep()
    if (onComplete) {
      onComplete()
    }
  }

  const getTotalSkills = () => {
    const allOccupations = [...apprenticeships, ...civilizedOccupations, ...hobbies]
    const skills = new Map()
    
    allOccupations.forEach(occupation => {
      if (occupation.entry?.effects) {
        occupation.entry.effects.forEach(effect => {
          if (effect.type === 'skill') {
            const skillName = effect.value?.name
            const skillRank = effect.value?.rank || 1
            
            if (skills.has(skillName)) {
              skills.set(skillName, Math.max(skills.get(skillName), skillRank))
            } else {
              skills.set(skillName, skillRank)
            }
          }
        })
      }
    })
    
    return Array.from(skills.entries()).map(([name, rank]) => ({ name, rank }))
  }

  // Check if character had apprenticeship offer
  const hasApprenticeshipOffer = character.youthEvents?.some(event => 
    event.result === 'Apprenticeship Offer' || event.name === 'Apprenticeship Offer'
  )

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Occupations & Training</h2>
        <p className="text-parchment-700 mb-3">
          Learn skills and trades that will shape your character's abilities and social standing
        </p>
        
        {/* Phase Indicator */}
        <div className="flex items-center gap-4 flex-wrap">
          {hasApprenticeshipOffer && (
            <>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                currentPhase === 'apprenticeship' ? 'bg-orange-500 text-white' : 
                apprenticeships.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                <span>1</span>
                <span>Apprenticeship</span>
              </div>
              
              <div className={`w-8 h-px ${apprenticeships.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </>
          )}
          
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            currentPhase === 'civilized' ? 'bg-indigo-500 text-white' : 
            civilizedOccupations.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            <span>{hasApprenticeshipOffer ? '2' : '1'}</span>
            <span>Profession</span>
          </div>
          
          <div className={`w-8 h-px ${civilizedOccupations.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            currentPhase === 'hobbies' ? 'bg-green-500 text-white' : 
            hobbies.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            <span>{hasApprenticeshipOffer ? '3' : '2'}</span>
            <span>Hobbies</span>
          </div>
          
          <div className={`w-8 h-px ${currentPhase === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            currentPhase === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            <span>✓</span>
            <span>Complete</span>
          </div>
        </div>
      </div>

      {/* No Apprenticeship Available Message */}
      {!hasApprenticeshipOffer && currentPhase === 'civilized' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">ℹ️</span>
            <h3 className="text-lg font-semibold text-blue-800">No Apprenticeship Available</h3>
          </div>
          <p className="text-blue-700">
            Your character did not receive an apprenticeship offer during their youth events. 
            They will proceed directly to establishing a professional career.
          </p>
        </div>
      )}

      {/* Apprenticeship Phase */}
      {currentPhase === 'apprenticeship' && hasApprenticeshipOffer && (
        <div className="space-y-4">
          <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Apprenticeship Training
            </h3>
            <p className="text-orange-700 mb-2">
              Your character serves as an apprentice, learning basic professional skills. 
              This provides fundamental training and establishes initial career direction.
            </p>
            <div className="bg-orange-100 border border-orange-300 rounded p-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-orange-800">
                <span>🎯</span>
                <span className="font-medium">Earned through Youth Event:</span>
                <span className="italic">Apprenticeship Offer</span>
              </div>
            </div>
            
          </div>
          
          {apprenticeships.length === 0 && (
            <OccupationTable 
              tableId="309" 
              occupationType="apprenticeship"
              onComplete={handleApprenticeshipComplete}
            />
          )}
        </div>
      )}

      {/* Civilized Occupation Phase */}
      {currentPhase === 'civilized' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border-2 border-indigo-500 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              Professional Career
            </h3>
            <p className="text-indigo-700 mb-4">
              Your character establishes a professional career, gaining advanced skills 
              and social standing within their chosen field.
            </p>
            
          </div>
          
          {civilizedOccupations.length === 0 && (
            <OccupationTable 
              tableId="310" 
              occupationType="civilized"
              onComplete={handleCivilizedComplete}
            />
          )}
        </div>
      )}

      {/* Hobbies Phase */}
      {currentPhase === 'hobbies' && (
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Personal Interests & Hobbies
            </h3>
            <p className="text-green-700 mb-4">
              Your character develops personal interests and hobbies, providing additional 
              skills and character depth. You may select multiple hobbies.
            </p>
            
            <div className="flex gap-3">
              {!showHobbyTable && (
                <>
                  <button
                    onClick={() => setShowHobbyTable(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {hobbies.length === 0 ? 'Add Hobby' : 'Add Another Hobby'}
                  </button>
                  {hobbies.length > 0 && (
                    <button
                      onClick={skipToComplete}
                      className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                    >
                      Complete Training
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {showHobbyTable && (
            <OccupationTable 
              tableId="314" 
              occupationType="hobby"
              onComplete={handleHobbyComplete}
            />
          )}
        </div>
      )}

      {/* Occupation Summary */}
      {(apprenticeships.length > 0 || civilizedOccupations.length > 0 || hobbies.length > 0) && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Professional Development Summary</h4>
          
          <div className="grid gap-4">
            {/* Apprenticeships */}
            {apprenticeships.length > 0 && (
              <div>
                <h5 className="font-medium text-orange-800 mb-2">Apprenticeships</h5>
                <div className="space-y-2">
                  {apprenticeships.map((occupation, index) => (
                    <div key={index} className="p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                      <div className="font-medium text-orange-800">
                        {occupation.entry?.result || occupation.result || 'Unknown Apprenticeship'}
                      </div>
                      {(occupation.entry?.description || occupation.description) && (
                        <div className="text-sm text-orange-600">
                          {occupation.entry?.description || occupation.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Civilized Occupations */}
            {civilizedOccupations.length > 0 && (
              <div>
                <h5 className="font-medium text-indigo-800 mb-2">Professional Career</h5>
                <div className="space-y-2">
                  {civilizedOccupations.map((occupation, index) => (
                    <div key={index} className="p-2 bg-indigo-50 rounded border-l-4 border-indigo-500">
                      <div className="font-medium text-indigo-800">
                        {occupation.entry?.result || occupation.result || 'Unknown Profession'}
                      </div>
                      {(occupation.entry?.description || occupation.description) && (
                        <div className="text-sm text-indigo-600">
                          {occupation.entry?.description || occupation.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hobbies */}
            {hobbies.length > 0 && (
              <div>
                <h5 className="font-medium text-green-800 mb-2">Personal Interests</h5>
                <div className="grid md:grid-cols-2 gap-2">
                  {hobbies.map((hobby, index) => (
                    <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-500">
                      <div className="font-medium text-green-800">
                        {hobby.entry?.result || hobby.result || 'Unknown Hobby'}
                      </div>
                      {(hobby.entry?.description || hobby.description) && (
                        <div className="text-sm text-green-600">
                          {hobby.entry?.description || hobby.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Comprehensive Character Progress Display */}
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>Character Progress (Heritage + Youth + Occupations)</span>
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
                    {character?.youthEvents?.find(e => e.eventType === 'childhood')?.result || 
                     character?.youthEvents?.find(e => e.lifePeriod === 'childhood')?.result || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Adolescence:</span>
                  <span className="ml-1 text-blue-600">
                    {character?.youthEvents?.find(e => e.eventType === 'adolescence')?.result || 
                     character?.youthEvents?.find(e => e.lifePeriod === 'adolescence')?.result || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Occupations Summary */}
            <div className="mb-4 p-3 bg-green-50 rounded border-l-4 border-green-500">
              <h5 className="font-medium text-green-800 mb-2">Professional Development</h5>
              <div className="grid md:grid-cols-3 gap-2 text-sm">
                {apprenticeships.length > 0 && (
                  <div>
                    <span className="text-green-700 font-medium">Apprenticeship:</span>
                    <span className="ml-1 text-green-600">{apprenticeships[0]?.entry?.result || apprenticeships[0]?.result || 'Unknown'}</span>
                  </div>
                )}
                {civilizedOccupations.length > 0 && (
                  <div>
                    <span className="text-green-700 font-medium">Profession:</span>
                    <span className="ml-1 text-green-600">{civilizedOccupations[0]?.entry?.result || civilizedOccupations[0]?.result || 'Unknown'}</span>
                  </div>
                )}
                {hobbies.length > 0 && (
                  <div>
                    <span className="text-green-700 font-medium">Hobbies:</span>
                    <span className="ml-1 text-green-600">
                      {hobbies.map(h => h?.entry?.result || h?.result).filter(Boolean).join(', ') || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
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
                  {character.personalityTraits.slice(0, 8).map((trait, index) => (
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
                  {character.personalityTraits.length > 8 && (
                    <div className="px-2 py-1 bg-gray-200 rounded text-sm text-gray-600">
                      +{character.personalityTraits.length - 8} more
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-3 text-sm text-gray-700 font-medium border-t pt-3">
              Heritage + Youth + Occupations Complete: {character?.name || 'Your character'} is ready for adult life events
            </div>
          </div>
          
          {/* Skills Summary */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-2">Acquired Skills</h5>
            <div className="grid md:grid-cols-3 gap-2">
              {getTotalSkills().map((skill, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                  <span className="font-medium text-blue-800">{skill.name}</span>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-bold">
                    Rank {skill.rank}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-blue-700 text-sm mt-2">
              Your character has developed <span className="font-semibold">{getTotalSkills().length} professional skill(s)</span> through 
              their training and experience.
            </p>
          </div>
        </div>
      )}

      {/* Completion */}
      {currentPhase === 'completed' && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3">
            Professional Training Complete! 🎯
          </h4>
          <p className="text-green-700 mb-4">
            Your character has completed their professional development, gaining valuable skills 
            and establishing their place in society. These occupations will influence their 
            opportunities and relationships throughout their adult life.
          </p>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-green-700">
                Review your occupations and skills above. Your character is ready for adult life!
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleContinue}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Continue to Adult Life Events →
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