// Character and related entity type definitions for PanCasting
import type { DnDRace } from '@/data/dndRaces'

// Equipment references stored on Character — written by EquipmentPanel
export interface EquippedWeaponRef {
  weaponId: string
  slot: 'primary' | 'secondary' | 'ranged'
  enhancementBonus: number
  isMasterwork: boolean
  hasFocus: boolean
  hasSpecialization: boolean
  notes: string
}

export interface EquippedArmorRef {
  armorId: string
  shieldId: string
  enhancementBonus: number
  shieldEnhancement: number
  naturalArmorBonus: number
  deflectionBonus: number
  miscACBonus: number
}

export interface Character {
  // Core Identity
  id: string
  name: string
  age: number
  level?: number
  attributes?: Record<string, any>
  generationStep?: number
  lastModified?: Date
  
  // D&D 3.5 Race Selection
  // 'manual' = chosen on the character sheet before background generation
  // 'background' = deferred to the Heritage & Birth table roll (default)
  raceSource?: 'manual' | 'background'
  dndRace?: DnDRace

  // D&D 3.5 Ability Scores — final values (base + racial modifiers)
  strength?: number
  dexterity?: number
  constitution?: number
  intelligence?: number
  wisdom?: number
  charisma?: number

  // Base ability scores before racial modifiers are applied
  baseAbilityScores?: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }

  // D&D Class Selection
  characterClass?: {
    name: string
    hitDie: string
    skillPointsPerLevel: number
    classSkills: string[]
    primaryAbility: string
    startingSkillRanks?: Record<string, number>
  }

  // D&D Alignment (9-point grid)
  dndAlignment?: DnDAlignmentCode

  // Hit Points
  hpMax?: number
  hpCurrent?: number
  /** HP rolled or chosen per level (index 0 = level 1) */
  hpPerLevel?: number[]

  // Computed combat statistics — recalculated whenever class/level/race/ability scores change
  combatStats?: DnDCombatStats

  // Selected feats (feat IDs from dndFeats.ts)
  selectedFeats?: string[]       // general + human bonus slots
  fighterBonusFeats?: string[]   // fighter bonus feat slots (Fighter class only)

  // Languages beyond the race's automatic set (chosen from bonusLanguages pool)
  bonusLanguages?: string[]

  // Equipment — written by EquipmentPanel
  equippedWeapons?: EquippedWeaponRef[]
  equippedArmor?: EquippedArmorRef
  gearInventory?: Record<string, number>
  currency?: { pp?: number; gp?: number; sp?: number; cp?: number }
  /** Original rolled starting gold (in gp), retained so the spent/budget meter survives spending */
  rolledStartingGp?: number

  // Spellcaster notes — free text per spell level
  spellNotes?: Record<number, string>

  // Physical description — appearance fields shown on the Details tab
  appearance?: {
    height?: string
    weight?: string
    hair?: string
    eyes?: string
    skin?: string
    description?: string
  }

  // Finalization Status
  isFinalized?: boolean
  completedAt?: Date
  
  // Heritage & Birth (100s)
  race: Race
  culture: Culture
  socialStatus: SocialStatus
  birthCircumstances: BirthCircumstances
  family: Family
  
  // Life Events
  youthEvents: Event[]          // 200s
  adulthoodEvents: Event[]      // 400s
  miscellaneousEvents: Event[]  // 600s
  lifeEvents?: Event[]          // Combined life events (optional)
  
  // Skills & Occupations (300s)
  occupations: Occupation[]
  apprenticeships: Apprenticeship[]
  hobbies: Hobby[]
  skills: Skill[]
  
  // Personality (500s)
  values: Values
  alignment: Alignment
  personalityTraits: PersonalityTraits
  
  // Relationships (700s)
  npcs: NPC[]
  companions: Companion[]
  rivals: Rival[]
  relationships: Relationship[]
  
  // Special Items (800s)
  gifts: Gift[]
  legacies: Legacy[]
  specialItems: SpecialItem[]
  
  // System Data
  activeModifiers: Modifiers
  generationHistory: GenerationStep[]
  dndIntegration: DDStats
  
  // Balanced Modifier System
  appliedModifiers?: AppliedModifier[]
  modifierSummary?: ModifierSummary

  // Extended social data (referenced in some components)
  social?: Record<string, unknown>
}

// Heritage & Birth Types (100s)
export interface Race {
  name: string
  type: 'Human' | 'Elf' | 'Dwarf' | 'Halfling' | 'Crossbreed' | 'Beastman' | 'Reptileman' | 'Orc' | 'Half-orc' | 'Other'
  culture?: Culture
  events: string[]
  modifiers: Partial<Modifiers>
  restrictions?: string[]
  specialAbilities?: string[]
}

export interface Culture {
  name: string
  type: 'Primitive' | 'Nomadic' | 'Barbaric' | 'Civilized'
  subtype?: 'Degenerate' | 'Regressive' | 'Developing' | 'Dynamic' | 'Stagnant' | 'Decadent'
  cuMod: number
  nativeEnvironment: string[]
  survival: number
  benefits: string[]
  literacyRate: number
  restrictions?: string[]
}

export interface SocialStatus {
  level: 'Destitute' | 'Poor' | 'Comfortable' | 'Well-to-Do' | 'Wealthy' | 'Nobility' | 'Extremely Wealthy'
  solMod: number
  survivalMod: number
  moneyMultiplier: number
  literacyMod: number
  benefits: string[]
  restrictions?: string[]
}

export interface BirthCircumstances {
  legitimacy: 'Legitimate' | 'Illegitimate'
  familyHead: string
  siblings: number
  birthOrder: number
  birthplace: string
  unusualCircumstances: string[]
  biMod: number
}

export interface Family {
  head: string
  members: FamilyMember[]
  occupations: Occupation[]
  relationships: Relationship[]
  notableFeatures: string[]
  socialConnections: string[]
  // Additional properties referenced in components
  siblings?: FamilyMember[]
  parents?: FamilyMember[]
  status?: string
}

export interface FamilyMember {
  id: string
  name: string
  relationship: string
  occupation?: Occupation
  personality?: PersonalityTraits
  significance: 'Minor' | 'Major' | 'Critical'
  alive: boolean
  notes: string[]
}

// Occupation & Skills Types (300s)
export interface Occupation {
  name: string
  type: 'Craft' | 'Professional' | 'Military' | 'Religious' | 'Criminal' | 'Special' | 'Academic' | 'apprenticeship' | 'civilized' | 'hobby'
  category?: string
  culture: string[]
  rank: number
  duration: number
  achievements: string[]
  workAttitudes: string[]
  benefits: string[]
  skills: Skill[]
  income?: string
  socialStatus?: string
  // Additional property referenced in components
  result?: string
}

export interface Apprenticeship {
  occupation: Occupation
  master: NPC
  duration: number
  startAge: number
  events: string[]
  skillsLearned: Skill[]
  completed: boolean
  circumstances: string[]
}

export interface Skill {
  name: string
  rank: number
  type: 'Craft' | 'Professional' | 'Combat' | 'Social' | 'Survival' | 'Academic' | 'Unusual'
  description?: string
  source: string // Where the skill was learned
  dndEquivalent?: string
  specialty?: string // Skill specialty (e.g., "Weaponsmithing" for Craft skill)
}

export interface Hobby {
  name: string
  rank: number
  interest: 'Casual' | 'Sporadic' | 'Devoted' | 'Consuming Passion'
  incomeSpent: string
  description: string
  benefits?: string[]
  socialConnections?: string[]
}

// Personality Types (500s)
export interface PersonalityTraits {
  lightside: PersonalityTrait[]
  neutral: PersonalityTrait[]
  darkside: PersonalityTrait[]
  exotic: ExoticTrait[]
}

export interface PersonalityTrait {
  name: string
  description: string
  type: 'Lightside' | 'Neutral' | 'Darkside'
  strength: TraitStrength
  source: string // Which event/table generated this trait
}

export interface ExoticTrait {
  category: 'Mental Affliction' | 'Phobia' | 'Allergy' | 'Behavior Tag' | 'Supernatural'
  name: string
  description: string
  strength: TraitStrength
  gameEffects?: string[]
  source: string
}

export interface Values {
  mostValuedPerson: string
  mostValuedThing: string
  mostValuedAbstraction: string
  mostValuedConcept?: string
  strength: TraitStrength
  motivations: string[]
}

export interface Alignment {
  primary: 'Lightside' | 'Neutral' | 'Darkside'
  attitude: string
  description: string
  dndAlignment?: string
  behaviorGuidelines: string[]
}

// D&D 3.5 nine-point alignment grid
export type DnDAlignmentCode = 'LG' | 'NG' | 'CG' | 'LN' | 'TN' | 'CN' | 'LE' | 'NE' | 'CE'

export interface DnDCombatStats {
  /** Primary and iterative attack bonuses, e.g. [8, 3] */
  bab: number[]
  fortitude: number
  reflex: number
  will: number
  /** Full AC: 10 + DEX (capped) + armor + shield + natural + deflection + misc */
  ac: number
  /** Touch AC: 10 + DEX + deflection + misc (no armor/shield/natural) */
  touchAC: number
  /** Flat-footed AC: AC minus DEX bonus */
  flatFootedAC: number
  /** DEX mod + Improved Initiative bonus */
  initiative: number
  /** BAB + STR mod + size modifier (Medium = 0) */
  grapple: number
  /** ft/round; reduced by armor type */
  speed: number
}

// System Types
export interface Modifiers {
  cuMod: number     // Culture Modifier
  solMod: number    // Social Status Modifier
  tiMod: number     // Title Modifier
  biMod: number     // Birth Modifier
  legitMod: number  // Legitimacy Modifier
  [key: string]: number
}

export interface GenerationStep {
  id: string
  stepNumber: number
  tableId: string
  tableName: string
  rollResult?: number
  modifiersApplied: string[]
  selectedEntry?: any
  timestamp: Date
  notes?: string
  skipped?: boolean
  manualSelection?: boolean
  // Additional properties referenced in components
  result?: string
  step?: string
  rollDetails?: {
    naturalRoll: number
    modifiers: number
    finalRoll: number
    breakdown: string
  }
  roll?: number
  effects?: Array<{
    type: string
    target: string
    value: any
    description?: string
  }>
}

// Utility Types
export type TraitStrength = 'Trivial' | 'Weak' | 'Average' | 'Strong' | 'Driving' | 'Obsessive'
export type RelationshipType = 'Family' | 'Friend' | 'Rival' | 'Romantic' | 'Professional' | 'Mentor' | 'Enemy' | 'Patron' | 'Contact'
export type RelationshipStrength = 'Weak' | 'Average' | 'Strong' | 'Intense' | 'Devoted'
export type LifePeriod = 'Childhood' | 'Adolescence' | 'Adulthood'
export type EventCategory = 'Youth' | 'Adulthood' | 'Miscellaneous' | 'Special'
export type NPCType = 'Companion' | 'Rival' | 'Family' | 'Contact' | 'Patron' | 'Other' | 'companion' | 'rival' | 'family' | 'professional' | 'npc'
export type PersonalityTraitType = 'Lightside' | 'Neutral' | 'Darkside' | 'Random'

// Forward declarations for types defined in other files
export interface Event {
  id: string
  name: string
  description: string
  category: EventCategory
  period: LifePeriod
  age?: number
  // Additional properties referenced in components
  result?: string
  eventType?: string
  ageRange?: { min?: number; max?: number }
}

export interface NPC {
  id: string
  name: string
  type: NPCType
  description?: string
  role?: string
  location?: string
  disposition?: string
  importance?: string
  secrets?: string[]
  [key: string]: unknown
}

export interface Companion extends NPC {
  loyalty?: 'Weak' | 'Average' | 'Strong' | 'Devoted'
  relationship?: string
  met?: string
  currentStatus?: string
  skills?: string[]
}

export interface Rival extends NPC {
  conflictType?: string
  threat?: string
  reason?: string
  currentStatus?: string
}

export interface Relationship {
  id: string
  person?: NPC
  type: RelationshipType | string
  // Additional properties referenced in components
  name?: string
  description?: string
  strength?: string
  status?: string
  history?: string
  [key: string]: unknown
}

export interface Gift {
  id: string
  name: string
  type: string
}

export interface Legacy extends Gift {
  inheritance: boolean
}

export interface SpecialItem extends Gift {
  rarity?: string
  description?: string
  category?: string
  result?: string
}

// Re-export DDStats from dnd.ts for full D&D integration
import type { DDStats as DNDStats } from './dnd'
export type DDStats = DNDStats

// Balanced Modifier System Types
export interface AppliedModifier {
  sourceEvent: string
  sourceTable: string
  positive: BalancedModifier[]
  negative: BalancedModifier[]
  appliedAt: Date
  tradeoffReason?: string
}

export interface BalancedModifier {
  type: 'ability' | 'skill' | 'trait' | 'social' | 'special'
  target: string
  value: number | string
  description: string
  category: 'physical' | 'intellectual' | 'social' | 'psychological' | 'practical'
}

export interface ModifierSummary {
  abilityScores: Record<string, number>
  skills: Record<string, number>
  traits: string[]
  socialModifiers: SocialModifier[]
  overallBalance: BalanceAssessment
}

export interface SocialModifier {
  context: string
  modifier: number
  description: string
}

export interface BalanceAssessment {
  totalPositive: number
  totalNegative: number
  netBalance: number
  warnings: string[]
}