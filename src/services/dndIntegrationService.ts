// Unified D&D Integration Service for PanCasting
// Supports both D&D 3.5 and D&D 5e

import type { Character } from '@/types/character'
import type { 
  DDStats, 
  DDCharacterSheet, 
  DDClassSuggestion, 
  DDExportOptions,
  DDExportResult,
  DDConverter,
  DDValidation 
} from '@/types/dnd'
import type { 
  DD5eStats, 
  DD5eCharacterSheet, 
  DD5eClassSuggestion,
  DD5eBackgroundSuggestion,
  DD5eExportOptions,
  DD5eConverter,
  DD5eValidation,
  DD5eAbilityScores,
  DD5eSkillProficiencies 
} from '@/types/dnd5e'

export type DNDEdition = '3.5' | '5e'

export interface UnifiedDNDStats {
  edition: DNDEdition
  stats35?: DDStats
  stats5e?: DD5eStats
}

/**
 * Main D&D Integration Service
 * Provides unified interface for both D&D 3.5 and 5e integration
 */
export class DNDIntegrationService {
  private dd35Converter: DD35Converter
  private dd5eConverter: DD5eConverter

  constructor() {
    this.dd35Converter = new DD35Converter()
    this.dd5eConverter = new DD5eConverter()
  }

  /**
   * Convert PanCasting character to D&D character sheet
   */
  convertCharacter(character: Character, edition: DNDEdition): DDCharacterSheet | DD5eCharacterSheet {
    switch (edition) {
      case '3.5':
        return this.dd35Converter.convertCharacter(character)
      case '5e':
        return this.dd5eConverter.convertCharacter(character)
      default:
        throw new Error(`Unsupported D&D edition: ${edition}`)
    }
  }

  /**
   * Get class suggestions for character
   */
  suggestClasses(character: Character, edition: DNDEdition): DDClassSuggestion[] | DD5eClassSuggestion[] {
    switch (edition) {
      case '3.5':
        return this.dd35Converter.suggestClasses(character)
      case '5e':
        return this.dd5eConverter.suggestClasses(character)
      default:
        throw new Error(`Unsupported D&D edition: ${edition}`)
    }
  }

  /**
   * Get background suggestions (5e only)
   */
  suggestBackgrounds(character: Character): DD5eBackgroundSuggestion[] {
    return this.dd5eConverter.suggestBackgrounds(character)
  }

  /**
   * Export character to various formats
   */
  async exportCharacter(
    character: Character, 
    edition: DNDEdition, 
    options: DDExportOptions | DD5eExportOptions
  ): Promise<DDExportResult> {
    try {
      const characterSheet = this.convertCharacter(character, edition)
      
      switch (options.format) {
        case 'json':
          return {
            success: true,
            data: JSON.stringify(characterSheet, null, 2),
            format: 'json'
          }
        case 'text':
          return {
            success: true,
            data: this.generateTextSheet(characterSheet, edition),
            format: 'text'
          }
        case 'pdf':
          return await this.generatePDF(characterSheet, edition, options)
        default:
          throw new Error(`Unsupported export format: ${options.format}`)
      }
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        format: options.format
      }
    }
  }

  /**
   * Validate character for D&D compliance
   */
  validateCharacter(character: Character, edition: DNDEdition): DDValidation | DD5eValidation {
    switch (edition) {
      case '3.5':
        return this.validateDD35Character(character)
      case '5e':
        return this.validateDD5eCharacter(character)
      default:
        throw new Error(`Unsupported D&D edition: ${edition}`)
    }
  }

  /**
   * Generate a unified stats object for both editions
   */
  generateUnifiedStats(character: Character): UnifiedDNDStats {
    return {
      edition: '5e', // Default to 5e
      stats35: this.dd35Converter.calculateDDStats(character),
      stats5e: this.dd5eConverter.calculateDD5eStats(character)
    }
  }

  private generateTextSheet(sheet: DDCharacterSheet | DD5eCharacterSheet, edition: DNDEdition): string {
    if (edition === '3.5') {
      return this.generateDD35TextSheet(sheet as DDCharacterSheet)
    } else {
      return this.generateDD5eTextSheet(sheet as DD5eCharacterSheet)
    }
  }

  private generateDD35TextSheet(sheet: DDCharacterSheet): string {
    return `
D&D 3.5 CHARACTER SHEET
========================

Character Name: ${sheet.characterName}
Race: ${sheet.race}
Classes: ${sheet.classes.map(c => `${c.name} ${c.level}`).join(', ')}
Level: ${sheet.level}
Alignment: ${sheet.alignment}
Age: ${sheet.age}

ABILITY SCORES
==============
Strength:     ${sheet.abilities.strength.score} (${sheet.abilities.strength.modifier >= 0 ? '+' : ''}${sheet.abilities.strength.modifier})
Dexterity:    ${sheet.abilities.dexterity.score} (${sheet.abilities.dexterity.modifier >= 0 ? '+' : ''}${sheet.abilities.dexterity.modifier})
Constitution: ${sheet.abilities.constitution.score} (${sheet.abilities.constitution.modifier >= 0 ? '+' : ''}${sheet.abilities.constitution.modifier})
Intelligence: ${sheet.abilities.intelligence.score} (${sheet.abilities.intelligence.modifier >= 0 ? '+' : ''}${sheet.abilities.intelligence.modifier})
Wisdom:       ${sheet.abilities.wisdom.score} (${sheet.abilities.wisdom.modifier >= 0 ? '+' : ''}${sheet.abilities.wisdom.modifier})
Charisma:     ${sheet.abilities.charisma.score} (${sheet.abilities.charisma.modifier >= 0 ? '+' : ''}${sheet.abilities.charisma.modifier})

COMBAT STATS
============
Hit Points: ${sheet.hitPoints}
Armor Class: ${sheet.armorClass}
Initiative: ${sheet.initiative >= 0 ? '+' : ''}${sheet.initiative}
Speed: ${sheet.speed} ft

SAVING THROWS
=============
Fortitude: ${sheet.saves.fortitude.total >= 0 ? '+' : ''}${sheet.saves.fortitude.total}
Reflex:    ${sheet.saves.reflex.total >= 0 ? '+' : ''}${sheet.saves.reflex.total}
Will:      ${sheet.saves.will.total >= 0 ? '+' : ''}${sheet.saves.will.total}

SKILLS
======
${sheet.skills.map(skill => `${skill.name}: ${skill.total >= 0 ? '+' : ''}${skill.total}`).join('\n')}

BACKGROUND
==========
${sheet.background}

PERSONALITY
===========
${sheet.personality}

BACKSTORY
=========
${sheet.backstory}
    `.trim()
  }

  private generateDD5eTextSheet(sheet: DD5eCharacterSheet): string {
    return `
D&D 5TH EDITION CHARACTER SHEET
===============================

Character Name: ${sheet.characterName}
Race: ${sheet.race}${sheet.subrace ? ` (${sheet.subrace})` : ''}
Class: ${sheet.class}${sheet.subclass ? ` (${sheet.subclass})` : ''}
Level: ${sheet.level}
Background: ${sheet.background}
Alignment: ${sheet.alignment}
Experience Points: ${sheet.experiencePoints}

ABILITY SCORES
==============
Strength:     ${sheet.abilityScores.strength} (${sheet.abilityModifiers.strength >= 0 ? '+' : ''}${sheet.abilityModifiers.strength})
Dexterity:    ${sheet.abilityScores.dexterity} (${sheet.abilityModifiers.dexterity >= 0 ? '+' : ''}${sheet.abilityModifiers.dexterity})
Constitution: ${sheet.abilityScores.constitution} (${sheet.abilityModifiers.constitution >= 0 ? '+' : ''}${sheet.abilityModifiers.constitution})
Intelligence: ${sheet.abilityScores.intelligence} (${sheet.abilityModifiers.intelligence >= 0 ? '+' : ''}${sheet.abilityModifiers.intelligence})
Wisdom:       ${sheet.abilityScores.wisdom} (${sheet.abilityModifiers.wisdom >= 0 ? '+' : ''}${sheet.abilityModifiers.wisdom})
Charisma:     ${sheet.abilityScores.charisma} (${sheet.abilityModifiers.charisma >= 0 ? '+' : ''}${sheet.abilityModifiers.charisma})

COMBAT STATS
============
Hit Points: ${sheet.currentHitPoints}/${sheet.hitPointMaximum}
Armor Class: ${sheet.armorClass}
Proficiency Bonus: +${sheet.proficiencyBonus}
Hit Dice: ${sheet.hitDice}

SAVING THROWS
=============
Strength:     ${sheet.savingThrows.strength.proficient ? '●' : '○'} ${sheet.savingThrows.strength.bonus >= 0 ? '+' : ''}${sheet.savingThrows.strength.bonus}
Dexterity:    ${sheet.savingThrows.dexterity.proficient ? '●' : '○'} ${sheet.savingThrows.dexterity.bonus >= 0 ? '+' : ''}${sheet.savingThrows.dexterity.bonus}
Constitution: ${sheet.savingThrows.constitution.proficient ? '●' : '○'} ${sheet.savingThrows.constitution.bonus >= 0 ? '+' : ''}${sheet.savingThrows.constitution.bonus}
Intelligence: ${sheet.savingThrows.intelligence.proficient ? '●' : '○'} ${sheet.savingThrows.intelligence.bonus >= 0 ? '+' : ''}${sheet.savingThrows.intelligence.bonus}
Wisdom:       ${sheet.savingThrows.wisdom.proficient ? '●' : '○'} ${sheet.savingThrows.wisdom.bonus >= 0 ? '+' : ''}${sheet.savingThrows.wisdom.bonus}
Charisma:     ${sheet.savingThrows.charisma.proficient ? '●' : '○'} ${sheet.savingThrows.charisma.bonus >= 0 ? '+' : ''}${sheet.savingThrows.charisma.bonus}

SKILLS
======
${Object.entries(sheet.skills).map(([name, skill]) => 
  `${skill.proficient ? '●' : '○'} ${name}: ${skill.bonus >= 0 ? '+' : ''}${skill.bonus}`
).join('\n')}

PERSONALITY TRAITS
==================
${sheet.personalityTraits.join('\n')}

IDEALS
======
${sheet.ideals.join('\n')}

BONDS
=====
${sheet.bonds.join('\n')}

FLAWS
=====
${sheet.flaws.join('\n')}

BACKSTORY
=========
${sheet.backstory}
    `.trim()
  }

  private async generatePDF(
    sheet: DDCharacterSheet | DD5eCharacterSheet, 
    edition: DNDEdition,
    options: DDExportOptions | DD5eExportOptions
  ): Promise<DDExportResult> {
    // PDF generation would require a library like jsPDF or Puppeteer
    // For now, return an error indicating this feature needs implementation
    return {
      success: false,
      errors: ['PDF export not yet implemented'],
      format: 'pdf'
    }
  }

  private validateDD35Character(character: Character): DDValidation {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Basic validation
    if (!character.name.trim()) errors.push('Character name is required')
    if (character.age < 15) warnings.push('Character age seems very young for an adventurer')
    if (character.skills.length === 0) warnings.push('Character has no skills')
    if (character.occupations.length === 0) warnings.push('Character has no occupations')

    // 3.5 specific validation
    if (character.race.name === 'Human' && character.personalityTraits.lightside.length + 
        character.personalityTraits.neutral.length + character.personalityTraits.darkside.length === 0) {
      warnings.push('Character has no personality traits defined')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      legalCharacter: errors.length === 0,
      rulesCompliant: errors.length === 0 && warnings.length === 0,
      suggestions
    }
  }

  private validateDD5eCharacter(character: Character): DD5eValidation {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Basic validation
    if (!character.name.trim()) errors.push('Character name is required')
    if (character.age < 15) warnings.push('Character age seems very young for an adventurer')
    if (character.skills.length === 0) warnings.push('Character has no skills')

    // 5e specific validation
    if (character.personalityTraits.lightside.length + character.personalityTraits.neutral.length + 
        character.personalityTraits.darkside.length === 0) {
      warnings.push('Character needs personality traits, ideals, bonds, and flaws for 5e')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      legalCharacter: errors.length === 0,
      rulesCompliant: errors.length === 0 && warnings.length === 0,
      suggestions,
      levelAppropriate: true
    }
  }
}

/**
 * D&D 3.5 Converter Implementation
 */
class DD35Converter implements DDConverter {
  convertCharacter(character: Character): DDCharacterSheet {
    const abilityModifiers = this.calculateAbilityModifiers(character)
    const skills = this.mapSkills(character)
    
    return {
      characterName: character.name,
      race: character.race.name,
      classes: this.mapClasses(character),
      level: character.level || 1,
      alignment: this.mapAlignment(character),
      age: character.age,
      
      abilities: this.generateAbilityScores(character),
      
      hitPoints: this.calculateHitPoints(character),
      armorClass: 10, // Base AC, will be calculated based on equipment
      touch: 10,
      flatFooted: 10,
      initiative: abilityModifiers.dexterity,
      speed: this.calculateSpeed(character),
      
      saves: this.calculateSaves(character),
      skills: skills,
      
      equipment: this.mapEquipment(character),
      money: { copper: 0, silver: 0, gold: 100, platinum: 0 }, // Starting gold
      
      background: this.generateBackground(character),
      personality: this.generatePersonality(character),
      goals: this.generateGoals(character),
      relationships: this.generateRelationships(character),
      
      classFeatures: [],
      racialTraits: this.mapRacialTraits(character),
      feats: [],
      
      notes: [],
      backstory: this.generateBackstory(character)
    }
  }

  calculateAbilityModifiers(character: Character): any {
    // Default ability scores based on race and background
    const baseScores = {
      strength: 13,
      dexterity: 13,
      constitution: 13,
      intelligence: 13,
      wisdom: 13,
      charisma: 13
    }

    // Apply racial modifiers
    const racialMods = this.getRacialModifiers(character.race.name)
    
    return {
      strength: baseScores.strength + racialMods.strength,
      dexterity: baseScores.dexterity + racialMods.dexterity,
      constitution: baseScores.constitution + racialMods.constitution,
      intelligence: baseScores.intelligence + racialMods.intelligence,
      wisdom: baseScores.wisdom + racialMods.wisdom,
      charisma: baseScores.charisma + racialMods.charisma
    }
  }

  mapSkills(character: Character): any[] {
    return character.skills.map(skill => ({
      name: this.mapSkillName(skill.name),
      keyAbility: this.getSkillKeyAbility(skill.name),
      ranks: skill.rank,
      abilityModifier: 0, // Will be calculated
      miscModifier: 0,
      total: skill.rank,
      classSkill: this.isClassSkill(skill.name, character),
      sources: [skill.source]
    }))
  }

  suggestClasses(character: Character): DDClassSuggestion[] {
    const suggestions: DDClassSuggestion[] = []
    
    // Analyze character background for class suggestions
    const combatSkills = character.skills.filter(s => 
      ['Combat', 'Military'].includes(s.type) || 
      s.name.toLowerCase().includes('weapon') ||
      s.name.toLowerCase().includes('fight')
    ).length
    
    const magicSkills = character.skills.filter(s => 
      s.name.toLowerCase().includes('magic') ||
      s.name.toLowerCase().includes('spell') ||
      s.description?.toLowerCase().includes('magic')
    ).length
    
    const socialSkills = character.skills.filter(s => 
      s.type === 'Social' ||
      s.name.toLowerCase().includes('diplomacy') ||
      s.name.toLowerCase().includes('bluff')
    ).length

    // Fighter suggestion - check combat skills OR military occupations
    const militaryOccupations = character.occupations.filter(o => o.type === 'Military').length
    if (combatSkills >= 2 || militaryOccupations >= 1) {
      suggestions.push({
        className: 'Fighter',
        suitability: Math.min(90, 60 + (combatSkills * 10) + (militaryOccupations * 15)),
        reasons: ['Strong combat background', 'Military experience'],
        backgroundSupport: character.occupations.filter(o => o.type === 'Military').map(o => o.name),
        potential: combatSkills > 4 ? 'Excellent' : 'High'
      })
    }

    // Wizard suggestion
    if (magicSkills > 1 || character.skills.some(s => s.type === 'Academic')) {
      suggestions.push({
        className: 'Wizard',
        suitability: Math.min(85, 50 + (magicSkills * 15)),
        reasons: ['Academic background', 'Interest in magic'],
        backgroundSupport: character.occupations.filter(o => o.type === 'Academic').map(o => o.name),
        potential: magicSkills > 2 ? 'Excellent' : 'Medium'
      })
    }

    // Rogue suggestion
    const rogueSkills = character.skills.filter(s =>
      ['Criminal', 'Social'].includes(s.type) ||
      s.name.toLowerCase().includes('stealth') ||
      s.name.toLowerCase().includes('lock')
    ).length
    
    if (rogueSkills >= 1) {
      suggestions.push({
        className: 'Rogue',
        suitability: Math.min(85, 55 + (rogueSkills * 10)),
        reasons: ['Diverse skill set', 'Social abilities'],
        backgroundSupport: character.occupations.filter(o => o.type === 'Criminal').map(o => o.name),
        potential: rogueSkills > 4 ? 'High' : 'Medium'
      })
    }

    return suggestions.sort((a, b) => b.suitability - a.suitability)
  }

  calculateStartingGold(character: Character): number {
    let gold = 100 // Base starting gold
    
    // Adjust based on social status
    const socialMod = character.socialStatus.moneyMultiplier
    gold *= socialMod
    
    return Math.floor(gold)
  }

  generateBackgroundFeatures(character: Character): any[] {
    return [] // Implementation would go here
  }

  calculateDDStats(character: Character): DDStats {
    return {
      abilityModifiers: this.calculateAbilityModifiers(character),
      skillBonuses: {},
      startingGold: this.calculateStartingGold(character),
      bonusLanguages: [],
      traits: [],
      flaws: [],
      equipment: [],
      specialAbilities: [],
      backgroundFeatures: []
    }
  }

  // Helper methods
  private getRacialModifiers(race: string): any {
    const modifiers: { [key: string]: any } = {
      'Human': { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      'Elf': { strength: 0, dexterity: 2, constitution: -2, intelligence: 0, wisdom: 0, charisma: 0 },
      'Dwarf': { strength: 0, dexterity: 0, constitution: 2, intelligence: 0, wisdom: 0, charisma: -2 },
      'Halfling': { strength: -2, dexterity: 2, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }
    }
    return modifiers[race] || modifiers['Human']
  }

  private mapSkillName(pancastingSkill: string): string {
    // Map PanCasting skills to D&D 3.5 skills
    const mappings: { [key: string]: string } = {
      'Weapon Use': 'Use Weapon',
      'Diplomacy': 'Diplomacy',
      'Bluff': 'Bluff',
      'Sense Motive': 'Sense Motive',
      'Knowledge': 'Knowledge',
      'Craft': 'Craft',
      'Profession': 'Profession'
    }
    return mappings[pancastingSkill] || pancastingSkill
  }

  private getSkillKeyAbility(skillName: string): string {
    const abilities: { [key: string]: string } = {
      'Diplomacy': 'charisma',
      'Bluff': 'charisma',
      'Sense Motive': 'wisdom',
      'Knowledge': 'intelligence',
      'Craft': 'intelligence',
      'Profession': 'wisdom'
    }
    return abilities[skillName] || 'intelligence'
  }

  private isClassSkill(skillName: string, character: Character): boolean {
    // Determine if skill is a class skill based on character's background
    return character.skills.some(s => s.name === skillName && s.rank > 0)
  }

  private mapClasses(character: Character): any[] {
    // Default to Fighter level 1 if no specific class is determined
    return [{
      name: 'Fighter',
      level: character.level || 1,
      hitDie: 'd10',
      skillPoints: 2,
      baseAttackBonus: [1],
      saves: { fortitude: 2, reflex: 0, will: 0 },
      classFeatures: []
    }]
  }

  private mapAlignment(character: Character): string {
    if (character.alignment.dndAlignment) {
      return character.alignment.dndAlignment
    }
    
    // Map based on personality traits
    const lightside = character.personalityTraits.lightside.length
    const darkside = character.personalityTraits.darkside.length
    
    if (lightside > darkside + 2) return 'Lawful Good'
    if (darkside > lightside + 2) return 'Chaotic Evil'
    return 'True Neutral'
  }

  private generateAbilityScores(character: Character): any {
    const modifiers = this.calculateAbilityModifiers(character)
    
    return {
      strength: { score: modifiers.strength, modifier: Math.floor((modifiers.strength - 10) / 2) },
      dexterity: { score: modifiers.dexterity, modifier: Math.floor((modifiers.dexterity - 10) / 2) },
      constitution: { score: modifiers.constitution, modifier: Math.floor((modifiers.constitution - 10) / 2) },
      intelligence: { score: modifiers.intelligence, modifier: Math.floor((modifiers.intelligence - 10) / 2) },
      wisdom: { score: modifiers.wisdom, modifier: Math.floor((modifiers.wisdom - 10) / 2) },
      charisma: { score: modifiers.charisma, modifier: Math.floor((modifiers.charisma - 10) / 2) }
    }
  }

  private calculateHitPoints(character: Character): number {
    const level = character.level || 1
    const conMod = Math.floor(((this.calculateAbilityModifiers(character).constitution) - 10) / 2)
    return (10 + conMod) + ((level - 1) * (6 + conMod)) // Fighter HD
  }

  private calculateSpeed(character: Character): number {
    // Base speed by race
    const speeds: { [key: string]: number } = {
      'Human': 30,
      'Elf': 30,
      'Dwarf': 20,
      'Halfling': 20
    }
    return speeds[character.race.name] || 30
  }

  private calculateSaves(character: Character): any {
    const level = character.level || 1
    const abilities = this.generateAbilityScores(character)
    
    return {
      fortitude: { 
        base: Math.floor(level / 2) + 2, 
        abilityModifier: abilities.constitution.modifier,
        magicModifier: 0,
        miscModifier: 0,
        tempModifier: 0,
        total: Math.floor(level / 2) + 2 + abilities.constitution.modifier
      },
      reflex: { 
        base: Math.floor(level / 3), 
        abilityModifier: abilities.dexterity.modifier,
        magicModifier: 0,
        miscModifier: 0,
        tempModifier: 0,
        total: Math.floor(level / 3) + abilities.dexterity.modifier
      },
      will: { 
        base: Math.floor(level / 3), 
        abilityModifier: abilities.wisdom.modifier,
        magicModifier: 0,
        miscModifier: 0,
        tempModifier: 0,
        total: Math.floor(level / 3) + abilities.wisdom.modifier
      }
    }
  }

  private mapEquipment(character: Character): any[] {
    return character.specialItems.map(item => ({
      name: item.name,
      type: 'Miscellaneous',
      description: '',
      value: 0,
      magical: false,
      history: ''
    }))
  }

  private generateBackground(character: Character): string {
    const parts = [
      `Born ${character.birthCircumstances.legitimacy.toLowerCase()} in ${character.birthCircumstances.birthplace}`,
      `Raised in ${character.culture.name} culture`,
      `${character.socialStatus.level} social standing`
    ]
    
    if (character.occupations.length > 0) {
      parts.push(`Worked as ${character.occupations.map(o => o.name).join(', ')}`)
    }
    
    return parts.join('. ') + '.'
  }

  private generatePersonality(character: Character): string {
    const traits = [
      ...character.personalityTraits.lightside.map(t => t.name),
      ...character.personalityTraits.neutral.map(t => t.name),
      ...character.personalityTraits.darkside.map(t => t.name)
    ]
    
    return traits.length > 0 ? traits.join(', ') : 'Personality to be determined'
  }

  private generateGoals(character: Character): string {
    if (character.values.motivations.length > 0) {
      return character.values.motivations.join(', ')
    }
    return `Values ${character.values.mostValuedAbstraction}`
  }

  private generateRelationships(character: Character): string {
    const relationships = [
      ...character.companions.map(c => `Companion: ${c.name}`),
      ...character.rivals.map(r => `Rival: ${r.name}`),
      ...character.npcs.map(n => `Contact: ${n.name}`)
    ]
    
    return relationships.join('; ')
  }

  private mapRacialTraits(character: Character): string[] {
    // Map racial traits based on race
    const traits: { [key: string]: string[] } = {
      'Human': ['Extra Feat', 'Extra Skill Points'],
      'Elf': ['Low-Light Vision', 'Keen Senses', 'Immunity to Sleep'],
      'Dwarf': ['Darkvision', 'Stonecunning', 'Weapon Familiarity'],
      'Halfling': ['Small Size', 'Lucky', 'Fearless']
    }
    
    return traits[character.race.name] || []
  }

  private generateBackstory(character: Character): string {
    const events = [
      ...character.youthEvents.map(e => e.description),
      ...character.adulthoodEvents.map(e => e.description),
      ...character.miscellaneousEvents.map(e => e.description)
    ]
    
    return events.join(' ')
  }
}

/**
 * D&D 5e Converter Implementation
 */
class DD5eConverter implements DD5eConverter {
  convertCharacter(character: Character): DD5eCharacterSheet {
    const abilityScores = this.calculateAbilityScores(character)
    const abilityModifiers = this.calculateAbilityModifiers(abilityScores)
    const level = character.level || 1
    const proficiencyBonus = this.calculateProficiencyBonus(level)
    
    return {
      characterName: character.name,
      race: character.race.name,
      class: this.suggestPrimaryClass(character),
      level: level,
      background: this.suggestBackground(character),
      alignment: this.mapAlignment(character),
      experiencePoints: this.calculateExperiencePoints(level),
      
      abilityScores: abilityScores,
      abilityModifiers: abilityModifiers,
      
      proficiencyBonus: proficiencyBonus,
      savingThrows: this.calculateSavingThrows(abilityModifiers, level),
      skills: this.mapSkills(character),
      
      armorClass: 10 + abilityModifiers.dexterity,
      hitPointMaximum: this.calculateHitPoints(character, abilityModifiers),
      currentHitPoints: this.calculateHitPoints(character, abilityModifiers),
      temporaryHitPoints: 0,
      hitDice: `1d10`,
      deathSaves: { successes: 0, failures: 0 },
      
      attacks: [],
      equipment: this.mapEquipment(character),
      money: { copper: 0, silver: 0, electrum: 0, gold: 150, platinum: 0 },
      
      featuresAndTraits: this.mapRacialTraits(character),
      otherProficiencies: this.calculateProficiencies(character),
      languages: this.calculateLanguages(character),
      
      personalityTraits: this.mapPersonalityTraits(character).traits,
      ideals: this.mapPersonalityTraits(character).ideals,
      bonds: this.mapPersonalityTraits(character).bonds,
      flaws: this.mapPersonalityTraits(character).flaws,
      backstory: this.generateBackstory(character),
      
      alliesAndOrganizations: this.generateAllies(character),
      additionalFeatures: '',
      treasure: '',
      characterAppearance: '',
      characterBackstory: this.generateBackstory(character)
    }
  }

  calculateAbilityModifiers(scores: DD5eAbilityScores): DD5eAbilityScores {
    return {
      strength: Math.floor((scores.strength - 10) / 2),
      dexterity: Math.floor((scores.dexterity - 10) / 2),
      constitution: Math.floor((scores.constitution - 10) / 2),
      intelligence: Math.floor((scores.intelligence - 10) / 2),
      wisdom: Math.floor((scores.wisdom - 10) / 2),
      charisma: Math.floor((scores.charisma - 10) / 2)
    }
  }

  mapSkills(character: Character): DD5eSkillProficiencies {
    const skills: DD5eSkillProficiencies = {}
    
    // Map PanCasting skills to 5e skills
    const skillMappings: { [key: string]: { dnd5e: string, ability: keyof DD5eAbilityScores } } = {
      'Diplomacy': { dnd5e: 'Persuasion', ability: 'charisma' },
      'Bluff': { dnd5e: 'Deception', ability: 'charisma' },
      'Sense Motive': { dnd5e: 'Insight', ability: 'wisdom' },
      'Knowledge': { dnd5e: 'History', ability: 'intelligence' },
      'Craft': { dnd5e: 'Athletics', ability: 'strength' },
      'Stealth': { dnd5e: 'Stealth', ability: 'dexterity' }
    }
    
    character.skills.forEach(skill => {
      const mapping = skillMappings[skill.name]
      if (mapping) {
        skills[mapping.dnd5e] = {
          proficient: skill.rank > 0,
          expertise: skill.rank > 5,
          bonus: skill.rank,
          abilityModifier: mapping.ability,
          sources: [skill.source]
        }
      }
    })
    
    return skills
  }

  suggestClasses(character: Character): DD5eClassSuggestion[] {
    const suggestions: DD5eClassSuggestion[] = []
    
    // Analyze character for class suggestions
    const combatSkills = character.skills.filter(s => 
      s.type === 'Combat' || s.name.toLowerCase().includes('weapon')
    ).length
    
    const magicInterest = character.skills.filter(s => 
      s.name.toLowerCase().includes('magic') || s.type === 'Academic'
    ).length
    
    const socialSkills = character.skills.filter(s => 
      s.type === 'Social'
    ).length
    
    // Fighter - check combat skills OR military occupations
    const militaryOccupations = character.occupations.filter(o => o.type === 'Military').length
    if (combatSkills >= 1 || militaryOccupations >= 1) {
      suggestions.push({
        className: 'Fighter',
        suitability: Math.min(90, 50 + (combatSkills * 15) + (militaryOccupations * 20)),
        reasons: ['Combat experience', 'Weapon training'],
        backgroundSupport: character.occupations.filter(o => o.type === 'Military').map(o => o.name),
        potential: combatSkills > 3 ? 'Excellent' : 'High',
        primaryAbility: 'strength',
        savingThrows: ['strength', 'constitution']
      })
    }
    
    // Wizard
    if (magicInterest > 0) {
      suggestions.push({
        className: 'Wizard',
        suitability: Math.min(85, 40 + (magicInterest * 20)),
        reasons: ['Academic background', 'Scholarly pursuits'],
        backgroundSupport: character.occupations.filter(o => o.type === 'Academic').map(o => o.name),
        potential: magicInterest > 2 ? 'Excellent' : 'Medium',
        primaryAbility: 'intelligence',
        savingThrows: ['intelligence', 'wisdom']
      })
    }
    
    // Rogue
    if (socialSkills >= 1) {
      suggestions.push({
        className: 'Rogue',
        suitability: Math.min(80, 45 + (socialSkills * 12)),
        reasons: ['Social skills', 'Versatile background'],
        backgroundSupport: character.occupations.map(o => o.name),
        potential: 'High',
        primaryAbility: 'dexterity',
        savingThrows: ['dexterity', 'intelligence']
      })
    }
    
    return suggestions.sort((a, b) => b.suitability - a.suitability)
  }

  suggestBackgrounds(character: Character): DD5eBackgroundSuggestion[] {
    const suggestions: DD5eBackgroundSuggestion[] = []
    
    // Analyze character's occupations and background for suggestions
    const hasAcademic = character.occupations.some(o => o.type === 'Academic')
    const hasMilitary = character.occupations.some(o => o.type === 'Military')
    const hasCriminal = character.occupations.some(o => o.type === 'Criminal')
    const hasReligious = character.occupations.some(o => o.type === 'Religious')
    
    if (hasAcademic) {
      suggestions.push({
        name: 'Sage',
        description: 'Academic background with research experience',
        suitability: 85,
        skillProficiencies: ['Arcana', 'History'],
        toolProficiencies: [],
        languages: 2,
        equipment: ['Scholar\'s pack', 'Ink and quill'],
        feature: 'Researcher',
        personalityTraits: ['I am easily distracted by the promise of information'],
        ideals: ['Knowledge is power'],
        bonds: ['The workshop where I learned my trade is the most important place in the world to me'],
        flaws: ['I am horribly awkward in social situations']
      })
    }
    
    if (hasMilitary) {
      suggestions.push({
        name: 'Soldier',
        description: 'Military service and combat experience',
        suitability: 90,
        skillProficiencies: ['Athletics', 'Intimidation'],
        toolProficiencies: ['One type of gaming set', 'Vehicles (land)'],
        languages: 0,
        equipment: ['Uniform', 'Insignia of rank'],
        feature: 'Military Rank',
        personalityTraits: ['I can stare down a hell hound without flinching'],
        ideals: ['Greater Good'],
        bonds: ['I would still lay down my life for the people I served with'],
        flaws: ['The monstrous enemy we faced in battle still leaves me quivering with fear']
      })
    }
    
    return suggestions.sort((a, b) => b.suitability - a.suitability)
  }

  calculateProficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1
  }

  generateBackgroundFeatures(character: Character): DD5eBackgroundFeature[] {
    return character.youthEvents.concat(character.adulthoodEvents).map(event => ({
      name: event.name,
      description: event.description,
      source: 'Background Event',
      category: 'Personal'
    }))
  }

  mapPersonalityTraits(character: Character): {
    traits: string[]
    ideals: string[]
    bonds: string[]
    flaws: string[]
  } {
    return {
      traits: character.personalityTraits.lightside.concat(character.personalityTraits.neutral)
        .map(t => t.description).slice(0, 2),
      ideals: [character.values.mostValuedAbstraction || 'Honor'],
      bonds: [character.values.mostValuedPerson || 'My family'],
      flaws: character.personalityTraits.darkside.map(t => t.description).slice(0, 1)
    }
  }

  calculateDD5eStats(character: Character): DD5eStats {
    const abilityScores = this.calculateAbilityScores(character)
    
    return {
      abilityScores: abilityScores,
      skills: this.mapSkills(character),
      savingThrows: this.calculateSavingThrows(this.calculateAbilityModifiers(abilityScores), character.level || 1),
      proficiencyBonus: this.calculateProficiencyBonus(character.level || 1),
      armorClass: 10,
      hitPoints: this.calculateHitPoints(character, this.calculateAbilityModifiers(abilityScores)),
      hitDice: '1d10',
      speed: 30,
      languages: this.calculateLanguages(character),
      proficiencies: this.calculateProficiencies(character),
      traits: character.personalityTraits.lightside.map(t => t.name),
      ideals: [character.values.mostValuedAbstraction],
      bonds: [character.values.mostValuedPerson],
      flaws: character.personalityTraits.darkside.map(t => t.name),
      equipment: [],
      backgroundFeatures: this.generateBackgroundFeatures(character)
    }
  }

  // Helper methods for 5e converter
  private calculateAbilityScores(character: Character): DD5eAbilityScores {
    // Standard array with racial bonuses
    const baseScores = {
      strength: 13,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 15
    }
    
    // Apply racial modifiers
    const racialMods = this.getRacialModifiers(character.race.name)
    
    return {
      strength: baseScores.strength + racialMods.strength,
      dexterity: baseScores.dexterity + racialMods.dexterity,
      constitution: baseScores.constitution + racialMods.constitution,
      intelligence: baseScores.intelligence + racialMods.intelligence,
      wisdom: baseScores.wisdom + racialMods.wisdom,
      charisma: baseScores.charisma + racialMods.charisma
    }
  }

  private getRacialModifiers(race: string): DD5eAbilityScores {
    const modifiers: { [key: string]: DD5eAbilityScores } = {
      'Human': { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
      'Elf': { strength: 0, dexterity: 2, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      'Dwarf': { strength: 0, dexterity: 0, constitution: 2, intelligence: 0, wisdom: 0, charisma: 0 },
      'Halfling': { strength: 0, dexterity: 2, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }
    }
    return modifiers[race] || modifiers['Human']
  }

  private calculateExperiencePoints(level: number): number {
    const xpTable = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000]
    return xpTable[level - 1] || 0
  }

  private calculateSavingThrows(modifiers: DD5eAbilityScores, level: number): any {
    const proficiencyBonus = this.calculateProficiencyBonus(level)
    
    return {
      strength: { proficient: false, bonus: modifiers.strength, sources: [] },
      dexterity: { proficient: false, bonus: modifiers.dexterity, sources: [] },
      constitution: { proficient: true, bonus: modifiers.constitution + proficiencyBonus, sources: ['Fighter'] },
      intelligence: { proficient: false, bonus: modifiers.intelligence, sources: [] },
      wisdom: { proficient: false, bonus: modifiers.wisdom, sources: [] },
      charisma: { proficient: false, bonus: modifiers.charisma, sources: [] }
    }
  }

  private calculateHitPoints(character: Character, modifiers: DD5eAbilityScores): number {
    const level = character.level || 1
    const hitDie = 10 // Fighter hit die
    return hitDie + modifiers.constitution + ((level - 1) * (6 + modifiers.constitution))
  }

  private mapEquipment(character: Character): any[] {
    return character.specialItems.map(item => ({
      name: item.name,
      type: 'Miscellaneous' as DD5eItemType,
      description: '',
      rarity: 'Common' as DD5eItemRarity,
      attunement: false,
      value: '0 gp',
      weight: 0,
      properties: [],
      magical: false
    }))
  }

  private mapRacialTraits(character: Character): string[] {
    const traits: { [key: string]: string[] } = {
      'Human': ['Extra Feat', 'Extra Skill'],
      'Elf': ['Darkvision', 'Keen Senses', 'Fey Ancestry', 'Trance'],
      'Dwarf': ['Darkvision', 'Dwarven Resilience', 'Stonecunning'],
      'Halfling': ['Lucky', 'Brave', 'Halfling Nimbleness']
    }
    
    return traits[character.race.name] || []
  }

  private calculateProficiencies(character: Character): any {
    return {
      armor: ['All armor', 'shields'],
      weapons: ['Simple weapons', 'martial weapons'],
      tools: character.skills.filter(s => s.type === 'Craft').map(s => s.name),
      vehicles: []
    }
  }

  private calculateLanguages(character: Character): string[] {
    const languages = ['Common']
    
    // Add racial languages
    if (character.race.name === 'Elf') languages.push('Elvish')
    if (character.race.name === 'Dwarf') languages.push('Dwarvish')
    if (character.race.name === 'Halfling') languages.push('Halfling')
    
    return languages
  }

  private suggestPrimaryClass(character: Character): string {
    const suggestions = this.suggestClasses(character)
    return suggestions.length > 0 ? suggestions[0].className : 'Fighter'
  }

  private suggestBackground(character: Character): string {
    const suggestions = this.suggestBackgrounds(character)
    return suggestions.length > 0 ? suggestions[0].name : 'Folk Hero'
  }

  private mapAlignment(character: Character): string {
    if (character.alignment.dndAlignment) {
      return character.alignment.dndAlignment
    }
    
    const lightside = character.personalityTraits.lightside.length
    const darkside = character.personalityTraits.darkside.length
    
    if (lightside > darkside + 1) return 'Lawful Good'
    if (darkside > lightside + 1) return 'Chaotic Evil'
    return 'True Neutral'
  }

  private generateBackstory(character: Character): string {
    const events = [
      ...character.youthEvents.map(e => e.description),
      ...character.adulthoodEvents.map(e => e.description)
    ]
    
    return events.join(' ')
  }

  private generateAllies(character: Character): string {
    return character.companions.concat(character.npcs).map(c => c.name).join(', ')
  }
}

// Export the main service
export const dndIntegrationService = new DNDIntegrationService()