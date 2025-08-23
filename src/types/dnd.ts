// D&D 3.5 integration type definitions for PanCasting

export interface DDStats {
  abilityModifiers: AbilityModifiers
  skillBonuses: SkillBonuses
  startingGold: number
  bonusLanguages: string[]
  traits: string[]
  flaws: string[]
  equipment: Item[]
  specialAbilities: string[]
  backgroundFeatures: BackgroundFeature[]
}

export interface AbilityModifiers {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export interface SkillBonuses {
  [skillName: string]: SkillBonus
}

export interface SkillBonus {
  totalBonus: number
  ranks: number
  synergy: number
  circumstance: number
  racial: number
  background: number
  sources: string[]
  description?: string
}

export interface Item {
  name: string
  type: ItemType
  description: string
  value: number
  weight?: number
  magical: boolean
  properties?: string[]
  enhancement?: number
  rarity?: ItemRarity
  attunement?: boolean
  charges?: number
  history?: string
}

export type ItemType = 
  | 'Weapon' 
  | 'Armor' 
  | 'Shield'
  | 'Tool' 
  | 'Jewelry' 
  | 'Clothing' 
  | 'Miscellaneous'
  | 'Potion'
  | 'Scroll'
  | 'Wand'
  | 'Rod'
  | 'Staff'
  | 'Ring'
  | 'Wondrous Item'

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary' | 'Artifact'

export interface BackgroundFeature {
  name: string
  description: string
  gameEffect: string
  source: string // Which background event/table generated this
  category: 'Social' | 'Professional' | 'Cultural' | 'Personal' | 'Magical' | 'Political'
}

// D&D 3.5 Specific Mappings
export interface DDSkillMapping {
  pancasting: string
  dnd35: string
  keyAbility: keyof AbilityModifiers
  synergies?: string[]
  description: string
}

export interface DDClassSuggestion {
  className: string
  suitability: number // 0-100
  reasons: string[]
  backgroundSupport: string[]
  potential: 'Low' | 'Medium' | 'High' | 'Excellent'
}

export interface DDRacialTraitMapping {
  race: string
  traits: DDRacialTrait[]
}

export interface DDRacialTrait {
  name: string
  description: string
  gameEffect: string
  type: 'Ability' | 'Skill' | 'Combat' | 'Special'
}

// Character Sheet Export Formats
export interface DDCharacterSheet {
  // Basic Information
  characterName: string
  playerName?: string
  race: string
  classes: DDClass[]
  level: number
  alignment: string
  deity?: string
  size: string
  age: number
  gender?: string
  height?: string
  weight?: string
  eyes?: string
  hair?: string
  skin?: string
  
  // Ability Scores
  abilities: {
    strength: AbilityScore
    dexterity: AbilityScore
    constitution: AbilityScore
    intelligence: AbilityScore
    wisdom: AbilityScore
    charisma: AbilityScore
  }
  
  // Combat Statistics
  hitPoints: number
  armorClass: number
  touch: number
  flatFooted: number
  initiative: number
  speed: number
  
  // Saves
  saves: {
    fortitude: Save
    reflex: Save
    will: Save
  }
  
  // Skills
  skills: DDSkill[]
  
  // Equipment
  equipment: Item[]
  money: {
    copper: number
    silver: number
    gold: number
    platinum: number
  }
  
  // Background
  background: string
  personality: string
  goals: string
  relationships: string
  
  // Special Abilities
  classFeatures: string[]
  racialTraits: string[]
  feats: string[]
  spells?: DDSpell[]
  
  // Notes
  notes: string[]
  backstory: string
}

export interface DDClass {
  name: string
  level: number
  hitDie: string
  skillPoints: number
  baseAttackBonus: number[]
  saves: {
    fortitude: number
    reflex: number
    will: number
  }
  classFeatures: string[]
}

export interface AbilityScore {
  score: number
  modifier: number
  tempScore?: number
  tempModifier?: number
}

export interface Save {
  base: number
  abilityModifier: number
  magicModifier: number
  miscModifier: number
  tempModifier: number
  total: number
}

export interface DDSkill {
  name: string
  keyAbility: keyof AbilityModifiers
  ranks: number
  abilityModifier: number
  miscModifier: number
  total: number
  classSkill: boolean
  armorCheckPenalty?: boolean
  synergy?: number
  sources: string[]
}

export interface DDSpell {
  name: string
  school: string
  level: number
  castingTime: string
  range: string
  target: string
  duration: string
  savingThrow: string
  spellResistance: string
  description: string
}

// Export Utilities
export interface DDExportOptions {
  format: 'json' | 'xml' | 'pdf' | 'text'
  includeBackstory: boolean
  includeRelationships: boolean
  includeTimeline: boolean
  includeNotes: boolean
  template?: string
}

export interface DDExportResult {
  success: boolean
  data?: string | Blob
  errors?: string[]
  warnings?: string[]
  format: string
}

// Conversion Utilities
export interface DDConverter {
  convertCharacter(character: any): DDCharacterSheet
  calculateAbilityModifiers(character: any): AbilityModifiers
  mapSkills(character: any): DDSkill[]
  suggestClasses(character: any): DDClassSuggestion[]
  calculateStartingGold(character: any): number
  generateBackgroundFeatures(character: any): BackgroundFeature[]
}

// Validation
export interface DDValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  legalCharacter: boolean
  rulesCompliant: boolean
  suggestions: string[]
}

// Template System
export interface DDTemplate {
  name: string
  description: string
  format: string
  sections: DDTemplateSection[]
  styling?: string
}

export interface DDTemplateSection {
  name: string
  content: string
  variables: string[]
  optional: boolean
  formatting?: string
}

// Integration Settings
export interface DDIntegrationSettings {
  ruleSystem: '3.5' | '3.0' | 'Pathfinder'
  houseRules: string[]
  allowedSources: string[]
  restrictedContent: string[]
  customMappings: DDSkillMapping[]
  exportPreferences: DDExportOptions
}

// Re-export D&D 5e types for unified access
export type { 
  DD5eStats, 
  DD5eCharacterSheet, 
  DD5eClassSuggestion,
  DD5eBackgroundSuggestion,
  DD5eExportOptions,
  DD5eAbilityScores,
  DD5eSkillProficiencies,
  DD5eConverter,
  DD5eValidation
} from './dnd5e'