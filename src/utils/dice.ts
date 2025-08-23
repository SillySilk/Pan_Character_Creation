// Dice rolling utilities for PanCasting

import type { DiceType, DiceRoll, Modifiers } from '@/types/tables'

/**
 * Cryptographically secure random number generator
 * Uses crypto.getRandomValues() for better randomness than Math.random()
 */
function getSecureRandom(): number {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] / (0xffffffff + 1)
}

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(getSecureRandom() * (max - min + 1)) + min
}

/**
 * Roll a single die of the specified type
 */
function rollSingleDie(sides: number): number {
  return randomInt(1, sides)
}

/**
 * Parse dice notation and return number of dice and sides
 */
function parseDiceNotation(diceType: DiceType): { count: number; sides: number } {
  const notation = diceType.toLowerCase()
  
  if (!notation || typeof notation !== 'string') {
    throw new Error('Invalid dice notation')
  }
  
  if (notation.includes('d')) {
    const parts = notation.split('d')
    const count = parts[0] ? parseInt(parts[0]) : 1
    const sides = parseInt(parts[1])
    
    if (isNaN(count) || isNaN(sides) || count < 1 || sides < 1) {
      throw new Error('Invalid dice notation')
    }
    
    return { count, sides }
  }
  
  throw new Error('Invalid dice notation')
}

/**
 * Get the possible range for a dice type
 */
export function getDiceRange(diceType: DiceType): [number, number] {
  const { count, sides } = parseDiceNotation(diceType)
  return [count, count * sides]
}

/**
 * Roll dice with the specified type and return individual results
 */
export function rollDiceDetailed(diceType: DiceType): number[] {
  const { count, sides } = parseDiceNotation(diceType)
  const results: number[] = []
  
  for (let i = 0; i < count; i++) {
    results.push(rollSingleDie(sides))
  }
  
  return results
}

/**
 * Roll dice with the specified type and return the sum
 */
export function rollDice(diceType: DiceType): number {
  const results = rollDiceDetailed(diceType)
  return results.reduce((sum, roll) => sum + roll, 0)
}

/**
 * Roll dice with modifiers applied
 */
export function rollWithModifiers(
  diceType: DiceType, 
  modifiers: Partial<Modifiers> = {}
): DiceRoll {
  const baseRoll = rollDice(diceType)
  const totalModifier = calculateTotalModifier(modifiers)
  const finalResult = Math.max(1, baseRoll + totalModifier) // Minimum result of 1
  
  return {
    diceType,
    baseRoll,
    modifiers,
    totalModifier,
    finalResult,
    breakdown: formatRollBreakdown(diceType, baseRoll, modifiers, totalModifier, finalResult),
    timestamp: new Date()
  }
}

/**
 * Calculate total modifier from modifier object
 */
function calculateTotalModifier(modifiers: Partial<Modifiers>): number {
  return Object.values(modifiers).reduce((total: number, mod) => total + (mod || 0), 0)
}

/**
 * Format a human-readable breakdown of the roll
 */
function formatRollBreakdown(
  diceType: DiceType,
  baseRoll: number,
  modifiers: Partial<Modifiers>,
  totalModifier: number,
  finalResult: number
): string {
  let breakdown = `${diceType}: ${baseRoll}`
  
  if (totalModifier !== 0) {
    const modifierText = totalModifier > 0 ? `+${totalModifier}` : `${totalModifier}`
    breakdown += ` ${modifierText}`
    
    // Add details about which modifiers contributed
    const activeModifiers = Object.entries(modifiers)
      .filter(([_, value]) => value !== 0 && value !== undefined)
      .map(([key, value]) => `${key}: ${value! > 0 ? '+' : ''}${value}`)
    
    if (activeModifiers.length > 0) {
      breakdown += ` (${activeModifiers.join(', ')})`
    }
  }
  
  breakdown += ` = ${finalResult}`
  return breakdown
}

/**
 * Validate that a dice type is supported
 */
export function isValidDiceType(diceType: string): diceType is DiceType {
  const validTypes: DiceType[] = [
    'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100',
    '2d10', '2d20', '3d6', '1d3', '1d4', '1d6'
  ]
  return validTypes.includes(diceType as DiceType)
}

/**
 * Roll multiple times and return all results
 */
export function rollMultiple(diceType: DiceType, count: number, modifiers?: Partial<Modifiers>): DiceRoll[] {
  const results: DiceRoll[] = []
  
  for (let i = 0; i < count; i++) {
    results.push(rollWithModifiers(diceType, modifiers))
  }
  
  return results
}

/**
 * Roll with advantage (roll twice, take higher)
 */
export function rollWithAdvantage(diceType: DiceType, modifiers?: Partial<Modifiers>): DiceRoll {
  const roll1 = rollWithModifiers(diceType, modifiers)
  const roll2 = rollWithModifiers(diceType, modifiers)
  
  const betterRoll = roll1.finalResult >= roll2.finalResult ? roll1 : roll2
  
  return {
    ...betterRoll,
    breakdown: `Advantage: [${roll1.baseRoll}, ${roll2.baseRoll}] -> ${betterRoll.breakdown}`
  }
}

/**
 * Roll with disadvantage (roll twice, take lower)
 */
export function rollWithDisadvantage(diceType: DiceType, modifiers?: Partial<Modifiers>): DiceRoll {
  const roll1 = rollWithModifiers(diceType, modifiers)
  const roll2 = rollWithModifiers(diceType, modifiers)
  
  const worseRoll = roll1.finalResult <= roll2.finalResult ? roll1 : roll2
  
  return {
    ...worseRoll,
    breakdown: `Disadvantage: [${roll1.baseRoll}, ${roll2.baseRoll}] -> ${worseRoll.breakdown}`
  }
}

/**
 * Roll and check if result falls within a specific range
 */
export function rollInRange(
  diceType: DiceType, 
  targetRange: [number, number], 
  modifiers?: Partial<Modifiers>
): { roll: DiceRoll; inRange: boolean; distance: number } {
  const roll = rollWithModifiers(diceType, modifiers)
  const [min, max] = targetRange
  const inRange = roll.finalResult >= min && roll.finalResult <= max
  
  let distance = 0
  if (roll.finalResult < min) {
    distance = min - roll.finalResult
  } else if (roll.finalResult > max) {
    distance = roll.finalResult - max
  }
  
  return { roll, inRange, distance }
}

/**
 * Simulate rolling a die many times to get probability distribution
 */
export function simulateRolls(
  diceType: DiceType, 
  iterations: number = 1000, 
  modifiers?: Partial<Modifiers>
): { average: number; distribution: Map<number, number>; min: number; max: number } {
  const results: number[] = []
  const distribution = new Map<number, number>()
  
  for (let i = 0; i < iterations; i++) {
    const roll = rollWithModifiers(diceType, modifiers)
    results.push(roll.finalResult)
    
    const count = distribution.get(roll.finalResult) || 0
    distribution.set(roll.finalResult, count + 1)
  }
  
  const average = results.reduce((sum, result) => sum + result, 0) / results.length
  const min = Math.min(...results)
  const max = Math.max(...results)
  
  return { average, distribution, min, max }
}

/**
 * Get the theoretical average for a dice type with modifiers
 */
export function getTheoreticalAverage(diceType: DiceType, modifiers?: Partial<Modifiers>): number {
  const { count, sides } = parseDiceNotation(diceType)
  const diceAverage = count * (sides + 1) / 2
  const totalModifier = modifiers ? calculateTotalModifier(modifiers) : 0
  return diceAverage + totalModifier
}

/**
 * Create a dice pool for rolling multiple different dice types
 */
export class DicePool {
  private dice: { type: DiceType; count: number }[] = []
  private modifiers: Partial<Modifiers> = {}
  
  addDice(diceType: DiceType, count: number = 1): this {
    this.dice.push({ type: diceType, count })
    return this
  }
  
  addModifiers(modifiers: Partial<Modifiers>): this {
    this.modifiers = { ...this.modifiers, ...modifiers }
    return this
  }
  
  roll(): { total: number; rolls: DiceRoll[]; breakdown: string } {
    const rolls: DiceRoll[] = []
    let total = 0
    
    for (const { type, count } of this.dice) {
      for (let i = 0; i < count; i++) {
        const roll = rollWithModifiers(type, this.modifiers)
        rolls.push(roll)
        total += roll.finalResult
      }
    }
    
    const breakdown = rolls.map(r => r.breakdown).join(' + ')
    return { total, rolls, breakdown }
  }
  
  clear(): this {
    this.dice = []
    this.modifiers = {}
    return this
  }
}

/**
 * Utility functions for common dice operations
 */
export const DiceUtils = {
  /**
   * Roll 1d3 (common in tables)
   */
  d3: () => rollDice('1d3'),
  
  /**
   * Roll 1d6 (common in tables)
   */
  d6: () => rollDice('1d6'),
  
  /**
   * Roll 1d20 (most common)
   */
  d20: () => rollDice('d20'),
  
  /**
   * Roll d100 (percentile)
   */
  d100: () => rollDice('d100'),
  
  /**
   * Roll 2d20 (for adulthood events)
   */
  '2d20': () => rollDice('2d20'),
  
  /**
   * Create a new dice pool
   */
  pool: () => new DicePool(),
  
  /**
   * Quick roll with common modifiers
   */
  quickRoll: (diceType: DiceType, cuMod = 0, solMod = 0, biMod = 0) => 
    rollWithModifiers(diceType, { cuMod, solMod, biMod })
}