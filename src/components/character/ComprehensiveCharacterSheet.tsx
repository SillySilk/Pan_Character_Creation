// Comprehensive Character Sheet - Shows all fields that will be generated
// with progressive filling as generation proceeds

import React, { useState } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import type { Character } from '../../types/character'
import { DND35_SKILLS, calculateSkillModifier, type DnDSkill } from '../../data/dnd35Skills'

interface ComprehensiveCharacterSheetProps {
  className?: string
  collapsible?: boolean
}

interface CharacterSheetField {
  label: string
  value: string | number
  status: 'filled' | 'pending' | 'empty'
  description?: string
}

interface CharacterSheetSection {
  title: string
  fields: CharacterSheetField[]
  isScrollable?: boolean
}

export function ComprehensiveCharacterSheet({ 
  className = '', 
  collapsible = false 
}: ComprehensiveCharacterSheetProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Helper function to get field status (filled, pending, or empty)
  const getFieldStatus = (value: any): 'filled' | 'pending' | 'empty' => {
    if (value === null || value === undefined || value === '' || 
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0)) {
      return 'empty'
    }
    return 'filled'
  }

  // Helper to get racial modifiers for an ability
  const getRacialModifiers = (ability: string): number => {
    if (!character?.race) return 0
    
    // This would need to be expanded to parse racial effects from the race data
    // For now, hardcode some common D&D racial modifiers for demonstration
    const racialBonuses: Record<string, Record<string, number>> = {
      'Elf': { dexterity: 2, constitution: -2 },
      'Dwarf': { constitution: 2, dexterity: -2 },
      'Halfling': { dexterity: 2, strength: -2 },
      'Half-Orc': { strength: 2, intelligence: -2, charisma: -2 }
    }
    
    return racialBonuses[character.race.name]?.[ability] || 0
  }

  // Helper to format ability scores with modifiers breakdown
  const formatAbilityScore = (baseScore: number | undefined, ability: string) => {
    const base = baseScore || 0
    const racialMod = getRacialModifiers(ability)
    const total = base + racialMod
    
    if (total === 0 && racialMod === 0) {
      return '0 (-5)'
    }
    
    const modifier = Math.floor((total - 10) / 2)
    const modifierText = `${modifier >= 0 ? '+' : ''}${modifier}`
    
    if (racialMod !== 0) {
      const racialText = `${racialMod >= 0 ? '+' : ''}${racialMod}`
      return `${total} (${modifierText}) [base ${base} ${racialText} racial]`
    } else {
      return `${total} (${modifierText})`
    }
  }

  // Helper to get status color
  const getStatusColor = (status: 'filled' | 'pending' | 'empty') => {
    switch (status) {
      case 'filled': return 'text-green-800 bg-green-100 border-green-300'
      case 'pending': return 'text-yellow-800 bg-yellow-100 border-yellow-300'  
      case 'empty': return 'text-gray-500 bg-gray-100 border-gray-300'
    }
  }

  // Helper to handle character name update
  const handleNameChange = (newName: string) => {
    updateCharacter({ ...character, name: newName })
  }

  // Helper to roll initial ability scores (4d6 drop lowest)
  const rollAbilityScores = () => {
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
      rolls.sort((a, b) => b - a) // Sort descending
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0) // Take highest 3
    }

    const newStats = {
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat()
    }

    updateCharacter({ ...character, ...newStats })
  }

  // Helper to get ability scores for skills calculation (includes racial modifiers)
  const getAbilityScores = () => ({
    strength: (character?.strength || 0) + getRacialModifiers('strength'),
    dexterity: (character?.dexterity || 0) + getRacialModifiers('dexterity'),
    constitution: (character?.constitution || 0) + getRacialModifiers('constitution'),
    intelligence: (character?.intelligence || 0) + getRacialModifiers('intelligence'),
    wisdom: (character?.wisdom || 0) + getRacialModifiers('wisdom'),
    charisma: (character?.charisma || 0) + getRacialModifiers('charisma')
  })

  // Helper to get character's skill ranks (from character data)
  const getSkillRanks = (): Record<string, number> => {
    // This would be expanded based on character.skills array structure
    // For now, return empty object until skills are properly implemented
    return {}
  }

  // Character sheet sections with all expected fields (reorganized with abilities first)
  const sections = [
    {
      title: '📊 Ability Scores',
      fields: [
        { 
          label: 'Strength', 
          value: formatAbilityScore(character?.strength, 'strength'),
          status: getFieldStatus(character?.strength)
        },
        { 
          label: 'Dexterity', 
          value: formatAbilityScore(character?.dexterity, 'dexterity'),
          status: getFieldStatus(character?.dexterity)
        },
        { 
          label: 'Constitution', 
          value: formatAbilityScore(character?.constitution, 'constitution'),
          status: getFieldStatus(character?.constitution)
        },
        { 
          label: 'Intelligence', 
          value: formatAbilityScore(character?.intelligence, 'intelligence'),
          status: getFieldStatus(character?.intelligence)
        },
        { 
          label: 'Wisdom', 
          value: formatAbilityScore(character?.wisdom, 'wisdom'),
          status: getFieldStatus(character?.wisdom)
        },
        { 
          label: 'Charisma', 
          value: formatAbilityScore(character?.charisma, 'charisma'),
          status: getFieldStatus(character?.charisma)
        }
      ]
    },
    {
      title: '🏰 Heritage & Birth',
      fields: [
        { 
          label: 'Race', 
          value: character?.race?.name || 'Upcoming',
          status: getFieldStatus(character?.race?.name)
        },
        { 
          label: 'Culture', 
          value: character?.culture?.name || 'Upcoming',
          status: getFieldStatus(character?.culture?.name)
        },
        { 
          label: 'Social Status', 
          value: character?.socialStatus?.level || 'Upcoming',
          status: getFieldStatus(character?.socialStatus?.level)
        },
        { 
          label: 'Birth Circumstances', 
          value: character?.birthCircumstances?.legitimacy || 'Upcoming',
          status: getFieldStatus(character?.birthCircumstances?.legitimacy)
        }
      ]
    },
    {
      title: '🌱 Youth Events',
      fields: [
        { 
          label: 'Childhood Events', 
          value: character?.youthEvents?.filter(e => e.period === 'Childhood')?.map(e => e.name || e.result).join(', ') || 'Upcoming',
          status: getFieldStatus(character?.youthEvents?.filter(e => e.period === 'Childhood'))
        },
        { 
          label: 'Adolescent Events', 
          value: character?.youthEvents?.filter(e => e.period === 'Adolescence')?.map(e => e.name || e.result).join(', ') || 'Upcoming',
          status: getFieldStatus(character?.youthEvents?.filter(e => e.period === 'Adolescence'))
        }
      ]
    },
    {
      title: '🎯 D&D 3.5 Skills',
      fields: DND35_SKILLS.map(skill => {
        const abilityScores = getAbilityScores()
        const skillRanks = getSkillRanks()
        const totalModifier = calculateSkillModifier(skill.name, abilityScores, skillRanks)
        const hasRanks = skillRanks[skill.name] > 0
        
        return {
          label: `${skill.name} (${skill.ability.charAt(0).toUpperCase() + skill.ability.slice(1, 3)})`,
          value: `${totalModifier >= 0 ? '+' : ''}${totalModifier}`,
          status: hasRanks ? 'filled' : 'empty' as const,
          description: skill.description
        }
      }),
      isScrollable: true
    },
    {
      title: '⚔️ Training & Background',
      fields: [
        { 
          label: 'Apprenticeship', 
          value: character?.occupations?.find(occ => occ.type === 'apprenticeship')?.result || 'Upcoming',
          status: getFieldStatus(character?.occupations?.find(occ => occ.type === 'apprenticeship'))
        },
        { 
          label: 'Profession', 
          value: character?.occupations?.find(occ => occ.type === 'civilized')?.result || 'Upcoming',
          status: getFieldStatus(character?.occupations?.find(occ => occ.type === 'civilized'))
        },
        { 
          label: 'Hobbies', 
          value: character?.occupations?.filter(occ => occ.type === 'hobby')?.map(h => h.result).join(', ') || 'Upcoming',
          status: getFieldStatus(character?.occupations?.filter(occ => occ.type === 'hobby'))
        }
      ]
    },
    {
      title: '🎭 Adult Life',
      fields: [
        { 
          label: 'Adulthood Events', 
          value: character?.adulthoodEvents?.length ? `${character.adulthoodEvents.length} experienced` : 'Upcoming',
          status: getFieldStatus(character?.adulthoodEvents)
        },
        { 
          label: 'Age', 
          value: character?.age ? `${character.age} years` : 'To be determined',
          status: getFieldStatus(character?.age)
        }
      ]
    },
    {
      title: '💭 Values & Beliefs',
      fields: [
        { 
          label: 'Personality Traits', 
          value: character?.personalityTraits ? 
            `${(character.personalityTraits.lightside?.length || 0) +
            (character.personalityTraits.neutral?.length || 0) +
            (character.personalityTraits.darkside?.length || 0) +
            (character.personalityTraits.exotic?.length || 0)} traits` : 'Upcoming',
          status: getFieldStatus(character?.personalityTraits)
        },
        { 
          label: 'Alignment', 
          value: character?.alignment?.primary || 'Upcoming',
          status: getFieldStatus(character?.alignment?.primary)
        }
      ]
    },
    {
      title: '👥 Relationships',
      fields: [
        { 
          label: 'NPCs', 
          value: character?.npcs?.length ? `${character.npcs.length} known` : 'Upcoming',
          status: getFieldStatus(character?.npcs)
        },
        { 
          label: 'Companions', 
          value: character?.companions?.length ? `${character.companions.length} allied` : 'Upcoming',
          status: getFieldStatus(character?.companions)
        },
        { 
          label: 'Rivals', 
          value: character?.rivals?.length ? `${character.rivals.length} opposed` : 'Upcoming',
          status: getFieldStatus(character?.rivals)
        },
        { 
          label: 'Relationships', 
          value: character?.relationships?.length ? `${character.relationships.length} connected` : 'Upcoming',
          status: getFieldStatus(character?.relationships)
        }
      ]
    },
    {
      title: '💎 Special Items',
      fields: [
        { 
          label: 'Gifts', 
          value: character?.gifts?.length ? `${character.gifts.length} received` : 'Upcoming',
          status: getFieldStatus(character?.gifts)
        },
        { 
          label: 'Legacies', 
          value: character?.legacies?.length ? `${character.legacies.length} inherited` : 'Upcoming',
          status: getFieldStatus(character?.legacies)
        },
        { 
          label: 'Special Items', 
          value: character?.specialItems?.length ? `${character.specialItems.length} possessed` : 'Upcoming',
          status: getFieldStatus(character?.specialItems)
        }
      ]
    }
  ]

  if (collapsible && isCollapsed) {
    return (
      <div className={`bg-parchment-50 border-2 border-amber-400 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-amber-800">Character Progress</h3>
            <div className="flex gap-1">
              {sections.map((section, index) => {
                const filledFields = section.fields.filter(f => f.status === 'filled').length
                const totalFields = section.fields.length
                const isComplete = filledFields === totalFields
                return (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full border ${
                      isComplete 
                        ? 'bg-green-500 border-green-600' 
                        : filledFields > 0 
                          ? 'bg-yellow-500 border-yellow-600' 
                          : 'bg-gray-300 border-gray-400'
                    }`}
                    title={`${section.title}: ${filledFields}/${totalFields}`}
                  />
                )
              })}
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-amber-600 hover:text-amber-800 text-lg font-bold"
            title="Expand character sheet"
          >
            ▼
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-parchment-50 border-2 border-amber-400 rounded-lg ${className}`}>
      <div className="p-4 border-b border-amber-300">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-amber-800">Character Sheet</h3>
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-amber-600 hover:text-amber-800 text-lg font-bold"
              title="Collapse character sheet"
            >
              ▲
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <label className="text-sm font-medium text-amber-700">Character Name:</label>
          <input
            type="text"
            value={character?.name || ''}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter character name..."
            className="flex-1 max-w-xs px-3 py-1 border border-amber-300 rounded-md text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
          <button
            onClick={rollAbilityScores}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
            title="Roll initial ability scores (4d6, drop lowest)"
          >
            🎲 Roll Stats
          </button>
          <span className="text-xs text-amber-600">- Generation Progress</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-lg border border-amber-200">
            <div className="px-3 py-2 bg-amber-100 rounded-t-lg border-b border-amber-200">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-amber-800">{section.title}</h4>
                <div className="text-xs text-amber-700">
                  {section.fields.filter(f => f.status === 'filled').length} / {section.fields.length}
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className={`${section.isScrollable ? 'max-h-64 overflow-y-auto' : ''} grid grid-cols-1 md:grid-cols-2 gap-2`}>
                {section.fields.map((field, fieldIndex) => (
                  <div 
                    key={fieldIndex}
                    className={`flex items-center justify-between px-2 py-1 rounded border ${getStatusColor(field.status)}`}
                    title={field.description || ''}
                  >
                    <span className="text-sm font-medium">{field.label}:</span>
                    <span className="text-sm font-mono">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generation Progress Summary */}
      <div className="p-4 border-t border-amber-300 bg-amber-50">
        <div className="text-center">
          <div className="text-sm text-amber-700 mb-2">Generation Progress</div>
          <div className="flex justify-center gap-2">
            {sections.map((section, index) => {
              const filledFields = section.fields.filter(f => f.status === 'filled').length
              const totalFields = section.fields.length
              const percentage = Math.round((filledFields / totalFields) * 100)
              return (
                <div key={index} className="text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    percentage === 100 
                      ? 'bg-green-500 text-white' 
                      : percentage > 0 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {percentage}%
                  </div>
                  <div className="text-xs text-amber-700 mt-1" style={{ fontSize: '10px' }}>
                    {section.title.replace(/🏰|📊|🌱|⚔️|🎭|💭|👥|💎/g, '').trim().split(' ')[0]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}