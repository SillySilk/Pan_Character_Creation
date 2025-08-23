// Table system type definitions for PanCasting

export interface Table {
  id: string
  name: string
  category: TableCategory
  diceType: DiceType
  modifier?: ModifierKey
  instructions?: string
  entries: TableEntry[]
  subtables?: Table[]
  conditions?: TableCondition[]
  description?: string
}

export interface TableEntry {
  id: string
  rollRange: [number, number]
  result: string
  description?: string
  effects?: Effect[]
  goto?: string
  personalityTrait?: PersonalityTraitType
  conditions?: Condition[]
  subtableReference?: string
  modifiers?: Partial<Modifiers>
  specialInstructions?: string
}

export interface Effect {
  type: 'modifier' | 'trait' | 'skill' | 'item' | 'relationship' | 'occupation' | 'event' | 'property'
  target: string
  value: any
  duration?: 'permanent' | 'temporary'
  condition?: string
  description?: string
}

export interface Condition {
  type: 'modifier' | 'trait' | 'status' | 'roll' | 'race' | 'culture' | 'social_status'
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'includes' | 'excludes'
  value: any
  description?: string
}

export interface TableCondition {
  description: string
  conditions: Condition[]
  effect: 'enable' | 'disable' | 'modify'
}

export interface Modifiers {
  cuMod: number     // Culture Modifier
  solMod: number    // Social Status Modifier  
  tiMod: number     // Title Modifier
  biMod: number     // Birth Modifier
  legitMod: number  // Legitimacy Modifier
  ageMod?: number   // Age Modifier
  genderMod?: number // Gender Modifier
  [key: string]: number | undefined
}

// Table Categories (100s-800s)
export type TableCategory = 
  | 'heritage'       // 100s - Heritage & Birth
  | 'youth'          // 200s - Youth Events  
  | 'occupations'    // 300s - Occupations & Skills
  | 'adulthood'      // 400s - Adulthood Events
  | 'personality'    // 500s - Personality & Values
  | 'miscellaneous'  // 600s - Miscellaneous Events
  | 'contacts'       // 700s - Contacts & Relationships
  | 'special'        // 800s - Special Items & Gifts
  | 'lifeDetails'    // 900s - Life Details (Consolidated)
  | '100s' | '200s' | '300s' | '400s' | '500s' | '600s' | '700s' | '800s' | '900s' // Numeric aliases

// Dice Types
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100' | '2d10' | '2d20' | '3d6' | '1d3' | '1d4' | '1d6'

// Modifier Keys
export type ModifierKey = keyof Modifiers

// Personality Trait Types
export type PersonalityTraitType = 'Lightside' | 'Neutral' | 'Darkside' | 'Random' | 'L' | 'N' | 'D' | 'R'

// Table Result Processing
export interface TableResult {
  entry: TableEntry
  rollValue: number
  modifiersApplied: Partial<Modifiers>
  effectsToApply: Effect[]
  nextTable?: string
  personalityTraitAssigned?: PersonalityTraitType
  timestamp: Date
}

export interface DiceRoll {
  diceType: DiceType
  baseRoll: number
  modifiers: Partial<Modifiers>
  totalModifier: number
  finalResult: number
  breakdown: string
  timestamp: Date
}

// Table Navigation
export interface TableReference {
  tableId: string
  tableName: string
  category: TableCategory
  description?: string
  conditions?: Condition[]
}

export interface NavigationContext {
  currentTable: string
  history: string[]
  breadcrumbs: TableReference[]
  canGoBack: boolean
  availableJumps: TableReference[]
}

// Specialized Table Types for Different Categories

// Heritage Tables (100s)
export interface HeritageTable extends Table {
  category: 'heritage'
  raceRestrictions?: string[]
  cultureRequirements?: string[]
}

// Youth Event Tables (200s)  
export interface YouthTable extends Table {
  category: 'youth'
  lifePeriod: 'childhood' | 'adolescence' | 'both'
  ageRange?: [number, number]
  eventCount?: DiceType // How many events (e.g., 1d3)
  traitAssignment?: any // Added for compatibility
  developmentalFocus?: any // Added for compatibility
}

// Occupation Tables (300s)
export interface OccupationTable extends Table {
  category: 'occupations'
  occupationType: 'craft' | 'professional' | 'military' | 'religious' | 'criminal' | 'special'
  cultureRestrictions?: string[]
  skillsGranted?: string[]
}

// Adulthood Event Tables (400s)
export interface AdulthoodTable extends Table {
  category: 'adulthood'
  minimumAge: number
  eventFrequency?: 'single' | 'multiple' | 'age_dependent'
}

// Personality Tables (500s)
export interface PersonalityTable extends Table {
  category: 'personality'
  traitCategory: 'values' | 'alignment' | 'traits' | 'exotic'
  strengthRating?: boolean
}

// Miscellaneous Event Tables (600s)
export interface MiscellaneousTable extends Table {
  category: 'miscellaneous'
  eventType: 'unusual' | 'tragedy' | 'wonderful' | 'specialized'
  complexity: 'simple' | 'complex' | 'multi_stage'
}

// Contact Tables (700s)
export interface ContactTable extends Table {
  category: 'contacts'
  relationshipType: 'npc' | 'companion' | 'rival' | 'family'
  generateStats?: boolean
}

// Special Item Tables (800s)
export interface SpecialTable extends Table {
  category: 'special'
  itemType: 'gift' | 'legacy' | 'magical' | 'property'
  valuationRequired?: boolean
}

// Table Processing Configuration
export interface TableProcessingConfiguration {
  allowManualSelection: boolean
  showAllEntries: boolean
  applyEffectsImmediately: boolean
  trackHistory: boolean
  validateConditions: boolean
  autoNavigate: boolean
}

// Table Validation
export interface TableValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  missingReferences: string[]
  invalidRanges: string[]
}

// Table Loading and Management
export interface TableRegistry {
  tables: Map<string, Table>
  categories: Map<TableCategory, string[]>
  references: Map<string, string[]> // table -> referenced tables
  loaded: boolean
  lastUpdated: Date
}

export interface TableLoader {
  loadTable(id: string): Promise<Table>
  loadCategory(category: TableCategory): Promise<Table[]>
  validateTable(table: Table): TableValidation
  getReferences(tableId: string): string[]
}

// Table Processing Interfaces for Engine
export interface TableProcessingOptions {
  manualSelection?: number
  skipGoto?: boolean
  inheritedModifiers?: number
  additionalModifiers?: Record<string, number>
  validateConditions?: boolean
  autoApplyEffects?: boolean
}

export interface TableProcessingResult {
  tableId: string
  tableName: string
  rollResult: number
  naturalRoll: number
  modifiersApplied: number
  selectedEntry: TableEntry
  entry: TableEntry  // Added for compatibility
  character?: any     // Added for compatibility
  effects: any[]
  gotoResults?: TableProcessingResult[]
  timestamp: Date
  success: boolean
  warnings?: string[]
  errors?: string[]
}