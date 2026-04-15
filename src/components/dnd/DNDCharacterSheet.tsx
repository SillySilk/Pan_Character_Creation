// D&D 3.5 Character Sheet - Primary Interface for Character Building
import { useState, useEffect } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { DND_CORE_SKILLS, calculateSkillBonus, getAbilityModifier } from '../../data/dndSkills'
import { DND_CORE_CLASSES, getClassByName } from '../../data/dndClasses'
import { DND_CORE_RACES, BACKGROUND_DECIDED_ID, getAbilityModifierSummary } from '../../data/dndRaces'
import { calcGeneralFeatCount, calcFighterBonusFeatCount } from '../../services/combatStatsService'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { CharacterPreview } from '../ui/CharacterPreview'
import { FeatSelector } from './FeatSelector'
import { EquipmentPanel } from './EquipmentPanel'
import { LanguagesSpellsPanel } from './LanguagesSpellsPanel'

type SheetTab = 'identity' | 'skills' | 'feats' | 'equipment' | 'languages' | 'traits'

const TAB_ORDER: SheetTab[] = ['identity', 'skills', 'feats', 'equipment', 'languages', 'traits']

const TABS_LABEL: Record<SheetTab, string> = {
  identity:  'Identity & Stats',
  skills:    'Skills',
  feats:     'Feats',
  equipment: 'Equipment',
  languages: 'Languages & Spells',
  traits:    'Traits & Details',
}

// Small "Next Section →" button rendered at the bottom of each tab panel.
// Disabled until the current tab's completion predicate is satisfied.
function NextSectionButton({
  enabled,
  nextLabel,
  hint,
  onClick,
}: {
  enabled: boolean
  nextLabel: string
  hint?: string
  onClick: () => void
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
      {!enabled && hint && (
        <span className="text-xs text-gray-500 italic">{hint}</span>
      )}
      <button
        type="button"
        onClick={enabled ? onClick : undefined}
        disabled={!enabled}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          enabled
            ? 'bg-amber-600 hover:bg-amber-700 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next: {nextLabel} →
      </button>
    </div>
  )
}

interface DNDCharacterSheetProps {
  className?: string
  onStartBackground?: () => void
}

export function DNDCharacterSheet({ className = '', onStartBackground }: DNDCharacterSheetProps) {
  const { character, updateCharacter, createNewCharacter, setDndRace, rollAbilityScores } = useCharacterStore()
  const [activeTab, setActiveTab] = useState<SheetTab>('identity')

  useEffect(() => {
    if (!character) createNewCharacter('New Character')
  }, [character, createNewCharacter])

  // ── Skill point math ──────────────────────────────────────────────────────
  const calculateAvailableSkillPoints = () => {
    if (!character?.characterClass || !character?.intelligence) return 0
    const basePoints = character.characterClass.skillPointsPerLevel
    const intMod = getAbilityModifier(character.intelligence)
    const level = character.level || 1
    const raceBonusFirst = character.dndRace?.bonusSkillPointsAtFirst ?? 0
    const raceBonusPerLevel = character.dndRace?.bonusSkillPointsPerLevel ?? 0
    const firstLevel = Math.max(1, basePoints + intMod + raceBonusFirst) * 4
    const laterLevels = Math.max(0, basePoints + intMod + raceBonusPerLevel) * Math.max(0, level - 1)
    return firstLevel + laterLevels
  }

  const calculateSpentSkillPoints = () => {
    if (!character?.skills) return 0
    return character.skills.reduce((total, skill) => {
      const isClassSkill = character?.characterClass?.classSkills.includes(skill.name) || false
      return total + (isClassSkill ? skill.rank : skill.rank * 2)
    }, 0)
  }

  // ── Race ─────────────────────────────────────────────────────────────────
  const handleRaceSelect = (raceId: string) => {
    if (raceId === BACKGROUND_DECIDED_ID) {
      setDndRace(null)
      updateCharacter({ ...character, raceSource: 'background', dndRace: undefined, lastModified: new Date() })
    } else {
      const race = DND_CORE_RACES.find(r => r.id === raceId)
      if (race) setDndRace(race)
    }
  }

  // ── Class ─────────────────────────────────────────────────────────────────
  const handleClassSelection = (name: string) => {
    const cls = getClassByName(name)
    if (!cls) return
    updateCharacter({
      ...character,
      characterClass: {
        name: cls.name,
        hitDie: cls.hitDie,
        skillPointsPerLevel: cls.skillPointsPerLevel,
        classSkills: cls.classSkills,
        primaryAbility: cls.primaryAbility,
        startingSkillRanks: {}
      },
      level: character?.level || 1,
      lastModified: new Date()
    })
  }

  // ── Skills ───────────────────────────────────────────────────────────────
  const allocateSkillPoint = (skillName: string, increment: boolean) => {
    if (!character?.skills || !character?.characterClass) return
    const currentSkills = [...character.skills]
    const idx = currentSkills.findIndex(s => s.name === skillName)
    const isClassSkill = character.characterClass.classSkills.includes(skillName)
    const maxRank = (character.level || 1) + 3
    const cost = isClassSkill ? 1 : 2
    const available = calculateAvailableSkillPoints() - calculateSpentSkillPoints()

    if (idx >= 0) {
      if (increment) {
        if (currentSkills[idx].rank < maxRank && available >= cost) currentSkills[idx].rank += 1
      } else {
        if (currentSkills[idx].rank > 0) {
          currentSkills[idx].rank -= 1
          if (currentSkills[idx].rank === 0) currentSkills.splice(idx, 1)
        }
      }
    } else if (increment && available >= cost) {
      currentSkills.push({
        name: skillName, rank: 1, type: 'Combat', source: 'Character Creation',
        description: DND_CORE_SKILLS.find(s => s.name === skillName)?.description || ''
      })
    }
    updateCharacter({ ...character, skills: currentSkills, lastModified: new Date() })
  }

  const getSkillRank = (skillName: string) => character?.skills?.find(s => s.name === skillName)?.rank ?? 0

  const getAbilityScore = (ability: string): number => {
    if (!character) return 10
    const map: Record<string, number> = {
      strength: character.strength || 10, dexterity: character.dexterity || 10,
      constitution: character.constitution || 10, intelligence: character.intelligence || 10,
      wisdom: character.wisdom || 10, charisma: character.charisma || 10,
    }
    return map[ability.toLowerCase()] ?? 10
  }

  // ── Gate check ───────────────────────────────────────────────────────────
  const isReadyForBackground = !!(
    character?.name?.trim() &&
    character?.characterClass &&
    (character?.raceSource === 'background' || character?.dndRace)
  )

  if (!character) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-lg font-medium">Loading Character Sheet…</div>
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

  // ── Tab completion predicates ─────────────────────────────────────────────
  const isIdentityComplete = !!(
    character.name?.trim() &&
    character.characterClass &&
    (character.raceSource === 'background' || character.dndRace) &&
    character.baseAbilityScores
  )

  const isSkillsComplete =
    isIdentityComplete && availablePoints > 0 && remainingPoints === 0

  const isHuman =
    character.dndRace?.name === 'Human' || character.race?.type === 'Human'
  const level = character.level ?? 1
  const expectedGeneralFeats = isIdentityComplete
    ? calcGeneralFeatCount(level, isHuman)
    : 0
  const expectedFighterFeats =
    character.characterClass?.name === 'Fighter'
      ? calcFighterBonusFeatCount(level)
      : 0
  const isFeatsComplete =
    isSkillsComplete &&
    (character.selectedFeats?.length ?? 0) >= expectedGeneralFeats &&
    (character.fighterBonusFeats?.length ?? 0) >= expectedFighterFeats

  // Equipment: require at least one weapon equipped OR armor chosen OR currency set.
  // Equipment panel persists state via its own Save button.
  const armorId = character.equippedArmor?.armorId
  const hasArmorChoice = !!armorId && armorId !== 'none'
  const hasCurrency = !!character.currency && (
    (character.currency.gp ?? 0) > 0 ||
    (character.currency.pp ?? 0) > 0 ||
    (character.currency.sp ?? 0) > 0 ||
    (character.currency.cp ?? 0) > 0
  )
  const isEquipmentComplete =
    isFeatsComplete &&
    ((character.equippedWeapons?.length ?? 0) > 0 || hasArmorChoice || hasCurrency)

  // Languages: all INT-bonus slots filled.
  const intMod = getAbilityModifier(character.intelligence ?? 10)
  const expectedBonusLangs = Math.max(0, intMod)
  const isLanguagesComplete =
    isEquipmentComplete &&
    (character.bonusLanguages?.length ?? 0) >= expectedBonusLangs

  // Traits/appearance is optional flavor — considered complete once languages are.
  const isTraitsComplete = isLanguagesComplete

  const tabCompletion: Record<SheetTab, boolean> = {
    identity:  isIdentityComplete,
    skills:    isSkillsComplete,
    feats:     isFeatsComplete,
    equipment: isEquipmentComplete,
    languages: isLanguagesComplete,
    traits:    isTraitsComplete,
  }

  const canAccessTab = (tab: SheetTab): boolean => {
    const idx = TAB_ORDER.indexOf(tab)
    if (idx <= 0) return true
    return TAB_ORDER.slice(0, idx).every(t => tabCompletion[t])
  }

  const advanceTab = (from: SheetTab) => {
    const idx = TAB_ORDER.indexOf(from)
    if (idx >= 0 && idx < TAB_ORDER.length - 1) setActiveTab(TAB_ORDER[idx + 1])
  }

  const nextTabLabel = (from: SheetTab): string => {
    const idx = TAB_ORDER.indexOf(from)
    const next = TAB_ORDER[idx + 1]
    return next ? TABS_LABEL[next] : ''
  }

  // ── TAB LABELS ────────────────────────────────────────────────────────────
  const TABS: { id: SheetTab; label: string }[] = TAB_ORDER.map(id => ({
    id,
    label: TABS_LABEL[id],
  }))

  return (
    <div className={`space-y-0 ${className}`}>
      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={character.name || ''}
            onChange={e => updateCharacter({ ...character, name: e.target.value, lastModified: new Date() })}
            placeholder="Character Name…"
            className="text-xl font-semibold bg-transparent border-b border-gray-300 outline-none w-full max-w-xs focus:border-amber-500 truncate"
          />
          {character.characterClass && (
            <div className="text-xs text-gray-500 mt-0.5">
              {character.characterClass.name} • Level {character.level || 1}
              {character.dndRace ? ` • ${character.dndRace.name}` : character.raceSource === 'background' ? ' • Race TBD' : ''}
            </div>
          )}
        </div>
        {onStartBackground && (
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Button
              onClick={onStartBackground}
              disabled={!isReadyForBackground}
              className={`text-sm ${isReadyForBackground ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              🎭 Generate Background →
            </Button>
            {!isReadyForBackground && (
              <p className="text-xs text-gray-500 text-right">
                {!character.name?.trim() ? 'Enter a name'
                  : !character.characterClass ? 'Select a class'
                  : 'Choose a race or "Decided by Background"'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200 bg-white">
        {TABS.map(tab => {
          const unlocked = canAccessTab(tab.id)
          const done = tabCompletion[tab.id]
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => unlocked && setActiveTab(tab.id)}
              disabled={!unlocked}
              title={unlocked ? tab.label : 'Complete the previous section to unlock'}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'border-amber-500 text-amber-700'
                  : !unlocked
                  ? 'border-transparent text-gray-300 cursor-not-allowed'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {!unlocked && <span className="text-xs">🔒</span>}
              {tab.label}
              {done && unlocked && <span className="text-green-600 text-xs">✓</span>}
            </button>
          )
        })}
      </div>

      {/* ── Mobile preview (collapsible) ─────────────────────────────────── */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-amber-800 list-none flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform">▶</span>
            Live Character Preview
          </summary>
          <div className="mt-3">
            <CharacterPreview character={character} compact />
          </div>
        </details>
      </div>

      {/* ── Body: tab content + sticky preview sidebar ───────────────────── */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">

      {/* ══════════════════════════════════════════════════════════════════
          TAB 1 — Identity & Stats
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'identity' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ── Ability Scores ─────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-base">
                  <span>Ability Scores</span>
                  <Button onClick={rollAbilityScores} size="sm" className="text-xs">
                    🎲 Roll Stats
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'].map(ability => {
                    const score = getAbilityScore(ability)
                    const mod = getAbilityModifier(score)
                    const raceMods = character.dndRace?.abilityModifiers as Record<string,number> | undefined
                    const racialMod = raceMods ? (raceMods[ability.toLowerCase()] ?? 0) : 0
                    const base = character.baseAbilityScores
                      ? ((character.baseAbilityScores as Record<string,number>)[ability.toLowerCase()] ?? score)
                      : score

                    return (
                      <div key={ability} className="flex items-center justify-between border-b border-gray-100 py-1.5">
                        <div className="text-sm font-medium text-gray-700">{ability.slice(0, 3).toUpperCase()}</div>
                        <div className="flex items-center gap-2">
                          {racialMod !== 0 && (
                            <span className="text-xs text-gray-400 font-mono">{base}</span>
                          )}
                          {racialMod !== 0 && (
                            <span className={`text-xs font-mono ${racialMod > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                              {racialMod > 0 ? '+' : ''}{racialMod}
                            </span>
                          )}
                          <span className="font-mono font-bold text-base w-6 text-right">{score}</span>
                          <span className="text-xs text-gray-500 font-mono w-8 text-center">
                            ({mod >= 0 ? '+' : ''}{mod})
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {!character.baseAbilityScores && (
                  <p className="text-xs text-gray-400 italic mt-2 text-center">Click "Roll Stats" to generate ability scores</p>
                )}
              </CardContent>
            </Card>

            {/* ── Race + Class stacked ───────────────────────────────────── */}
            <div className="space-y-4">
              {/* Race — compact pill selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Race</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Background option */}
                  <button
                    onClick={() => handleRaceSelect(BACKGROUND_DECIDED_ID)}
                    className={`w-full text-left px-3 py-2 rounded-lg border-2 text-sm transition-colors ${
                      character.raceSource === 'background'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 font-medium'
                        : 'border-dashed border-gray-300 hover:border-amber-400 text-gray-600'
                    }`}
                  >
                    🎲 Decided by Background
                  </button>

                  {/* Race pill grid */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {DND_CORE_RACES.map(race => {
                      const isSelected = character.dndRace?.id === race.id
                      const modSummary = getAbilityModifierSummary(race.abilityModifiers)
                      return (
                        <button
                          key={race.id}
                          onClick={() => handleRaceSelect(race.id)}
                          className={`text-left px-2.5 py-2 rounded-lg border transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
                          }`}
                        >
                          <div className={`text-sm font-medium ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                            {race.name}
                          </div>
                          <div className={`text-xs font-mono mt-0.5 ${
                            modSummary === 'No ability modifiers' ? 'text-gray-400' : 'text-blue-600'
                          }`}>
                            {modSummary === 'No ability modifiers' ? '—' : modSummary}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Selected race — inline detail strip */}
                  {character.dndRace && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-800">{character.dndRace.name}</span>
                        <span className="text-gray-500">{character.dndRace.size} • {character.dndRace.speed} ft.</span>
                      </div>
                      <div className="text-blue-700 font-mono">{getAbilityModifierSummary(character.dndRace.abilityModifiers)}</div>
                      <div className="text-gray-600">
                        {character.dndRace.racialTraits.slice(0, 3).map(t => t.name).join(' • ')}
                        {character.dndRace.racialTraits.length > 3 && ` +${character.dndRace.racialTraits.length - 3} more`}
                      </div>
                      <div className="text-gray-500">Favored class: {character.dndRace.favoredClass}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Class — compact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Class</CardTitle>
                </CardHeader>
                <CardContent>
                  {!character.characterClass ? (
                    <div className="grid grid-cols-2 gap-1">
                      {DND_CORE_CLASSES.map(cls => (
                        <button
                          key={cls.name}
                          onClick={() => handleClassSelection(cls.name)}
                          className="text-left px-2.5 py-2 rounded-lg border border-gray-200 hover:border-amber-400 hover:bg-amber-50/40 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-800">{cls.name}</div>
                          <div className="text-xs text-gray-500">{cls.hitDie} • {cls.primaryAbility.slice(0,3).toUpperCase()}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{character.characterClass.name}</div>
                        <div className="text-sm text-gray-500">
                          {character.characterClass.hitDie} • {character.characterClass.primaryAbility} primary
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {character.characterClass.skillPointsPerLevel}+Int skill pts/level
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Level</span>
                          <input
                            type="number" min={1} max={20}
                            value={character.level || 1}
                            onChange={e => updateCharacter({ ...character, level: parseInt(e.target.value) || 1, lastModified: new Date() })}
                            className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 text-sm font-mono"
                          />
                        </div>
                        <button
                          onClick={() => updateCharacter({ ...character, characterClass: undefined, skills: [], lastModified: new Date() })}
                          className="text-xs text-amber-600 hover:text-amber-800 underline"
                        >
                          Change class
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <NextSectionButton
            enabled={isIdentityComplete}
            nextLabel={nextTabLabel('identity')}
            hint={
              !character.name?.trim()           ? 'Enter a character name'
              : !character.characterClass       ? 'Select a class'
              : !(character.raceSource === 'background' || character.dndRace)
                ? 'Choose a race or "Decided by Background"'
              : !character.baseAbilityScores    ? 'Roll ability scores'
              : undefined
            }
            onClick={() => advanceTab('identity')}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 2 — Skills
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'skills' && (
        <div className="p-4 space-y-4">
          {/* Skill points banner */}
          {character.characterClass && (
            <div className="flex items-center gap-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Available:</span>
                <span className="font-mono font-bold">{availablePoints}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Spent:</span>
                <span className="font-mono font-bold">{spentPoints}</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-gray-600">Remaining:</span>
                <span className={`font-mono font-bold text-base ${remainingPoints < 0 ? 'text-red-600' : remainingPoints === 0 ? 'text-gray-600' : 'text-green-600'}`}>
                  {remainingPoints}
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-4">
                C = class skill (1 pt) • cross-class costs 2 pts • max rank = level + 3
              </div>
            </div>
          )}

          <Card>
            <CardContent className="pt-4">
              {character.characterClass ? (
                <div className="space-y-0.5">
                  <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 border-b pb-2 mb-1 uppercase tracking-wide">
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
                      <div key={skill.name}
                        className={`grid grid-cols-12 gap-2 items-center py-1 text-sm rounded hover:bg-gray-50 ${!skillCalc.canUseUntrained && ranks === 0 ? 'opacity-50' : ''}`}>
                        <div className="col-span-4 flex items-center gap-1">
                          <span className={`text-sm ${!skillCalc.canUseUntrained && ranks === 0 ? 'line-through text-gray-400' : ''}`}>
                            {skill.name}
                          </span>
                          {isClassSkill && <Badge variant="outline" className="text-xs bg-green-100 text-green-800 px-1 py-0">C</Badge>}
                          {skill.trainedOnly && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 px-1 py-0">T</Badge>}
                        </div>
                        <div className="col-span-2 text-center text-xs text-gray-500">
                          {skill.keyAbility.slice(0, 3).toUpperCase()}
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="flex items-center justify-center gap-0.5">
                            <Button onClick={() => allocateSkillPoint(skill.name, false)} disabled={ranks <= 0}
                              size="sm" variant="outline" className="w-6 h-6 p-0 text-xs">−</Button>
                            <span className="font-mono w-6 text-center text-sm">{ranks}</span>
                            <Button onClick={() => allocateSkillPoint(skill.name, true)} disabled={ranks >= maxRank || remainingPoints < cost}
                              size="sm" variant="outline" className="w-6 h-6 p-0 text-xs">+</Button>
                          </div>
                          <div className="text-xs text-gray-400">{cost}pt·{maxRank}max</div>
                        </div>
                        <div className="col-span-2 text-center font-mono text-sm">
                          {skillCalc.abilityModifier >= 0 ? '+' : ''}{skillCalc.abilityModifier}
                        </div>
                        <div className={`col-span-2 text-center font-mono font-semibold text-sm ${skillCalc.total > 0 ? 'text-green-700' : skillCalc.total < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {skillCalc.total >= 0 ? '+' : ''}{skillCalc.total}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-base mb-1">No class selected</p>
                  <p className="text-sm">Select a class on the Identity tab to allocate skill points</p>
                </div>
              )}
            </CardContent>
          </Card>

          <NextSectionButton
            enabled={isSkillsComplete}
            nextLabel={nextTabLabel('skills')}
            hint={
              !character.characterClass ? 'Select a class first'
              : remainingPoints > 0     ? `Spend all skill points (${remainingPoints} remaining)`
              : remainingPoints < 0     ? 'You have overspent your skill points'
              : undefined
            }
            onClick={() => advanceTab('skills')}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB — Feats
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'feats' && (
        <div className="p-4">
          {character.characterClass ? (
            <FeatSelector />
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-gray-400 text-sm">
                Select a class on the Identity tab before choosing feats.
              </CardContent>
            </Card>
          )}
          <NextSectionButton
            enabled={isFeatsComplete}
            nextLabel={nextTabLabel('feats')}
            hint={
              !character.characterClass ? 'Select a class first'
              : (character.selectedFeats?.length ?? 0) < expectedGeneralFeats
                ? `Fill all ${expectedGeneralFeats} general feat slot${expectedGeneralFeats !== 1 ? 's' : ''} and click Save`
              : (character.fighterBonusFeats?.length ?? 0) < expectedFighterFeats
                ? `Fill all ${expectedFighterFeats} fighter bonus slot${expectedFighterFeats !== 1 ? 's' : ''} and click Save`
              : undefined
            }
            onClick={() => advanceTab('feats')}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB — Equipment
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'equipment' && (
        <div className="p-4">
          {character.characterClass ? (
            <EquipmentPanel />
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-gray-400 text-sm">
                Select a class on the Identity tab — starting gold depends on class.
              </CardContent>
            </Card>
          )}
          <NextSectionButton
            enabled={isEquipmentComplete}
            nextLabel={nextTabLabel('equipment')}
            hint={
              !character.characterClass ? 'Select a class first'
              : 'Equip a weapon or armor (and click Save) to continue'
            }
            onClick={() => advanceTab('equipment')}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB — Languages & Spells
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'languages' && (
        <div className="p-4">
          <LanguagesSpellsPanel />
          <NextSectionButton
            enabled={isLanguagesComplete}
            nextLabel={nextTabLabel('languages')}
            hint={
              (character.bonusLanguages?.length ?? 0) < expectedBonusLangs
                ? `Choose all ${expectedBonusLangs} bonus language${expectedBonusLangs !== 1 ? 's' : ''} and click Save`
                : undefined
            }
            onClick={() => advanceTab('languages')}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB — Traits & Details
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'traits' && (
        <div className="p-4 space-y-4">
          {/* Physical Description — live-editing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Physical Description</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const appearance = character.appearance ?? {}
                const updateAppearance = (patch: Partial<NonNullable<typeof character.appearance>>) =>
                  updateCharacter({
                    ...character,
                    appearance: { ...appearance, ...patch },
                    lastModified: new Date(),
                  })
                const field = (
                  label: string,
                  key: 'height' | 'weight' | 'hair' | 'eyes' | 'skin',
                  placeholder: string,
                ) => (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">{label}</label>
                    <input
                      type="text"
                      value={appearance[key] ?? ''}
                      onChange={e => updateAppearance({ [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-amber-500 outline-none"
                    />
                  </div>
                )
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {field('Height', 'height', "5'10\"")}
                      {field('Weight', 'weight', '180 lbs')}
                      {field('Hair', 'hair', 'Auburn')}
                      {field('Eyes', 'eyes', 'Green')}
                      {field('Skin', 'skin', 'Tan')}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Description</label>
                      <textarea
                        value={appearance.description ?? ''}
                        onChange={e => updateAppearance({ description: e.target.value })}
                        placeholder="Distinguishing features, scars, bearing, clothing style…"
                        rows={3}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-amber-500 outline-none resize-y"
                      />
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Racial Traits */}
            {character.dndRace ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{character.dndRace.name} Racial Traits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {Object.keys(character.dndRace.abilityModifiers).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Ability Modifiers</p>
                      <p className="font-mono text-blue-700">{getAbilityModifierSummary(character.dndRace.abilityModifiers)}</p>
                    </div>
                  )}

                  {character.dndRace.racialTraits.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Special Traits</p>
                      <ul className="space-y-1.5">
                        {character.dndRace.racialTraits.map(trait => (
                          <li key={trait.name}>
                            <span className="font-medium text-gray-800">{trait.name}:</span>{' '}
                            <span className="text-gray-600">{trait.mechanical ?? trait.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {character.dndRace.skillBonuses.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Racial Skill Bonuses</p>
                      <ul className="space-y-0.5">
                        {character.dndRace.skillBonuses.map(sb => (
                          <li key={sb.skill} className="flex justify-between">
                            <span className="text-gray-700">{sb.skill}</span>
                            <span className="font-semibold text-green-700">+{sb.bonus}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {character.dndRace.savingThrowBonuses.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Saving Throw Bonuses</p>
                      <ul className="space-y-0.5">
                        {character.dndRace.savingThrowBonuses.map(sb => (
                          <li key={sb.type} className="flex justify-between">
                            <span className="text-gray-700">vs {sb.type}</span>
                            <span className="font-semibold text-blue-700">+{sb.bonus}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Languages</p>
                    <p className="text-gray-700">
                      <span className="font-medium">Automatic:</span> {character.dndRace.automaticLanguages.join(', ')}
                    </p>
                    {character.dndRace.bonusLanguages.length > 0 && (
                      <p className="text-gray-500 text-xs mt-0.5">
                        <span className="font-medium">Bonus pool:</span> {character.dndRace.bonusLanguages.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="pt-1 border-t border-gray-100 text-xs text-gray-500">
                    All characters get <strong>1 feat at level 1</strong>.
                    {character.dndRace.bonusFeatAtFirst && (
                      <span className="text-green-700 font-medium"> {character.dndRace.name}s get +1 bonus feat.</span>
                    )}
                    {character.characterClass?.name === 'Fighter' && (
                      <span className="text-blue-700 font-medium"> Fighters also get a bonus combat feat.</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-10 text-center text-gray-400 text-sm">
                  {character.raceSource === 'background'
                    ? 'Race will be determined during Background generation.'
                    : 'Select a race on the Identity tab to see racial traits.'}
                </CardContent>
              </Card>
            )}

            {/* Background bonuses + Class details */}
            <div className="space-y-4">
              {/* Background bonuses */}
              {character.dndIntegration && (() => {
                const mods = character.dndIntegration.abilityModifiers
                const hasAnyMod = mods && Object.values(mods).some(v => v !== 0)
                const skills = character.dndIntegration.skillBonuses
                const hasSkills = skills && Object.keys(skills).length > 0
                if (!hasAnyMod && !hasSkills) return null
                return (
                  <Card className="border-green-400 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-800 text-base">🎭 Background Story Bonuses</CardTitle>
                      <p className="text-xs text-green-700">Live updates as you roll your background story.</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {hasAnyMod && (
                          <div>
                            <p className="font-medium text-green-800 mb-1">Ability Modifiers</p>
                            {Object.entries(mods).filter(([,v]) => v !== 0).map(([key, val]) => (
                              <div key={key} className="flex justify-between font-mono">
                                <span className="capitalize text-green-700">{key.slice(0,3).toUpperCase()}</span>
                                <span className={val > 0 ? 'text-green-600' : 'text-red-600'}>{val > 0 ? '+' : ''}{val}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {hasSkills && (
                          <div>
                            <p className="font-medium text-green-800 mb-1">Skill Bonuses</p>
                            {Object.entries(skills).filter(([,v]) => v.totalBonus !== 0).slice(0, 8).map(([skill, val]) => (
                              <div key={skill} className="flex justify-between font-mono text-xs">
                                <span className="text-green-700">{skill}</span>
                                <span className={val.totalBonus > 0 ? 'text-green-600' : 'text-red-600'}>
                                  {val.totalBonus > 0 ? '+' : ''}{val.totalBonus}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })()}

              {/* Class details */}
              {character.characterClass && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{character.characterClass.name} Details</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    {(() => {
                      const cls = DND_CORE_CLASSES.find(c => c.name === character.characterClass!.name)
                      if (!cls) return null
                      return (
                        <>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <div className="text-gray-500">Hit Die</div><div className="font-medium">{cls.hitDie}</div>
                            <div className="text-gray-500">Primary Ability</div><div className="font-medium">{cls.primaryAbility}</div>
                            <div className="text-gray-500">Skills/Level</div><div className="font-medium">{cls.skillPointsPerLevel} + INT mod</div>
                            <div className="text-gray-500">BAB</div><div className="font-medium">{cls.baseAttackBonus}</div>
                            <div className="text-gray-500">Fortitude</div><div className="font-medium">{cls.fortitudeSave}</div>
                            <div className="text-gray-500">Reflex</div><div className="font-medium">{cls.reflexSave}</div>
                            <div className="text-gray-500">Will</div><div className="font-medium">{cls.willSave}</div>
                            {cls.spellcasting && cls.spellcasting !== 'None' && (
                              <><div className="text-gray-500">Spellcasting</div><div className="font-medium">{cls.spellcasting}</div></>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 mt-2">Class Skills</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{cls.classSkills.join(', ')}</p>
                          </div>
                          {cls.classFeatures.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Class Features</p>
                              <p className="text-xs text-gray-600">{cls.classFeatures.join(', ')}</p>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

        </div>

        {/* ── Live preview sidebar (desktop) ─────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
            <CharacterPreview character={character} />
          </div>
        </aside>
      </div>
    </div>
  )
}
