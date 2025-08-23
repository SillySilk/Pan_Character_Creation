// D&D 5th Edition integration type definitions for PanCasting

export interface DD5eStats {
  abilityScores: DD5eAbilityScores
  skills: DD5eSkillProficiencies
  savingThrows: DD5eSavingThrows
  proficiencyBonus: number
  armorClass: number
  hitPoints: number
  hitDice: string
  speed: number
  languages: string[]
  proficiencies: DD5eProficiencies
  traits: string[]
  ideals: string[]
  bonds: string[]
  flaws: string[]
  equipment: DD5eItem[]
  spells?: DD5eSpellcasting
  backgroundFeatures: DD5eBackgroundFeature[]
}

export interface DD5eAbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export interface DD5eSkillProficiencies {
  [skillName: string]: DD5eSkillProficiency
}

export interface DD5eSkillProficiency {
  proficient: boolean
  expertise: boolean
  bonus: number
  abilityModifier: keyof DD5eAbilityScores
  sources: string[]
}

export interface DD5eSavingThrows {
  strength: DD5eSavingThrow
  dexterity: DD5eSavingThrow
  constitution: DD5eSavingThrow
  intelligence: DD5eSavingThrow
  wisdom: DD5eSavingThrow
  charisma: DD5eSavingThrow
}

export interface DD5eSavingThrow {
  proficient: boolean
  bonus: number
  sources: string[]
}

export interface DD5eProficiencies {
  armor: string[]
  weapons: string[]
  tools: string[]
  vehicles: string[]
}

export interface DD5eItem {
  name: string
  type: DD5eItemType
  description: string
  rarity: DD5eItemRarity
  attunement: boolean
  value: string
  weight: number
  properties: string[]
  damage?: string
  armorClass?: number
  stealthDisadvantage?: boolean
  strength?: number
  magical: boolean
  charges?: number
  history?: string
}

export type DD5eItemType = 
  | 'Simple Melee Weapon'
  | 'Martial Melee Weapon' 
  | 'Simple Ranged Weapon'
  | 'Martial Ranged Weapon'
  | 'Light Armor'
  | 'Medium Armor'
  | 'Heavy Armor'
  | 'Shield'
  | 'Adventuring Gear'
  | 'Tools'
  | 'Mount/Vehicle'
  | 'Trade Good'
  | 'Treasure'
  | 'Magic Item'

export type DD5eItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary' | 'Artifact'

export interface DD5eBackgroundFeature {
  name: string
  description: string
  source: string
  category: 'Social' | 'Professional' | 'Cultural' | 'Personal' | 'Magical' | 'Political'
}

export interface DD5eSpellcasting {
  spellcastingClass: string
  spellcastingAbility: keyof DD5eAbilityScores
  spellSaveDC: number
  spellAttackBonus: number
  cantripsKnown: number
  spellsKnown: number
  spellSlots: DD5eSpellSlots
  spells: DD5eSpell[]
}

export interface DD5eSpellSlots {
  level1: number
  level2: number
  level3: number
  level4: number
  level5: number
  level6: number
  level7: number
  level8: number
  level9: number
}

export interface DD5eSpell {
  name: string
  level: number
  school: string
  castingTime: string
  range: string
  components: string
  duration: string
  description: string
  atHigherLevels?: string
  ritual: boolean
  concentration: boolean
  source: string
}

// 5e Character Sheet
export interface DD5eCharacterSheet {
  // Basic Information
  characterName: string
  playerName?: string
  race: string
  subrace?: string
  class: string
  subclass?: string
  level: number
  background: string
  alignment: string
  experiencePoints: number
  
  // Ability Scores
  abilityScores: DD5eAbilityScores
  abilityModifiers: DD5eAbilityScores
  
  // Proficiency
  proficiencyBonus: number
  savingThrows: DD5eSavingThrows
  skills: DD5eSkillProficiencies
  
  // Combat
  armorClass: number
  hitPointMaximum: number
  currentHitPoints: number
  temporaryHitPoints: number
  hitDice: string
  deathSaves: {
    successes: number
    failures: number
  }
  
  // Attacks & Spellcasting
  attacks: DD5eAttack[]
  spellcasting?: DD5eSpellcasting
  
  // Equipment
  equipment: DD5eItem[]
  money: {
    copper: number
    silver: number
    electrum: number
    gold: number
    platinum: number
  }
  
  // Features & Traits
  featuresAndTraits: string[]
  otherProficiencies: DD5eProficiencies
  languages: string[]
  
  // Character Background
  personalityTraits: string[]
  ideals: string[]
  bonds: string[]
  flaws: string[]
  backstory: string
  
  // Additional Notes
  alliesAndOrganizations: string
  additionalFeatures: string
  treasure: string
  characterAppearance: string
  characterBackstory: string
}

export interface DD5eAttack {
  name: string
  atkBonus: string
  damageType: string
  damage: string
  range?: string
  ammunition?: number
}

// Class Suggestions for 5e
export interface DD5eClassSuggestion {
  className: string
  subclass?: string
  suitability: number // 0-100
  reasons: string[]
  backgroundSupport: string[]
  potential: 'Low' | 'Medium' | 'High' | 'Excellent'
  primaryAbility: keyof DD5eAbilityScores
  savingThrows: (keyof DD5eAbilityScores)[]
}

// Background Suggestions for 5e
export interface DD5eBackgroundSuggestion {
  name: string
  description: string
  suitability: number
  skillProficiencies: string[]
  toolProficiencies: string[]
  languages: number
  equipment: string[]
  feature: string
  personalityTraits: string[]
  ideals: string[]
  bonds: string[]
  flaws: string[]
}

// Export Options for 5e
export interface DD5eExportOptions {
  format: 'json' | 'dndbeyond' | 'roll20' | 'foundry' | 'pdf' | 'text'
  includeBackstory: boolean
  includePersonality: boolean
  includeAppearance: boolean
  includeNotes: boolean
  officialContent: boolean
  template?: string
}

// 5e Skill Mappings
export interface DD5eSkillMapping {
  pancasting: string
  dnd5e: string
  abilityScore: keyof DD5eAbilityScores
  description: string
}

// 5e Race Trait Mappings
export interface DD5eRacialTraitMapping {
  race: string
  subrace?: string
  traits: DD5eRacialTrait[]
  abilityScoreIncrease: Partial<DD5eAbilityScores>
  size: string
  speed: number
  languages: string[]
}

export interface DD5eRacialTrait {
  name: string
  description: string
  type: 'Ability' | 'Skill Proficiency' | 'Language' | 'Resistance' | 'Sense' | 'Special'
}

// Converter Interface for 5e
export interface DD5eConverter {
  convertCharacter(character: any): DD5eCharacterSheet
  calculateAbilityModifiers(scores: DD5eAbilityScores): DD5eAbilityScores
  mapSkills(character: any): DD5eSkillProficiencies
  suggestClasses(character: any): DD5eClassSuggestion[]
  suggestBackgrounds(character: any): DD5eBackgroundSuggestion[]
  calculateProficiencyBonus(level: number): number
  generateBackgroundFeatures(character: any): DD5eBackgroundFeature[]
  mapPersonalityTraits(character: any): {
    traits: string[]
    ideals: string[]
    bonds: string[]
    flaws: string[]
  }
}

// 5e Validation
export interface DD5eValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  legalCharacter: boolean
  rulesCompliant: boolean
  suggestions: string[]
  levelAppropriate: boolean
}