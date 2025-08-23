// Validation utilities for PanCasting

import type { Character, Race, Culture, SocialStatus, Skill } from '@/types/character'
import type { Table, TableEntry, DiceType } from '@/types/tables'
import type { Event } from '@/types/events'

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions?: string[]
}

/**
 * Character validation functions
 */
export const CharacterValidation = {
  /**
   * Validate a complete character
   */
  validateCharacter(character: Partial<Character>): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Required fields
    if (!character.id) errors.push('Character ID is required')
    if (!character.name || character.name.trim() === '') {
      errors.push('Character name is required')
    }
    if (character.age !== undefined && (character.age < 0 || character.age > 200)) {
      warnings.push('Character age seems unusual (0-200 expected)')
    }

    // Heritage validation
    if (character.race) {
      const raceValidation = this.validateRace(character.race)
      errors.push(...raceValidation.errors)
      warnings.push(...raceValidation.warnings)
    }

    if (character.culture) {
      const cultureValidation = this.validateCulture(character.culture)
      errors.push(...cultureValidation.errors)
      warnings.push(...cultureValidation.warnings)
    }

    if (character.socialStatus) {
      const statusValidation = this.validateSocialStatus(character.socialStatus)
      errors.push(...statusValidation.errors)
      warnings.push(...statusValidation.warnings)
    }

    // Skills validation
    if (character.skills) {
      for (const skill of character.skills) {
        const skillValidation = this.validateSkill(skill)
        errors.push(...skillValidation.errors.map(e => `Skill "${skill.name}": ${e}`))
        warnings.push(...skillValidation.warnings.map(w => `Skill "${skill.name}": ${w}`))
      }
    }

    // Events validation - basic validation for character events
    if (character.youthEvents) {
      for (let i = 0; i < character.youthEvents.length; i++) {
        const event = character.youthEvents[i]
        if (!event.id) errors.push(`Youth Event ${i + 1}: Missing event ID`)
        if (!event.name) errors.push(`Youth Event ${i + 1}: Missing event name`)
      }
    }

    // Cross-validation
    if (character.race && character.culture) {
      const crossValidation = this.validateRaceCultureCompatibility(character.race, character.culture)
      warnings.push(...crossValidation.warnings)
      suggestions.push(...crossValidation.suggestions || [])
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    }
  },

  /**
   * Validate race information
   */
  validateRace(race: Race): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!race.name || race.name.trim() === '') {
      errors.push('Race name is required')
    }

    if (!race.type) {
      errors.push('Race type is required')
    }

    if (!race.events || race.events.length === 0) {
      warnings.push('Race has no associated events')
    }

    if (!race.modifiers) {
      warnings.push('Race has no modifiers defined')
    }

    return { isValid: errors.length === 0, errors, warnings }
  },

  /**
   * Validate culture information
   */
  validateCulture(culture: Culture): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!culture.name || culture.name.trim() === '') {
      errors.push('Culture name is required')
    }

    if (!culture.type) {
      errors.push('Culture type is required')
    }

    if (culture.cuMod === undefined || culture.cuMod === null) {
      errors.push('Culture modifier (cuMod) is required')
    }

    if (culture.survival < 1 || culture.survival > 10) {
      warnings.push('Survival value should be between 1 and 10')
    }

    if (culture.literacyRate < 0 || culture.literacyRate > 100) {
      warnings.push('Literacy rate should be between 0 and 100')
    }

    return { isValid: errors.length === 0, errors, warnings }
  },

  /**
   * Validate social status
   */
  validateSocialStatus(status: SocialStatus): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!status.level) {
      errors.push('Social status level is required')
    }

    if (status.solMod === undefined || status.solMod === null) {
      errors.push('Social status modifier (solMod) is required')
    }

    if (status.moneyMultiplier <= 0) {
      warnings.push('Money multiplier should be positive')
    }

    return { isValid: errors.length === 0, errors, warnings }
  },

  /**
   * Validate skill information
   */
  validateSkill(skill: Skill): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!skill.name || skill.name.trim() === '') {
      errors.push('Skill name is required')
    }

    if (skill.rank < 0 || skill.rank > 10) {
      warnings.push('Skill rank should be between 0 and 10')
    }

    if (!skill.type) {
      errors.push('Skill type is required')
    }

    if (!skill.source || skill.source.trim() === '') {
      warnings.push('Skill source not specified')
    }

    return { isValid: errors.length === 0, errors, warnings }
  },

  /**
   * Validate event information
   */
  validateEvent(event: Event): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!event.id || event.id.trim() === '') {
      errors.push('Event ID is required')
    }

    if (!event.name || event.name.trim() === '') {
      errors.push('Event name is required')
    }

    if (!event.description || event.description.trim() === '') {
      warnings.push('Event description is empty')
    }

    if (!event.category) {
      errors.push('Event category is required')
    }

    if (!event.period) {
      errors.push('Event period is required')
    }

    if (event.age !== undefined && (event.age < 0 || event.age > 200)) {
      warnings.push('Event age seems unusual')
    }

    return { isValid: errors.length === 0, errors, warnings }
  },

  /**
   * Validate race and culture compatibility
   */
  validateRaceCultureCompatibility(race: Race, culture: Culture): ValidationResult {
    const warnings: string[] = []
    const suggestions: string[] = []

    // Check for known incompatibilities
    if (race.type === 'Dwarf' && culture.type === 'Civilized' && culture.subtype === 'Decadent') {
      warnings.push('Dwarves rarely live in Decadent Civilized cultures')
      suggestions.push('Consider a different culture type for this dwarf')
    }

    if (race.type === 'Halfling' && culture.type === 'Civilized' && culture.subtype === 'Dynamic') {
      warnings.push('Halflings typically prefer simpler cultures')
      suggestions.push('Consider Barbaric or simpler Civilized culture')
    }

    if (race.type === 'Elf' && culture.type === 'Primitive') {
      warnings.push('Elves are rarely found in Primitive cultures')
      suggestions.push('Consider Civilized or Barbaric culture for elves')
    }

    // Check restrictions
    if (race.restrictions && race.restrictions.some(r => r.includes(culture.type))) {
      warnings.push(`Race restrictions may conflict with ${culture.type} culture`)
    }

    return { isValid: true, errors: [], warnings, suggestions }
  }
}

/**
 * Table validation functions
 */
export const TableValidation = {
  /**
   * Validate a table structure
   */
  validateTable(table: Table): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!table.id || table.id.trim() === '') {
      errors.push('Table ID is required')
    }

    if (!table.name || table.name.trim() === '') {
      errors.push('Table name is required')
    }

    if (!table.category) {
      errors.push('Table category is required')
    }

    if (!table.diceType) {
      errors.push('Table dice type is required')
    } else if (!this.isValidDiceType(table.diceType)) {
      errors.push(`Invalid dice type: ${table.diceType}`)
    }

    if (!table.entries || table.entries.length === 0) {
      errors.push('Table must have at least one entry')
    } else {
      // Validate entries
      for (let i = 0; i < table.entries.length; i++) {
        const entryValidation = this.validateTableEntry(table.entries[i], i)
        errors.push(...entryValidation.errors)
        warnings.push(...entryValidation.warnings)
      }

      // Check for range overlaps
      const rangeValidation = this.validateTableRanges(table.entries)
      errors.push(...rangeValidation.errors)
      warnings.push(...rangeValidation.warnings)
    }

    return { isValid: errors.length === 0, errors, warnings }
  },

  /**
   * Validate a table entry
   */
  validateTableEntry(entry: TableEntry, index: number): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!entry.id || entry.id.trim() === '') {
      errors.push(`Entry ${index + 1}: ID is required`)
    }

    if (!entry.rollRange || entry.rollRange.length !== 2) {
      errors.push(`Entry ${index + 1}: Roll range must be [min, max]`)
    } else {
      const [min, max] = entry.rollRange
      if (min > max) {
        errors.push(`Entry ${index + 1}: Roll range minimum (${min}) cannot be greater than maximum (${max})`)
      }
      if (min < 1) {
        warnings.push(`Entry ${index + 1}: Roll range minimum (${min}) is less than 1`)
      }
    }

    if (!entry.result || entry.result.trim() === '') {
      errors.push(`Entry ${index + 1}: Result text is required`)
    }

    // Validate goto references
    if (entry.goto && !this.isValidTableReference(entry.goto)) {
      warnings.push(`Entry ${index + 1}: Goto reference "${entry.goto}" may be invalid`)
    }

    return { isValid: errors.length === 0, errors, warnings }
  },

  /**
   * Validate table entry ranges don't overlap
   */
  validateTableRanges(entries: TableEntry[]): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const ranges: Array<{ range: [number, number]; index: number }> = []

    entries.forEach((entry, index) => {
      if (entry.rollRange) {
        ranges.push({ range: entry.rollRange, index })
      }
    })

    // Sort by minimum value
    ranges.sort((a, b) => a.range[0] - b.range[0])

    // Check for overlaps
    for (let i = 0; i < ranges.length - 1; i++) {
      const current = ranges[i]
      const next = ranges[i + 1]

      if (current.range[1] >= next.range[0]) {
        errors.push(
          `Overlapping ranges: Entry ${current.index + 1} (${current.range[0]}-${current.range[1]}) ` +
          `overlaps with Entry ${next.index + 1} (${next.range[0]}-${next.range[1]})`
        )
      }
    }

    // Check for gaps
    for (let i = 0; i < ranges.length - 1; i++) {
      const current = ranges[i]
      const next = ranges[i + 1]

      if (current.range[1] + 1 < next.range[0]) {
        warnings.push(
          `Gap in ranges: Between Entry ${current.index + 1} (ends at ${current.range[1]}) ` +
          `and Entry ${next.index + 1} (starts at ${next.range[0]})`
        )
      }
    }

    return { isValid: errors.length === 0, errors, warnings }
  },

  /**
   * Check if dice type is valid
   */
  isValidDiceType(diceType: string): diceType is DiceType {
    const validTypes: DiceType[] = [
      'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100',
      '2d10', '2d20', '3d6', '1d3', '1d4', '1d6'
    ]
    return validTypes.includes(diceType as DiceType)
  },

  /**
   * Check if table reference is valid format
   */
  isValidTableReference(reference: string): boolean {
    // Basic validation for table references like "627", "table-101a", etc.
    return /^[a-zA-Z0-9-_]+$/.test(reference)
  }
}

/**
 * Data sanitization functions
 */
export const DataSanitization = {
  /**
   * Sanitize string input
   */
  sanitizeString(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') return ''
    
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/\r\n|\r|\n/g, '\n') // Normalize line endings
  },

  /**
   * Sanitize number input
   */
  sanitizeNumber(input: any, min: number = -Infinity, max: number = Infinity): number {
    const num = Number(input)
    if (isNaN(num)) return 0
    return Math.min(Math.max(num, min), max)
  },

  /**
   * Sanitize array input
   */
  sanitizeArray<T>(input: any, validator: (item: any) => T | null, maxLength: number = 100): T[] {
    if (!Array.isArray(input)) return []
    
    return input
      .slice(0, maxLength)
      .map(validator)
      .filter((item): item is T => item !== null)
  }
}

/**
 * Format validation functions
 */
export const FormatValidation = {
  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate character name format
   */
  isValidCharacterName(name: string): boolean {
    if (!name || name.length < 1 || name.length > 50) return false
    
    // Allow letters, spaces, apostrophes, hyphens
    const nameRegex = /^[a-zA-Z\s'\-]+$/
    return nameRegex.test(name)
  },

  /**
   * Validate ID format
   */
  isValidId(id: string): boolean {
    if (!id || id.length < 1 || id.length > 100) return false
    
    // Allow letters, numbers, hyphens, underscores
    const idRegex = /^[a-zA-Z0-9_-]+$/
    return idRegex.test(id)
  }
}

/**
 * Utility function to create validation result
 */
export function createValidationResult(
  isValid: boolean,
  errors: string[] = [],
  warnings: string[] = [],
  suggestions: string[] = []
): ValidationResult {
  return { isValid, errors, warnings, suggestions }
}