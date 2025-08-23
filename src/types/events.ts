// Event system type definitions for PanCasting

import type { 
  LifePeriod, 
  EventCategory, 
  PersonalityTraitType,
  RelationshipType,
  NPCType 
} from './character'

export interface Event {
  id: string
  name: string
  description: string
  category: EventCategory
  period: LifePeriod
  age?: number
  effects: EventEffect[]
  personalityTrait?: PersonalityTraitType
  relationships?: RelationshipEffect[]
  items?: ItemEffect[]
  tableSource: string
  significance: 'Minor' | 'Major' | 'Critical' | 'Life_Changing'
  resolution?: string
  ongoing?: boolean
}

export interface EventEffect {
  type: 'modifier' | 'trait' | 'skill' | 'item' | 'relationship' | 'occupation' | 'social_status' | 'reputation'
  target: string
  value: any
  duration?: 'permanent' | 'temporary' | 'conditional'
  condition?: string
  description?: string
  gameImpact?: string
}

export interface RelationshipEffect {
  type: 'create' | 'modify' | 'destroy'
  npcId?: string
  npcType: NPCType
  relationshipType: RelationshipType
  strength: 'Weak' | 'Average' | 'Strong' | 'Intense'
  description: string
  circumstances: string
  obligations?: string[]
  benefits?: string[]
}

export interface ItemEffect {
  type: 'gain' | 'lose' | 'modify'
  itemType: 'weapon' | 'armor' | 'tool' | 'jewelry' | 'property' | 'document' | 'magical' | 'mundane'
  name: string
  description: string
  value?: number
  magical?: boolean
  properties?: string[]
  restrictions?: string[]
}

// Specialized Event Types by Category

// Youth Events (200s)
export interface YouthEvent extends Event {
  category: 'Youth'
  period: 'Childhood' | 'Adolescence'
  formativeImpact: boolean
  parentalReaction?: string
  socialConsequences?: string
  educationalImpact?: string
}

// Adulthood Events (400s) 
export interface AdulthoodEvent extends Event {
  category: 'Adulthood'
  period: 'Adulthood'
  careerImpact?: string
  socialStatusChange?: string
  wealthImpact?: string
  reputationChange?: string
  politicalConsequences?: string
}

// Miscellaneous Events (600s)
export interface MiscellaneousEvent extends Event {
  category: 'Miscellaneous'
  subtype: 'unusual' | 'tragedy' | 'wonderful' | 'religious' | 'romantic' | 'patron' | 'death' | 'specialized'
  complexity: 'simple' | 'complex' | 'multi_stage'
  mysticalElements?: boolean
  supernaturalInvolvement?: boolean
}

// Specialized Miscellaneous Events
export interface UnusualEvent extends MiscellaneousEvent {
  subtype: 'unusual'
  mysticalElements: true
  cosmicSignificance?: string
  longTermMystery?: string
}

export interface TragedyEvent extends MiscellaneousEvent {
  subtype: 'tragedy'
  lossType: 'person' | 'property' | 'status' | 'ability' | 'freedom'
  copingMechanism?: string
  support?: string
  recovery?: string
}

export interface WonderfulEvent extends MiscellaneousEvent {
  subtype: 'wonderful'
  benefitType: 'material' | 'social' | 'personal' | 'spiritual' | 'magical'
  celebration?: string
  sharing?: string
  responsibility?: string
}

export interface ReligiousEvent extends MiscellaneousEvent {
  subtype: 'religious'
  faithChange?: boolean
  divineIntervention?: boolean
  deity?: string
  clergy?: string
  pilgrimage?: boolean
}

export interface RomanticEvent extends MiscellaneousEvent {
  subtype: 'romantic'
  relationshipStatus: 'new' | 'existing' | 'ended' | 'complicated'
  partner: RelationshipEffect
  socialComplications?: string
  familyReactions?: string
}

export interface PatronEvent extends MiscellaneousEvent {
  subtype: 'patron'
  patronType: 'noble' | 'wealthy' | 'powerful' | 'mysterious' | 'religious' | 'criminal'
  serviceTerms: string
  obligations: string[]
  benefits: string[]
  duration?: string
}

export interface DeathEvent extends MiscellaneousEvent {
  subtype: 'death'
  deceased: RelationshipEffect
  cause: 'accident' | 'murder' | 'illness' | 'war' | 'old_age' | 'mysterious'
  characterInvolvement?: string
  inheritance?: ItemEffect[]
  investigation?: boolean
  justice?: string
}

// Specialized Experience Events
export interface PrisonEvent extends MiscellaneousEvent {
  subtype: 'specialized'
  experienceType: 'prison'
  duration: string
  prisonType: 'local' | 'royal' | 'military' | 'religious' | 'secret'
  crime?: string
  cellmates?: RelationshipEffect[]
  prisonEvents: string[]
  release: 'served_time' | 'escape' | 'pardon' | 'rescue' | 'bribe'
}

export interface MilitaryEvent extends MiscellaneousEvent {
  subtype: 'specialized'
  experienceType: 'military'
  branch: 'army' | 'navy' | 'guard' | 'militia' | 'mercenary' | 'special'
  rank?: string
  campaigns?: string[]
  battles?: string[]
  wounds?: string[]
  decorations?: string[]
  discharge: 'honorable' | 'dishonorable' | 'medical' | 'desertion'
}

export interface SlaveryEvent extends MiscellaneousEvent {
  subtype: 'specialized'
  experienceType: 'slavery'
  captureMethod: string
  master: RelationshipEffect
  treatment: 'harsh' | 'fair' | 'privileged'
  skills?: string[]
  escape?: boolean
  freedom: 'escape' | 'purchase' | 'rescue' | 'death_of_master' | 'war'
}

export interface UnderworldEvent extends MiscellaneousEvent {
  subtype: 'specialized'
  experienceType: 'underworld'
  organization?: string
  crimeType: string[]
  reputation?: string
  territory?: string
  rivals?: RelationshipEffect[]
  lawTrouble?: boolean
  exit: 'retirement' | 'betrayal' | 'arrest' | 'death' | 'promotion'
}

// Event Processing and Management
export interface EventTimeline {
  events: Event[]
  chronological: Event[]
  byPeriod: {
    childhood: Event[]
    adolescence: Event[]
    adulthood: Event[]
  }
  byCategory: {
    youth: Event[]
    adulthood: Event[]
    miscellaneous: Event[]
    special: Event[]
  }
  significance: {
    minor: Event[]
    major: Event[]
    critical: Event[]
    lifeChanging: Event[]
  }
}

export interface EventProcessor {
  processEvent(event: Event): EventResult
  applyEffects(effects: EventEffect[]): void
  validateEvent(event: Event): boolean
  generateConsequences(event: Event): EventEffect[]
}

export interface EventResult {
  event: Event
  effectsApplied: EventEffect[]
  relationshipsCreated: RelationshipEffect[]
  itemsGained: ItemEffect[]
  personalityTraitsAdded: string[]
  nextEvents?: string[]
  warnings?: string[]
}

// Event Generation
export interface EventGenerator {
  generateYouthEvent(age: number, period: LifePeriod, count?: number): YouthEvent[]
  generateAdulthoodEvent(age: number, count?: number): AdulthoodEvent[]
  generateMiscellaneousEvent(type?: string): MiscellaneousEvent
  generateRandomEvent(category?: EventCategory): Event
}

export interface EventTemplate {
  id: string
  name: string
  category: EventCategory
  period?: LifePeriod
  description: string
  effects: EventEffect[]
  conditions?: string[]
  variations?: EventTemplate[]
}

// Event Validation and Quality
export interface EventValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
  consistency: boolean
  narrative: boolean
}

export interface EventQuality {
  coherence: number // 0-100
  interest: number // 0-100
  gameRelevance: number // 0-100
  narrativeFlow: number // 0-100
  characterDevelopment: number // 0-100
}