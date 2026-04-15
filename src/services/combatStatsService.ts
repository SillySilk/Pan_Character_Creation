// D&D 3.5 Combat Statistics Calculator
// All formulas verified against C:\AI\D&D\01-core-rules.md and C:\AI\D&D\02-classes.md

import type { DnDCombatStats } from '@/types/character'

// ── BAB progressions ────────────────────────────────────────────────────────

/** Returns primary BAB for a given progression and level (SRD Table 3-1) */
export function calcPrimaryBAB(progression: 'Good' | 'Average' | 'Poor', level: number): number {
  const l = Math.max(1, Math.min(20, level))
  switch (progression) {
    case 'Good':    return l                       // +1 per level
    case 'Average': return Math.floor(l * 3 / 4)  // +3/4 per level
    case 'Poor':    return Math.floor(l / 2)       // +1/2 per level
  }
}

/**
 * Returns the full iterative attack array for display (e.g. [8, 3] for BAB +8).
 * Extra attacks at -5/-10/-15 when primary BAB hits 6/11/16.
 */
export function calcAttackArray(progression: 'Good' | 'Average' | 'Poor', level: number): number[] {
  const primary = calcPrimaryBAB(progression, level)
  const attacks: number[] = [primary]
  let next = primary - 5
  while (next > 0) {
    attacks.push(next)
    next -= 5
  }
  return attacks
}

// ── Save progressions ────────────────────────────────────────────────────────

/** Returns base save bonus for a given progression and level (SRD Table 3-1) */
export function calcSaveBase(progression: 'Good' | 'Poor', level: number): number {
  const l = Math.max(1, Math.min(20, level))
  return progression === 'Good'
    ? Math.floor(l / 2) + 2   // 2, 3, 3, 4, 4, 5 …
    : Math.floor(l / 3)        // 0, 0, 1, 1, 1, 2 …
}

// ── Hit Points ───────────────────────────────────────────────────────────────

/** Hit die maximum value from string like 'd8' */
export function hitDieMax(hitDie: string): number {
  const n = parseInt(hitDie.replace('d', ''), 10)
  return isNaN(n) ? 8 : n
}

/**
 * HP for one level using average (ceiling of die avg).
 * Level 1 always uses max; subsequent levels use ceiling of average.
 */
export function hpForLevel(hitDie: string, level: number, conMod: number): number {
  const max = hitDieMax(hitDie)
  if (level === 1) return max + conMod
  const avg = Math.ceil((max + 1) / 2)
  return Math.max(1, avg + conMod)
}

/** Total HP for all levels 1..level using average method */
export function calcHPTotal(hitDie: string, level: number, conMod: number): number {
  let total = 0
  for (let l = 1; l <= level; l++) total += hpForLevel(hitDie, l, conMod)
  return Math.max(1, total)
}

// ── Armor Class ──────────────────────────────────────────────────────────────

interface ACInputs {
  dexMod: number
  armorBonus: number
  shieldBonus: number
  /** Max DEX from armor (undefined = no cap) */
  maxDexFromArmor?: number
  naturalArmor?: number
  deflection?: number
  misc?: number
}

export interface ACResult {
  ac: number
  touchAC: number
  flatFootedAC: number
  effectiveDexBonus: number
}

export function calcAC(inputs: ACInputs): ACResult {
  const {
    dexMod,
    armorBonus,
    shieldBonus,
    maxDexFromArmor,
    naturalArmor = 0,
    deflection = 0,
    misc = 0,
  } = inputs

  const effectiveDex = maxDexFromArmor !== undefined
    ? Math.min(dexMod, maxDexFromArmor)
    : dexMod

  const ac = 10 + effectiveDex + armorBonus + shieldBonus + naturalArmor + deflection + misc
  const touchAC = 10 + effectiveDex + deflection + misc
  const flatFootedAC = ac - Math.max(0, effectiveDex)

  return { ac, touchAC, flatFootedAC, effectiveDexBonus: effectiveDex }
}

// ── Speed ────────────────────────────────────────────────────────────────────

/**
 * Base speed adjusted for armor type.
 * Standard Medium race base speed is 30 ft; Dwarf and gnome is 20 ft.
 */
export function calcSpeed(baseSpeed: number, armorCategory: 'None' | 'Light' | 'Medium' | 'Heavy'): number {
  if (armorCategory === 'None' || armorCategory === 'Light') return baseSpeed
  // Medium/Heavy armor reduces 30→20, 20→15
  return baseSpeed === 30 ? 20 : 15
}

// ── Grapple ──────────────────────────────────────────────────────────────────

/** Size modifier for grapple / CMB (Medium = 0, Large = +4, Small = -4, etc.) */
export const SIZE_GRAPPLE_MOD: Record<string, number> = {
  Fine: -16, Diminutive: -12, Tiny: -8, Small: -4,
  Medium: 0, Large: 4, Huge: 8, Gargantuan: 12, Colossal: 16,
}

export function calcGrapple(bab: number, strMod: number, size = 'Medium'): number {
  return bab + strMod + (SIZE_GRAPPLE_MOD[size] ?? 0)
}

// ── Full combat stats bundle ─────────────────────────────────────────────────

interface CombatStatsInput {
  babProgression: 'Good' | 'Average' | 'Poor'
  fortProgression: 'Good' | 'Poor'
  refProgression: 'Good' | 'Poor'
  willProgression: 'Good' | 'Poor'
  level: number
  str: number; dex: number; con: number; int: number; wis: number; cha: number
  armorBonus?: number
  shieldBonus?: number
  maxDexFromArmor?: number
  naturalArmor?: number
  deflection?: number
  miscAC?: number
  baseSpeed?: number
  armorCategory?: 'None' | 'Light' | 'Medium' | 'Heavy'
  size?: string
  /** +4 from Improved Initiative feat */
  hasImprovedInitiative?: boolean
  miscFort?: number
  miscRef?: number
  miscWill?: number
}

/** Ability score → modifier */
export function abilMod(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function calcCombatStats(input: CombatStatsInput): DnDCombatStats {
  const {
    babProgression, fortProgression, refProgression, willProgression,
    level, str, dex, con, int: _int, wis, cha: _cha,
    armorBonus = 0, shieldBonus = 0, maxDexFromArmor,
    naturalArmor = 0, deflection = 0, miscAC = 0,
    baseSpeed = 30, armorCategory = 'None', size = 'Medium',
    hasImprovedInitiative = false,
    miscFort = 0, miscRef = 0, miscWill = 0,
  } = input

  const strMod = abilMod(str)
  const dexMod = abilMod(dex)
  const conMod = abilMod(con)
  const wisMod = abilMod(wis)

  const primaryBAB = calcPrimaryBAB(babProgression, level)
  const bab = calcAttackArray(babProgression, level)

  const fortBase = calcSaveBase(fortProgression, level)
  const refBase  = calcSaveBase(refProgression, level)
  const willBase = calcSaveBase(willProgression, level)

  const { ac, touchAC, flatFootedAC } = calcAC({
    dexMod, armorBonus, shieldBonus, maxDexFromArmor,
    naturalArmor, deflection, misc: miscAC,
  })

  const initiative = dexMod + (hasImprovedInitiative ? 4 : 0)
  const grapple = calcGrapple(primaryBAB, strMod, size)
  const speed = calcSpeed(baseSpeed, armorCategory)

  return {
    bab,
    fortitude: fortBase + conMod + miscFort,
    reflex:    refBase  + dexMod + miscRef,
    will:      willBase + wisMod + miscWill,
    ac, touchAC, flatFootedAC,
    initiative,
    grapple,
    speed,
  }
}

// ── Skill points ─────────────────────────────────────────────────────────────

/**
 * Total skill points available for a character.
 * Level 1: (base + INT mod) × 4 (min 4)
 * Each additional level: base + INT mod (min 1)
 * Human bonus: +1 per level
 */
export function calcAvailableSkillPoints(
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

// ── Carrying capacity ─────────────────────────────────────────────────────────

const CARRY_LIGHT: number[] = [0,10,20,30,40,50,60,70,80,90,100,115,130,150,175,200,230,260,300,350,400]
// SRD Table 9-1 (light load upper bound by STR score 1-20)

export function getCarryCapacity(str: number): { light: number; medium: number; heavy: number } {
  const idx = Math.max(1, Math.min(20, str))
  const light = CARRY_LIGHT[idx]
  return { light, medium: light * 2, heavy: light * 3 }
}

// ── Feat count ───────────────────────────────────────────────────────────────

/**
 * Number of general feat slots at given level.
 * Feats at: 1, 3, 6, 9, 12, 15, 18. Humans get +1 at level 1.
 * Fighters get bonus combat feats separately (not counted here).
 */
export function calcGeneralFeatCount(level: number, isHuman: boolean): number {
  const levels = [1, 3, 6, 9, 12, 15, 18]
  return levels.filter(l => l <= level).length + (isHuman ? 1 : 0)
}

export function calcFighterBonusFeatCount(level: number): number {
  // Fighter bonus feats at levels 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
  const fighterFeatLevels = [1,2,4,6,8,10,12,14,16,18,20]
  return fighterFeatLevels.filter(l => l <= level).length
}
