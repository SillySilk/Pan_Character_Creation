// Modifier calculation service for PanCasting

import type { Character, Modifiers } from '../types/character'
import type { Table } from '../types/tables'

export interface ModifierCalculationResult {
  total: number
  breakdown: ModifierBreakdown[]
  warnings: string[]
}

export interface ModifierBreakdown {
  source: string
  type: string
  value: number
  description: string
}

export class ModifierCalculator {
  private readonly MIN_MODIFIER = -20
  private readonly MAX_MODIFIER = 20

  /**
   * Calculate total modifiers for a table roll
   */
  calculateTableModifiers(
    table: Table,
    character: Partial<Character>,
    additionalModifiers: Record<string, number> = {}
  ): ModifierCalculationResult {
    const breakdown: ModifierBreakdown[] = []
    const warnings: string[] = []
    let total = 0

    // Base character modifiers
    if (character.activeModifiers) {
      const characterMods = this.getCharacterModifiers(character.activeModifiers, table)
      breakdown.push(...characterMods.breakdown)
      total += characterMods.total
    }

    // Cultural modifiers
    if (character.culture) {
      const cultureMod = this.getCultureModifier(character.culture, table)
      if (cultureMod.value !== 0) {
        breakdown.push(cultureMod)
        total += cultureMod.value
      }
    }

    // Social status modifiers
    if (character.socialStatus) {
      const socialMod = this.getSocialStatusModifier(character.socialStatus, table)
      if (socialMod.value !== 0) {
        breakdown.push(socialMod)
        total += socialMod.value
      }
    }

    // Birth circumstance modifiers
    if (character.birthCircumstances) {
      const birthMod = this.getBirthModifier(character.birthCircumstances, table)
      if (birthMod.value !== 0) {
        breakdown.push(birthMod)
        total += birthMod.value
      }
    }

    // Additional modifiers
    Object.entries(additionalModifiers).forEach(([key, value]) => {
      if (value !== 0) {
        breakdown.push({
          source: 'Additional',
          type: key,
          value,
          description: `Additional modifier: ${key}`
        })
        total += value
      }
    })

    // Apply bounds checking
    const originalTotal = total
    total = Math.max(this.MIN_MODIFIER, Math.min(this.MAX_MODIFIER, total))
    
    if (total !== originalTotal) {
      warnings.push(
        `Modifier clamped from ${originalTotal} to ${total} (range: ${this.MIN_MODIFIER} to ${this.MAX_MODIFIER})`
      )
    }

    return {
      total,
      breakdown,
      warnings
    }
  }

  /**
   * Get character modifiers relevant to the table
   */
  private getCharacterModifiers(
    activeModifiers: Modifiers,
    table: Table
  ): { total: number; breakdown: ModifierBreakdown[] } {
    const breakdown: ModifierBreakdown[] = []
    let total = 0

    // Apply table-specific modifier if it exists
    if (table.modifier) {
      const modifierKey = table.modifier as string
      const value = activeModifiers[modifierKey] || 0
      if (value !== 0) {
        breakdown.push({
          source: 'Character',
          type: modifierKey,
          value,
          description: this.getModifierDescription(modifierKey)
        })
        total += value
      }
    }

    return { total, breakdown }
  }

  /**
   * Get culture modifier for table
   */
  private getCultureModifier(culture: any, _table: Table): ModifierBreakdown {
    // Culture modifier (CuMod) applies to many tables
    const cuMod = culture.cuMod || 0
    
    return {
      source: 'Culture',
      type: 'CuMod',
      value: cuMod,
      description: `Cultural modifier from ${culture.name} (${culture.type})`
    }
  }

  /**
   * Get social status modifier for table
   */
  private getSocialStatusModifier(socialStatus: any, _table: Table): ModifierBreakdown {
    // Social status modifier (SolMod) applies to many tables
    const solMod = socialStatus.solMod || 0
    
    return {
      source: 'Social Status',
      type: 'SolMod', 
      value: solMod,
      description: `Social status modifier from ${socialStatus.level}`
    }
  }

  /**
   * Get birth circumstance modifier for table
   */
  private getBirthModifier(birthCircumstances: any, _table: Table): ModifierBreakdown {
    // Birth modifier (BiMod) applies to certain tables
    const biMod = birthCircumstances.biMod || 0
    
    return {
      source: 'Birth',
      type: 'BiMod',
      value: biMod,
      description: `Birth circumstance modifier (${birthCircumstances.legitimacy})`
    }
  }

  /**
   * Calculate modifiers for specific character attributes
   */
  calculateAttributeModifiers(character: Partial<Character>): Modifiers {
    const modifiers: Modifiers = {
      cuMod: 0,
      solMod: 0,
      tiMod: 0,
      biMod: 0,
      legitMod: 0
    }

    // Culture modifier
    if (character.culture) {
      modifiers.cuMod = character.culture.cuMod || 0
    }

    // Social status modifier
    if (character.socialStatus) {
      modifiers.solMod = character.socialStatus.solMod || 0
    }

    // Birth modifiers
    if (character.birthCircumstances) {
      modifiers.biMod = character.birthCircumstances.biMod || 0
      modifiers.legitMod = character.birthCircumstances.legitimacy === 'Legitimate' ? 0 : -1
    }

    // Calculate derived modifiers from occupations, events, etc.
    this.addDerivedModifiers(character, modifiers)

    return modifiers
  }

  /**
   * Add modifiers derived from events, occupations, etc.
   */
  private addDerivedModifiers(character: Partial<Character>, modifiers: Modifiers): void {
    // Occupation-based modifiers
    if (character.occupations) {
      character.occupations.forEach(occupation => {
        // High-ranking occupations might provide title modifiers
        if (occupation.rank >= 4) {
          modifiers.tiMod += 1
        }
      })
    }

    // Event-based modifiers would be calculated here
    // These would come from specific events that grant ongoing bonuses
    
    // Family status modifiers
    if (character.family && character.family.socialConnections) {
      // High-status family connections might provide social modifiers
      const connectionCount = character.family.socialConnections.length
      if (connectionCount > 3) {
        modifiers.solMod += Math.floor(connectionCount / 3)
      }
    }
  }

  /**
   * Recalculate all character modifiers
   */
  recalculateCharacterModifiers(character: Partial<Character>): Character {
    const updatedCharacter = { ...character } as Character
    updatedCharacter.activeModifiers = this.calculateAttributeModifiers(character)
    return updatedCharacter
  }

  /**
   * Get description for modifier type
   */
  private getModifierDescription(modifierType: string): string {
    const descriptions: Record<string, string> = {
      cuMod: 'Cultural background modifier',
      solMod: 'Social status modifier',
      tiMod: 'Title and rank modifier',
      biMod: 'Birth circumstances modifier',
      legitMod: 'Legitimacy modifier'
    }
    
    return descriptions[modifierType] || `${modifierType} modifier`
  }

  /**
   * Check if modifiers are within valid ranges
   */
  validateModifiers(modifiers: Modifiers): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    Object.entries(modifiers).forEach(([key, value]) => {
      if (typeof value === 'number') {
        if (value < this.MIN_MODIFIER || value > this.MAX_MODIFIER) {
          errors.push(`${key} value ${value} is outside valid range (${this.MIN_MODIFIER} to ${this.MAX_MODIFIER})`)
        }
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Get modifier summary for display
   */
  getModifierSummary(character: Partial<Character>): string {
    const modifiers = character.activeModifiers
    if (!modifiers) return 'No modifiers'

    const nonZeroModifiers = Object.entries(modifiers)
      .filter(([_, value]) => value !== 0)
      .map(([key, value]) => `${key}: ${value > 0 ? '+' : ''}${value}`)

    return nonZeroModifiers.length > 0 
      ? nonZeroModifiers.join(', ')
      : 'No active modifiers'
  }
}

// Default calculator instance
export const modifierCalculator = new ModifierCalculator()