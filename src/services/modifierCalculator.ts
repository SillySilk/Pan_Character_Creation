// Balanced Modifier Calculator Service for PanCasting

import type { 
  Character, 
  AppliedModifier, 
  BalancedModifier, 
  ModifierSummary, 
  BalanceAssessment
} from '../types/character'
import type { Effect } from '../types/tables'

export class ModifierCalculator {
  
  /**
   * Apply a balanced effect to a character
   */
  applyBalancedEffect(
    character: Character, 
    effect: Effect, 
    sourceEvent: string, 
    sourceTable: string
  ): Character {
    if (effect.type !== 'balanced' || !effect.positiveEffects || !effect.negativeEffects) {
      console.warn('Attempted to apply non-balanced effect as balanced effect')
      return character
    }

    // Ensure appliedModifiers array exists
    if (!character.appliedModifiers) {
      character.appliedModifiers = []
    }

    const appliedModifier: AppliedModifier = {
      sourceEvent,
      sourceTable,
      positive: effect.positiveEffects,
      negative: effect.negativeEffects,
      appliedAt: new Date(),
      tradeoffReason: effect.tradeoffReason
    }

    // Apply the modifier effects to character stats
    const updatedCharacter = this.applyModifierEffects(character, effect.positiveEffects, effect.negativeEffects)
    
    // Ensure appliedModifiers array exists
    if (!updatedCharacter.appliedModifiers) {
      updatedCharacter.appliedModifiers = []
    }
    
    // Track the application
    updatedCharacter.appliedModifiers.push(appliedModifier)
    
    // Update summary
    updatedCharacter.modifierSummary = this.calculateModifierSummary(updatedCharacter)
    
    console.log(`✅ Applied balanced modifier from ${sourceEvent}:`, {
      positive: effect.positiveEffects.length,
      negative: effect.negativeEffects.length,
      tradeoff: effect.tradeoffReason
    })
    
    return updatedCharacter
  }

  /**
   * Apply modifier effects to character statistics
   */
  private applyModifierEffects(
    character: Character, 
    positiveEffects: BalancedModifier[], 
    negativeEffects: BalancedModifier[]
  ): Character {
    let updatedCharacter = { ...character }

    // Apply positive effects
    positiveEffects.forEach(effect => {
      updatedCharacter = this.applySingleModifier(updatedCharacter, effect)
    })

    // Apply negative effects
    negativeEffects.forEach(effect => {
      updatedCharacter = this.applySingleModifier(updatedCharacter, effect)
    })

    return updatedCharacter
  }

  /**
   * Apply a single modifier to the character
   */
  private applySingleModifier(
    character: Character, 
    modifier: BalancedModifier
  ): Character {
    const updatedCharacter = { ...character }
    const value = typeof modifier.value === 'number' ? modifier.value : parseInt(modifier.value.toString())

    switch (modifier.type) {
      case 'ability':
        this.applyAbilityModifier(updatedCharacter, modifier.target, value)
        break
      
      case 'skill':
        this.applySkillModifier(updatedCharacter, modifier.target, value)
        break
      
      case 'trait':
        this.applyTraitModifier(updatedCharacter, modifier.target, modifier.description)
        break
      
      case 'social':
        // Social modifiers are tracked but not applied directly to character stats
        break
      
      case 'special':
        this.applySpecialModifier(updatedCharacter, modifier.target, modifier.value)
        break
    }

    return updatedCharacter
  }

  /**
   * Apply ability score modifiers
   */
  private applyAbilityModifier(character: Character, ability: string, value: number): void {
    // Apply to D&D integration
    if (character.dndIntegration?.abilityModifiers) {
      const abilityKey = ability.toLowerCase() as keyof typeof character.dndIntegration.abilityModifiers
      if (abilityKey in character.dndIntegration.abilityModifiers) {
        character.dndIntegration.abilityModifiers[abilityKey] += value
      }
    }
  }

  /**
   * Apply skill modifiers
   */
  private applySkillModifier(character: Character, skill: string, value: number): void {
    // Find or create skill entry
    if (!character.skills) {
      character.skills = []
    }

    const existingSkill = character.skills.find(s => s.name === skill)
    if (existingSkill) {
      existingSkill.rank += value
      // Ensure rank doesn't go below 0
      existingSkill.rank = Math.max(0, existingSkill.rank)
    } else if (value > 0) {
      // Only add new skills for positive modifiers
      character.skills.push({
        name: skill,
        rank: value,
        type: 'Survival',
        source: 'Background Event'
      })
    }
  }

  /**
   * Apply trait modifiers
   */
  private applyTraitModifier(character: Character, trait: string, description: string): void {
    // Add to appropriate personality trait category or create special traits array
    if (!character.personalityTraits) {
      character.personalityTraits = {
        lightside: [],
        neutral: [],
        darkside: [],
        exotic: []
      }
    }

    // For now, add to neutral traits with description
    character.personalityTraits.neutral.push({
      name: trait,
      description,
      strength: 'Average',
      source: 'Background Event',
      type: 'Neutral'
    })
  }

  /**
   * Apply special modifiers (languages, equipment, etc.)
   */
  private applySpecialModifier(_character: Character, target: string, _value: any): void {
    switch (target) {
      case 'languages':
        // Would implement language tracking
        break
      case 'equipment':
        // Would implement equipment additions
        break
      // Add other special modifier types as needed
    }
  }

  /**
   * Calculate comprehensive modifier summary
   */
  calculateModifierSummary(character: Character): ModifierSummary {
    if (!character.appliedModifiers) {
      return {
        abilityScores: {},
        skills: {},
        traits: [],
        socialModifiers: [],
        overallBalance: {
          totalPositive: 0,
          totalNegative: 0,
          netBalance: 0,
          warnings: []
        }
      }
    }

    const summary: ModifierSummary = {
      abilityScores: {},
      skills: {},
      traits: [],
      socialModifiers: [],
      overallBalance: {
        totalPositive: 0,
        totalNegative: 0,
        netBalance: 0,
        warnings: []
      }
    }

    // Aggregate all applied modifiers
    character.appliedModifiers.forEach(appliedModifier => {
      // Process positive effects
      appliedModifier.positive.forEach(effect => {
        this.addToSummary(summary, effect, 'positive')
      })

      // Process negative effects
      appliedModifier.negative.forEach(effect => {
        this.addToSummary(summary, effect, 'negative')
      })
    })

    // Calculate overall balance
    summary.overallBalance = this.assessBalance(summary)

    return summary
  }

  /**
   * Add effect to modifier summary
   */
  private addToSummary(summary: ModifierSummary, effect: BalancedModifier, polarity: 'positive' | 'negative'): void {
    const value = typeof effect.value === 'number' ? effect.value : parseInt(effect.value.toString())
    const actualValue = polarity === 'negative' ? -Math.abs(value) : Math.abs(value)

    switch (effect.type) {
      case 'ability':
        summary.abilityScores[effect.target] = (summary.abilityScores[effect.target] || 0) + actualValue
        break
      
      case 'skill':
        summary.skills[effect.target] = (summary.skills[effect.target] || 0) + actualValue
        break
      
      case 'trait':
        if (!summary.traits.includes(effect.description)) {
          summary.traits.push(effect.description)
        }
        break
      
      case 'social':
        summary.socialModifiers.push({
          context: effect.target,
          modifier: actualValue,
          description: effect.description
        })
        break
    }

    // Track for balance calculation
    if (polarity === 'positive') {
      summary.overallBalance.totalPositive += Math.abs(value)
    } else {
      summary.overallBalance.totalNegative += Math.abs(value)
    }
  }

  /**
   * Assess character balance and generate warnings
   */
  private assessBalance(summary: ModifierSummary): BalanceAssessment {
    const assessment: BalanceAssessment = {
      totalPositive: summary.overallBalance.totalPositive,
      totalNegative: summary.overallBalance.totalNegative,
      netBalance: summary.overallBalance.totalPositive - summary.overallBalance.totalNegative,
      warnings: []
    }

    // Check ability score balance
    const abilityTotal = Object.values(summary.abilityScores).reduce((sum, value) => sum + value, 0)
    if (Math.abs(abilityTotal) > 3) {
      assessment.warnings.push(`Ability score total (${abilityTotal}) exceeds recommended limit of ±3`)
    }

    // Check for extreme skill bonuses
    Object.entries(summary.skills).forEach(([skill, bonus]) => {
      if (bonus > 10) {
        assessment.warnings.push(`${skill} bonus (+${bonus}) exceeds recommended limit of +10`)
      }
      if (bonus < -5) {
        assessment.warnings.push(`${skill} penalty (${bonus}) is very severe`)
      }
    })

    // Check overall balance
    const balanceRatio = assessment.totalNegative > 0 ? assessment.totalPositive / assessment.totalNegative : Infinity
    if (balanceRatio > 2) {
      assessment.warnings.push('Character has significantly more benefits than drawbacks')
    }
    if (balanceRatio < 0.5) {
      assessment.warnings.push('Character has significantly more drawbacks than benefits')
    }

    return assessment
  }

  /**
   * Validate character modifier balance
   */
  validateCharacterBalance(character: Character): BalanceAssessment {
    if (!character.modifierSummary) {
      character.modifierSummary = this.calculateModifierSummary(character)
    }
    
    return character.modifierSummary.overallBalance
  }

  /**
   * Get modifier breakdown by source
   */
  getModifierBreakdown(character: Character): Array<{
    source: string
    positive: BalancedModifier[]
    negative: BalancedModifier[]
    tradeoffReason?: string
  }> {
    if (!character.appliedModifiers) return []

    return character.appliedModifiers.map(modifier => ({
      source: modifier.sourceEvent,
      positive: modifier.positive,
      negative: modifier.negative,
      tradeoffReason: modifier.tradeoffReason
    }))
  }
}

// Export singleton instance
export const modifierCalculator = new ModifierCalculator()