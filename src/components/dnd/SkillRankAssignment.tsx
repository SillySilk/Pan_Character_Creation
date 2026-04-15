// D&D 3.5 Skill Rank Assignment
// Rules: class skill = 1 pt/rank, max level+3; cross-class = 2 pt/rank, max (level+3)/2

import { useState, useMemo } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { DND_CORE_SKILLS } from '../../data/dndSkills'
import { DND_CORE_CLASSES } from '../../data/dndClasses'
import {
  maxClassRanks,
  maxCrossClassRanks,
  calcSkillPointBudget,
  calcPointsSpent,
  computeSynergies,
  SKILL_SYNERGIES,
} from '../../services/skillService'
import { abilMod } from '../../services/combatStatsService'

interface SkillRankAssignmentProps {
  onComplete?: () => void
}

const ABILITY_LABELS: Record<string, string> = {
  Strength: 'STR', Dexterity: 'DEX', Constitution: 'CON',
  Intelligence: 'INT', Wisdom: 'WIS', Charisma: 'CHA',
}

const ABILITY_COLORS: Record<string, string> = {
  Strength: 'text-red-700', Dexterity: 'text-green-700', Constitution: 'text-orange-700',
  Intelligence: 'text-blue-700', Wisdom: 'text-purple-700', Charisma: 'text-pink-700',
}

export function SkillRankAssignment({ onComplete }: SkillRankAssignmentProps) {
  const { character, updateSkillRanks } = useCharacterStore()

  // Local ranks state — initialized from store
  const [ranks, setRanks] = useState<Record<string, number>>(() => {
    const stored = character?.dndIntegration?.skillBonuses ?? {}
    const init: Record<string, number> = {}
    for (const skill of DND_CORE_SKILLS) {
      init[skill.name] = stored[skill.name]?.ranks ?? 0
    }
    return init
  })

  const [filter, setFilter] = useState<'all' | 'class' | 'cross'>('all')
  const [search, setSearch] = useState('')

  if (!character) return <div className="p-6 text-gray-500">No character loaded.</div>

  const cls = character.characterClass
    ? DND_CORE_CLASSES.find(c => c.name === character.characterClass!.name)
    : null
  const level = character.level ?? 1

  const str  = character.strength     ?? 10
  const dex  = character.dexterity    ?? 10
  const con  = character.constitution ?? 10
  const int_ = character.intelligence ?? 10
  const wis  = character.wisdom       ?? 10
  const cha  = character.charisma     ?? 10

  const intMod = abilMod(int_)
  const isHuman = character.dndRace?.name === 'Human' || character.race?.type === 'Human'

  const budget = cls
    ? calcSkillPointBudget(
        cls.skillPointsPerLevel, intMod, level, isHuman,
        character.dndRace?.bonusSkillPointsAtFirst ?? 0,
        character.dndRace?.bonusSkillPointsPerLevel ?? 0,
      )
    : 0

  const classSkillNames = cls?.classSkills ?? []

  const isClassSkill = (skillName: string) =>
    classSkillNames.some(
      cs => cs.toLowerCase() === skillName.toLowerCase()
        || skillName.toLowerCase().startsWith(cs.toLowerCase()),
    )

  const spent = calcPointsSpent(ranks, classSkillNames)
  const remaining = budget - spent

  const synergyMap = useMemo(() => computeSynergies(ranks), [ranks])

  // Ability score lookup
  const abilScore = (ability: string): number => {
    switch (ability) {
      case 'Strength':     return str
      case 'Dexterity':    return dex
      case 'Constitution': return con
      case 'Intelligence': return int_
      case 'Wisdom':       return wis
      case 'Charisma':     return cha
      default:             return 10
    }
  }

  function fmt(n: number) { return n >= 0 ? `+${n}` : `${n}` }

  const adjustRank = (skillName: string, delta: number) => {
    const current = ranks[skillName] ?? 0
    const isClass = isClassSkill(skillName)
    const maxR = isClass ? maxClassRanks(level) : maxCrossClassRanks(level)
    const cost = isClass ? 1 : 2

    const newRank = Math.max(0, Math.min(maxR, current + delta))
    const pointDelta = (newRank - current) * cost

    // Don't allow overspending
    if (pointDelta > remaining) return

    setRanks(prev => ({ ...prev, [skillName]: newRank }))
  }

  const handleSave = () => {
    updateSkillRanks(ranks)
    onComplete?.()
  }

  // Synergy sources and what they grant — for tooltip display
  const synergyGrants = (skillName: string): string[] =>
    SKILL_SYNERGIES
      .filter(s => s.source === skillName)
      .map(s => `+${s.bonus} ${s.target}${s.note ? ` (${s.note})` : ''}`)

  const synergyReceives = (skillName: string): string[] =>
    SKILL_SYNERGIES
      .filter(s => s.target === skillName && (ranks[s.source] ?? 0) >= 5)
      .map(s => `+${s.bonus} from ${s.source}`)

  // Filtered + searched skill list
  const visibleSkills = DND_CORE_SKILLS.filter(skill => {
    if (search && !skill.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'class'  && !isClassSkill(skill.name)) return false
    if (filter === 'cross'  &&  isClassSkill(skill.name)) return false
    return true
  })

  // Group by ability
  const grouped: Record<string, typeof visibleSkills> = {}
  for (const skill of visibleSkills) {
    if (!grouped[skill.keyAbility]) grouped[skill.keyAbility] = []
    grouped[skill.keyAbility].push(skill)
  }
  const abilityOrder = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']

  const budgetPct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
  const overBudget = remaining < 0

  return (
    <div className="space-y-4">

      {/* Header / budget */}
      <div className="bg-white rounded-lg border-2 border-amber-500 p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h2 className="text-xl font-bold text-amber-800">Assign Skill Ranks</h2>
            {cls ? (
              <p className="text-sm text-gray-600">
                {cls.name} level {level} — {cls.skillPointsPerLevel}+INT/level
                {isHuman && ' (+1 Human)'}
              </p>
            ) : (
              <p className="text-sm text-amber-600">Select a class first to allocate skill points.</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className={`text-3xl font-bold ${overBudget ? 'text-red-600' : remaining === 0 ? 'text-green-700' : 'text-amber-800'}`}>
              {remaining}
            </div>
            <div className="text-xs text-gray-500">points left</div>
            <div className="text-xs text-gray-400">{spent} / {budget} spent</div>
          </div>
        </div>

        {/* Budget bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div
            className={`h-2.5 rounded-full transition-all ${overBudget ? 'bg-red-500' : budgetPct >= 95 ? 'bg-amber-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, budgetPct)}%` }}
          />
        </div>

        {/* Quick rules reminder */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-400 inline-block" />
            Class skill — 1 pt/rank, max {maxClassRanks(level)}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-300 inline-block" />
            Cross-class — 2 pts/rank, max {maxCrossClassRanks(level)}
          </span>
          {Object.keys(synergyMap).length > 0 && (
            <span className="flex items-center gap-1 text-blue-600">
              <span className="text-blue-500">⟳</span>
              Synergy bonuses active
            </span>
          )}
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm">
          {(['all', 'class', 'cross'] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 transition-colors ${filter === f ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {f === 'all' ? 'All' : f === 'class' ? 'Class' : 'Cross-Class'}
            </button>
          ))}
        </div>
      </div>

      {/* Skill groups */}
      {abilityOrder.map(ability => {
        const skills = grouped[ability]
        if (!skills || skills.length === 0) return null
        const abilScore_ = abilScore(ability)
        const mod = abilMod(abilScore_)

        return (
          <div key={ability} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Ability header */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span className={`text-sm font-bold ${ABILITY_COLORS[ability]}`}>
                {ABILITY_LABELS[ability]}
              </span>
              <span className="text-sm text-gray-700 font-semibold">{ability}</span>
              <span className="text-sm text-gray-500">
                {abilScore_} ({fmt(mod)})
              </span>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-2 px-4 py-1 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
              <span>Skill</span>
              <span className="w-10 text-center">Rnks</span>
              <span className="w-6 text-center">+</span>
              <span className="w-14 text-center">Mod</span>
              <span className="w-14 text-center">Syn</span>
              <span className="w-14 text-center font-semibold text-gray-700">Total</span>
            </div>

            {/* Skill rows */}
            {skills.map(skill => {
              const isClass = isClassSkill(skill.name)
              const maxR = isClass ? maxClassRanks(level) : maxCrossClassRanks(level)
              const r = ranks[skill.name] ?? 0
              const racial = character.dndIntegration?.skillBonuses?.[skill.name]?.racial ?? 0
              const synBonus = synergyMap[skill.name] ?? 0
              const mod_ = abilMod(abilScore(skill.keyAbility))
              const total = r + mod_ + synBonus + racial
              const grants = synergyGrants(skill.name)
              const receives = synergyReceives(skill.name)

              const canIncrease = r < maxR && (remaining >= (isClass ? 1 : 2))
              const canDecrease = r > 0

              return (
                <div
                  key={skill.name}
                  className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-2 px-4 py-1.5 border-b border-gray-50 last:border-b-0 items-center text-sm ${
                    isClass ? 'bg-green-50/30' : 'bg-white'
                  }`}
                >
                  {/* Skill name + badges */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`truncate ${isClass ? 'text-gray-800' : 'text-gray-500'}`}>
                      {skill.name}
                    </span>
                    {skill.trainedOnly && r === 0 && (
                      <span className="text-xs text-gray-400 italic shrink-0">trained</span>
                    )}
                    {skill.armorCheckPenalty && (
                      <span className="text-xs text-orange-500 shrink-0" title="Armor check penalty applies">ACP</span>
                    )}
                    {grants.length > 0 && (
                      <span
                        className={`text-xs shrink-0 ${r >= 5 ? 'text-blue-600' : 'text-gray-400'}`}
                        title={`5 ranks grants: ${grants.join(', ')}`}
                      >
                        {r >= 5 ? '⟳' : '○'}
                      </span>
                    )}
                    {receives.length > 0 && (
                      <span
                        className="text-xs text-blue-600 shrink-0"
                        title={receives.join(', ')}
                      >
                        ★
                      </span>
                    )}
                    {racial > 0 && (
                      <span className="text-xs text-purple-600 shrink-0" title="Racial bonus">R</span>
                    )}
                  </div>

                  {/* Rank stepper */}
                  <div className="flex items-center gap-0.5 w-10 justify-center">
                    <button
                      type="button"
                      onClick={() => adjustRank(skill.name, -1)}
                      disabled={!canDecrease}
                      className="w-5 h-5 flex items-center justify-center rounded text-xs border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-gray-600"
                    >−</button>
                    <span className={`w-5 text-center text-sm font-semibold ${r > 0 ? 'text-amber-700' : 'text-gray-400'}`}>
                      {r}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustRank(skill.name, 1)}
                      disabled={!canIncrease}
                      className="w-5 h-5 flex items-center justify-center rounded text-xs border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-gray-600"
                    >+</button>
                  </div>

                  {/* Max ranks indicator */}
                  <div className="w-6 text-center">
                    <span className={`text-xs ${r >= maxR ? 'text-amber-600 font-semibold' : 'text-gray-300'}`}>
                      {r >= maxR ? 'MAX' : `/${maxR}`}
                    </span>
                  </div>

                  {/* Ability mod */}
                  <div className={`w-14 text-center text-xs ${ABILITY_COLORS[skill.keyAbility]}`}>
                    {fmt(mod_)}
                  </div>

                  {/* Synergy */}
                  <div className={`w-14 text-center text-xs ${synBonus > 0 ? 'text-blue-600 font-semibold' : 'text-gray-300'}`}>
                    {synBonus > 0 ? fmt(synBonus) : '—'}
                  </div>

                  {/* Total */}
                  <div className={`w-14 text-center font-bold ${
                    r === 0 && skill.trainedOnly
                      ? 'text-gray-300'
                      : total >= 10 ? 'text-green-700' : total >= 5 ? 'text-amber-700' : 'text-gray-700'
                  }`}>
                    {r === 0 && skill.trainedOnly ? '—' : fmt(total)}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Footer save */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        {overBudget && (
          <p className="text-red-600 text-sm text-center mb-2 font-medium">
            Over budget by {Math.abs(remaining)} points — remove some ranks before saving.
          </p>
        )}
        <div className="flex gap-3">
          <div className="flex-1 text-sm text-gray-500 flex items-center">
            {remaining === 0
              ? '✓ All skill points allocated'
              : remaining > 0
              ? `${remaining} point${remaining !== 1 ? 's' : ''} unspent`
              : `${Math.abs(remaining)} points over budget`}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={overBudget}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Skills & Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
