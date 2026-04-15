// Character Identity Step — unified first step combining name, ability scores,
// class, race, alignment, and level into a single cohesive block.

import { useState, useEffect, useCallback } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { DND_CORE_CLASSES, getClassByName, type DnDClass } from '../../data/dndClasses'
import { DND_CORE_RACES, BACKGROUND_DECIDED_ID, getAbilityModifierSummary } from '../../data/dndRaces'
import { AlignmentPicker } from './AlignmentPicker'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { abilMod } from '../../services/combatStatsService'
import type { DnDAlignmentCode } from '@/types/character'

interface CharacterIdentityStepProps {
  onComplete?: () => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(mod: number): string {
  return `${mod >= 0 ? '+' : ''}${mod}`
}

function abilityMod(score: number): number {
  return abilMod(score)
}

const ABILITY_LABELS: { key: keyof AbilityScores; short: string; full: string }[] = [
  { key: 'strength',     short: 'STR', full: 'Strength'     },
  { key: 'dexterity',    short: 'DEX', full: 'Dexterity'    },
  { key: 'constitution', short: 'CON', full: 'Constitution' },
  { key: 'intelligence', short: 'INT', full: 'Intelligence' },
  { key: 'wisdom',       short: 'WIS', full: 'Wisdom'       },
  { key: 'charisma',     short: 'CHA', full: 'Charisma'     },
]

interface AbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

// Class suitability based on primary ability modifier
function getClassSuitability(cls: DnDClass, scores: AbilityScores): { label: string; color: string } {
  const scoreMap: Record<string, number> = {
    strength:     scores.strength,
    dexterity:    scores.dexterity,
    constitution: scores.constitution,
    intelligence: scores.intelligence,
    wisdom:       scores.wisdom,
    charisma:     scores.charisma,
  }
  const mod = abilityMod(scoreMap[cls.primaryAbility.toLowerCase()] ?? 10)
  if (mod >= 3) return { label: 'Excellent', color: 'text-green-700 bg-green-100 border-green-200' }
  if (mod >= 1) return { label: 'Good fit',  color: 'text-yellow-700 bg-yellow-100 border-yellow-200' }
  if (mod >= 0) return { label: 'Adequate',  color: 'text-orange-700 bg-orange-100 border-orange-200' }
  return { label: 'Poor fit', color: 'text-red-700 bg-red-100 border-red-200' }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CharacterIdentityStep({ onComplete }: CharacterIdentityStepProps) {
  const {
    character,
    rollAbilityScores,
    updateCharacterName,
    updateCharacter,
    setDndRace,
    setDndAlignment,
    setCharacterLevel,
    recalcCombatStats,
  } = useCharacterStore()

  // Local UI state
  const [name, setName] = useState<string>(character?.name ?? '')
  const [selectedClass, setSelectedClass] = useState<DnDClass | null>(
    character?.characterClass ? getClassByName(character.characterClass.name) ?? null : null
  )
  const [selectedRaceId, setSelectedRaceId] = useState<string>(
    character?.dndRace?.id ?? BACKGROUND_DECIDED_ID
  )
  const [alignment, setAlignment] = useState<DnDAlignmentCode | undefined>(character?.dndAlignment)
  const [level, setLevel] = useState<number>(character?.level ?? 1)
  const [statsRolled, setStatsRolled] = useState(false)
  const [rollingAnimation, setRollingAnimation] = useState(false)
  const [expandedClass, setExpandedClass] = useState<string | null>(null)

  // Determine if scores are present
  useEffect(() => {
    if (
      character?.strength && character?.dexterity && character?.constitution &&
      character?.intelligence && character?.wisdom && character?.charisma
    ) {
      setStatsRolled(true)
    }
  }, [character])

  // Live ability scores from store (include racial modifiers)
  const scores: AbilityScores = {
    strength:     character?.strength     ?? 10,
    dexterity:    character?.dexterity    ?? 10,
    constitution: character?.constitution ?? 10,
    intelligence: character?.intelligence ?? 10,
    wisdom:       character?.wisdom       ?? 10,
    charisma:     character?.charisma     ?? 10,
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleRollStats = useCallback(() => {
    setRollingAnimation(true)
    rollAbilityScores()
    setStatsRolled(true)
    setTimeout(() => setRollingAnimation(false), 600)
  }, [rollAbilityScores])

  const handleNameChange = useCallback((value: string) => {
    setName(value)
    if (character) updateCharacterName(value)
  }, [character, updateCharacterName])

  const handleClassSelect = useCallback((cls: DnDClass) => {
    if (!character) return
    setSelectedClass(cls)
    updateCharacter({
      characterClass: {
        name: cls.name,
        hitDie: cls.hitDie,
        skillPointsPerLevel: cls.skillPointsPerLevel,
        classSkills: cls.classSkills,
        primaryAbility: cls.primaryAbility,
        startingSkillRanks: {},
      },
      level,
    })
    // If current alignment is now illegal for this class, clear it
    if (alignment) {
      const restrictionMap: Record<string, (c: DnDAlignmentCode) => boolean> = {
        Paladin:   (c) => c === 'LG',
        Monk:      (c) => c === 'LG' || c === 'LN' || c === 'LE',
        Bard:      (c) => c !== 'LG' && c !== 'LN' && c !== 'LE',
        Druid:     (c) => c === 'LN' || c === 'TN' || c === 'CN' || c === 'NG' || c === 'NE',
        Barbarian: (c) => c !== 'LG' && c !== 'LN' && c !== 'LE',
      }
      const check = restrictionMap[cls.name]
      if (check && !check(alignment)) {
        setAlignment(undefined)
      }
    }
    setTimeout(() => recalcCombatStats(), 0)
  }, [character, level, alignment, updateCharacter, recalcCombatStats])

  const handleRaceSelect = useCallback((raceId: string) => {
    setSelectedRaceId(raceId)
    if (raceId === BACKGROUND_DECIDED_ID) {
      setDndRace(null)
      updateCharacter({ raceSource: 'background', dndRace: undefined })
    } else {
      const race = DND_CORE_RACES.find(r => r.id === raceId) ?? null
      if (race) {
        setDndRace(race)
        updateCharacter({ raceSource: 'manual' })
      }
    }
  }, [setDndRace, updateCharacter])

  const handleAlignmentChange = useCallback((value: DnDAlignmentCode) => {
    setAlignment(value)
    setDndAlignment(value)
  }, [setDndAlignment])

  const handleLevelChange = useCallback((newLevel: number) => {
    const clamped = Math.max(1, Math.min(20, newLevel))
    setLevel(clamped)
    setCharacterLevel(clamped)
  }, [setCharacterLevel])

  const handleContinue = useCallback(() => {
    if (name.trim() && selectedClass && alignment) {
      if (character) updateCharacterName(name.trim())
      onComplete?.()
    }
  }, [name, selectedClass, alignment, character, updateCharacterName, onComplete])

  // ── Derived state ────────────────────────────────────────────────────────────

  const selectedRace = DND_CORE_RACES.find(r => r.id === selectedRaceId)
  const isBackgroundDecided = selectedRaceId === BACKGROUND_DECIDED_ID
  const canContinue = name.trim().length > 0 && !!selectedClass && !!alignment

  const QUICK_LEVELS = [1, 3, 5, 7, 10, 15, 20]

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ═══ Section header ═══════════════════════════════════════════════════ */}
      <div className="text-center pb-2 border-b-2 border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900">Character Identity</h2>
        <p className="text-sm text-amber-700 mt-1">
          Name your hero, roll ability scores, and choose class, race, and alignment — in any order you like.
        </p>
      </div>

      {/* ═══ Row 1: Name + Level (compact) ═══════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Character Name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-amber-800 mb-1">
            Character Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="Enter character name..."
            className={[
              'w-full px-4 py-2.5 border-2 rounded-lg text-base font-medium transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-amber-400',
              name.trim()
                ? 'border-amber-400 bg-amber-50 text-amber-900'
                : 'border-gray-300 bg-white text-gray-700 placeholder-gray-400',
            ].join(' ')}
          />
          {!name.trim() && (
            <p className="text-xs text-amber-600 mt-1">A name is required to continue.</p>
          )}
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-semibold text-amber-800 mb-1">Starting Level</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLevelChange(level - 1)}
              disabled={level <= 1}
              className="w-9 h-9 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-amber-50 hover:border-amber-400 disabled:opacity-40 font-bold text-lg leading-none"
              aria-label="Decrease level"
            >
              −
            </button>
            <span className="text-3xl font-bold text-amber-800 w-10 text-center select-none">{level}</span>
            <button
              type="button"
              onClick={() => handleLevelChange(level + 1)}
              disabled={level >= 20}
              className="w-9 h-9 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-amber-50 hover:border-amber-400 disabled:opacity-40 font-bold text-lg leading-none"
              aria-label="Increase level"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {QUICK_LEVELS.map(l => (
              <button
                key={l}
                type="button"
                onClick={() => handleLevelChange(l)}
                className={[
                  'px-2 py-0.5 rounded text-xs font-medium border transition-colors',
                  level === l
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'border-gray-300 text-gray-600 hover:bg-amber-50 hover:border-amber-400',
                ].join(' ')}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Row 2: Ability Scores ════════════════════════════════════════════ */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-amber-900 text-base">Ability Scores</h3>
            {selectedRace && Object.keys(selectedRace.abilityModifiers).length > 0 && (
              <p className="text-xs text-amber-700 mt-0.5">
                Racial adjustments applied: {getAbilityModifierSummary(selectedRace.abilityModifiers)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleRollStats}
            className={[
              'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2',
              statsRolled
                ? 'border-amber-400 bg-white text-amber-700 hover:bg-amber-100'
                : 'border-amber-600 bg-amber-600 text-white hover:bg-amber-700 shadow-md',
              rollingAnimation ? 'scale-95 opacity-75' : '',
            ].join(' ')}
          >
            <span className={rollingAnimation ? 'animate-spin inline-block' : ''}>
              {statsRolled ? '\u{1F3B2}' : '\u{1F3B2}'}
            </span>
            {statsRolled ? 'Reroll Scores' : 'Roll Ability Scores'}
          </button>
        </div>

        {statsRolled ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {ABILITY_LABELS.map(({ key, short, full }) => {
              const score = scores[key]
              const mod   = abilityMod(score)
              const base  = character?.baseAbilityScores?.[key]
              const racialDelta = base !== undefined ? score - base : 0
              return (
                <div
                  key={key}
                  className="flex flex-col items-center bg-white border-2 border-amber-200 rounded-lg p-2 shadow-sm"
                  title={`${full}: ${score} (${fmt(mod)})`}
                >
                  <span className="text-xs font-bold text-gray-500 tracking-wide">{short}</span>
                  <span className="text-2xl font-black text-amber-900 leading-tight">{score}</span>
                  <span className={`text-sm font-bold ${mod >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {fmt(mod)}
                  </span>
                  {racialDelta !== 0 && (
                    <span className={`text-xs font-semibold ${racialDelta > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                      ({fmt(racialDelta)} race)
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {ABILITY_LABELS.map(({ short }) => (
              <div
                key={short}
                className="flex flex-col items-center bg-white border-2 border-dashed border-amber-200 rounded-lg p-2 opacity-50"
              >
                <span className="text-xs font-bold text-gray-400 tracking-wide">{short}</span>
                <span className="text-2xl font-black text-gray-300">—</span>
                <span className="text-sm text-gray-300">—</span>
              </div>
            ))}
          </div>
        )}

        {!statsRolled && (
          <p className="text-center text-amber-700 text-sm mt-3 font-medium">
            Roll 4d6 (drop lowest) for each of the six ability scores.
          </p>
        )}
      </div>

      {/* ═══ Row 3: Class + Race side by side ════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Class picker — wider column */}
        <div className="lg:col-span-3">
          <h3 className="font-bold text-amber-900 text-base mb-2">
            Class <span className="text-red-500">*</span>
            {selectedClass && (
              <Badge className="ml-2 text-xs bg-amber-100 text-amber-800 border border-amber-300">
                {selectedClass.name} selected
              </Badge>
            )}
          </h3>
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
            {DND_CORE_CLASSES.map(cls => {
              const suit      = statsRolled ? getClassSuitability(cls, scores) : null
              const isSelected = selectedClass?.name === cls.name
              const isExpanded = expandedClass === cls.name

              return (
                <div
                  key={cls.name}
                  className={[
                    'rounded-lg border-2 transition-all',
                    isSelected
                      ? 'border-amber-500 bg-amber-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-amber-300',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2 px-3 py-2">
                    {/* Select button */}
                    <button
                      type="button"
                      onClick={() => handleClassSelect(cls)}
                      className={[
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors',
                        isSelected
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-gray-300 hover:border-amber-400',
                      ].join(' ')}
                      aria-label={`Select ${cls.name}`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    {/* Class name + badges */}
                    <div
                      className="flex-1 flex flex-wrap items-center gap-1.5 cursor-pointer min-w-0"
                      onClick={() => handleClassSelect(cls)}
                    >
                      <span className={`font-semibold text-sm ${isSelected ? 'text-amber-800' : 'text-gray-800'}`}>
                        {cls.name}
                      </span>
                      <span className="text-xs text-gray-400">{cls.hitDie}</span>
                      {cls.spellcasting !== 'None' && (
                        <span className="text-xs text-purple-600 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded font-medium">
                          {cls.spellcasting} caster
                        </span>
                      )}
                      {suit && (
                        <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${suit.color}`}>
                          {suit.label}
                        </span>
                      )}
                    </div>

                    {/* Expand/collapse details */}
                    <button
                      type="button"
                      onClick={() => setExpandedClass(isExpanded ? null : cls.name)}
                      className="text-gray-400 hover:text-amber-600 text-xs px-1.5 py-0.5 rounded hover:bg-amber-50 flex-shrink-0"
                      aria-label={isExpanded ? 'Hide details' : 'Show details'}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>

                  {/* Expanded detail row */}
                  {isExpanded && (
                    <div className="px-3 pb-2 pt-0 border-t border-gray-100 mt-1">
                      <p className="text-xs text-gray-500 mb-1">{cls.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        <span><strong>BAB:</strong> {cls.baseAttackBonus}</span>
                        <span><strong>Skills:</strong> {cls.skillPointsPerLevel}+INT/lvl</span>
                        <span>
                          <strong>Good saves:</strong>{' '}
                          {[
                            cls.fortitudeSave === 'Good' && 'Fort',
                            cls.reflexSave    === 'Good' && 'Ref',
                            cls.willSave      === 'Good' && 'Will',
                          ].filter(Boolean).join(', ') || 'None'}
                        </span>
                        <span><strong>Primary:</strong> {cls.primaryAbility}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cls.classFeatures.map(f => (
                          <span key={f} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Race picker — narrower column */}
        <div className="lg:col-span-2">
          <h3 className="font-bold text-amber-900 text-base mb-2">Race</h3>
          <div className="space-y-1.5">

            {/* Background-decided option */}
            <button
              type="button"
              onClick={() => handleRaceSelect(BACKGROUND_DECIDED_ID)}
              className={[
                'w-full text-left px-3 py-2 rounded-lg border-2 transition-all text-sm',
                isBackgroundDecided
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 bg-white hover:border-amber-300',
              ].join(' ')}
            >
              <div className="font-semibold text-gray-700">Decide from Background</div>
              <div className="text-xs text-gray-400 mt-0.5">Let the heritage tables determine your race</div>
            </button>

            {/* Core races */}
            {DND_CORE_RACES.map(race => {
              const isSelected = selectedRaceId === race.id
              const modSummary = getAbilityModifierSummary(race.abilityModifiers)
              return (
                <button
                  key={race.id}
                  type="button"
                  onClick={() => handleRaceSelect(race.id)}
                  className={[
                    'w-full text-left px-3 py-2 rounded-lg border-2 transition-all',
                    isSelected
                      ? 'border-amber-500 bg-amber-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-amber-300',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-amber-800' : 'text-gray-800'}`}>
                      {race.name}
                    </span>
                    <span className="text-xs text-gray-400">{race.size} · {race.speed}ft</span>
                  </div>
                  {modSummary !== 'No ability modifiers' && (
                    <div className="text-xs text-blue-700 mt-0.5 font-medium">{modSummary}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-0.5">{race.favoredClass !== 'Any' ? `Favored: ${race.favoredClass}` : 'Favored: Any class'}</div>
                </button>
              )
            })}
          </div>

          {/* Race traits summary */}
          {selectedRace && !isBackgroundDecided && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs font-semibold text-blue-800 mb-1">Key traits:</div>
              <ul className="space-y-0.5">
                {selectedRace.racialTraits.slice(0, 3).map(trait => (
                  <li key={trait.name} className="text-xs text-blue-700">
                    <span className="font-medium">{trait.name}</span>
                    {trait.mechanical && <span className="text-blue-500"> — {trait.mechanical}</span>}
                  </li>
                ))}
                {selectedRace.racialTraits.length > 3 && (
                  <li className="text-xs text-blue-500">+{selectedRace.racialTraits.length - 3} more traits</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Row 4: Alignment ════════════════════════════════════════════════ */}
      <div>
        <h3 className="font-bold text-amber-900 text-base mb-2">
          Alignment <span className="text-red-500">*</span>
          {selectedClass && (
            <span className="text-xs text-amber-600 font-normal ml-2">
              {selectedClass.name} restrictions apply
            </span>
          )}
        </h3>
        <AlignmentPicker
          value={alignment}
          onChange={handleAlignmentChange}
          forClass={selectedClass?.name}
        />
      </div>

      {/* ═══ Continue ════════════════════════════════════════════════════════ */}
      <div className="sticky bottom-0 bg-white border-t-2 border-amber-200 pt-3 pb-1">
        {/* Inline validation hints */}
        {(!name.trim() || !selectedClass || !alignment) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 justify-center">
            {!name.trim() && (
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                Enter a character name
              </span>
            )}
            {!selectedClass && (
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                Choose a class
              </span>
            )}
            {!alignment && (
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                Pick an alignment
              </span>
            )}
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {canContinue
            ? `Continue — ${name.trim()}, ${selectedClass!.name} ${level > 1 ? `(Level ${level})` : ''} · ${alignment} · ${isBackgroundDecided ? 'Race TBD' : selectedRace?.name ?? ''}`
            : 'Complete required fields to continue'}
        </Button>
      </div>
    </div>
  )
}
