// D&D 3.5 Character Sheet - Primary Interface for Character Building
import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { DND_CORE_SKILLS, calculateSkillBonus, getAbilityModifier } from '../../data/dndSkills'
import { DND_CORE_CLASSES } from '../../data/dndClasses'
import { getClassByName } from '../../data/dndClasses'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

interface DNDCharacterSheetProps {
  className?: string
}

export function DNDCharacterSheet({ className = '' }: DNDCharacterSheetProps) {
  const { character, updateCharacter, createNewCharacter } = useCharacterStore()
  const [skillPointsToSpend, setSkillPointsToSpend] = useState<Record<string, number>>({})

  // Ensure we have a character to work with
  useEffect(() => {
    if (!character) {
      createNewCharacter('New Character')
    }
  }, [character, createNewCharacter])

  // Calculate available skill points
  const calculateAvailableSkillPoints = () => {
    if (!character?.characterClass || !character?.intelligence) return 0
    const basePoints = character.characterClass.skillPointsPerLevel
    const intMod = getAbilityModifier(character.intelligence)
    const level = character.level || 1
    return (basePoints + intMod) * level
  }

  // Calculate spent skill points
  const calculateSpentSkillPoints = () => {
    if (!character?.skills) return 0
    return character.skills.reduce((total, skill) => {
      const isClassSkill = character?.characterClass?.classSkills.includes(skill.name) || false
      return total + (isClassSkill ? skill.rank : skill.rank * 2)
    }, 0)
  }

  // Roll ability scores (4d6 drop lowest)
  const rollAbilityScores = () => {
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
      rolls.sort((a, b) => b - a)
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
    }

    const newStats = {
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat()
    }

    updateCharacter({ ...character, ...newStats, lastModified: new Date() })
  }

  // Handle class selection
  const handleClassSelection = (className: string) => {
    const selectedClass = getClassByName(className)
    if (!selectedClass) return

    updateCharacter({
      ...character,
      characterClass: {
        name: selectedClass.name,
        hitDie: selectedClass.hitDie,
        skillPointsPerLevel: selectedClass.skillPointsPerLevel,
        classSkills: selectedClass.classSkills,
        primaryAbility: selectedClass.primaryAbility,
        startingSkillRanks: {}
      },
      level: character?.level || 1,
      lastModified: new Date()
    })
  }

  // Handle skill point allocation
  const allocateSkillPoint = (skillName: string, increment: boolean) => {
    if (!character?.skills || !character?.characterClass) return

    const currentSkills = [...character.skills]
    const skillIndex = currentSkills.findIndex(s => s.name === skillName)
    const isClassSkill = character.characterClass.classSkills.includes(skillName)
    const maxRank = (character.level || 1) + 3
    const cost = isClassSkill ? 1 : 2

    const availablePoints = calculateAvailableSkillPoints() - calculateSpentSkillPoints()

    if (skillIndex >= 0) {
      const currentRank = currentSkills[skillIndex].rank
      
      if (increment) {
        // Add skill point
        if (currentRank < maxRank && availablePoints >= cost) {
          currentSkills[skillIndex].rank += 1
        }
      } else {
        // Remove skill point
        if (currentRank > 0) {
          currentSkills[skillIndex].rank -= 1
          if (currentSkills[skillIndex].rank === 0) {
            currentSkills.splice(skillIndex, 1)
          }
        }
      }
    } else if (increment) {
      // Add new skill
      if (availablePoints >= cost) {
        currentSkills.push({
          name: skillName,
          rank: 1,
          type: 'Combat',
          source: 'Character Creation',
          description: DND_CORE_SKILLS.find(s => s.name === skillName)?.description || ''
        })
      }
    }

    updateCharacter({ ...character, skills: currentSkills, lastModified: new Date() })
  }

  // Get skill rank for display
  const getSkillRank = (skillName: string): number => {
    if (!character?.skills) return 0
    const skill = character.skills.find(s => s.name === skillName)
    return skill?.rank || 0
  }

  // Calculate ability modifier
  const getAbilityScore = (ability: string): number => {
    if (!character) return 10
    switch (ability.toLowerCase()) {
      case 'strength': return character.strength || 10
      case 'dexterity': return character.dexterity || 10
      case 'constitution': return character.constitution || 10
      case 'intelligence': return character.intelligence || 10
      case 'wisdom': return character.wisdom || 10
      case 'charisma': return character.charisma || 10
      default: return 10
    }
  }

  // Early return if no character yet
  if (!character) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-lg font-medium">Loading Character Sheet...</div>
              <div className="text-sm text-gray-600 mt-2">Initializing D&D 3.5 character</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const availablePoints = calculateAvailableSkillPoints()
  const spentPoints = calculateSpentSkillPoints()
  const remainingPoints = availablePoints - spentPoints

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Character Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">D&D 3.5 Character Sheet</CardTitle>
              <div className="text-sm text-gray-600 mt-1">
                <input
                  type="text"
                  value={character?.name || ''}
                  onChange={(e) => updateCharacter({ ...character, name: e.target.value, lastModified: new Date() })}
                  placeholder="Character Name"
                  className="text-lg font-medium bg-transparent border-none outline-none"
                />
              </div>
            </div>
            {character?.characterClass && (
              <div className="text-right">
                <div className="font-medium">{character.characterClass.name}</div>
                <div className="text-sm text-gray-600">Level {character?.level || 1}</div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Abilities and Class */}
        <div className="space-y-6">
          {/* Ability Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Ability Scores</span>
                <Button onClick={rollAbilityScores} size="sm">
                  🎲 Roll Stats
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'].map(ability => {
                const score = getAbilityScore(ability)
                const modifier = getAbilityModifier(score)
                return (
                  <div key={ability} className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">{ability}</span>
                    <div className="text-right">
                      <span className="font-mono text-lg">{score}</span>
                      <span className="ml-2 text-sm text-gray-600">
                        ({modifier >= 0 ? '+' : ''}{modifier})
                      </span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Class Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Class Selection</CardTitle>
            </CardHeader>
            <CardContent>
              {!character?.characterClass ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">Choose your character class:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {DND_CORE_CLASSES.map(cls => (
                      <Button
                        key={cls.name}
                        onClick={() => handleClassSelection(cls.name)}
                        variant="outline"
                        className="text-left justify-start"
                      >
                        <div>
                          <div className="font-medium">{cls.name}</div>
                          <div className="text-xs text-gray-500">{cls.hitDie} • {cls.skillPointsPerLevel}+Int skills</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{character.characterClass.name}</h3>
                      <p className="text-sm text-gray-600">{character.characterClass.hitDie} Hit Die</p>
                    </div>
                    <Button
                      onClick={() => updateCharacter({ ...character, characterClass: undefined, skills: [], lastModified: new Date() })}
                      variant="outline"
                      size="sm"
                    >
                      Change
                    </Button>
                  </div>
                  <div className="text-sm">
                    <p><strong>Primary:</strong> {character.characterClass.primaryAbility}</p>
                    <p><strong>Skills/Level:</strong> {character.characterClass.skillPointsPerLevel} + Int mod</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skill Points Summary */}
          {character?.characterClass && (
            <Card>
              <CardHeader>
                <CardTitle>Skill Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className="font-mono">{availablePoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spent:</span>
                    <span className="font-mono">{spentPoints}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Remaining:</span>
                    <span className={`font-mono ${remainingPoints < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {remainingPoints}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Skills */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              {!character?.characterClass && (
                <p className="text-sm text-gray-600">Select a class to allocate skill points</p>
              )}
            </CardHeader>
            <CardContent>
              {character?.characterClass ? (
                <div className="space-y-1">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 border-b pb-2 mb-2">
                    <div className="col-span-4">Skill</div>
                    <div className="col-span-2 text-center">Key</div>
                    <div className="col-span-2 text-center">Ranks</div>
                    <div className="col-span-2 text-center">Mod</div>
                    <div className="col-span-2 text-center">Total</div>
                  </div>
                  
                  {DND_CORE_SKILLS.map(skill => {
                    const isClassSkill = character.characterClass!.classSkills.includes(skill.name)
                    const ranks = getSkillRank(skill.name)
                    const abilityScore = getAbilityScore(skill.keyAbility)
                    const skillCalc = calculateSkillBonus(skill, ranks, abilityScore, isClassSkill)
                    const maxRank = (character.level || 1) + 3
                    const cost = isClassSkill ? 1 : 2

                    return (
                      <div key={skill.name} className={`grid grid-cols-12 gap-2 items-center py-1 text-sm hover:bg-gray-50 ${!skillCalc.canUseUntrained ? 'opacity-60' : ''}`}>
                        <div className="col-span-4">
                          <div className="flex items-center gap-1">
                            <span className={!skillCalc.canUseUntrained ? 'line-through' : ''}>{skill.name}</span>
                            {isClassSkill && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">C</Badge>
                            )}
                            {skill.trainedOnly && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">T</Badge>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 text-center text-xs">{skill.keyAbility.substring(0, 3).toUpperCase()}</div>
                        <div className="col-span-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              onClick={() => allocateSkillPoint(skill.name, false)}
                              disabled={ranks <= 0}
                              size="sm"
                              variant="outline"
                              className="w-6 h-6 p-0 text-xs"
                            >
                              −
                            </Button>
                            <span className="font-mono w-8 text-center">{ranks}</span>
                            <Button
                              onClick={() => allocateSkillPoint(skill.name, true)}
                              disabled={ranks >= maxRank || remainingPoints < cost}
                              size="sm"
                              variant="outline"
                              className="w-6 h-6 p-0 text-xs"
                            >
                              +
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {isClassSkill ? '1pt' : '2pt'} • max {maxRank}
                          </div>
                        </div>
                        <div className="col-span-2 text-center font-mono">
                          {skillCalc.abilityModifier >= 0 ? '+' : ''}{skillCalc.abilityModifier}
                        </div>
                        <div className="col-span-2 text-center font-mono font-medium">
                          {skillCalc.total >= 0 ? '+' : ''}{skillCalc.total}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Roll ability scores and select a class to begin allocating skill points</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}