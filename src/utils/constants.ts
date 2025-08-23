// Game constants for PanCasting

import type { DiceType } from '@/types/tables'

/**
 * Application constants
 */
export const APP_CONFIG = {
  name: 'PanCasting',
  version: '1.0.0',
  description: 'D&D Background Generator',
  maxCharacters: 50,
  maxEventsPerPeriod: 10,
  storageKeys: {
    characters: 'pancasting_characters',
    settings: 'pancasting_settings',
    session: 'pancasting_session'
  }
} as const

/**
 * Dice type constants
 */
export const DICE_TYPES: DiceType[] = [
  'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100',
  '2d10', '2d20', '3d6', '1d3', '1d4', '1d6'
] as const

/**
 * Table category constants (100s-800s)
 */
export const TABLE_CATEGORIES = {
  HERITAGE: 'heritage',
  YOUTH: 'youth', 
  OCCUPATIONS: 'occupations',
  ADULTHOOD: 'adulthood',
  PERSONALITY: 'personality',
  MISCELLANEOUS: 'miscellaneous',
  CONTACTS: 'contacts',
  SPECIAL: 'special'
} as const

export const TABLE_CATEGORY_NAMES = {
  heritage: 'Heritage & Birth (100s)',
  youth: 'Youth Events (200s)',
  occupations: 'Occupations & Skills (300s)', 
  adulthood: 'Adulthood Events (400s)',
  personality: 'Personality & Values (500s)',
  miscellaneous: 'Miscellaneous Events (600s)',
  contacts: 'Contacts & Relationships (700s)',
  special: 'Special Items & Gifts (800s)'
} as const

/**
 * Race constants
 */
export const RACES = {
  HUMAN: 'Human',
  ELF: 'Elf', 
  DWARF: 'Dwarf',
  HALFLING: 'Halfling',
  CROSSBREED: 'Crossbreed',
  BEASTMAN: 'Beastman',
  REPTILEMAN: 'Reptileman',
  ORC: 'Orc',
  HALF_ORC: 'Half-orc',
  OTHER: 'Other'
} as const

/**
 * Culture type constants
 */
export const CULTURE_TYPES = {
  PRIMITIVE: 'Primitive',
  NOMADIC: 'Nomadic', 
  BARBARIC: 'Barbaric',
  CIVILIZED: 'Civilized'
} as const

export const CULTURE_SUBTYPES = {
  DEGENERATE: 'Degenerate',
  REGRESSIVE: 'Regressive',
  DEVELOPING: 'Developing',
  DYNAMIC: 'Dynamic',
  STAGNANT: 'Stagnant',
  DECADENT: 'Decadent'
} as const

/**
 * Social status constants
 */
export const SOCIAL_STATUS_LEVELS = {
  DESTITUTE: 'Destitute',
  POOR: 'Poor',
  COMFORTABLE: 'Comfortable', 
  WELL_TO_DO: 'Well-to-Do',
  WEALTHY: 'Wealthy',
  NOBILITY: 'Nobility',
  EXTREMELY_WEALTHY: 'Extremely Wealthy'
} as const

/**
 * Life period constants
 */
export const LIFE_PERIODS = {
  CHILDHOOD: 'Childhood',
  ADOLESCENCE: 'Adolescence',
  ADULTHOOD: 'Adulthood'
} as const

/**
 * Age ranges for life periods
 */
export const AGE_RANGES = {
  childhood: { min: 1, max: 12 },
  adolescence: { min: 13, max: 18 },
  adulthood: { min: 19, max: 100 }
} as const

/**
 * Event category constants
 */
export const EVENT_CATEGORIES = {
  YOUTH: 'Youth',
  ADULTHOOD: 'Adulthood', 
  MISCELLANEOUS: 'Miscellaneous',
  SPECIAL: 'Special'
} as const

/**
 * Personality trait type constants
 */
export const PERSONALITY_TRAIT_TYPES = {
  LIGHTSIDE: 'Lightside',
  NEUTRAL: 'Neutral',
  DARKSIDE: 'Darkside',
  RANDOM: 'Random',
  L: 'L',
  N: 'N', 
  D: 'D',
  R: 'R'
} as const

/**
 * Trait strength constants
 */
export const TRAIT_STRENGTHS = {
  TRIVIAL: 'Trivial',
  WEAK: 'Weak',
  AVERAGE: 'Average',
  STRONG: 'Strong',
  DRIVING: 'Driving',
  OBSESSIVE: 'Obsessive'
} as const

/**
 * Relationship type constants
 */
export const RELATIONSHIP_TYPES = {
  FAMILY: 'Family',
  FRIEND: 'Friend',
  RIVAL: 'Rival',
  ROMANTIC: 'Romantic',
  PROFESSIONAL: 'Professional',
  MENTOR: 'Mentor',
  ENEMY: 'Enemy',
  PATRON: 'Patron',
  CONTACT: 'Contact'
} as const

/**
 * Relationship strength constants
 */
export const RELATIONSHIP_STRENGTHS = {
  WEAK: 'Weak',
  AVERAGE: 'Average',
  STRONG: 'Strong',
  INTENSE: 'Intense',
  DEVOTED: 'Devoted'
} as const

/**
 * Skill type constants
 */
export const SKILL_TYPES = {
  CRAFT: 'Craft',
  PROFESSIONAL: 'Professional',
  COMBAT: 'Combat',
  SOCIAL: 'Social',
  SURVIVAL: 'Survival',
  ACADEMIC: 'Academic',
  UNUSUAL: 'Unusual'
} as const

/**
 * Occupation type constants
 */
export const OCCUPATION_TYPES = {
  CRAFT: 'Craft',
  PROFESSIONAL: 'Professional',
  MILITARY: 'Military',
  RELIGIOUS: 'Religious',
  CRIMINAL: 'Criminal',
  SPECIAL: 'Special',
  ACADEMIC: 'Academic'
} as const

/**
 * Modifier key constants
 */
export const MODIFIER_KEYS = {
  CU_MOD: 'cuMod',
  SOL_MOD: 'solMod',
  TI_MOD: 'tiMod',
  BI_MOD: 'biMod',
  LEGIT_MOD: 'legitMod',
  AGE_MOD: 'ageMod',
  GENDER_MOD: 'genderMod'
} as const

/**
 * Modifier descriptions
 */
export const MODIFIER_DESCRIPTIONS = {
  cuMod: 'Culture Modifier',
  solMod: 'Social Status Modifier',
  tiMod: 'Title Modifier',
  biMod: 'Birth Modifier',
  legitMod: 'Legitimacy Modifier',
  ageMod: 'Age Modifier',
  genderMod: 'Gender Modifier'
} as const

/**
 * D&D 3.5 ability constants
 */
export const DND_ABILITIES = {
  STRENGTH: 'strength',
  DEXTERITY: 'dexterity', 
  CONSTITUTION: 'constitution',
  INTELLIGENCE: 'intelligence',
  WISDOM: 'wisdom',
  CHARISMA: 'charisma'
} as const

/**
 * D&D 3.5 skill mappings
 */
export const DND_SKILL_MAPPINGS = {
  // Combat Skills
  'Weapon Use': 'Base Attack Bonus',
  'Archery': 'Ranged Attack',
  'Shields': 'Shield Proficiency',
  
  // Social Skills
  'Diplomacy': 'Diplomacy',
  'Intimidation': 'Intimidate',
  'Fast Talk': 'Bluff',
  'Etiquette': 'Diplomacy',
  
  // Academic Skills
  'Reading/Writing': 'Literacy',
  'Accounting': 'Profession (Accountant)',
  'Law': 'Knowledge (Law)',
  'History': 'Knowledge (History)',
  'Religion': 'Knowledge (Religion)',
  
  // Survival Skills
  'Survival': 'Survival',
  'Tracking': 'Survival',
  'Animal Handling': 'Handle Animal',
  'Riding': 'Ride',
  
  // Craft Skills
  'Smithing': 'Craft (Blacksmithing)',
  'Carpentry': 'Craft (Carpentry)',
  'Leatherworking': 'Craft (Leatherworking)',
  'Cooking': 'Profession (Cook)',
  
  // Unusual Skills
  'Gambling': 'Profession (Gambler)',
  'Performance': 'Perform',
  'Sleight of Hand': 'Sleight of Hand',
  'Stealth': 'Hide/Move Silently'
} as const

/**
 * Item type constants
 */
export const ITEM_TYPES = {
  WEAPON: 'Weapon',
  ARMOR: 'Armor',
  SHIELD: 'Shield',
  TOOL: 'Tool',
  JEWELRY: 'Jewelry',
  CLOTHING: 'Clothing',
  MISCELLANEOUS: 'Miscellaneous',
  POTION: 'Potion',
  SCROLL: 'Scroll',
  WAND: 'Wand',
  ROD: 'Rod',
  STAFF: 'Staff',
  RING: 'Ring',
  WONDROUS_ITEM: 'Wondrous Item'
} as const

/**
 * Item rarity constants
 */
export const ITEM_RARITIES = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  VERY_RARE: 'Very Rare',
  LEGENDARY: 'Legendary',
  ARTIFACT: 'Artifact'
} as const

/**
 * Generation mode constants
 */
export const GENERATION_MODES = {
  GUIDED: 'guided',
  MANUAL: 'manual',
  RANDOM: 'random'
} as const

/**
 * Validation constants
 */
export const VALIDATION_LIMITS = {
  maxCharacterNameLength: 50,
  maxDescriptionLength: 1000,
  maxNotesLength: 2000,
  maxEventsPerCharacter: 100,
  maxSkillRank: 10,
  maxAge: 200,
  maxModifierValue: 50
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_NAME: 'Name can only contain letters, spaces, apostrophes, and hyphens',
  NAME_TOO_LONG: `Name cannot exceed ${VALIDATION_LIMITS.maxCharacterNameLength} characters`,
  DESCRIPTION_TOO_LONG: `Description cannot exceed ${VALIDATION_LIMITS.maxDescriptionLength} characters`,
  INVALID_AGE: `Age must be between 0 and ${VALIDATION_LIMITS.maxAge}`,
  INVALID_SKILL_RANK: `Skill rank must be between 0 and ${VALIDATION_LIMITS.maxSkillRank}`,
  TABLE_NOT_FOUND: 'The requested table could not be found',
  INVALID_DICE_TYPE: 'Invalid dice type specified',
  ROLL_FAILED: 'Failed to roll dice',
  SAVE_FAILED: 'Failed to save character data',
  LOAD_FAILED: 'Failed to load character data'
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  CHARACTER_SAVED: 'Character saved successfully',
  CHARACTER_LOADED: 'Character loaded successfully',
  CHARACTER_DELETED: 'Character deleted successfully',
  EXPORT_SUCCESS: 'Character exported successfully',
  IMPORT_SUCCESS: 'Character imported successfully'
} as const

/**
 * Default values
 */
export const DEFAULTS = {
  characterName: 'Unnamed Character',
  characterAge: 18,
  skillRank: 1,
  eventAge: 10,
  modifierValue: 0,
  socialStatusLevel: SOCIAL_STATUS_LEVELS.COMFORTABLE,
  cultureType: CULTURE_TYPES.CIVILIZED,
  race: RACES.HUMAN
} as const

/**
 * Theme constants
 */
export const THEME = {
  colors: {
    primary: 'medieval-700',
    secondary: 'parchment-200',
    accent: 'medieval-500',
    background: 'parchment-50',
    text: 'medieval-900',
    success: 'green-600',
    warning: 'yellow-600',
    error: 'red-600'
  },
  fonts: {
    heading: 'Cinzel',
    body: 'Crimson Text'
  }
} as const