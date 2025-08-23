// Enhanced Character Summary Component for PanCasting Generation Workflow

import React, { useState } from 'react'
import { Character } from '../../types/character'
import { useCharacterStore } from '../../stores/characterStore'

interface CharacterSummaryProps {
  character?: Character
  showFullDetails?: boolean
  className?: string
  persistent?: boolean
  collapsible?: boolean
}

export function CharacterSummary({ 
  character: propCharacter, 
  showFullDetails = false, 
  className = '',
  persistent = false,
  collapsible = false
}: CharacterSummaryProps) {
  const { character: storeCharacter } = useCharacterStore()
  const character = propCharacter || storeCharacter
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!character) {
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${className}`}>
        <div className="text-gray-500">
          <div className="text-4xl mb-2">👤</div>
          <p className="text-lg font-medium">No Character</p>
          <p className="text-sm">Generate a character to see their details</p>
        </div>
      </div>
    )
  }

  const getPersonalityTraitIcon = (type: string) => {
    switch (type) {
      case 'Lightside': return '😇'
      case 'Darkside': return '😈'
      case 'Neutral': return '😐'
      case 'Exotic': return '✨'
      default: return '❓'
    }
  }

  const getModifierDisplay = (value: number) => {
    if (value > 0) return `+${value}`
    if (value < 0) return `${value}`
    return '0'
  }

  const getModifierColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getAbilityModifier = (score: number) => {
    return Math.floor((score - 10) / 2)
  }

  const getTotalSkills = () => {
    if (!character.skills) return []
    return Object.entries(character.skills).map(([name, data]) => ({
      name,
      rank: typeof data === 'object' ? data.rank : data,
      specialty: typeof data === 'object' ? data.specialty : undefined
    }))
  }

  const getSummaryStats = () => {
    return {
      totalEvents: (character.youthEvents?.length || 0) + (character.adulthoodEvents?.length || 0),
      occupations: character.occupations?.length || 0,
      apprenticeships: character.apprenticeships?.length || 0,
      skills: character.skills ? Object.keys(character.skills).length : 0,
      hobbies: character.hobbies?.length || 0,
      relationships: (character.npcs?.length || 0) + (character.companions?.length || 0) + (character.rivals?.length || 0) + (character.relationships?.length || 0),
      traits: character.personalityTraits?.length || 0
    }
  }

  // If persistent and collapsible, show compact header when collapsed
  if (persistent && collapsible && isCollapsed) {
    return (
      <div className={`bg-parchment-50 border-2 border-amber-400 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-bold text-amber-800">
              {character?.name || 'Unnamed Character'}
            </div>
            {character?.age && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">
                Age {character.age}
              </span>
            )}
            {character?.race?.name && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {character.race.name}
              </span>
            )}
            {character?.culture?.name && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                {character.culture.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{getSummaryStats().totalEvents} Events</span>
            <span>•</span>
            <span>{getSummaryStats().occupations} Jobs</span>
            <span>•</span>
            <span>{getSummaryStats().skills} Skills</span>
            <button 
              onClick={() => setIsCollapsed(false)}
              className="ml-2 text-amber-600 hover:text-amber-800"
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-parchment-50 border-2 border-amber-600 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-amber-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{character.name || 'Unnamed Character'}</h2>
            <div className="flex items-center gap-2 mt-1">
              {character.race && (
                <span className="px-2 py-1 bg-amber-700 rounded text-sm">
                  {character.race.name}
                </span>
              )}
              {character.culture && (
                <span className="px-2 py-1 bg-amber-700 rounded text-sm">
                  {character.culture.name}
                </span>
              )}
              {character.age && (
                <span className="px-2 py-1 bg-amber-700 rounded text-sm">
                  Age {character.age}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-2xl">🎭</div>
                <div className="text-sm opacity-90">
                  Level {character.level || 1}
                </div>
              </div>
              {collapsible && (
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="ml-2 text-amber-200 hover:text-white transition-colors"
                >
                  ▲
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Character Progress Summary */}
        {persistent && (
          <div className="mt-3 pt-3 border-t border-amber-700">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
              <div className="bg-amber-700 rounded p-2">
                <div className="text-xs opacity-90">Heritage</div>
                <div className="text-sm font-bold">
                  {character.race?.name ? '✓' : '—'}
                </div>
              </div>
              <div className="bg-amber-700 rounded p-2">
                <div className="text-xs opacity-90">Youth</div>
                <div className="text-sm font-bold">
                  {character.youthEvents?.length || 0}
                </div>
              </div>
              <div className="bg-amber-700 rounded p-2">
                <div className="text-xs opacity-90">Jobs</div>
                <div className="text-sm font-bold">
                  {character.occupations?.length || 0}
                </div>
              </div>
              <div className="bg-amber-700 rounded p-2">
                <div className="text-xs opacity-90">Adult</div>
                <div className="text-sm font-bold">
                  {character.adulthoodEvents?.length || 0}
                </div>
              </div>
              <div className="bg-amber-700 rounded p-2">
                <div className="text-xs opacity-90">Skills</div>
                <div className="text-sm font-bold">
                  {getSummaryStats().skills}
                </div>
              </div>
              <div className="bg-amber-700 rounded p-2">
                <div className="text-xs opacity-90">Relations</div>
                <div className="text-sm font-bold">
                  {getSummaryStats().relationships}
                </div>
              </div>
              <div className="bg-amber-700 rounded p-2">
                <div className="text-xs opacity-90">Traits</div>
                <div className="text-sm font-bold">
                  {getSummaryStats().traits}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Core Stats */}
      <div className="p-4 bg-white border-b border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-3">Core Attributes</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(character.attributes || {}).map(([attr, value]) => {
            const modifier = getAbilityModifier(value)
            return (
              <div key={attr} className="bg-parchment-100 rounded-lg p-3 text-center border border-amber-200">
                <div className="text-xs font-medium text-amber-700 uppercase mb-1">
                  {attr.substring(0, 3)}
                </div>
                <div className="text-lg font-bold text-amber-800">
                  {value}
                </div>
                <div className={`text-xs font-medium ${getModifierColor(modifier)}`}>
                  {modifier >= 0 ? '+' : ''}{modifier}
                </div>
              </div>
            )
          })}
        </div>

        {/* Active Modifiers */}
        {character.activeModifiers && Object.keys(character.activeModifiers).length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-amber-800 mb-2">Active Modifiers</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(character.activeModifiers).map(([mod, value]) => (
                <span 
                  key={mod}
                  className={`px-2 py-1 bg-gray-100 rounded text-sm font-medium ${getModifierColor(value)}`}
                >
                  {mod}: {getModifierDisplay(value)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Life Events */}
      {persistent && ((character.youthEvents && character.youthEvents.length > 0) || (character.adulthoodEvents && character.adulthoodEvents.length > 0)) && (
        <div className="p-4 bg-green-50 border-b border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3">Life Events & Experience</h3>
          <div className="space-y-3">
            {character.youthEvents && character.youthEvents.length > 0 && (
              <div>
                <div className="font-medium text-green-800 mb-1 text-sm">Youth Events ({character.youthEvents.length})</div>
                <div className="space-y-1">
                  {character.youthEvents.slice(0, showFullDetails ? undefined : 3).map((event, index) => (
                    <div key={index} className="text-xs text-green-700 bg-green-100 p-2 rounded">
                      <div className="font-medium">{event.name || event.result}</div>
                      {event.description && (
                        <div className="text-green-600 mt-1">{event.description}</div>
                      )}
                    </div>
                  ))}
                  {!showFullDetails && character.youthEvents.length > 3 && (
                    <div className="text-xs text-green-600 italic">
                      +{character.youthEvents.length - 3} more events...
                    </div>
                  )}
                </div>
              </div>
            )}

            {character.adulthoodEvents && character.adulthoodEvents.length > 0 && (
              <div>
                <div className="font-medium text-orange-800 mb-1 text-sm">Adulthood Events ({character.adulthoodEvents.length})</div>
                <div className="space-y-1">
                  {character.adulthoodEvents.slice(0, showFullDetails ? undefined : 2).map((event, index) => (
                    <div key={index} className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
                      <div className="font-medium">{event.name || event.result}</div>
                      {event.description && (
                        <div className="text-orange-600 mt-1">{event.description}</div>
                      )}
                    </div>
                  ))}
                  {!showFullDetails && character.adulthoodEvents.length > 2 && (
                    <div className="text-xs text-orange-600 italic">
                      +{character.adulthoodEvents.length - 2} more events...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Relationships & Family */}
      {persistent && (character.family || getSummaryStats().relationships > 0) && (
        <div className="p-4 bg-pink-50 border-b border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3">Relationships & Family</h3>
          
          {character.family && (
            <div className="mb-3">
              <div className="font-medium text-pink-800 mb-1 text-sm">Family Background</div>
              <div className="text-xs text-pink-700 bg-pink-100 p-2 rounded">
                {character.family.siblings !== undefined && `${character.family.siblings} siblings`}
                {character.family.parents && ` • Parents: ${character.family.parents}`}
                {character.family.status && ` • Status: ${character.family.status}`}
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-2 text-xs">
            {character.npcs && character.npcs.length > 0 && (
              <div className="text-pink-700 bg-pink-100 p-2 rounded">
                <div className="font-medium">NPCs: {character.npcs.length}</div>
                {character.npcs.slice(0, 2).map((npc, index) => (
                  <div key={index}>• {npc.name}</div>
                ))}
                {character.npcs.length > 2 && <div className="italic">+{character.npcs.length - 2} more...</div>}
              </div>
            )}
            
            {character.companions && character.companions.length > 0 && (
              <div className="text-blue-700 bg-blue-100 p-2 rounded">
                <div className="font-medium">Companions: {character.companions.length}</div>
                {character.companions.slice(0, 2).map((companion, index) => (
                  <div key={index}>• {companion.name}</div>
                ))}
                {character.companions.length > 2 && <div className="italic">+{character.companions.length - 2} more...</div>}
              </div>
            )}
            
            {character.rivals && character.rivals.length > 0 && (
              <div className="text-red-700 bg-red-100 p-2 rounded">
                <div className="font-medium">Rivals: {character.rivals.length}</div>
                {character.rivals.slice(0, 2).map((rival, index) => (
                  <div key={index}>• {rival.name}</div>
                ))}
                {character.rivals.length > 2 && <div className="italic">+{character.rivals.length - 2} more...</div>}
              </div>
            )}
            
            {character.relationships && character.relationships.length > 0 && (
              <div className="text-purple-700 bg-purple-100 p-2 rounded">
                <div className="font-medium">Other Contacts: {character.relationships.length}</div>
                {character.relationships.slice(0, 2).map((relationship, index) => (
                  <div key={index}>• {relationship.name}</div>
                ))}
                {character.relationships.length > 2 && <div className="italic">+{character.relationships.length - 2} more...</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hobbies & Special Interests */}
      {persistent && character.hobbies && character.hobbies.length > 0 && (
        <div className="p-4 bg-violet-50 border-b border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3">Hobbies & Interests</h3>
          <div className="flex flex-wrap gap-1">
            {character.hobbies.map((hobby, index) => (
              <span key={index} className="text-xs text-violet-700 bg-violet-100 px-2 py-1 rounded">
                {hobby.name}
                {hobby.description && ` (${hobby.description})`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Personality Traits */}
      {character.personalityTraits && character.personalityTraits.length > 0 && (
        <div className="p-4 bg-indigo-50 border-b border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3">Personality</h3>
          <div className="flex flex-wrap gap-2">
            {character.personalityTraits.slice(0, showFullDetails ? undefined : 6).map((trait, index) => (
              <div key={index} className="flex items-center gap-1 px-2 py-1 bg-white rounded border">
                <span>{getPersonalityTraitIcon(trait.type)}</span>
                <span className="text-sm font-medium">{trait.name}</span>
              </div>
            ))}
            {!showFullDetails && character.personalityTraits.length > 6 && (
              <div className="px-2 py-1 bg-gray-200 rounded text-sm text-gray-600">
                +{character.personalityTraits.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {character.skills && Object.keys(character.skills).length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3">Skills</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {getTotalSkills().slice(0, showFullDetails ? undefined : 8).map((skill, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                <span className="font-medium">{skill.name}</span>
                <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-bold">
                  Rank {skill.rank}
                </span>
              </div>
            ))}
            {!showFullDetails && getTotalSkills().length > 8 && (
              <div className="bg-gray-200 p-2 rounded text-sm text-gray-600 text-center col-span-full">
                +{getTotalSkills().length - 8} more skills
              </div>
            )}
          </div>
        </div>
      )}

      {/* Occupations */}
      {character.occupations && character.occupations.length > 0 && (
        <div className="p-4 bg-green-50 border-b border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3">Occupations</h3>
          <div className="space-y-2">
            {character.occupations.slice(0, showFullDetails ? undefined : 3).map((occupation, index) => (
              <div key={index} className="bg-white p-2 rounded border-l-4 border-green-500">
                <div className="font-medium text-green-800">
                  {occupation.name || occupation.result || 'Unknown Occupation'}
                </div>
                {occupation.type && (
                  <div className="text-sm text-green-600 capitalize">
                    {occupation.type}
                  </div>
                )}
              </div>
            ))}
            {!showFullDetails && character.occupations.length > 3 && (
              <div className="bg-gray-200 p-2 rounded text-sm text-gray-600 text-center">
                +{character.occupations.length - 3} more occupations
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Events (if showing full details) */}
      {showFullDetails && character.generationHistory && character.generationHistory.length > 0 && (
        <div className="p-4 bg-yellow-50">
          <h3 className="font-semibold text-amber-800 mb-3">Recent Life Events</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {character.generationHistory.slice(-5).reverse().map((event, index) => (
              <div key={index} className="bg-white p-2 rounded text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{event.result}</span>
                  <span className="text-xs text-gray-500">{event.tableName}</span>
                </div>
                {event.rollDetails && (
                  <div className="text-xs text-gray-600 mt-1">{event.rollDetails}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generation Progress */}
      {character.generationStep && (
        <div className="p-3 bg-amber-100 border-t border-amber-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-amber-800">Generation Progress:</span>
            <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded">
              Step {character.generationStep}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}