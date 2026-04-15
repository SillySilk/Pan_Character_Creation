// D&D 3.5 Skill calculation utilities
// Rules verified against C:\AI\D&D\03-skills-feats.md

import { DND_CORE_SKILLS } from '@/data/dndSkills'
import type { SkillBonus, SkillBonuses } from '@/types/dnd'
import { abilMod } from './combatStatsService'

// ── Constants ────────────────────────────────────────────────────────────────

/** Max ranks for a class skill at a given level = level + 3 */
export function maxClassRanks(level: number): number {
  return level + 3
}

/** Max ranks for a cross-class skill = floor((level + 3) / 2) */
export function maxCrossClassRanks(level: number): number {
  return Math.floor((level + 3) / 2)
}

/** Skill-point cost for 1 rank: 1 for class skill, 2 for cross-class */
export function rankCost(isClassSkill: boolean): number {
  return isClassSkill ? 1 : 2
}

// ── Synergy table (SRD §Skills) ──────────────────────────────────────────────

interface Synergy {
  source: string   // skill name that, when it has 5+ ranks, grants the bonus
  target: string   // skill name that receives the bonus
  bonus: number
  note?: string    // optional context shown in UI
}

export const SKILL_SYNERGIES: Synergy[] = [
  { source: 'Bluff',         target: 'Diplomacy',       bonus: 2 },
  { source: 'Bluff',         target: 'Intimidate',       bonus: 2 },
  { source: 'Bluff',         target: 'Sleight Of Hand',  bonus: 2 },
  { source: 'Escape Artist', target: 'Use Rope',         bonus: 2, note: 'binding' },
  { source: 'Handle Animal', target: 'Ride',             bonus: 2 },
  { source: 'Jump',          target: 'Tumble',           bonus: 2 },
  { source: 'Knowledge',     target: 'Spellcraft',       bonus: 2, note: 'Arcana' },
  { source: 'Search',        target: 'Survival',         bonus: 2, note: 'tracking' },
  { source: 'Sense Motive',  target: 'Diplomacy',        bonus: 2 },
  { source: 'Spellcraft',    target: 'Use Magic Device', bonus: 2, note: 'scrolls' },
  { source: 'Survival',      target: 'Knowledge',        bonus: 2, note: 'nature' },
  { source: 'Tumble',        target: 'Balance',          bonus: 2 },
  { source: 'Tumble',        target: 'Jump',             bonus: 2 },
  { source: 'Use Magic Device', target: 'Spellcraft',    bonus: 2, note: 'decipher scrolls' },
  { source: 'Use Rope',      target: 'Climb',            bonus: 2, note: 'climbing ropes' },
  { source: 'Use Rope',      target: 'Escape Artist',    bonus: 2, note: 'ropes' },
]

/**
 * Given a map of skillName → ranks, compute total synergy bonus for each skill.
 */
export function computeSynergies(ranks: Record<string, number>): Record<string, number> {
  const synBonus: Record<string, number> = {}
  for (const syn of SKILL_SYNERGIES) {
    const sourceRanks = ranks[syn.source] ?? 0
    if (sourceRanks >= 5) {
      synBonus[syn.target] = (synBonus[syn.target] ?? 0) + syn.bonus
    }
  }
  return synBonus
}

// ── Full skill bonus calculation ─────────────────────────────────────────────

interface AbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

/**
 * Build a complete SkillBonuses map from scratch given:
 * - allocated ranks per skill (from character creation)
 * - character's ability scores
 * - existing racial/background bonuses to preserve
 */
export function buildSkillBonuses(
  allocatedRanks: Record<string, number>,
  abilities: AbilityScores,
  existingBonuses: SkillBonuses = {},
): SkillBonuses {
  const synergyMap = computeSynergies(allocatedRanks)

  const result: SkillBonuses = {}

  for (const skill of DND_CORE_SKILLS) {
    const ranks = allocatedRanks[skill.name] ?? 0
    const existing = existingBonuses[skill.name]
    const racial    = existing?.racial     ?? 0
    const background = existing?.background ?? 0
    const circumstance = existing?.circumstance ?? 0
    const synergy   = synergyMap[skill.name] ?? 0

    const abilScore = abilities[skill.keyAbility.toLowerCase() as keyof AbilityScores] ?? 10
    const abilBonus = abilMod(abilScore)

    const sources: string[] = []
    if (ranks > 0) sources.push(`${ranks} ranks`)
    if (racial > 0) sources.push(`${racial} racial`)
    if (synergy > 0) sources.push(`${synergy} synergy`)
    if (background > 0) sources.push(`${background} background`)
    if (circumstance !== 0) sources.push(`${circumstance} circumstance`)

    result[skill.name] = {
      totalBonus: ranks + abilBonus + synergy + racial + background + circumstance,
      ranks,
      synergy,
      circumstance,
      racial,
      background,
      sources,
    } satisfies SkillBonus
  }

  return result
}

// ── Skill point budget calculation ───────────────────────────────────────────

export function calcSkillPointBudget(
  classBase: number,
  intMod: number,
  level: number,
  isHuman: boolean,
  raceBonusFirst = 0,
  raceBonusPerLevel = 0,
): number {
  const humanBonus = isHuman ? 1 : 0
  const firstLevel = Math.max(1, classBase + intMod + humanBonus + raceBonusFirst) * 4
  const laterLevels = level > 1
    ? Math.max(1, classBase + intMod + humanBonus + raceBonusPerLevel) * (level - 1)
    : 0
  return firstLevel + laterLevels
}

/** Skill points already spent given a ranks allocation and class skill list */
export function calcPointsSpent(
  allocatedRanks: Record<string, number>,
  classSkills: string[],
): number {
  let spent = 0
  for (const [skillName, ranks] of Object.entries(allocatedRanks)) {
    if (ranks <= 0) continue
    const isClass = classSkills.some(
      cs => cs.toLowerCase() === skillName.toLowerCase()
        || skillName.toLowerCase().startsWith(cs.toLowerCase()),
    )
    spent += ranks * rankCost(isClass)
  }
  return spent
}
