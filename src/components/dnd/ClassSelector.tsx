// D&D 3.5 Class Selection Component

import React, { useState } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { DND_CORE_CLASSES, getClassByName, type DnDClass } from '../../data/dndClasses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

interface ClassSelectorProps {
  onClassSelected?: (selectedClass: DnDClass) => void
  onComplete?: () => void
}

export function ClassSelector({ onClassSelected, onComplete }: ClassSelectorProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [selectedClass, setSelectedClass] = useState<DnDClass | null>(
    character?.characterClass ? getClassByName(character.characterClass.name) || null : null
  )
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const handleClassSelection = (dndClass: DnDClass) => {
    if (!character) return

    // Update character with selected class
    const updatedCharacter = {
      ...character,
      characterClass: {
        name: dndClass.name,
        hitDie: dndClass.hitDie,
        skillPointsPerLevel: dndClass.skillPointsPerLevel,
        classSkills: dndClass.classSkills,
        primaryAbility: dndClass.primaryAbility,
        startingSkillRanks: {}
      },
      level: 1,
      lastModified: new Date()
    }

    setSelectedClass(dndClass)
    updateCharacter(updatedCharacter)
    onClassSelected?.(dndClass)
  }

  const handleContinue = () => {
    if (selectedClass) {
      onComplete?.()
    }
  }

  const getAbilityScoreForClass = (abilityName: string): number => {
    if (!character) return 10
    
    switch (abilityName.toLowerCase()) {
      case 'strength': return character.strength || 10
      case 'dexterity': return character.dexterity || 10
      case 'constitution': return character.constitution || 10
      case 'intelligence': return character.intelligence || 10
      case 'wisdom': return character.wisdom || 10
      case 'charisma': return character.charisma || 10
      default: return 10
    }
  }

  const getClassSuitability = (dndClass: DnDClass): { score: number; description: string } => {
    const primaryScore = getAbilityScoreForClass(dndClass.primaryAbility)
    const modifier = Math.floor((primaryScore - 10) / 2)
    
    if (modifier >= 3) return { score: 90, description: 'Excellent fit' }
    if (modifier >= 1) return { score: 75, description: 'Good fit' }
    if (modifier >= 0) return { score: 60, description: 'Adequate fit' }
    if (modifier >= -1) return { score: 45, description: 'Below average fit' }
    return { score: 25, description: 'Poor fit' }
  }

  const getSuitabilityColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  if (!character) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Class Selection</CardTitle>
          <CardDescription>Create a character first to select a class</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-medieval-800">
            Choose Your D&D 3.5 Class
          </CardTitle>
          <CardDescription>
            Select a class that matches your character's abilities and play style
          </CardDescription>
        </CardHeader>

        {/* Character Stats Summary */}
        <div className="bg-parchment-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-medieval-800 mb-2">Your Ability Scores</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><strong>STR:</strong> {character.strength || 10} ({Math.floor(((character.strength || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((character.strength || 10) - 10) / 2)})</div>
            <div><strong>DEX:</strong> {character.dexterity || 10} ({Math.floor(((character.dexterity || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((character.dexterity || 10) - 10) / 2)})</div>
            <div><strong>CON:</strong> {character.constitution || 10} ({Math.floor(((character.constitution || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((character.constitution || 10) - 10) / 2)})</div>
            <div><strong>INT:</strong> {character.intelligence || 10} ({Math.floor(((character.intelligence || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((character.intelligence || 10) - 10) / 2)})</div>
            <div><strong>WIS:</strong> {character.wisdom || 10} ({Math.floor(((character.wisdom || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((character.wisdom || 10) - 10) / 2)})</div>
            <div><strong>CHA:</strong> {character.charisma || 10} ({Math.floor(((character.charisma || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((character.charisma || 10) - 10) / 2)})</div>
          </div>
        </div>

        {/* Class List */}
        <div className="grid gap-4">
          {DND_CORE_CLASSES.map((dndClass) => {
            const suitability = getClassSuitability(dndClass)
            const isSelected = selectedClass?.name === dndClass.name
            const isExpanded = showDetails === dndClass.name

            return (
              <Card 
                key={dndClass.name}
                className={`cursor-pointer transition-colors ${
                  isSelected 
                    ? 'ring-2 ring-amber-500 bg-amber-50' 
                    : 'hover:bg-medieval-50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 
                          className="text-lg font-semibold text-medieval-800 cursor-pointer"
                          onClick={() => handleClassSelection(dndClass)}
                        >
                          {dndClass.name}
                        </h4>
                        <Badge className={`text-xs px-2 py-1 ${getSuitabilityColor(suitability.score)}`}>
                          {suitability.description}
                        </Badge>
                      </div>
                      <p className="text-medieval-600 text-sm mb-2">{dndClass.description}</p>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-medieval-700">
                        <span><strong>Hit Die:</strong> {dndClass.hitDie}</span>
                        <span><strong>Skills/Level:</strong> {dndClass.skillPointsPerLevel} + Int mod</span>
                        <span><strong>Primary:</strong> {dndClass.primaryAbility}</span>
                        {dndClass.spellcasting !== 'None' && (
                          <span><strong>Spells:</strong> {dndClass.spellcasting}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleClassSelection(dndClass)}
                        variant={isSelected ? "default" : "outline"}
                        className={isSelected ? "bg-amber-600 hover:bg-amber-700" : ""}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowDetails(isExpanded ? null : dndClass.name)}
                      >
                        {isExpanded ? 'Hide' : 'Details'}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-medieval-200 space-y-3">
                      <div>
                        <h5 className="font-medium text-medieval-800 mb-1">Save Progressions</h5>
                        <div className="text-sm text-medieval-700 flex gap-4">
                          <span><strong>Fort:</strong> {dndClass.fortitudeSave}</span>
                          <span><strong>Ref:</strong> {dndClass.reflexSave}</span>
                          <span><strong>Will:</strong> {dndClass.willSave}</span>
                          <span><strong>BAB:</strong> {dndClass.baseAttackBonus}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-medieval-800 mb-1">Class Skills</h5>
                        <div className="text-xs text-medieval-600 flex flex-wrap gap-1">
                          {dndClass.classSkills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-medieval-800 mb-1">Key Features</h5>
                        <div className="text-xs text-medieval-600 flex flex-wrap gap-1">
                          {dndClass.classFeatures.slice(0, 5).map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {dndClass.classFeatures.length > 5 && (
                            <span className="text-xs text-medieval-500">
                              +{dndClass.classFeatures.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Continue Button */}
        {selectedClass && (
          <div className="flex justify-center pt-6 border-t border-medieval-200 mt-6">
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Continue with {selectedClass.name}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}