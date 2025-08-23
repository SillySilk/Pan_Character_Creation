import { describe, it, expect, vi } from 'vitest'
import { 
  rollDice, 
  rollWithModifiers, 
  isValidDiceType,
  getDiceRange,
  rollDiceDetailed
} from '../dice'

describe('Dice Utilities', () => {
  describe('rollDice', () => {
    it('should return a number within valid range for d20', () => {
      const result = rollDice('d20')
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(20)
      expect(Number.isInteger(result)).toBe(true)
    })

    it('should return a number within valid range for d6', () => {
      const result = rollDice('d6')
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
      expect(Number.isInteger(result)).toBe(true)
    })

    it('should handle percentage dice (d100)', () => {
      const result = rollDice('d100')
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(100)
      expect(Number.isInteger(result)).toBe(true)
    })

    it('should handle multiple dice (2d6)', () => {
      const result = rollDice('2d6')
      expect(result).toBeGreaterThanOrEqual(2)
      expect(result).toBeLessThanOrEqual(12)
      expect(Number.isInteger(result)).toBe(true)
    })

    it('should throw error for invalid dice strings', () => {
      expect(() => rollDice('invalid' as any)).toThrow('Invalid dice notation')
      expect(() => rollDice('' as any)).toThrow('Invalid dice notation')
      expect(() => rollDice('d0' as any)).toThrow()
    })
  })

  describe('rollWithModifiers', () => {
    it('should return a DiceRoll object with correct structure', () => {
      const result = rollWithModifiers('d20')
      
      expect(result).toHaveProperty('diceType', 'd20')
      expect(result).toHaveProperty('baseRoll')
      expect(result).toHaveProperty('modifiers')
      expect(result).toHaveProperty('totalModifier')
      expect(result).toHaveProperty('finalResult')
      expect(result).toHaveProperty('breakdown')
      expect(result).toHaveProperty('timestamp')
      
      expect(result.baseRoll).toBeGreaterThanOrEqual(1)
      expect(result.baseRoll).toBeLessThanOrEqual(20)
      expect(result.timestamp).toBeInstanceOf(Date)
    })

    it('should apply modifiers correctly', () => {
      const modifiers = { strength: 2, dexterity: -1 }
      const result = rollWithModifiers('d20', modifiers)
      
      expect(result.totalModifier).toBe(1)
      expect(result.finalResult).toBe(result.baseRoll + 1)
      expect(result.modifiers).toEqual(modifiers)
    })

    it('should handle multiple dice with modifiers', () => {
      const result = rollWithModifiers('3d6', { bonus: 4 })
      
      expect(result.baseRoll).toBeGreaterThanOrEqual(3)
      expect(result.baseRoll).toBeLessThanOrEqual(18)
      expect(result.totalModifier).toBe(4)
      expect(result.finalResult).toBe(result.baseRoll + 4)
    })

    it('should generate correct breakdown string', () => {
      const result = rollWithModifiers('d20', { strength: 2 })
      
      expect(result.breakdown).toContain('d20:')
      expect(result.breakdown).toContain('strength: +2')
      expect(result.breakdown).toContain(`= ${result.finalResult}`)
    })
  })

  describe('getDiceRange', () => {
    it('should get correct range for single die', () => {
      const result = getDiceRange('d20')
      expect(result).toEqual([1, 20])
    })

    it('should get correct range for multiple dice', () => {
      const result = getDiceRange('3d6')
      expect(result).toEqual([3, 18])
    })

    it('should handle percentage dice', () => {
      const result = getDiceRange('d100')
      expect(result).toEqual([1, 100])
    })

    it('should throw error for invalid formats', () => {
      expect(() => getDiceRange('invalid' as any)).toThrow('Invalid dice notation')
      expect(() => getDiceRange('' as any)).toThrow('Invalid dice notation')
    })
  })

  describe('isValidDiceType', () => {
    it('should validate correct dice strings', () => {
      expect(isValidDiceType('d6')).toBe(true)
      expect(isValidDiceType('d20')).toBe(true)
      expect(isValidDiceType('2d10')).toBe(true)
      expect(isValidDiceType('3d6')).toBe(true)
      expect(isValidDiceType('d100')).toBe(true)
    })

    it('should reject invalid dice strings', () => {
      expect(isValidDiceType('')).toBe(false)
      expect(isValidDiceType('invalid')).toBe(false)
      expect(isValidDiceType('d0')).toBe(false)
      expect(isValidDiceType('0d6')).toBe(false)
      expect(isValidDiceType('d')).toBe(false)
      expect(isValidDiceType('3d')).toBe(false)
    })
  })

  describe('rollDiceDetailed', () => {
    it('should return array of individual dice rolls', () => {
      const result = rollDiceDetailed('3d6')
      
      expect(result).toHaveLength(3)
      result.forEach(roll => {
        expect(roll).toBeGreaterThanOrEqual(1)
        expect(roll).toBeLessThanOrEqual(6)
        expect(Number.isInteger(roll)).toBe(true)
      })
    })

    it('should return single result for single die', () => {
      const result = rollDiceDetailed('d20')
      
      expect(result).toHaveLength(1)
      expect(result[0]).toBeGreaterThanOrEqual(1)
      expect(result[0]).toBeLessThanOrEqual(20)
    })
  })
})