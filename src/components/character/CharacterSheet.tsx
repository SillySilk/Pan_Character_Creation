// Detailed Character Sheet Component for PanCasting

import React, { useState } from 'react'
import { Character } from '../../types/character'
import { useCharacterStore } from '../../stores/characterStore'

interface CharacterSheetProps {
  character?: Character
  editable?: boolean
  onSave?: (character: Character) => void
  className?: string
}

export function CharacterSheet({ 
  character: propCharacter, 
  editable = false,
  onSave,
  className = '' 
}: CharacterSheetProps) {
  const { character: storeCharacter, updateCharacter } = useCharacterStore()
  const character = propCharacter || storeCharacter
  
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'history' | 'export'>('overview')

  if (!character) {
    return (
      <div className={`bg-parchment-50 border border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <div className="text-parchment-600">
          <div className="text-6xl mb-4">📜</div>
          <p className="text-xl font-medium">No Character Sheet</p>
          <p className="text-parchment-500">Select or generate a character to view their sheet</p>
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

  const getSkillBonus = (rank: number) => {
    return Math.floor((rank - 1) / 2)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'details', label: 'Details', icon: '📊' },
    { id: 'history', label: 'Life History', icon: '📚' },
    { id: 'export', label: 'Export', icon: '📤' }
  ]

  return (
    <div className={`bg-white border-2 border-amber-600 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{character.name || 'Unnamed Character'}</h1>
            <div className="flex items-center gap-3 text-amber-100">
              {character.race && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-300 rounded-full"></span>
                  {character.race.name}
                </span>
              )}
              {character.culture && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-300 rounded-full"></span>
                  {character.culture.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-300 rounded-full"></span>
                Level {character.level || 1}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl mb-2">🎭</div>
            <div className="text-sm text-amber-100">Character Sheet</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-amber-100 border-b border-amber-200">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-amber-800 border-b-2 border-amber-600'
                  : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Core Attributes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Core Attributes</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(character.attributes || {}).map(([attr, value]) => (
                  <div key={attr} className="bg-white rounded-lg p-3 text-center border">
                    <div className="text-xs font-medium text-gray-600 uppercase mb-1">
                      {attr}
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{value}</div>
                    <div className="text-xs text-gray-500">
                      {getModifierDisplay(Math.floor((value - 10) / 2))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Modifiers */}
            {character.activeModifiers && Object.keys(character.activeModifiers).length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Active Modifiers</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(character.activeModifiers).map(([mod, value]) => (
                    <div key={mod} className="bg-white rounded-lg p-3 text-center border">
                      <div className="text-sm font-medium text-gray-700">{mod}</div>
                      <div className={`text-xl font-bold ${
                        value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {getModifierDisplay(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {character.skills && Object.keys(character.skills).length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Skills & Abilities</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(character.skills).map(([skillName, skillData]) => {
                    const rank = typeof skillData === 'object' ? skillData.rank : skillData
                    const specialty = typeof skillData === 'object' ? skillData.specialty : undefined
                    const bonus = getSkillBonus(rank)
                    
                    return (
                      <div key={skillName} className="bg-white rounded-lg p-3 border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">{skillName}</div>
                            {specialty && (
                              <div className="text-xs text-gray-600 italic">({specialty})</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-blue-600">Rank {rank}</div>
                            <div className="text-xs text-gray-500">+{bonus} bonus</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Personality Traits */}
            {character.personalityTraits && character.personalityTraits.length > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Personality Traits</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {character.personalityTraits.map((trait, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border flex items-center gap-3">
                      <span className="text-2xl">{getPersonalityTraitIcon(trait.type)}</span>
                      <div>
                        <div className="font-medium text-gray-800">{trait.name}</div>
                        <div className="text-sm text-gray-600">{trait.type}</div>
                        {trait.description && (
                          <div className="text-xs text-gray-500 mt-1">{trait.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Occupations */}
            {character.occupations && character.occupations.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Professional Background</h2>
                <div className="space-y-3">
                  {character.occupations.map((occupation, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-green-800">
                            {occupation.name || occupation.result || 'Unknown Occupation'}
                          </h3>
                          {occupation.type && (
                            <div className="text-sm text-green-600 capitalize">{occupation.type}</div>
                          )}
                          {occupation.description && (
                            <div className="text-sm text-gray-600 mt-2">{occupation.description}</div>
                          )}
                        </div>
                        {occupation.effects && (
                          <div className="text-xs text-green-700">
                            {occupation.effects.filter(e => e.type === 'skill').length} skills gained
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Relationships */}
            {character.relationships && character.relationships.length > 0 && (
              <div className="bg-pink-50 rounded-lg p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Relationships & Contacts</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {character.relationships.map((relationship, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-pink-200">
                      <div className="font-medium text-pink-800">
                        {relationship.name || 'Unknown Contact'}
                      </div>
                      {relationship.type && (
                        <div className="text-sm text-pink-600">{relationship.type}</div>
                      )}
                      {relationship.relationship && (
                        <div className="text-xs text-gray-600 mt-1">{relationship.relationship}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Items */}
            {character.specialItems && character.specialItems.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Special Items & Possessions</h2>
                <div className="space-y-3">
                  {character.specialItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-yellow-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-yellow-800">
                            {item.name || 'Unknown Item'}
                          </div>
                          {item.type && (
                            <div className="text-sm text-yellow-600">{item.type}</div>
                          )}
                          {item.description && (
                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                          )}
                        </div>
                        {item.quality && (
                          <div className="text-xs text-yellow-700 italic">
                            {item.quality}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-amber-50 rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Life History Timeline</h2>
              
              {character.generationHistory && character.generationHistory.length > 0 ? (
                <div className="space-y-4">
                  {character.generationHistory.map((event, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-amber-400">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-amber-800">{event.result}</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            {event.tableName} - Step {event.step}
                          </div>
                          {event.rollDetails && (
                            <div className="text-xs text-gray-500 mt-1">
                              Roll: {event.rollDetails}
                            </div>
                          )}
                          {event.manualSelection && (
                            <div className="text-xs text-blue-600 mt-1">
                              Manually Selected
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Roll: {event.roll}
                        </div>
                      </div>
                      
                      {/* Event Effects */}
                      {event.effects && event.effects.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-sm font-medium text-gray-700 mb-2">Effects:</div>
                          <div className="flex flex-wrap gap-2">
                            {event.effects.map((effect, effectIndex) => (
                              <span 
                                key={effectIndex}
                                className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs"
                              >
                                {effect.type}: {JSON.stringify(effect.value).slice(0, 30)}...
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📚</div>
                  <p>No life history recorded</p>
                  <p className="text-sm">Events will appear here as the character is generated</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Export Options</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button className="bg-white border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-semibold text-blue-800">Export as JSON</div>
                  <div className="text-sm text-gray-600">Raw character data</div>
                </button>
                
                <button className="bg-white border-2 border-green-200 rounded-lg p-4 hover:border-green-400 transition-colors">
                  <div className="text-2xl mb-2">🎲</div>
                  <div className="font-semibold text-green-800">D&D 3.5 Export</div>
                  <div className="text-sm text-gray-600">Character sheet format</div>
                </button>
                
                <button className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-semibold text-purple-800">Text Summary</div>
                  <div className="text-sm text-gray-600">Readable character description</div>
                </button>
                
                <button className="bg-white border-2 border-orange-200 rounded-lg p-4 hover:border-orange-400 transition-colors">
                  <div className="text-2xl mb-2">🖨️</div>
                  <div className="font-semibold text-orange-800">Print Version</div>
                  <div className="text-sm text-gray-600">Printer-friendly format</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}