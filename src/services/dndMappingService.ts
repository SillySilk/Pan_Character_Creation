// D&D 3.5 Character Mapping Service for PanCasting
// Converts narrative character data to D&D 3.5 format

import type { Character, Skill, PersonalityTrait } from '../types/character'
import type {
  DDStats,
  AbilityModifiers,
  SkillBonuses,
  BackgroundFeature,
  DDCharacterSheet,
  DDClass,
  DDSkill,
  AbilityScore,
  Save,
  DDClassSuggestion
} from '../types/dnd'
import { DND_CORE_SKILLS, getAbilityModifier, calculateSkillBonus } from '../data/dndSkills'
import { DND_CORE_CLASSES, getClassByName } from '../data/dndClasses'

export interface DNDMappingService {
  // Core conversion methods
  mapAttributesToAbilities(character: Character): AbilityModifiers
  mapSkillsToDNDSkills(character: Character): DDSkill[]
  generateDNDBackground(character: Character): BackgroundFeature[]
  recommendClasses(character: Character): DDClassSuggestion[]
  convertToDNDCharacter(character: Character): DDCharacterSheet

  // Helper methods
  calculateAbilityScores(character: Character): Record<string, AbilityScore>
  mapPersonalityToAlignment(character: Character): string
  generateBackgroundDescription(character: Character): string
  calculateStartingWealth(character: Character): number
}

/**
 * Attribute to Ability Score Mapping Configuration
 */
const ATTRIBUTE_MAPPING = {
  // Primary mappings - narrative attributes to D&D abilities
  strength: ['strength', 'physical', 'might', 'power'],
  dexterity: ['dexterity', 'agility', 'speed', 'reflexes', 'coordination'],
  constitution: ['constitution', 'health', 'endurance', 'stamina', 'vitality'],
  intelligence: ['intelligence', 'intellect', 'reasoning', 'logic', 'education'],
  wisdom: ['wisdom', 'perception', 'awareness', 'intuition', 'willpower'],
  charisma: ['charisma', 'presence', 'leadership', 'persuasion', 'social']
}

/**
 * Skill Mapping Configuration
 */
interface SkillMapping {
  narrativeSkill: string
  dndSkill: string
  conversionRatio: number
  notes?: string
}

const SKILL_MAPPINGS: SkillMapping[] = [
  // Craft Skills
  { narrativeSkill: 'Weaponsmithing', dndSkill: 'Craft', conversionRatio: 1.0 },
  { narrativeSkill: 'Armorsmithing', dndSkill: 'Craft', conversionRatio: 1.0 },
  { narrativeSkill: 'Blacksmithing', dndSkill: 'Craft', conversionRatio: 1.0 },
  { narrativeSkill: 'Carpentry', dndSkill: 'Craft', conversionRatio: 1.0 },
  { narrativeSkill: 'Masonry', dndSkill: 'Craft', conversionRatio: 1.0 },
  { narrativeSkill: 'Cooking', dndSkill: 'Craft', conversionRatio: 1.0 },
  { narrativeSkill: 'Tailoring', dndSkill: 'Craft', conversionRatio: 1.0 },

  // Combat Skills
  { narrativeSkill: 'Swordsmanship', dndSkill: 'Intimidate', conversionRatio: 0.5, notes: 'Combat prowess translates to intimidation' },
  { narrativeSkill: 'Archery', dndSkill: 'Spot', conversionRatio: 0.6, notes: 'Archery requires good eyesight' },
  { narrativeSkill: 'Shield Work', dndSkill: 'Balance', conversionRatio: 0.4, notes: 'Shield work improves balance' },

  // Social Skills
  { narrativeSkill: 'Leadership', dndSkill: 'Diplomacy', conversionRatio: 0.8 },
  { narrativeSkill: 'Persuasion', dndSkill: 'Diplomacy', conversionRatio: 1.0 },
  { narrativeSkill: 'Intimidation', dndSkill: 'Intimidate', conversionRatio: 1.0 },
  { narrativeSkill: 'Deception', dndSkill: 'Bluff', conversionRatio: 1.0 },
  { narrativeSkill: 'Performance', dndSkill: 'Perform', conversionRatio: 1.0 },
  { narrativeSkill: 'Storytelling', dndSkill: 'Perform', conversionRatio: 0.8 },

  // Knowledge Skills
  { narrativeSkill: 'History', dndSkill: 'Knowledge', conversionRatio: 1.0 },
  { narrativeSkill: 'Religion', dndSkill: 'Knowledge', conversionRatio: 1.0 },
  { narrativeSkill: 'Nature', dndSkill: 'Knowledge', conversionRatio: 1.0 },
  { narrativeSkill: 'Magic', dndSkill: 'Spellcraft', conversionRatio: 0.8 },
  { narrativeSkill: 'Lore', dndSkill: 'Knowledge', conversionRatio: 0.9 },

  // Survival Skills
  { narrativeSkill: 'Hunting', dndSkill: 'Survival', conversionRatio: 0.9 },
  { narrativeSkill: 'Tracking', dndSkill: 'Survival', conversionRatio: 1.0 },
  { narrativeSkill: 'Foraging', dndSkill: 'Survival', conversionRatio: 0.7 },
  { narrativeSkill: 'Animal Handling', dndSkill: 'Handle Animal', conversionRatio: 1.0 },
  { narrativeSkill: 'Riding', dndSkill: 'Ride', conversionRatio: 1.0 },

  // Stealth and Agility
  { narrativeSkill: 'Stealth', dndSkill: 'Hide', conversionRatio: 0.8 },
  { narrativeSkill: 'Sneaking', dndSkill: 'Move Silently', conversionRatio: 0.8 },
  { narrativeSkill: 'Lockpicking', dndSkill: 'Open Lock', conversionRatio: 1.0 },
  { narrativeSkill: 'Pickpocketing', dndSkill: 'Sleight Of Hand', conversionRatio: 1.0 },
  { narrativeSkill: 'Acrobatics', dndSkill: 'Tumble', conversionRatio: 0.9 },
  { narrativeSkill: 'Climbing', dndSkill: 'Climb', conversionRatio: 1.0 },
  { narrativeSkill: 'Swimming', dndSkill: 'Swim', conversionRatio: 1.0 },

  // Medical and Healing
  { narrativeSkill: 'Healing', dndSkill: 'Heal', conversionRatio: 1.0 },
  { narrativeSkill: 'Herbalism', dndSkill: 'Heal', conversionRatio: 0.6 },
  { narrativeSkill: 'Medicine', dndSkill: 'Heal', conversionRatio: 1.0 },

  // Investigation and Perception
  { narrativeSkill: 'Investigation', dndSkill: 'Search', conversionRatio: 0.8 },
  { narrativeSkill: 'Perception', dndSkill: 'Spot', conversionRatio: 0.9 },
  { narrativeSkill: 'Listening', dndSkill: 'Listen', conversionRatio: 1.0 },
  { narrativeSkill: 'Insight', dndSkill: 'Sense Motive', conversionRatio: 0.8 },

  // Professional Skills
  { narrativeSkill: 'Administration', dndSkill: 'Profession', conversionRatio: 1.0 },
  { narrativeSkill: 'Teaching', dndSkill: 'Profession', conversionRatio: 1.0 },
  { narrativeSkill: 'Merchant', dndSkill: 'Appraise', conversionRatio: 0.7 },
  { narrativeSkill: 'Appraisal', dndSkill: 'Appraise', conversionRatio: 1.0 },

  // Specialized Skills
  { narrativeSkill: 'Disguise', dndSkill: 'Disguise', conversionRatio: 1.0 },
  { narrativeSkill: 'Forgery', dndSkill: 'Forgery', conversionRatio: 1.0 },
  { narrativeSkill: 'Rope Use', dndSkill: 'Use Rope', conversionRatio: 1.0 },
  { narrativeSkill: 'Escape Artist', dndSkill: 'Escape Artist', conversionRatio: 1.0 }
]

/**
 * Class Recommendation Weights
 */
const CLASS_RECOMMENDATION_WEIGHTS = {
  abilityScores: 0.4,
  skills: 0.3,
  background: 0.2,
  personality: 0.1
}

class DNDMappingServiceImpl implements DNDMappingService {
  /**
   * Map character attributes to D&D ability scores
   */
  mapAttributesToAbilities(character: Character): AbilityModifiers {
    // Use existing ability scores if available
    if (character.strength && character.dexterity && character.constitution &&
        character.intelligence && character.wisdom && character.charisma) {
      return {
        strength: getAbilityModifier(character.strength),
        dexterity: getAbilityModifier(character.dexterity),
        constitution: getAbilityModifier(character.constitution),
        intelligence: getAbilityModifier(character.intelligence),
        wisdom: getAbilityModifier(character.wisdom),
        charisma: getAbilityModifier(character.charisma)
      }
    }

    // If no ability scores, generate from attributes and modifiers
    const baseScores = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }

    // Apply cultural and social modifiers
    if (character.culture) {
      switch (character.culture.type) {
        case 'Barbaric':
          baseScores.strength += 1
          baseScores.constitution += 1
          baseScores.intelligence -= 1
          break
        case 'Civilized':
          baseScores.intelligence += 1
          baseScores.charisma += 1
          baseScores.strength -= 1
          break
        case 'Primitive':
          baseScores.wisdom += 1
          baseScores.constitution += 1
          baseScores.charisma -= 1
          break
        case 'Nomadic':
          baseScores.dexterity += 1
          baseScores.wisdom += 1
          baseScores.constitution -= 1
          break
      }
    }

    // Apply occupation-based modifiers
    if (character.occupations && character.occupations.length > 0) {
      for (const occupation of character.occupations) {
        switch (occupation.type) {
          case 'Military':
            baseScores.strength += 1
            baseScores.constitution += 1
            break
          case 'Academic':
            baseScores.intelligence += 2
            break
          case 'Professional':
            baseScores.intelligence += 1
            baseScores.charisma += 1
            break
          case 'Craft':
            baseScores.dexterity += 1
            baseScores.intelligence += 1
            break
          case 'Religious':
            baseScores.wisdom += 2
            break
        }
      }
    }

    // Convert to modifiers
    return {
      strength: getAbilityModifier(Math.max(3, Math.min(18, baseScores.strength))),
      dexterity: getAbilityModifier(Math.max(3, Math.min(18, baseScores.dexterity))),
      constitution: getAbilityModifier(Math.max(3, Math.min(18, baseScores.constitution))),
      intelligence: getAbilityModifier(Math.max(3, Math.min(18, baseScores.intelligence))),
      wisdom: getAbilityModifier(Math.max(3, Math.min(18, baseScores.wisdom))),
      charisma: getAbilityModifier(Math.max(3, Math.min(18, baseScores.charisma)))
    }
  }

  /**
   * Calculate full ability scores (score + modifier)
   */
  calculateAbilityScores(character: Character): Record<string, AbilityScore> {
    const abilities = {
      strength: character.strength || 10,
      dexterity: character.dexterity || 10,
      constitution: character.constitution || 10,
      intelligence: character.intelligence || 10,
      wisdom: character.wisdom || 10,
      charisma: character.charisma || 10
    }

    const result: Record<string, AbilityScore> = {}

    for (const [ability, score] of Object.entries(abilities)) {
      result[ability] = {
        score,
        modifier: getAbilityModifier(score)
      }
    }

    return result
  }

  /**
   * Map narrative skills to D&D skills
   */
  mapSkillsToDNDSkills(character: Character): DDSkill[] {
    if (!character.skills || character.skills.length === 0) {
      return []
    }

    const dndSkills: DDSkill[] = []
    const abilities = this.calculateAbilityScores(character)
    const isClassSkillMap = this.getClassSkillMap(character)

    // Process each narrative skill
    for (const skill of character.skills) {
      const mapping = SKILL_MAPPINGS.find(m =>
        m.narrativeSkill.toLowerCase() === skill.name.toLowerCase()
      )

      if (mapping) {
        // Find the D&D skill definition
        const dndSkillDef = DND_CORE_SKILLS.find(s => s.name === mapping.dndSkill)
        if (dndSkillDef) {
          const keyAbility = dndSkillDef.keyAbility.toLowerCase()
          const abilityMod = abilities[keyAbility]?.modifier || 0
          const convertedRanks = Math.round(skill.rank * mapping.conversionRatio)
          const isClassSkill = isClassSkillMap[mapping.dndSkill] || false

          // Check if skill already exists (for multiple mappings to same D&D skill)
          const existingSkill = dndSkills.find(s => s.name === mapping.dndSkill)
          if (existingSkill) {
            existingSkill.ranks = Math.max(existingSkill.ranks, convertedRanks)
            existingSkill.total = existingSkill.ranks + existingSkill.abilityModifier + existingSkill.miscModifier
            existingSkill.sources.push(`${skill.name} (${skill.source})`)
          } else {
            dndSkills.push({
              name: mapping.dndSkill,
              keyAbility: dndSkillDef.keyAbility as keyof AbilityModifiers,
              ranks: convertedRanks,
              abilityModifier: abilityMod,
              miscModifier: 0,
              total: convertedRanks + abilityMod,
              classSkill: isClassSkill,
              sources: [`${skill.name} (${skill.source})`]
            })
          }
        }
      } else {
        // Unmapped skill - create as custom skill with most appropriate ability
        const customAbility = this.guessKeyAbility(skill.name)
        const abilityMod = abilities[customAbility.toLowerCase()]?.modifier || 0

        dndSkills.push({
          name: `${skill.name} (Custom)`,
          keyAbility: customAbility as keyof AbilityModifiers,
          ranks: skill.rank,
          abilityModifier: abilityMod,
          miscModifier: 0,
          total: skill.rank + abilityMod,
          classSkill: false,
          sources: [`Custom skill from ${skill.source}`]
        })
      }
    }

    return dndSkills
  }

  /**
   * Generate D&D background features from character history
   */
  generateDNDBackground(character: Character): BackgroundFeature[] {
    const features: BackgroundFeature[] = []

    // Generate features from culture
    if (character.culture) {
      features.push({
        name: `Cultural Heritage: ${character.culture.name}`,
        description: `Raised in ${character.culture.name} culture`,
        gameEffect: `+2 circumstance bonus to social interactions with ${character.culture.name} peoples`,
        source: 'Cultural Background',
        category: 'Cultural'
      })
    }

    // Generate features from social status
    if (character.socialStatus) {
      const statusLevel = character.socialStatus.level
      if (statusLevel && statusLevel !== '') {
        features.push({
          name: `Social Standing: ${statusLevel}`,
          description: `Born into ${statusLevel.toLowerCase()} circumstances`,
          gameEffect: this.getSocialStatusEffect(statusLevel),
          source: 'Birth Circumstances',
          category: 'Social'
        })
      }
    }

    // Generate features from occupations
    if (character.occupations && character.occupations.length > 0) {
      for (const occupation of character.occupations.slice(0, 2)) { // Limit to 2 major occupations
        features.push({
          name: `Professional Experience: ${occupation.name}`,
          description: `Trained as a ${occupation.name.toLowerCase()}`,
          gameEffect: `+2 circumstance bonus to related profession checks`,
          source: 'Professional Training',
          category: 'Professional'
        })
      }
    }

    // Generate features from significant relationships
    if (character.relationships && character.relationships.length > 0) {
      const significantRelationships = character.relationships.filter(rel =>
        rel.type === 'Patron' || rel.type === 'Mentor'
      )

      for (const rel of significantRelationships.slice(0, 1)) { // Limit to 1
        features.push({
          name: `Important Contact: ${rel.person.name}`,
          description: `Maintains a relationship with ${rel.person.name}`,
          gameEffect: `Can call upon contact for assistance once per adventure`,
          source: 'Personal Relationships',
          category: 'Social'
        })
      }
    }

    // Generate features from personality traits
    if (character.personalityTraits) {
      const strongTraits = [
        ...character.personalityTraits.lightside.filter(t => t.strength === 'Strong' || t.strength === 'Driving'),
        ...character.personalityTraits.darkside.filter(t => t.strength === 'Strong' || t.strength === 'Driving')
      ]

      for (const trait of strongTraits.slice(0, 1)) { // Limit to 1 major trait
        features.push({
          name: `Strong Personality: ${trait.name}`,
          description: trait.description,
          gameEffect: this.getPersonalityTraitEffect(trait),
          source: 'Personality Development',
          category: 'Personal'
        })
      }
    }

    return features
  }

  /**
   * Recommend D&D classes based on character
   */
  recommendClasses(character: Character): DDClassSuggestion[] {
    const recommendations: DDClassSuggestion[] = []
    const abilities = this.calculateAbilityScores(character)

    for (const dndClass of DND_CORE_CLASSES) {
      const score = this.calculateClassSuitability(character, dndClass, abilities)
      const reasons = this.getClassReasons(character, dndClass, abilities)
      const backgroundSupport = this.getBackgroundSupport(character, dndClass)

      recommendations.push({
        className: dndClass.name,
        suitability: score,
        reasons,
        backgroundSupport,
        potential: this.getSuitabilityLabel(score)
      })
    }

    // Sort by suitability score
    return recommendations.sort((a, b) => b.suitability - a.suitability)
  }

  /**
   * Convert character to full D&D character sheet
   */
  convertToDNDCharacter(character: Character): DDCharacterSheet {
    const abilities = this.calculateAbilityScores(character)
    const skills = this.mapSkillsToDNDSkills(character)
    const backgroundFeatures = this.generateDNDBackground(character)
    const level = character.level || 1

    return {
      // Basic Information
      characterName: character.name,
      race: character.race?.name || 'Human',
      classes: character.characterClass ? [{
        name: character.characterClass.name,
        level: level,
        hitDie: character.characterClass.hitDie,
        skillPoints: character.characterClass.skillPointsPerLevel,
        baseAttackBonus: [level], // Simplified - should be calculated based on class
        saves: {
          fortitude: Math.floor(level / 2),
          reflex: Math.floor(level / 3),
          will: Math.floor(level / 2)
        },
        classFeatures: []
      }] : [],
      level,
      alignment: this.mapPersonalityToAlignment(character),
      size: 'Medium', // Default
      age: character.age,

      // Ability Scores
      abilities: {
        strength: abilities.strength,
        dexterity: abilities.dexterity,
        constitution: abilities.constitution,
        intelligence: abilities.intelligence,
        wisdom: abilities.wisdom,
        charisma: abilities.charisma
      },

      // Combat Statistics
      hitPoints: this.calculateHitPoints(character, abilities),
      armorClass: 10 + abilities.dexterity.modifier,
      touch: 10 + abilities.dexterity.modifier,
      flatFooted: 10,
      initiative: abilities.dexterity.modifier,
      speed: 30, // Default human speed

      // Saves
      saves: {
        fortitude: this.calculateSave('fortitude', character, abilities),
        reflex: this.calculateSave('reflex', character, abilities),
        will: this.calculateSave('will', character, abilities)
      },

      // Skills
      skills,

      // Equipment (simplified)
      equipment: [],
      money: {
        copper: 0,
        silver: 0,
        gold: this.calculateStartingWealth(character),
        platinum: 0
      },

      // Background
      background: this.generateBackgroundDescription(character),
      personality: this.generatePersonalityDescription(character),
      goals: this.generateGoalsDescription(character),
      relationships: this.generateRelationshipsDescription(character),

      // Special Abilities
      classFeatures: character.characterClass?.name ? this.getClassFeatures(character.characterClass.name, level) : [],
      racialTraits: this.getRacialTraits(character.race?.name || 'Human'),
      feats: [],
      spells: undefined,

      // Notes
      notes: [],
      backstory: this.generateBackstoryDescription(character)
    }
  }

  // Helper methods

  private getClassSkillMap(character: Character): Record<string, boolean> {
    if (!character.characterClass) return {}

    const classSkills = character.characterClass.classSkills || []
    const map: Record<string, boolean> = {}

    for (const skill of classSkills) {
      map[skill] = true
    }

    return map
  }

  private guessKeyAbility(skillName: string): string {
    const name = skillName.toLowerCase()

    if (name.includes('strength') || name.includes('lift') || name.includes('carry')) return 'Strength'
    if (name.includes('dex') || name.includes('agile') || name.includes('quick')) return 'Dexterity'
    if (name.includes('health') || name.includes('endur') || name.includes('tough')) return 'Constitution'
    if (name.includes('knowledge') || name.includes('learn') || name.includes('study')) return 'Intelligence'
    if (name.includes('wise') || name.includes('percep') || name.includes('aware')) return 'Wisdom'
    if (name.includes('charm') || name.includes('social') || name.includes('lead')) return 'Charisma'

    return 'Intelligence' // Default
  }

  private getSocialStatusEffect(status: string): string {
    switch (status) {
      case 'Wealthy':
      case 'Nobility':
      case 'Extremely Wealthy':
        return '+4 bonus to Diplomacy with nobles, +2 to starting wealth'
      case 'Well-to-Do':
      case 'Comfortable':
        return '+2 bonus to social interactions in appropriate circles'
      case 'Poor':
      case 'Destitute':
        return '+2 bonus to Survival checks, +1 to Fortitude saves'
      default:
        return 'No mechanical effect'
    }
  }

  private getPersonalityTraitEffect(trait: PersonalityTrait): string {
    const name = trait.name.toLowerCase()

    if (name.includes('courage') || name.includes('brave')) {
      return '+2 morale bonus against fear effects'
    } else if (name.includes('honest') || name.includes('trustworthy')) {
      return '+2 circumstance bonus to Diplomacy checks'
    } else if (name.includes('quick') || name.includes('alert')) {
      return '+1 circumstance bonus to initiative'
    } else if (name.includes('strong') || name.includes('determined')) {
      return '+1 morale bonus to Will saves'
    }

    return 'Roleplay effect only'
  }

  private calculateClassSuitability(character: Character, dndClass: any, abilities: Record<string, AbilityScore>): number {
    let score = 50 // Base score

    // Ability score compatibility (40% weight)
    const primaryAbility = dndClass.primaryAbility.toLowerCase()
    const primaryScore = abilities[primaryAbility]?.score || 10
    const abilityBonus = (primaryScore - 10) * 3 * CLASS_RECOMMENDATION_WEIGHTS.abilityScores
    score += abilityBonus

    // Skill compatibility (30% weight)
    const skillMatch = this.calculateSkillCompatibility(character, dndClass)
    score += skillMatch * 50 * CLASS_RECOMMENDATION_WEIGHTS.skills

    // Background compatibility (20% weight)
    const backgroundMatch = this.calculateBackgroundCompatibility(character, dndClass)
    score += backgroundMatch * 40 * CLASS_RECOMMENDATION_WEIGHTS.background

    // Personality compatibility (10% weight)
    const personalityMatch = this.calculatePersonalityCompatibility(character, dndClass)
    score += personalityMatch * 20 * CLASS_RECOMMENDATION_WEIGHTS.personality

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  private calculateSkillCompatibility(character: Character, dndClass: any): number {
    if (!character.skills || character.skills.length === 0) return 0.5

    const characterSkills = character.skills.map(s => s.name.toLowerCase())
    const classSkills = dndClass.classSkills.map((s: string) => s.toLowerCase())

    let matches = 0
    for (const skill of characterSkills) {
      const mapping = SKILL_MAPPINGS.find(m => m.narrativeSkill.toLowerCase() === skill)
      if (mapping && classSkills.includes(mapping.dndSkill.toLowerCase())) {
        matches++
      }
    }

    return Math.min(1.0, matches / Math.max(characterSkills.length, 1))
  }

  private calculateBackgroundCompatibility(character: Character, dndClass: any): number {
    let compatibility = 0.5 // Base compatibility

    // Check occupation compatibility
    if (character.occupations) {
      for (const occupation of character.occupations) {
        switch (dndClass.name) {
          case 'Fighter':
          case 'Ranger':
          case 'Paladin':
            if (occupation.type === 'Military') compatibility += 0.3
            break
          case 'Wizard':
          case 'Sorcerer':
            if (occupation.type === 'Academic') compatibility += 0.3
            break
          case 'Cleric':
            if (occupation.type === 'Religious') compatibility += 0.4
            break
          case 'Rogue':
            if (occupation.type === 'Criminal') compatibility += 0.4
            break
          case 'Bard':
            if (occupation.type === 'Professional') compatibility += 0.2
            break
        }
      }
    }

    return Math.min(1.0, compatibility)
  }

  private calculatePersonalityCompatibility(character: Character, dndClass: any): number {
    if (!character.personalityTraits) return 0.5

    let compatibility = 0.5
    const traits = [
      ...character.personalityTraits.lightside,
      ...character.personalityTraits.neutral,
      ...character.personalityTraits.darkside
    ]

    for (const trait of traits) {
      const name = trait.name.toLowerCase()

      switch (dndClass.name) {
        case 'Paladin':
          if (character.personalityTraits.lightside.length > character.personalityTraits.darkside.length) {
            compatibility += 0.2
          }
          break
        case 'Barbarian':
          if (name.includes('fierce') || name.includes('wild') || name.includes('rage')) {
            compatibility += 0.2
          }
          break
        case 'Wizard':
          if (name.includes('study') || name.includes('learn') || name.includes('knowledge')) {
            compatibility += 0.2
          }
          break
        case 'Rogue':
          if (name.includes('sneak') || name.includes('cunning') || name.includes('sly')) {
            compatibility += 0.2
          }
          break
      }
    }

    return Math.min(1.0, compatibility)
  }

  private getClassReasons(character: Character, dndClass: any, abilities: Record<string, AbilityScore>): string[] {
    const reasons: string[] = []

    // Primary ability check
    const primaryAbility = dndClass.primaryAbility.toLowerCase()
    const score = abilities[primaryAbility]?.score || 10
    if (score >= 14) {
      reasons.push(`High ${dndClass.primaryAbility} (${score})`)
    } else if (score <= 8) {
      reasons.push(`Low ${dndClass.primaryAbility} (${score}) - not recommended`)
    }

    // Skill compatibility
    const skillMatch = this.calculateSkillCompatibility(character, dndClass)
    if (skillMatch > 0.6) {
      reasons.push('Good skill compatibility')
    } else if (skillMatch < 0.3) {
      reasons.push('Limited skill overlap')
    }

    // Background compatibility
    const backgroundMatch = this.calculateBackgroundCompatibility(character, dndClass)
    if (backgroundMatch > 0.7) {
      reasons.push('Strong background alignment')
    }

    return reasons
  }

  private getBackgroundSupport(character: Character, dndClass: any): string[] {
    const support: string[] = []

    if (character.occupations) {
      for (const occupation of character.occupations) {
        if (this.isOccupationRelevant(occupation.type, dndClass.name)) {
          support.push(`${occupation.name} background`)
        }
      }
    }

    if (character.culture) {
      if (this.isCultureRelevant(character.culture.type, dndClass.name)) {
        support.push(`${character.culture.name} cultural background`)
      }
    }

    return support
  }

  private getSuitabilityLabel(score: number): 'Low' | 'Medium' | 'High' | 'Excellent' {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'High'
    if (score >= 40) return 'Medium'
    return 'Low'
  }

  private mapPersonalityToAlignment(character: Character): string {
    if (!character.personalityTraits) return 'True Neutral'

    const lightside = character.personalityTraits.lightside.length
    const darkside = character.personalityTraits.darkside.length
    const neutral = character.personalityTraits.neutral.length

    if (lightside > darkside + neutral) {
      return 'Neutral Good'
    } else if (darkside > lightside + neutral) {
      return 'Neutral Evil'
    } else {
      return 'True Neutral'
    }
  }

  private calculateHitPoints(character: Character, abilities: Record<string, AbilityScore>): number {
    const level = character.level || 1
    const conMod = abilities.constitution?.modifier || 0
    const baseHP = character.characterClass?.hitDie === 'd12' ? 12 :
                   character.characterClass?.hitDie === 'd10' ? 10 :
                   character.characterClass?.hitDie === 'd8' ? 8 :
                   character.characterClass?.hitDie === 'd6' ? 6 :
                   character.characterClass?.hitDie === 'd4' ? 4 : 8

    return Math.max(1, baseHP + conMod + (level - 1) * (Math.floor(baseHP / 2) + 1 + conMod))
  }

  private calculateSave(saveType: string, character: Character, abilities: Record<string, AbilityScore>): Save {
    const level = character.level || 1
    const abilityMod = saveType === 'fortitude' ? abilities.constitution?.modifier || 0 :
                       saveType === 'reflex' ? abilities.dexterity?.modifier || 0 :
                       abilities.wisdom?.modifier || 0

    const base = Math.floor(level / 2) // Simplified base save calculation

    return {
      base,
      abilityModifier: abilityMod,
      magicModifier: 0,
      miscModifier: 0,
      tempModifier: 0,
      total: base + abilityMod
    }
  }

  private calculateStartingWealth(character: Character): number {
    let wealth = 100 // Base starting gold

    if (character.socialStatus) {
      wealth *= character.socialStatus.moneyMultiplier || 1
    }

    if (character.occupations) {
      for (const occupation of character.occupations) {
        if (occupation.type === 'Professional' || occupation.type === 'Academic') {
          wealth += 50
        }
      }
    }

    return Math.round(wealth)
  }

  private generateBackgroundDescription(character: Character): string {
    const parts: string[] = []

    if (character.race && character.culture) {
      parts.push(`A ${character.race.name} raised in ${character.culture.name} culture.`)
    }

    if (character.socialStatus && character.socialStatus.level) {
      parts.push(`Born into ${character.socialStatus.level.toLowerCase()} circumstances.`)
    }

    if (character.occupations && character.occupations.length > 0) {
      const occupation = character.occupations[0]
      parts.push(`Trained as a ${occupation.name.toLowerCase()}.`)
    }

    return parts.join(' ')
  }

  private generatePersonalityDescription(character: Character): string {
    if (!character.personalityTraits) return 'Personality traits not defined.'

    const traits = [
      ...character.personalityTraits.lightside.slice(0, 2),
      ...character.personalityTraits.neutral.slice(0, 1),
      ...character.personalityTraits.darkside.slice(0, 1)
    ]

    if (traits.length === 0) return 'Personality traits not defined.'

    return traits.map(t => t.name).join(', ')
  }

  private generateGoalsDescription(character: Character): string {
    if (character.values?.motivations && character.values.motivations.length > 0) {
      return character.values.motivations.join('; ')
    }
    return 'Goals not yet defined.'
  }

  private generateRelationshipsDescription(character: Character): string {
    if (!character.relationships || character.relationships.length === 0) {
      return 'No significant relationships recorded.'
    }

    const important = character.relationships.slice(0, 3)
    return important.map(r => `${r.person.name} (${r.type})`).join(', ')
  }

  private generateBackstoryDescription(character: Character): string {
    const events = [
      ...(character.youthEvents || []),
      ...(character.adulthoodEvents || []),
      ...(character.miscellaneousEvents || [])
    ]

    if (events.length === 0) {
      return 'Backstory events not recorded.'
    }

    return `Character has experienced ${events.length} significant life events that shaped their development.`
  }

  private getClassFeatures(className: string, level: number): string[] {
    // Simplified class features - in a full implementation, this would be more detailed
    const classData = getClassByName(className)
    return classData?.classFeatures.slice(0, Math.min(level, 3)) || []
  }

  private getRacialTraits(raceName: string): string[] {
    // Simplified racial traits mapping
    switch (raceName.toLowerCase()) {
      case 'human':
        return ['Extra Feat', 'Extra Skill Points', 'Versatile']
      case 'elf':
        return ['Low-light Vision', 'Keen Senses', 'Elven Immunities']
      case 'dwarf':
        return ['Darkvision', 'Stonecunning', 'Stability']
      default:
        return ['Standard Racial Traits']
    }
  }

  private isOccupationRelevant(occupationType: string, className: string): boolean {
    const relevanceMap: Record<string, string[]> = {
      'Military': ['Fighter', 'Ranger', 'Paladin', 'Barbarian'],
      'Academic': ['Wizard', 'Cleric'],
      'Religious': ['Cleric', 'Paladin'],
      'Criminal': ['Rogue'],
      'Professional': ['Bard'],
      'Craft': ['Fighter', 'Ranger']
    }

    return relevanceMap[occupationType]?.includes(className) || false
  }

  private isCultureRelevant(cultureType: string, className: string): boolean {
    const relevanceMap: Record<string, string[]> = {
      'Barbaric': ['Barbarian', 'Fighter', 'Ranger'],
      'Civilized': ['Wizard', 'Bard', 'Paladin'],
      'Primitive': ['Druid', 'Ranger', 'Barbarian'],
      'Nomadic': ['Ranger', 'Bard']
    }

    return relevanceMap[cultureType]?.includes(className) || false
  }
}

// Export singleton instance
export const dndMappingService = new DNDMappingServiceImpl()
export default dndMappingService