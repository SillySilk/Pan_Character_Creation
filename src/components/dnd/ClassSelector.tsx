// D&D 3.5 Class + Level + Alignment Selection Component

import { useState, useEffect } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { DND_CORE_CLASSES, getClassByName, type DnDClass } from '../../data/dndClasses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { AlignmentPicker } from './AlignmentPicker'
import {
  calcCombatStats,
  calcHPTotal,
  abilMod,
  calcGeneralFeatCount,
  calcFighterBonusFeatCount,
  calcAvailableSkillPoints,
} from '../../services/combatStatsService'
import type { DnDAlignmentCode } from '@/types/character'

interface ClassSelectorProps {
  onClassSelected?: (selectedClass: DnDClass) => void
  onComplete?: () => void
}

function fmt(mod: number): string {
  return `${mod >= 0 ? '+' : ''}${mod}`
}

function abilityMod(score: number | undefined): number {
  return abilMod(score ?? 10)
}

export function ClassSelector({ onClassSelected, onComplete }: ClassSelectorProps) {
  const { character, updateCharacter, setDndAlignment, setCharacterLevel, recalcCombatStats } = useCharacterStore()

  const [selectedClass, setSelectedClass] = useState<DnDClass | null>(
    character?.characterClass ? getClassByName(character.characterClass.name) ?? null : null
  )
  const [level, setLevel] = useState<number>(character?.level ?? 1)
  const [alignment, setAlignment] = useState<DnDAlignmentCode | undefined>(character?.dndAlignment)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  // Sync level/alignment back to store whenever they change
  useEffect(() => {
    if (character) setCharacterLevel(level)
  }, [level])

  useEffect(() => {
    if (character && alignment) setDndAlignment(alignment)
  }, [alignment])

  const handleClassSelection = (dndClass: DnDClass) => {
    if (!character) return
    updateCharacter({
      characterClass: {
        name: dndClass.name,
        hitDie: dndClass.hitDie,
        skillPointsPerLevel: dndClass.skillPointsPerLevel,
        classSkills: dndClass.classSkills,
        primaryAbility: dndClass.primaryAbility,
        startingSkillRanks: {},
      },
      level,
    })
    setSelectedClass(dndClass)
    onClassSelected?.(dndClass)
    // Trigger HP + combat stat recalc
    setTimeout(() => recalcCombatStats(), 0)
  }

  const handleContinue = () => {
    if (selectedClass && alignment) onComplete?.()
  }

  // ── Ability score helpers ──────────────────────────────────────────────────
  const str  = character?.strength     ?? 10
  const dex  = character?.dexterity    ?? 10
  const con  = character?.constitution ?? 10
  const int_ = character?.intelligence ?? 10
  const wis  = character?.wisdom       ?? 10
  const cha  = character?.charisma     ?? 10

  const getAbilityScoreForClass = (abilityName: string): number => {
    switch (abilityName.toLowerCase()) {
      case 'strength':     return str
      case 'dexterity':    return dex
      case 'constitution': return con
      case 'intelligence': return int_
      case 'wisdom':       return wis
      case 'charisma':     return cha
      default:             return 10
    }
  }

  const getClassSuitability = (cls: DnDClass) => {
    const mod = abilityMod(getAbilityScoreForClass(cls.primaryAbility))
    if (mod >= 3) return { score: 90, description: 'Excellent fit' }
    if (mod >= 1) return { score: 75, description: 'Good fit' }
    if (mod >= 0) return { score: 60, description: 'Adequate fit' }
    if (mod >= -1) return { score: 45, description: 'Below average' }
    return { score: 25, description: 'Poor fit' }
  }

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-100'
    if (score >= 60) return 'text-yellow-700 bg-yellow-100'
    return 'text-red-700 bg-red-100'
  }

  // ── HP & combat stat preview for selected class ────────────────────────────
  const hpPreview = selectedClass
    ? calcHPTotal(selectedClass.hitDie, level, abilityMod(con))
    : null

  const intMod = abilityMod(int_)

  const combatPreview = selectedClass
    ? calcCombatStats({
        babProgression:  selectedClass.baseAttackBonus,
        fortProgression: selectedClass.fortitudeSave,
        refProgression:  selectedClass.reflexSave,
        willProgression: selectedClass.willSave,
        level, str, dex, con, int: int_, wis, cha,
        baseSpeed: character?.dndRace?.speed ?? 30,
      })
    : null

  const isHuman = character?.dndRace?.name === 'Human' || character?.race?.type === 'Human'
  const featCount = selectedClass
    ? calcGeneralFeatCount(level, isHuman)
    : null
  const fighterBonusFeats = selectedClass?.name === 'Fighter'
    ? calcFighterBonusFeatCount(level)
    : 0

  const skillPoints = selectedClass
    ? calcAvailableSkillPoints(
        selectedClass.skillPointsPerLevel,
        intMod,
        level,
        isHuman,
        character?.dndRace?.bonusSkillPointsAtFirst ?? 0,
        character?.dndRace?.bonusSkillPointsPerLevel ?? 0,
      )
    : null

  if (!character) return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Class Selection</CardTitle>
        <CardDescription>Create a character first to select a class</CardDescription>
      </CardHeader>
    </Card>
  )

  const canContinue = !!selectedClass && !!alignment

  return (
    <div className="space-y-6">

      {/* ── Ability score summary ── */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-amber-800 mb-3">Your Ability Scores</h3>
          <div className="grid grid-cols-6 gap-2 text-sm text-center">
            {[
              ['STR', str], ['DEX', dex], ['CON', con],
              ['INT', int_], ['WIS', wis], ['CHA', cha],
            ].map(([label, score]) => (
              <div key={label as string} className="bg-amber-50 rounded p-2">
                <div className="text-xs text-gray-500 font-medium">{label}</div>
                <div className="text-lg font-bold text-amber-900">{score}</div>
                <div className="text-xs text-purple-700 font-semibold">{fmt(abilityMod(score as number))}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Level picker ── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Character Level:
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLevel(l => Math.max(1, l - 1))}
                disabled={level <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 font-bold"
              >−</button>
              <span className="text-2xl font-bold text-amber-800 w-8 text-center">{level}</span>
              <button
                type="button"
                onClick={() => setLevel(l => Math.min(20, l + 1))}
                disabled={level >= 20}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 font-bold"
              >+</button>
            </div>
            <div className="flex flex-wrap gap-1">
              {[1,3,5,7,10,15,20].map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                    level === l
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Class list ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-amber-800">Choose Your Class</CardTitle>
          <CardDescription>Select a class that matches your abilities and play style</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {DND_CORE_CLASSES.map((cls) => {
            const suit = getClassSuitability(cls)
            const isSelected = selectedClass?.name === cls.name
            const isExpanded = showDetails === cls.name

            return (
              <div
                key={cls.name}
                className={`rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className="text-base font-semibold text-gray-900 cursor-pointer hover:text-amber-700"
                          onClick={() => handleClassSelection(cls)}
                        >
                          {cls.name}
                        </span>
                        <Badge className={`text-xs ${getSuitabilityColor(suit.score)}`}>
                          {suit.description}
                        </Badge>
                        {cls.spellcasting !== 'None' && (
                          <Badge variant="outline" className="text-xs text-purple-700 border-purple-300">
                            {cls.spellcasting} spellcaster
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{cls.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                        <span><strong>HD:</strong> {cls.hitDie}</span>
                        <span><strong>BAB:</strong> {cls.baseAttackBonus}</span>
                        <span><strong>Skills:</strong> {cls.skillPointsPerLevel}+INT/lvl</span>
                        <span><strong>Good saves:</strong> {[
                          cls.fortitudeSave === 'Good' && 'Fort',
                          cls.reflexSave    === 'Good' && 'Ref',
                          cls.willSave      === 'Good' && 'Will',
                        ].filter(Boolean).join(', ') || 'None'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleClassSelection(cls)}
                        variant={isSelected ? 'default' : 'outline'}
                        className={isSelected ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
                      >
                        {isSelected ? '✓ Selected' : 'Select'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowDetails(isExpanded ? null : cls.name)}
                      >
                        {isExpanded ? 'Hide' : 'Details'}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-600">Class Skills: </span>
                        <span className="text-xs text-gray-500">{cls.classSkills.join(', ')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cls.classFeatures.map((f) => (
                          <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* ── Combat stats preview (shown once class selected) ── */}
      {selectedClass && combatPreview && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-amber-800 mb-3">
              {selectedClass.name} Level {level} Preview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">Hit Points</div>
                <div className="text-2xl font-bold text-red-700">{hpPreview}</div>
                <div className="text-xs text-gray-400">avg method</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">Base Attack</div>
                <div className="text-xl font-bold text-blue-700">
                  {combatPreview.bab.map(b => fmt(b)).join('/')}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">Initiative</div>
                <div className="text-2xl font-bold text-green-700">{fmt(combatPreview.initiative)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">Speed</div>
                <div className="text-2xl font-bold text-purple-700">{combatPreview.speed}</div>
                <div className="text-xs text-gray-400">ft/round</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-xs text-gray-500">Fortitude</div>
                <div className="font-bold text-gray-800">{fmt(combatPreview.fortitude)}</div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-xs text-gray-500">Reflex</div>
                <div className="font-bold text-gray-800">{fmt(combatPreview.reflex)}</div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-xs text-gray-500">Will</div>
                <div className="font-bold text-gray-800">{fmt(combatPreview.will)}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 bg-gray-50 rounded p-2">
              <span>Feats: <strong>{featCount}</strong>{fighterBonusFeats > 0 && ` + ${fighterBonusFeats} fighter bonus`}</span>
              <span>Skill points: <strong>{skillPoints}</strong> total</span>
              <span>Grapple: <strong>{fmt(combatPreview.grapple)}</strong></span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Alignment picker ── */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-amber-800 mb-1">Alignment</h3>
          <p className="text-sm text-gray-500 mb-3">Choose your character's moral and ethical outlook.</p>
          <AlignmentPicker
            value={alignment}
            onChange={setAlignment}
            forClass={selectedClass?.name}
          />
        </CardContent>
      </Card>

      {/* ── Continue button ── */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-0 py-3">
        {!selectedClass && (
          <p className="text-sm text-amber-700 text-center mb-2">Select a class to continue</p>
        )}
        {selectedClass && !alignment && (
          <p className="text-sm text-amber-700 text-center mb-2">Choose an alignment to continue</p>
        )}
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
          className="w-full bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
        >
          {canContinue
            ? `Continue as ${selectedClass!.name} (Level ${level}) — ${alignment}`
            : 'Complete class & alignment to continue'}
        </Button>
      </div>
    </div>
  )
}
