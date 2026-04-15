// D&D 3.5 Comprehensive Skill Sheet Component

import { useCharacterStore } from '../../stores/characterStore'
import { DND_CORE_SKILLS, getAbilityModifier, calculateSkillBonus, type DnDSkill } from '../../data/dndSkills'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface SkillSheetProps {
  showOnlyClassSkills?: boolean
  showDescriptions?: boolean
  compact?: boolean
}

export function SkillSheet({ showOnlyClassSkills = false, showDescriptions = false, compact = false }: SkillSheetProps) {
  const { character } = useCharacterStore()

  if (!character) {
    return (
      <Card className="p-4">
        <CardContent>
          <p className="text-medieval-600">No character data available</p>
        </CardContent>
      </Card>
    )
  }

  const getAbilityScore = (ability: string): number => {
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

  const getSkillRanks = (skillName: string): number => {
    if (!character.skills) return 0
    const skill = character.skills.find(s => s.name === skillName)
    return skill?.rank || 0
  }

  const isClassSkill = (skillName: string): boolean => {
    return character.characterClass?.classSkills.includes(skillName) || false
  }

  const getSkillsToDisplay = (): DnDSkill[] => {
    if (!showOnlyClassSkills || !character.characterClass) {
      return DND_CORE_SKILLS
    }
    return DND_CORE_SKILLS.filter(skill => character.characterClass!.classSkills.includes(skill.name))
  }

  const skillsToDisplay = getSkillsToDisplay()

  const groupSkillsByAbility = (): Record<string, DnDSkill[]> => {
    return skillsToDisplay.reduce((groups, skill) => {
      const ability = skill.keyAbility
      if (!groups[ability]) {
        groups[ability] = []
      }
      groups[ability].push(skill)
      return groups
    }, {} as Record<string, DnDSkill[]>)
  }

  const skillGroups = groupSkillsByAbility()
  const abilities = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']

  const renderSkillRow = (skill: DnDSkill) => {
    const ranks = getSkillRanks(skill.name)
    const abilityScore = getAbilityScore(skill.keyAbility)
    const isClass = isClassSkill(skill.name)
    const skillCalc = calculateSkillBonus(skill, ranks, abilityScore, isClass)
    
    const totalModifier = skillCalc.total
    const canUse = skillCalc.canUseUntrained

    return (
      <tr key={skill.name} className={`border-b border-medieval-200 hover:bg-medieval-50 ${!canUse ? 'opacity-60' : ''}`}>
        <td className="py-2 px-3">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${!canUse ? 'line-through' : ''}`}>
              {skill.name}
            </span>
            {isClass && (
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                Class
              </Badge>
            )}
            {skill.trainedOnly && (
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                T
              </Badge>
            )}
            {skill.armorCheckPenalty && (
              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                ACP
              </Badge>
            )}
          </div>
          {showDescriptions && !compact && (
            <div className="text-xs text-medieval-600 mt-1">{skill.description}</div>
          )}
        </td>
        <td className="py-2 px-3 text-center text-sm font-mono">
          {skill.keyAbility.substr(0, 3).toUpperCase()}
        </td>
        <td className="py-2 px-3 text-center font-mono">
          {ranks}
        </td>
        <td className="py-2 px-3 text-center font-mono">
          {skillCalc.abilityModifier >= 0 ? '+' : ''}{skillCalc.abilityModifier}
        </td>
        <td className="py-2 px-3 text-center font-mono">
          0
        </td>
        <td className="py-2 px-3 text-center font-mono font-bold">
          {totalModifier >= 0 ? '+' : ''}{totalModifier}
        </td>
        {!compact && (
          <td className="py-2 px-3 text-xs text-medieval-600">
            {!canUse ? 'Cannot use untrained' : skill.useUntrained || '—'}
          </td>
        )}
      </tr>
    )
  }

  const renderAbilitySection = (ability: string) => {
    const abilitySkills = skillGroups[ability] || []
    if (abilitySkills.length === 0) return null

    const abilityScore = getAbilityScore(ability)
    const abilityMod = getAbilityModifier(abilityScore)

    return (
      <div key={ability} className="mb-6">
        <div className="bg-medieval-100 px-3 py-2 rounded-t-lg border-b-2 border-medieval-300">
          <h4 className="font-semibold text-medieval-800 flex items-center gap-2">
            {ability} ({abilityScore})
            <Badge variant="outline" className="text-xs">
              {abilityMod >= 0 ? '+' : ''}{abilityMod}
            </Badge>
            <span className="text-sm font-normal text-medieval-600">
              ({abilitySkills.length} skills)
            </span>
          </h4>
        </div>
        <table className="w-full">
          <tbody>
            {abilitySkills.map(renderSkillRow)}
          </tbody>
        </table>
      </div>
    )
  }

  const totalSkillPoints = character.characterClass 
    ? character.characterClass.skillPointsPerLevel + getAbilityModifier(character.intelligence || 10)
    : 0

  const usedSkillPoints = character.skills 
    ? character.skills.reduce((total, skill) => total + skill.rank, 0) 
    : 0

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-medieval-800">
            D&D 3.5 Skills
            {character.characterClass && (
              <span className="text-lg font-normal text-medieval-600 ml-2">
                ({character.characterClass.name})
              </span>
            )}
          </CardTitle>
          {character.characterClass && (
            <div className="text-sm text-medieval-600">
              <div>Skill Points: {usedSkillPoints} / {totalSkillPoints} per level</div>
              <div>Available: {Math.max(0, totalSkillPoints - usedSkillPoints)}</div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Skills Header */}
        <div className="mb-4">
          <table className="w-full">
            <thead>
              <tr className="bg-medieval-200 text-medieval-800 text-sm">
                <th className="py-2 px-3 text-left font-semibold">Skill Name</th>
                <th className="py-2 px-3 text-center font-semibold">Key</th>
                <th className="py-2 px-3 text-center font-semibold">Ranks</th>
                <th className="py-2 px-3 text-center font-semibold">Ability</th>
                <th className="py-2 px-3 text-center font-semibold">Misc</th>
                <th className="py-2 px-3 text-center font-semibold">Total</th>
                {!compact && <th className="py-2 px-3 text-center font-semibold">Untrained</th>}
              </tr>
            </thead>
          </table>
        </div>

        {/* Skills by Ability */}
        <div className="space-y-4">
          {abilities.map(renderAbilitySection)}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-parchment-50 rounded-lg">
          <h4 className="font-semibold text-medieval-800 mb-2">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-medieval-700">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">Class</Badge>
              <span>Class skill</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">T</Badge>
              <span>Trained only</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">ACP</Badge>
              <span>Armor check penalty</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="line-through">Skill</span>
              <span>Cannot use untrained</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {character.characterClass && (
          <div className="mt-4 p-4 bg-medieval-100 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-semibold text-medieval-800">Class Skills</div>
                <div className="text-medieval-700">{character.characterClass.classSkills.length}</div>
              </div>
              <div>
                <div className="font-semibold text-medieval-800">Skills with Ranks</div>
                <div className="text-medieval-700">{character.skills?.length || 0}</div>
              </div>
              <div>
                <div className="font-semibold text-medieval-800">Trainable Skills</div>
                <div className="text-medieval-700">{DND_CORE_SKILLS.filter(s => !s.trainedOnly).length}</div>
              </div>
              <div>
                <div className="font-semibold text-medieval-800">Max Rank</div>
                <div className="text-medieval-700">{character.level || 1} + 3</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}