// D&D Character View Container
// Wraps existing DNDCharacterSheet with data conversion and state management

import { useEffect, useState, useCallback } from 'react'
import type { Character } from '../../types/character'
import type { DDClassSuggestion } from '../../types/dnd'
import { DNDCharacterSheet } from '../dnd/DNDCharacterSheet'
import { ClassSelector } from '../dnd/ClassSelector'
import { dndMappingService } from '../../services/dndMappingService'
import { useCharacterStore } from '../../stores/characterStore'
import { useCharacterDNDView } from '../../hooks/useCharacterDNDView'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export interface DNDCharacterViewProps {
  character: Character
  onCharacterUpdate?: (updates: Partial<Character>) => void
  readOnly?: boolean
  className?: string
}

export function DNDCharacterView({
  character,
  onCharacterUpdate,
  readOnly = false,
  className = ''
}: DNDCharacterViewProps) {
  const { updateCharacter } = useCharacterStore()
  const [showClassRecommendations, setShowClassRecommendations] = useState(false)
  const [classRecommendations, setClassRecommendations] = useState<DDClassSuggestion[]>([])

  // Use the D&D view hook for state management
  const {
    dndCharacter,
    isConverting,
    conversionError,
    convertToDND,
    refreshDNDData,
    canShowDNDView,
    hasUnsavedChanges,
    conversionStatus,
    statusMessage
  } = useCharacterDNDView({
    character,
    autoConvert: true,
    onConversionError: (error) => {
      console.error('D&D conversion failed:', error)
    }
  })

  // Load class recommendations when character data is available
  useEffect(() => {
    if (character && canShowDNDView) {
      try {
        const recommendations = dndMappingService.recommendClasses(character)
        setClassRecommendations(recommendations.slice(0, 5)) // Top 5 recommendations
      } catch (error) {
        console.error('Failed to generate class recommendations:', error)
        setClassRecommendations([])
      }
    }
  }, [character, canShowDNDView])

  // Handle character updates
  const handleCharacterUpdate = useCallback((updates: Partial<Character>) => {
    if (readOnly) return

    if (onCharacterUpdate) {
      onCharacterUpdate(updates)
    } else {
      updateCharacter(updates)
    }
  }, [readOnly, onCharacterUpdate, updateCharacter])

  // Handle class selection
  const handleClassSelection = useCallback((className: string) => {
    if (readOnly) return

    const selectedClass = dndMappingService.recommendClasses(character)
      .find(rec => rec.className === className)

    if (selectedClass) {
      const classData = {
        name: selectedClass.className,
        hitDie: 'd8', // Default, should come from class data
        skillPointsPerLevel: 4, // Default, should come from class data
        classSkills: [], // Should come from class data
        primaryAbility: 'Strength', // Should come from class data
        startingSkillRanks: {}
      }

      handleCharacterUpdate({
        characterClass: classData,
        level: character.level || 1
      })
    }
  }, [character, handleCharacterUpdate, readOnly])

  // Handle refresh request
  const handleRefresh = useCallback(async () => {
    await refreshDNDData()
  }, [refreshDNDData])

  if (!canShowDNDView) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">D&D View Unavailable</h3>
              <p className="text-gray-600 mb-4">
                This character needs ability scores or skills to display as a D&D character sheet.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>To enable D&D view:</p>
                <ul className="text-left max-w-xs mx-auto">
                  <li>• Roll ability scores (STR, DEX, CON, INT, WIS, CHA)</li>
                  <li>• Add skills through character generation</li>
                  <li>• Complete the character creation process</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (conversionStatus === 'converting') {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-xl font-medium">Converting to D&D Format</span>
              </div>
              <p className="text-gray-600">{statusMessage}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (conversionStatus === 'error') {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Conversion Failed</h3>
              <p className="text-red-600 mb-4">{conversionError || statusMessage}</p>
              <Button onClick={handleRefresh} variant="outline">
                🔄 Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Conversion Status Warning */}
      {hasUnsavedChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="text-yellow-600">⚠️</div>
              <div>
                <div className="font-medium text-yellow-800">Character Data Changed</div>
                <div className="text-sm text-yellow-700">
                  The D&D character sheet may be outdated. Refresh to see latest changes.
                </div>
              </div>
            </div>
            <Button onClick={handleRefresh} size="sm" variant="outline">
              🔄 Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Class Selection Prompt */}
      {!character.characterClass && classRecommendations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <span>⚔️</span>
              <span>Choose Your D&D Class</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-4">
              Based on your character's abilities and background, here are the recommended classes:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {classRecommendations.slice(0, 3).map((recommendation) => (
                <button
                  key={recommendation.className}
                  onClick={() => handleClassSelection(recommendation.className)}
                  disabled={readOnly}
                  className="p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">{recommendation.className}</span>
                    <Badge
                      variant={recommendation.potential === 'Excellent' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {recommendation.suitability}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {recommendation.reasons.slice(0, 2).join(', ')}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowClassRecommendations(!showClassRecommendations)}
                variant="outline"
                size="sm"
              >
                {showClassRecommendations ? 'Hide' : 'Show'} All Recommendations
              </Button>

              {!readOnly && (
                <Button
                  onClick={() => handleCharacterUpdate({ characterClass: undefined })}
                  variant="outline"
                  size="sm"
                >
                  Skip Class Selection
                </Button>
              )}
            </div>

            {/* Extended Recommendations */}
            {showClassRecommendations && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <ClassSelector
                  onClassSelected={(selectedClass) => {
                    handleClassSelection(selectedClass.name)
                    setShowClassRecommendations(false)
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conversion Info Panel */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎲</div>
              <div>
                <div className="font-medium text-gray-800">
                  D&D 3.5 Character Sheet
                  {character.characterClass && (
                    <span className="ml-2 text-gray-600">
                      • {character.characterClass.name} Level {character.level || 1}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Auto-converted from narrative character data
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                ✨ Generated
              </Badge>

              {!readOnly && (
                <Button onClick={handleRefresh} size="sm" variant="outline">
                  🔄 Refresh
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main D&D Character Sheet */}
      {dndCharacter ? (
        <DNDCharacterSheet className="w-full" />
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to Convert</h3>
              <p className="text-gray-600 mb-4">
                Click the button below to generate your D&D 3.5 character sheet.
              </p>
              <Button onClick={convertToDND} disabled={isConverting}>
                {isConverting ? 'Converting...' : 'Generate D&D Character Sheet'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Details (Debug/Development) */}
      {dndCharacter && process.env.NODE_ENV === 'development' && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            🔧 Conversion Details (Development)
          </summary>
          <Card className="mt-2 border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Ability Scores:</span>{' '}
                  STR {dndCharacter.abilities.strength.score} ({dndCharacter.abilities.strength.modifier >= 0 ? '+' : ''}{dndCharacter.abilities.strength.modifier}),{' '}
                  DEX {dndCharacter.abilities.dexterity.score} ({dndCharacter.abilities.dexterity.modifier >= 0 ? '+' : ''}{dndCharacter.abilities.dexterity.modifier}),{' '}
                  CON {dndCharacter.abilities.constitution.score} ({dndCharacter.abilities.constitution.modifier >= 0 ? '+' : ''}{dndCharacter.abilities.constitution.modifier}),{' '}
                  INT {dndCharacter.abilities.intelligence.score} ({dndCharacter.abilities.intelligence.modifier >= 0 ? '+' : ''}{dndCharacter.abilities.intelligence.modifier}),{' '}
                  WIS {dndCharacter.abilities.wisdom.score} ({dndCharacter.abilities.wisdom.modifier >= 0 ? '+' : ''}{dndCharacter.abilities.wisdom.modifier}),{' '}
                  CHA {dndCharacter.abilities.charisma.score} ({dndCharacter.abilities.charisma.modifier >= 0 ? '+' : ''}{dndCharacter.abilities.charisma.modifier})
                </div>

                <div>
                  <span className="font-medium">Converted Skills:</span>{' '}
                  {dndCharacter.skills.length > 0 ? (
                    dndCharacter.skills.map(skill =>
                      `${skill.name} (${skill.ranks} ranks, +${skill.total} total)`
                    ).join(', ')
                  ) : (
                    'None'
                  )}
                </div>

                <div>
                  <span className="font-medium">Class Recommendations:</span>{' '}
                  {classRecommendations.slice(0, 3).map(rec =>
                    `${rec.className} (${rec.suitability}%)`
                  ).join(', ')}
                </div>

                <div>
                  <span className="font-medium">Starting Wealth:</span>{' '}
                  {dndCharacter.money.gold} gold pieces
                </div>

                <div>
                  <span className="font-medium">Background Features:</span>{' '}
                  {dndCharacter.background || 'Auto-generated from character history'}
                </div>
              </div>
            </CardContent>
          </Card>
        </details>
      )}
    </div>
  )
}

// Simplified version for embedding in other components
export interface EmbeddedDNDCharacterViewProps {
  character: Character
  showHeader?: boolean
  showClassSelection?: boolean
}

export function EmbeddedDNDCharacterView({
  character,
  showHeader = true,
  showClassSelection: _showClassSelection = true
}: EmbeddedDNDCharacterViewProps) {
  return (
    <DNDCharacterView
      character={character}
      readOnly={true}
      className={`${!showHeader ? 'space-y-4' : ''}`}
    />
  )
}

// Wrapper for integration with existing character sheet tabs
export interface DNDCharacterTabProps {
  character: Character
  onCharacterUpdate?: (updates: Partial<Character>) => void
}

export function DNDCharacterTab({ character, onCharacterUpdate }: DNDCharacterTabProps) {
  if (!character) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎲</div>
          <p>No character selected</p>
        </div>
      </div>
    )
  }

  return (
    <DNDCharacterView
      character={character}
      onCharacterUpdate={onCharacterUpdate}
      className="max-w-none"
    />
  )
}