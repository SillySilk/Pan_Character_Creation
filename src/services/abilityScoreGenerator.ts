// Ability Score Generation Service for D&D Character Creation
// Provides multiple methods for generating ability scores based on character background

import type { Character } from '@/types/character'
import type { AbilityModifiers } from '@/types/dnd'

export type AbilityScoreMethod = 'intelligent' | 'point-buy' | '4d6-drop-lowest' | 'standard-array' | '3d6-straight'

export interface AbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

/**
 * Main ability score generator
 */
export class AbilityScoreGenerator {
  /**
   * Generate ability scores using the specified method
   */
  generateScores(character: Character, method: AbilityScoreMethod = 'intelligent'): AbilityScores {
    switch (method) {
      case 'intelligent':
        return this.generateIntelligentScores(character)
      case 'point-buy':
        return this.generatePointBuyScores(character)
      case '4d6-drop-lowest':
        return this.generate4d6DropLowest()
      case 'standard-array':
        return this.assignStandardArray(character)
      case '3d6-straight':
        return this.generate3d6Straight()
      default:
        return this.generateIntelligentScores(character)
    }
  }

  /**
   * Intelligent ability score generation based on character background
   * Analyzes skills, occupations, and background to create appropriate scores
   */
  private generateIntelligentScores(character: Character): AbilityScores {
    // Start with base scores (represents average person)
    const scores: AbilityScores = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }

    // Analyze character skills for ability score bonuses
    const skillAnalysis = this.analyzeSkills(character)

    // Analyze occupations for ability score bonuses
    const occupationAnalysis = this.analyzeOccupations(character)

    // Analyze events for ability score modifications
    const eventAnalysis = this.analyzeEvents(character)

    // Combine analyses with weighted importance
    const combined = {
      strength: skillAnalysis.strength + occupationAnalysis.strength + eventAnalysis.strength,
      dexterity: skillAnalysis.dexterity + occupationAnalysis.dexterity + eventAnalysis.dexterity,
      constitution: skillAnalysis.constitution + occupationAnalysis.constitution + eventAnalysis.constitution,
      intelligence: skillAnalysis.intelligence + occupationAnalysis.intelligence + eventAnalysis.intelligence,
      wisdom: skillAnalysis.wisdom + occupationAnalysis.wisdom + eventAnalysis.wisdom,
      charisma: skillAnalysis.charisma + occupationAnalysis.charisma + eventAnalysis.charisma
    }

    // Calculate point pool (28 point buy equivalent = 75 total ability points)
    const totalPoints = 75

    // Normalize scores to use available points
    const priorityScores = this.distributePointsByPriority(combined, totalPoints)

    // Add to base scores
    scores.strength += priorityScores.strength
    scores.dexterity += priorityScores.dexterity
    scores.constitution += priorityScores.constitution
    scores.intelligence += priorityScores.intelligence
    scores.wisdom += priorityScores.wisdom
    scores.charisma += priorityScores.charisma

    // Ensure scores are within valid range (3-18 before racial mods)
    return this.clampScores(scores)
  }

  /**
   * Analyze character skills to determine ability score priorities
   */
  private analyzeSkills(character: Character): AbilityScores {
    const priorities: AbilityScores = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    }

    character.skills.forEach(skill => {
      const weight = skill.rank / 2 // Higher rank = more influence

      // Map skill types to ability scores
      switch (skill.type) {
        case 'Combat':
          if (skill.name.toLowerCase().includes('ranged') ||
              skill.name.toLowerCase().includes('bow') ||
              skill.name.toLowerCase().includes('throw')) {
            priorities.dexterity += weight
          } else {
            priorities.strength += weight
          }
          priorities.constitution += weight * 0.5
          break

        case 'Craft':
          priorities.intelligence += weight
          priorities.dexterity += weight * 0.5
          break

        case 'Academic':
          priorities.intelligence += weight * 1.5
          priorities.wisdom += weight * 0.5
          break

        case 'Social':
          priorities.charisma += weight * 1.5
          priorities.wisdom += weight * 0.5
          break

        case 'Survival':
          priorities.wisdom += weight
          priorities.constitution += weight * 0.5
          break

        case 'Professional':
          priorities.intelligence += weight * 0.5
          priorities.wisdom += weight * 0.5
          priorities.charisma += weight * 0.5
          break
      }
    })

    return priorities
  }

  /**
   * Analyze character occupations to determine ability score priorities
   */
  private analyzeOccupations(character: Character): AbilityScores {
    const priorities: AbilityScores = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    }

    character.occupations.forEach(occupation => {
      const weight = occupation.rank || 1

      switch (occupation.type) {
        case 'Military':
          priorities.strength += weight * 2
          priorities.constitution += weight * 1.5
          priorities.dexterity += weight
          break

        case 'Academic':
          priorities.intelligence += weight * 2.5
          priorities.wisdom += weight
          break

        case 'Religious':
          priorities.wisdom += weight * 2.5
          priorities.charisma += weight
          break

        case 'Criminal':
          priorities.dexterity += weight * 2
          priorities.charisma += weight
          priorities.intelligence += weight
          break

        case 'Craft':
          priorities.strength += weight
          priorities.dexterity += weight
          priorities.intelligence += weight
          break

        case 'Professional':
          priorities.intelligence += weight
          priorities.charisma += weight * 1.5
          priorities.wisdom += weight
          break
      }
    })

    return priorities
  }

  /**
   * Analyze character events for ability score implications
   */
  private analyzeEvents(character: Character): AbilityScores {
    const priorities: AbilityScores = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    }

    // Youth events shape early development
    character.youthEvents.forEach(event => {
      if (event.description.toLowerCase().includes('athletic') ||
          event.description.toLowerCase().includes('physical')) {
        priorities.strength += 0.5
        priorities.constitution += 0.5
      }
      if (event.description.toLowerCase().includes('study') ||
          event.description.toLowerCase().includes('learn')) {
        priorities.intelligence += 0.5
      }
      if (event.description.toLowerCase().includes('social') ||
          event.description.toLowerCase().includes('friend')) {
        priorities.charisma += 0.5
      }
    })

    // Adulthood events reinforce abilities
    character.adulthoodEvents.forEach(event => {
      if (event.description.toLowerCase().includes('combat') ||
          event.description.toLowerCase().includes('fight')) {
        priorities.strength += 1
        priorities.constitution += 0.5
      }
      if (event.description.toLowerCase().includes('wise') ||
          event.description.toLowerCase().includes('mentor')) {
        priorities.wisdom += 1
      }
    })

    return priorities
  }

  /**
   * Distribute points based on priorities using point-buy logic
   */
  private distributePointsByPriority(priorities: AbilityScores, totalPoints: number): AbilityScores {
    // Find total priority weight
    const totalPriority = Object.values(priorities).reduce((sum, val) => sum + val, 0)

    if (totalPriority === 0) {
      // No priorities, distribute evenly
      const perStat = Math.floor(totalPoints / 6)
      return {
        strength: perStat,
        dexterity: perStat,
        constitution: perStat,
        intelligence: perStat,
        wisdom: perStat,
        charisma: perStat
      }
    }

    // Calculate raw distribution
    const distributed: AbilityScores = {
      strength: Math.round((priorities.strength / totalPriority) * totalPoints),
      dexterity: Math.round((priorities.dexterity / totalPriority) * totalPoints),
      constitution: Math.round((priorities.constitution / totalPriority) * totalPoints),
      intelligence: Math.round((priorities.intelligence / totalPriority) * totalPoints),
      wisdom: Math.round((priorities.wisdom / totalPriority) * totalPoints),
      charisma: Math.round((priorities.charisma / totalPriority) * totalPoints)
    }

    // Ensure minimum of 0 bonus (no stat below 10) and max of 8 bonus (18 total before racial)
    Object.keys(distributed).forEach(key => {
      const statKey = key as keyof AbilityScores
      distributed[statKey] = Math.max(0, Math.min(8, distributed[statKey]))
    })

    return distributed
  }

  /**
   * Generate scores using point-buy system (28 points)
   */
  private generatePointBuyScores(character: Character): AbilityScores {
    // Use intelligent analysis to prioritize, then apply point-buy
    const priorities = this.analyzeSkills(character)
    const occupationPriorities = this.analyzeOccupations(character)

    // Combine priorities
    const combined = Object.keys(priorities).reduce((acc, key) => {
      const statKey = key as keyof AbilityScores
      acc[statKey] = priorities[statKey] + occupationPriorities[statKey]
      return acc
    }, { ...priorities })

    // Sort abilities by priority
    const sorted = Object.entries(combined)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key as keyof AbilityScores)

    // Assign point-buy values based on priority
    // Common distribution: 15, 14, 13, 12, 10, 8 (28 point buy)
    const pointBuyArray = [15, 14, 13, 12, 10, 8]
    const scores: AbilityScores = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }

    sorted.forEach((ability, index) => {
      scores[ability] = pointBuyArray[index]
    })

    return scores
  }

  /**
   * Generate scores using 4d6 drop lowest method
   */
  private generate4d6DropLowest(): AbilityScores {
    const rollAbility = (): number => {
      const rolls = [
        this.rollDie(6),
        this.rollDie(6),
        this.rollDie(6),
        this.rollDie(6)
      ].sort((a, b) => b - a)

      // Drop lowest, sum the rest
      return rolls[0] + rolls[1] + rolls[2]
    }

    return {
      strength: rollAbility(),
      dexterity: rollAbility(),
      constitution: rollAbility(),
      intelligence: rollAbility(),
      wisdom: rollAbility(),
      charisma: rollAbility()
    }
  }

  /**
   * Assign standard array based on character priorities
   */
  private assignStandardArray(character: Character): AbilityScores {
    // Standard array: 15, 14, 13, 12, 10, 8
    const standardArray = [15, 14, 13, 12, 10, 8]

    // Use intelligent analysis to determine assignment
    const priorities = this.analyzeSkills(character)
    const occupationPriorities = this.analyzeOccupations(character)

    const combined = Object.keys(priorities).reduce((acc, key) => {
      const statKey = key as keyof AbilityScores
      acc[statKey] = priorities[statKey] + occupationPriorities[statKey]
      return acc
    }, { ...priorities })

    // Sort by priority
    const sorted = Object.entries(combined)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key as keyof AbilityScores)

    const scores: AbilityScores = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }

    sorted.forEach((ability, index) => {
      scores[ability] = standardArray[index]
    })

    return scores
  }

  /**
   * Generate scores using classic 3d6 straight down
   */
  private generate3d6Straight(): AbilityScores {
    return {
      strength: this.roll3d6(),
      dexterity: this.roll3d6(),
      constitution: this.roll3d6(),
      intelligence: this.roll3d6(),
      wisdom: this.roll3d6(),
      charisma: this.roll3d6()
    }
  }

  /**
   * Clamp scores to valid range (3-18)
   */
  private clampScores(scores: AbilityScores): AbilityScores {
    const clamped: AbilityScores = { ...scores }

    Object.keys(clamped).forEach(key => {
      const statKey = key as keyof AbilityScores
      clamped[statKey] = Math.max(3, Math.min(18, clamped[statKey]))
    })

    return clamped
  }

  /**
   * Roll a single die
   */
  private rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1
  }

  /**
   * Roll 3d6
   */
  private roll3d6(): number {
    return this.rollDie(6) + this.rollDie(6) + this.rollDie(6)
  }

  /**
   * Calculate ability modifiers from scores
   */
  calculateModifiers(scores: AbilityScores): AbilityModifiers {
    return {
      strength: Math.floor((scores.strength - 10) / 2),
      dexterity: Math.floor((scores.dexterity - 10) / 2),
      constitution: Math.floor((scores.constitution - 10) / 2),
      intelligence: Math.floor((scores.intelligence - 10) / 2),
      wisdom: Math.floor((scores.wisdom - 10) / 2),
      charisma: Math.floor((scores.charisma - 10) / 2)
    }
  }

  /**
   * Apply racial modifiers to ability scores
   */
  applyRacialModifiers(scores: AbilityScores, race: string): AbilityScores {
    const modifiers = this.getRacialModifiers(race)

    return {
      strength: scores.strength + modifiers.strength,
      dexterity: scores.dexterity + modifiers.dexterity,
      constitution: scores.constitution + modifiers.constitution,
      intelligence: scores.intelligence + modifiers.intelligence,
      wisdom: scores.wisdom + modifiers.wisdom,
      charisma: scores.charisma + modifiers.charisma
    }
  }

  /**
   * Get racial ability score modifiers
   */
  private getRacialModifiers(race: string): AbilityScores {
    const modifiers: { [key: string]: AbilityScores } = {
      'Human': { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      'Elf': { strength: 0, dexterity: 2, constitution: -2, intelligence: 0, wisdom: 0, charisma: 0 },
      'Dwarf': { strength: 0, dexterity: 0, constitution: 2, intelligence: 0, wisdom: 0, charisma: -2 },
      'Halfling': { strength: -2, dexterity: 2, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      'Half-Orc': { strength: 2, dexterity: 0, constitution: 0, intelligence: -2, wisdom: 0, charisma: -2 },
      'Gnome': { strength: -2, dexterity: 0, constitution: 2, intelligence: 0, wisdom: 0, charisma: 0 },
      'Half-Elf': { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }
    }

    return modifiers[race] || modifiers['Human']
  }
}

// Export singleton instance
export const abilityScoreGenerator = new AbilityScoreGenerator()
