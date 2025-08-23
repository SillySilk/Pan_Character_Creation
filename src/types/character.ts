// Character and related entity type definitions for PanCasting

export interface Character {
  // Core Identity
  id: string
  name: string
  age: number
  level?: number
  attributes?: Record<string, any>
  generationStep?: number
  lastModified?: Date
  
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
  type: 'Craft' | 'Professional' | 'Military' | 'Religious' | 'Criminal' | 'Special' | 'Academic'
  culture: string[]
  rank: number
  duration: number
  achievements: string[]
  workAttitudes: string[]
  benefits: string[]
  skills: Skill[]
  income?: string
  socialStatus?: string
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
}

// Utility Types
export type TraitStrength = 'Trivial' | 'Weak' | 'Average' | 'Strong' | 'Driving' | 'Obsessive'
export type RelationshipType = 'Family' | 'Friend' | 'Rival' | 'Romantic' | 'Professional' | 'Mentor' | 'Enemy' | 'Patron' | 'Contact'
export type RelationshipStrength = 'Weak' | 'Average' | 'Strong' | 'Intense' | 'Devoted'
export type LifePeriod = 'Childhood' | 'Adolescence' | 'Adulthood'
export type EventCategory = 'Youth' | 'Adulthood' | 'Miscellaneous' | 'Special'
export type NPCType = 'Companion' | 'Rival' | 'Family' | 'Contact' | 'Patron' | 'Other'
export type PersonalityTraitType = 'Lightside' | 'Neutral' | 'Darkside' | 'Random'

// Forward declarations for types defined in other files
export interface Event {
  id: string
  name: string
  description: string
  category: EventCategory
  period: LifePeriod
  age?: number
}

export interface NPC {
  id: string
  name: string
  type: NPCType
}

export interface Companion extends NPC {
  loyalty: 'Weak' | 'Average' | 'Strong' | 'Devoted'
}

export interface Rival extends NPC {
  conflictType: string
}

export interface Relationship {
  id: string
  person: NPC
  type: RelationshipType
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
  rarity: string
}

// Re-export DDStats from dnd.ts for full D&D integration
import type { DDStats as DNDStats } from './dnd'
export type DDStats = DNDStats