// Character state management store for PanCasting

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { 
  Character, 
  Race, 
  Culture, 
  SocialStatus, 
  BirthCircumstances,
  Family,
  Occupation,
  Apprenticeship,
  Skill,
  Hobby,
  Values,
  Alignment,
  PersonalityTraits,
  NPC,
  Companion,
  Rival,
  Relationship,
  Gift,
  Legacy,
  SpecialItem,
  Modifiers,
  GenerationStep,
  ModifierSummary,
  BalanceAssessment,
} from '@/types/character'
import type { DDStats, SkillBonuses, BackgroundFeature, Item } from '@/types/dnd'
import type { Event as CharacterEvent } from '@/types/character'
import type { Effect } from '@/types/tables'
import { DEFAULTS } from '@/utils/constants'
import { modifierCalculator } from '@/services/modifierCalculator'
import { markdownCharacterService } from '../services/markdownCharacterService'
import { abilityScoreGenerator } from '@/services/abilityScoreGenerator'

/**
 * Character store interface
 */
interface CharacterStore {
  // Current character state
  character: Character | null
  
  // Store state
  isLoading: boolean
  error: string | null
  hasUnsavedChanges: boolean
  
  // Character management
  createNewCharacter: (name?: string) => Character
  loadCharacter: (character: Character) => void
  resetCharacter: () => void
  cloneCharacter: () => Character | null
  updateCharacter: (updates: Partial<Character>) => void
  
  // Basic character updates
  updateCharacterName: (name: string) => void
  updateCharacterAge: (age: number) => void
  
  // Ability Score Management
  rollAbilityScores: () => void
  updateAbilityScore: (ability: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma', value: number) => void

  // D&D Race Selection
  // Pass null to clear race and revert to base scores. Pass a DnDRace to apply its modifiers.
  setDndRace: (race: import('@/data/dndRaces').DnDRace | null) => void

  // Feat selection
  setSelectedFeats: (feats: string[]) => void
  setFighterBonusFeats: (feats: string[]) => void

  // Skill rank assignment — keyed by D&D skill name
  updateSkillRanks: (ranks: Record<string, number>) => void

  // D&D Alignment
  setDndAlignment: (alignment: import('@/types/character').DnDAlignmentCode) => void

  // Character Level & HP
  setCharacterLevel: (level: number) => void
  setHPCurrent: (hp: number) => void
  /** Recompute hpMax and combatStats from current class/level/ability scores */
  recalcCombatStats: () => void

  // Markdown management
  getCharacterMarkdown: () => string
  downloadCharacterMarkdown: () => void
  
  // Heritage & Birth (100s)
  updateRace: (race: Race) => void
  updateCulture: (culture: Culture) => void
  updateSocialStatus: (status: SocialStatus) => void
  updateBirthCircumstances: (circumstances: BirthCircumstances) => void
  updateFamily: (family: Family) => void
  
  // Events (200s, 400s, 600s)
  addEvent: (event: CharacterEvent) => void
  removeEvent: (eventId: string) => void
  updateEvent: (eventId: string, updates: Partial<CharacterEvent>) => void
  getEventsByPeriod: (period: 'Childhood' | 'Adolescence' | 'Adulthood') => CharacterEvent[]
  getEventsByCategory: (category: string) => CharacterEvent[]
  
  // Occupations & Skills (300s)
  addOccupation: (occupation: Occupation) => void
  removeOccupation: (occupationIndex: number) => void
  updateOccupation: (index: number, updates: Partial<Occupation>) => void
  addApprenticeship: (apprenticeship: Apprenticeship) => void
  removeApprenticeship: (apprenticeshipIndex: number) => void
  addSkill: (skill: Skill) => void
  removeSkill: (skillName: string) => void
  updateSkill: (skillName: string, updates: Partial<Skill>) => void
  addHobby: (hobby: Hobby) => void
  removeHobby: (hobbyIndex: number) => void
  
  // Personality (500s)
  updateValues: (values: Values) => void
  updateAlignment: (alignment: Alignment) => void
  updatePersonalityTraits: (traits: PersonalityTraits) => void
  addPersonalityTrait: (trait: { name: string; description: string; type: 'Lightside' | 'Neutral' | 'Darkside' }) => void
  
  // Relationships (700s)
  addNPC: (npc: NPC) => void
  removeNPC: (npcId: string) => void
  updateNPC: (npcId: string, updates: Partial<NPC>) => void
  addCompanion: (companion: Companion) => void
  removeCompanion: (companionId: string) => void
  addRival: (rival: Rival) => void
  removeRival: (rivalId: string) => void
  addRelationship: (relationship: Relationship) => void
  removeRelationship: (relationshipId: string) => void
  
  // Special Items (800s)
  addGift: (gift: Gift) => void
  removeGift: (giftId: string) => void
  addLegacy: (legacy: Legacy) => void
  removeLegacy: (legacyId: string) => void
  addSpecialItem: (item: SpecialItem) => void
  removeSpecialItem: (itemId: string) => void
  
  // Modifiers
  addModifier: (key: keyof Modifiers, value: number) => void
  removeModifier: (key: keyof Modifiers) => void
  updateModifier: (key: keyof Modifiers, value: number) => void
  calculateTotalModifier: (type: keyof Modifiers) => number
  getActiveModifiers: () => Modifiers
  
  // Generation History
  addGenerationStep: (step: GenerationStep) => void
  removeGenerationStep: (stepId: string) => void
  getGenerationHistory: () => GenerationStep[]
  clearGenerationHistory: () => void
  
  // D&D Integration
  updateDNDStats: (stats: Partial<DDStats>) => void
  calculateDNDModifiers: () => DDStats
  
  // Computed properties
  getTotalEvents: () => number
  getTotalSkills: () => number
  getTotalOccupations: () => number
  getCharacterSummary: () => string
  
  // Validation
  validateCharacter: () => { isValid: boolean; errors: string[]; warnings: string[] }
  
  // Roster Management
  saveCharacterToRoster: () => boolean
  loadCharacterRoster: () => Character[]
  deleteCharacterFromRoster: (characterId: string) => void
  finalizeCharacter: () => boolean
  
  // Persistence
  saveToLocalStorage: () => void
  loadFromLocalStorage: (characterId: string) => boolean
  exportCharacter: () => string
  importCharacter: (data: string) => boolean
  
  // Balanced Modifier System
  applyBalancedEffect: (effect: Effect, sourceEvent: string, sourceTable: string) => void
  getModifierSummary: () => ModifierSummary | null
  validateCharacterBalance: () => BalanceAssessment | null
  getModifierBreakdown: () => Array<{
    source: string
    positive: any[]
    negative: any[]
    tradeoffReason?: string
  }>

  // Utilities
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  markSaved: () => void
  markUnsaved: () => void
}

/**
 * Create a new empty character
 */
function createEmptyCharacter(name: string = DEFAULTS.characterName): Character {
  const id = `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  return {
    id,
    name,
    age: DEFAULTS.characterAge,

    // D&D Race Selection — defaults to 'background' (rolled during Heritage step)
    raceSource: 'background',
    dndRace: undefined,
    baseAbilityScores: undefined,

    // Heritage & Birth (100s) - Initialize with empty values
    race: {
      name: '',  // Empty so heritage tables will show
      type: 'Human' as const,
      events: [],
      modifiers: {}
    },
    culture: {
      name: 'Unknown',
      type: DEFAULTS.cultureType,
      cuMod: 0,
      nativeEnvironment: [],
      survival: 6,
      benefits: [],
      literacyRate: 50
    },
    socialStatus: {
      level: '' as SocialStatus['level'],  // Empty until determined during Heritage step
      solMod: 0,
      survivalMod: 0,
      moneyMultiplier: 1,
      literacyMod: 0,
      benefits: []
    },
    birthCircumstances: {
      legitimacy: '' as BirthCircumstances['legitimacy'],  // Empty until determined during Heritage step
      familyHead: '',
      siblings: 0,
      birthOrder: 0,
      birthplace: '',
      unusualCircumstances: [],
      biMod: 0
    },
    family: {
      head: 'Unknown',
      members: [],
      occupations: [],
      relationships: [],
      notableFeatures: [],
      socialConnections: []
    },
    
    // Life Events
    youthEvents: [],
    adulthoodEvents: [],
    miscellaneousEvents: [],
    
    // Skills & Occupations (300s)
    occupations: [],
    apprenticeships: [],
    hobbies: [],
    skills: [],
    
    // Personality (500s)
    values: {
      mostValuedPerson: '',
      mostValuedThing: '',
      mostValuedAbstraction: '',
      strength: 'Average',
      motivations: []
    },
    alignment: {
      primary: 'Neutral',
      attitude: '',
      description: '',
      behaviorGuidelines: []
    },
    personalityTraits: {
      lightside: [],
      neutral: [],
      darkside: [],
      exotic: []
    },
    
    // Relationships (700s)
    npcs: [],
    companions: [],
    rivals: [],
    relationships: [],
    
    // Special Items (800s)
    gifts: [],
    legacies: [],
    specialItems: [],
    
    // System Data
    activeModifiers: {
      cuMod: 0,
      solMod: 0,
      tiMod: 0,
      biMod: 0,
      legitMod: 0
    },
    generationHistory: [],
    
    // Balanced Modifier System
    appliedModifiers: [],
    modifierSummary: {
      abilityScores: {},
      skills: {},
      traits: [],
      socialModifiers: [],
      overallBalance: {
        totalPositive: 0,
        totalNegative: 0,
        netBalance: 0,
        warnings: []
      }
    },
    
    dndIntegration: {
      abilityModifiers: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
      },
      skillBonuses: {} as SkillBonuses,
      startingGold: 0,
      bonusLanguages: [],
      traits: [],
      flaws: [],
      equipment: [] as Item[],
      specialAbilities: [],
      backgroundFeatures: [] as BackgroundFeature[]
    }
  }
}

/**
 * Character store implementation
 */
export const useCharacterStore = create<CharacterStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    character: null,
    isLoading: false,
    error: null,
    hasUnsavedChanges: false,

    // Character management
    createNewCharacter: (name) => {
      const newCharacter = createEmptyCharacter(name)
      set({ character: newCharacter, hasUnsavedChanges: true, error: null })
      return newCharacter
    },

    loadCharacter: (character) => {
      set({ character: { ...character }, hasUnsavedChanges: false, error: null })
    },

    resetCharacter: () => {
      set({ character: null, hasUnsavedChanges: false, error: null })
    },

    cloneCharacter: () => {
      const { character } = get()
      if (!character) return null
      
      const cloned = { ...character, id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }
      return cloned
    },

    updateCharacter: (updates) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: { ...character, ...updates, lastModified: new Date() },
        hasUnsavedChanges: true 
      })
    },

    // Basic character updates
    updateCharacterName: (name) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: { ...character, name },
        hasUnsavedChanges: true 
      })
    },

    updateCharacterAge: (age) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: { ...character, age },
        hasUnsavedChanges: true 
      })
    },

    // Ability Score Management
    rollAbilityScores: () => {
      const { character } = get()
      if (!character) return

      // 4d6 drop lowest — standard D&D 3.5 point buy alternative
      const roll4d6DropLowest = () => {
        const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
        rolls.sort((a, b) => a - b)
        return rolls.slice(1).reduce((sum, n) => sum + n, 0)
      }

      const base = {
        strength: roll4d6DropLowest(),
        dexterity: roll4d6DropLowest(),
        constitution: roll4d6DropLowest(),
        intelligence: roll4d6DropLowest(),
        wisdom: roll4d6DropLowest(),
        charisma: roll4d6DropLowest()
      }

      // Apply racial modifiers on top of base scores
      const raceMods = character.dndRace?.abilityModifiers ?? {}
      const finalScores = {
        strength: base.strength + (raceMods.strength ?? 0),
        dexterity: base.dexterity + (raceMods.dexterity ?? 0),
        constitution: base.constitution + (raceMods.constitution ?? 0),
        intelligence: base.intelligence + (raceMods.intelligence ?? 0),
        wisdom: base.wisdom + (raceMods.wisdom ?? 0),
        charisma: base.charisma + (raceMods.charisma ?? 0)
      }

      set({
        character: {
          ...character,
          baseAbilityScores: base,
          ...finalScores,
          lastModified: new Date()
        },
        hasUnsavedChanges: true
      })
    },

    updateAbilityScore: (ability, value) => {
      const { character } = get()
      if (!character) return

      set({
        character: {
          ...character,
          [ability]: value,
          lastModified: new Date()
        },
        hasUnsavedChanges: true
      })
    },

    // D&D Race Selection — applies or removes racial ability score modifiers
    setDndRace: (race) => {
      const { character } = get()
      if (!character) return

      if (race === null) {
        // Revert to base scores and clear race
        const base = character.baseAbilityScores
        set({
          character: {
            ...character,
            dndRace: undefined,
            raceSource: 'background',
            ...(base ? {
              strength: base.strength,
              dexterity: base.dexterity,
              constitution: base.constitution,
              intelligence: base.intelligence,
              wisdom: base.wisdom,
              charisma: base.charisma
            } : {}),
            lastModified: new Date()
          },
          hasUnsavedChanges: true
        })
        return
      }

      // Compute base scores: if scores are already rolled, strip any previous racial mods first
      const prevMods = character.dndRace?.abilityModifiers ?? {}
      const base = character.baseAbilityScores ?? {
        strength: (character.strength ?? 10) - (prevMods.strength ?? 0),
        dexterity: (character.dexterity ?? 10) - (prevMods.dexterity ?? 0),
        constitution: (character.constitution ?? 10) - (prevMods.constitution ?? 0),
        intelligence: (character.intelligence ?? 10) - (prevMods.intelligence ?? 0),
        wisdom: (character.wisdom ?? 10) - (prevMods.wisdom ?? 0),
        charisma: (character.charisma ?? 10) - (prevMods.charisma ?? 0)
      }

      const newMods = race.abilityModifiers

      // Build racial skill bonus map for dndIntegration
      const racialSkillBonuses: Record<string, number> = {}
      for (const sb of race.skillBonuses ?? []) {
        racialSkillBonuses[sb.skill] = (racialSkillBonuses[sb.skill] ?? 0) + sb.bonus
      }

      set({
        character: {
          ...character,
          dndRace: race,
          raceSource: 'manual',
          baseAbilityScores: base,
          strength: base.strength + (newMods.strength ?? 0),
          dexterity: base.dexterity + (newMods.dexterity ?? 0),
          constitution: base.constitution + (newMods.constitution ?? 0),
          intelligence: base.intelligence + (newMods.intelligence ?? 0),
          wisdom: base.wisdom + (newMods.wisdom ?? 0),
          charisma: base.charisma + (newMods.charisma ?? 0),
          dndIntegration: {
            ...character.dndIntegration,
            skillBonuses: {
              ...character.dndIntegration?.skillBonuses,
              ...Object.fromEntries(
                Object.entries(racialSkillBonuses).map(([skill, bonus]) => {
                  const existing = character.dndIntegration?.skillBonuses?.[skill]
                  return [skill, {
                    totalBonus: (existing?.totalBonus ?? 0) + bonus,
                    ranks: existing?.ranks ?? 0,
                    synergy: existing?.synergy ?? 0,
                    circumstance: existing?.circumstance ?? 0,
                    racial: bonus,
                    background: existing?.background ?? 0,
                    sources: [...(existing?.sources ?? []), `${race.name} racial`]
                  }]
                })
              )
            }
          },
          lastModified: new Date()
        },
        hasUnsavedChanges: true
      })
    },

    // Feat selection
    setSelectedFeats: (feats) => {
      const { character } = get()
      if (!character) return
      set({
        character: { ...character, selectedFeats: feats, lastModified: new Date() },
        hasUnsavedChanges: true,
      })
    },

    setFighterBonusFeats: (feats) => {
      const { character } = get()
      if (!character) return
      set({
        character: { ...character, fighterBonusFeats: feats, lastModified: new Date() },
        hasUnsavedChanges: true,
      })
    },

    // Skill rank assignment
    updateSkillRanks: (ranks) => {
      const { character } = get()
      if (!character) return

      const {
        buildSkillBonuses,
      } = require('@/services/skillService') as typeof import('@/services/skillService')

      const abilities = {
        strength:     character.strength     ?? 10,
        dexterity:    character.dexterity    ?? 10,
        constitution: character.constitution ?? 10,
        intelligence: character.intelligence ?? 10,
        wisdom:       character.wisdom       ?? 10,
        charisma:     character.charisma     ?? 10,
      }

      const newBonuses = buildSkillBonuses(
        ranks,
        abilities,
        character.dndIntegration?.skillBonuses ?? {},
      )

      set({
        character: {
          ...character,
          dndIntegration: {
            ...character.dndIntegration,
            skillBonuses: newBonuses,
          },
          lastModified: new Date(),
        },
        hasUnsavedChanges: true,
      })
    },

    // D&D Alignment
    setDndAlignment: (alignment) => {
      const { character } = get()
      if (!character) return
      set({
        character: { ...character, dndAlignment: alignment, lastModified: new Date() },
        hasUnsavedChanges: true,
      })
    },

    // Character Level & HP
    setCharacterLevel: (level) => {
      const { character } = get()
      if (!character) return
      const { recalcCombatStats } = get()
      set({
        character: { ...character, level, lastModified: new Date() },
        hasUnsavedChanges: true,
      })
      // Recompute HP and combat stats with new level
      recalcCombatStats()
    },

    setHPCurrent: (hp) => {
      const { character } = get()
      if (!character) return
      set({
        character: { ...character, hpCurrent: hp, lastModified: new Date() },
        hasUnsavedChanges: true,
      })
    },

    recalcCombatStats: () => {
      const { character } = get()
      if (!character) return

      const { characterClass, level = 1 } = character
      if (!characterClass) return

      // Lazy-import to avoid circular dependency at module load time
      const {
        calcCombatStats,
        calcHPTotal,
        abilMod,
      } = require('@/services/combatStatsService') as typeof import('@/services/combatStatsService')

      const { DND_CORE_CLASSES } = require('@/data/dndClasses') as typeof import('@/data/dndClasses')
      const cls = DND_CORE_CLASSES.find(c => c.name === characterClass.name)
      if (!cls) return

      const str  = character.strength     ?? 10
      const dex  = character.dexterity    ?? 10
      const con  = character.constitution ?? 10
      const int_ = character.intelligence ?? 10
      const wis  = character.wisdom       ?? 10
      const cha  = character.charisma     ?? 10

      const conMod = abilMod(con)
      const newHPMax = calcHPTotal(characterClass.hitDie, level, conMod)

      const combatStats = calcCombatStats({
        babProgression:  cls.baseAttackBonus,
        fortProgression: cls.fortitudeSave,
        refProgression:  cls.reflexSave,
        willProgression: cls.willSave,
        level,
        str, dex, con, int: int_, wis, cha,
        baseSpeed: character.dndRace?.speed ?? 30,
      })

      set({
        character: {
          ...character,
          hpMax: newHPMax,
          hpCurrent: newHPMax,
          combatStats,
          lastModified: new Date(),
        },
        hasUnsavedChanges: true,
      })
    },

    // Markdown management
    getCharacterMarkdown: () => {
      const { character } = get()
      if (!character) return '# No Character\n\nNo character is currently loaded.'
      
      return markdownCharacterService.getCharacterMarkdown(character)
    },

    downloadCharacterMarkdown: () => {
      const { character } = get()
      if (!character) return
      
      markdownCharacterService.downloadCharacterMarkdown(character)
    },

    // Heritage & Birth updates
    updateRace: (race) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: { ...character, race },
        hasUnsavedChanges: true 
      })
    },

    updateCulture: (culture) => {
      const { character } = get()
      if (!character) return
      
      // Update culture and recalculate modifiers
      const updatedModifiers = {
        ...character.activeModifiers,
        cuMod: culture.cuMod
      }
      
      set({ 
        character: { 
          ...character, 
          culture,
          activeModifiers: updatedModifiers
        },
        hasUnsavedChanges: true 
      })
    },

    updateSocialStatus: (socialStatus) => {
      const { character } = get()
      if (!character) return
      
      // Update social status and recalculate modifiers
      const updatedModifiers = {
        ...character.activeModifiers,
        solMod: socialStatus.solMod
      }
      
      set({ 
        character: { 
          ...character, 
          socialStatus,
          activeModifiers: updatedModifiers
        },
        hasUnsavedChanges: true 
      })
    },

    updateBirthCircumstances: (birthCircumstances) => {
      const { character } = get()
      if (!character) return
      
      // Update birth circumstances and recalculate modifiers
      const updatedModifiers = {
        ...character.activeModifiers,
        biMod: birthCircumstances.biMod
      }
      
      set({ 
        character: { 
          ...character, 
          birthCircumstances,
          activeModifiers: updatedModifiers
        },
        hasUnsavedChanges: true 
      })
    },

    updateFamily: (family) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: { ...character, family },
        hasUnsavedChanges: true 
      })
    },

    // Event management
    addEvent: (event) => {
      const { character } = get()
      if (!character) return
      
      let updatedCharacter = { ...character }
      
      // Add to appropriate event array based on category
      switch (event.category) {
        case 'Youth':
          updatedCharacter.youthEvents = [...character.youthEvents, event]
          break
        case 'Adulthood':
          updatedCharacter.adulthoodEvents = [...character.adulthoodEvents, event]
          break
        case 'Miscellaneous':
          updatedCharacter.miscellaneousEvents = [...character.miscellaneousEvents, event]
          break
        default:
          // Add to miscellaneous if category is unknown
          updatedCharacter.miscellaneousEvents = [...character.miscellaneousEvents, event]
      }
      
      set({ 
        character: updatedCharacter,
        hasUnsavedChanges: true 
      })
    },

    removeEvent: (eventId) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          youthEvents: character.youthEvents.filter(e => e.id !== eventId),
          adulthoodEvents: character.adulthoodEvents.filter(e => e.id !== eventId),
          miscellaneousEvents: character.miscellaneousEvents.filter(e => e.id !== eventId)
        },
        hasUnsavedChanges: true 
      })
    },

    updateEvent: (eventId, updates) => {
      const { character } = get()
      if (!character) return
      
      const updateEventInArray = (events: CharacterEvent[]) => 
        events.map(event => event.id === eventId ? { ...event, ...updates } : event)
      
      set({ 
        character: {
          ...character,
          youthEvents: updateEventInArray(character.youthEvents),
          adulthoodEvents: updateEventInArray(character.adulthoodEvents),
          miscellaneousEvents: updateEventInArray(character.miscellaneousEvents)
        },
        hasUnsavedChanges: true 
      })
    },

    getEventsByPeriod: (period) => {
      const { character } = get()
      if (!character) return []
      
      return [
        ...character.youthEvents,
        ...character.adulthoodEvents,
        ...character.miscellaneousEvents
      ].filter(event => event.period === period)
    },

    getEventsByCategory: (category) => {
      const { character } = get()
      if (!character) return []
      
      return [
        ...character.youthEvents,
        ...character.adulthoodEvents,
        ...character.miscellaneousEvents
      ].filter(event => event.category === category)
    },

    // Occupation management
    addOccupation: (occupation) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          occupations: [...character.occupations, occupation]
        },
        hasUnsavedChanges: true 
      })
    },

    removeOccupation: (index) => {
      const { character } = get()
      if (!character) return
      
      const updatedOccupations = character.occupations.filter((_, i) => i !== index)
      
      set({ 
        character: {
          ...character,
          occupations: updatedOccupations
        },
        hasUnsavedChanges: true 
      })
    },

    updateOccupation: (index, updates) => {
      const { character } = get()
      if (!character) return
      
      const updatedOccupations = character.occupations.map((occupation, i) => 
        i === index ? { ...occupation, ...updates } : occupation
      )
      
      set({ 
        character: {
          ...character,
          occupations: updatedOccupations
        },
        hasUnsavedChanges: true 
      })
    },

    addApprenticeship: (apprenticeship) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          apprenticeships: [...character.apprenticeships, apprenticeship]
        },
        hasUnsavedChanges: true 
      })
    },

    removeApprenticeship: (index) => {
      const { character } = get()
      if (!character) return
      
      const updatedApprenticeships = character.apprenticeships.filter((_, i) => i !== index)
      
      set({ 
        character: {
          ...character,
          apprenticeships: updatedApprenticeships
        },
        hasUnsavedChanges: true 
      })
    },

    addSkill: (skill) => {
      const { character } = get()
      if (!character || !character.skills) return
      
      // Check if skill already exists and update rank instead
      const existingSkillIndex = character.skills.findIndex(s => s.name === skill.name)
      
      if (existingSkillIndex !== -1) {
        const updatedSkills = [...character.skills]
        updatedSkills[existingSkillIndex] = {
          ...updatedSkills[existingSkillIndex],
          rank: Math.max(updatedSkills[existingSkillIndex].rank, skill.rank),
          specialty: skill.specialty || updatedSkills[existingSkillIndex].specialty
        }
        
        set({ 
          character: {
            ...character,
            skills: updatedSkills
          },
          hasUnsavedChanges: true 
        })
      } else {
        set({ 
          character: {
            ...character,
            skills: [...character.skills, skill]
          },
          hasUnsavedChanges: true 
        })
      }
    },

    removeSkill: (skillName) => {
      const { character } = get()
      if (!character || !character.skills) return
      
      const updatedSkills = character.skills.filter(skill => skill.name !== skillName)
      
      set({ 
        character: {
          ...character,
          skills: updatedSkills
        },
        hasUnsavedChanges: true 
      })
    },

    updateSkill: (skillName, updates) => {
      const { character } = get()
      if (!character || !character.skills) return
      
      const existingSkillIndex = character.skills.findIndex(s => s.name === skillName)
      if (existingSkillIndex === -1) return
      
      const updatedSkills = [...character.skills]
      updatedSkills[existingSkillIndex] = {
        ...updatedSkills[existingSkillIndex],
        ...(updates as Partial<Skill>)
      }
      
      set({ 
        character: {
          ...character,
          skills: updatedSkills
        },
        hasUnsavedChanges: true 
      })
    },

    addHobby: (hobby) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          hobbies: [...character.hobbies, hobby]
        },
        hasUnsavedChanges: true 
      })
    },

    removeHobby: (index) => {
      const { character } = get()
      if (!character) return
      
      const updatedHobbies = character.hobbies.filter((_, i) => i !== index)
      
      set({ 
        character: {
          ...character,
          hobbies: updatedHobbies
        },
        hasUnsavedChanges: true 
      })
    },

    // Personality management
    updateValues: (values) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: { ...character, values },
        hasUnsavedChanges: true 
      })
    },

    updateAlignment: (alignment) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: { ...character, alignment },
        hasUnsavedChanges: true 
      })
    },

    updatePersonalityTraits: (personalityTraits) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: { ...character, personalityTraits },
        hasUnsavedChanges: true 
      })
    },

    addPersonalityTrait: (trait) => {
      const { character } = get()
      if (!character) return
      
      const newTrait = {
        ...trait,
        strength: 'Average' as const,
        source: 'Manual Entry'
      }
      
      const updatedTraits = { ...character.personalityTraits }
      
      switch (trait.type) {
        case 'Lightside':
          updatedTraits.lightside = [...updatedTraits.lightside, newTrait]
          break
        case 'Neutral':
          updatedTraits.neutral = [...updatedTraits.neutral, newTrait]
          break
        case 'Darkside':
          updatedTraits.darkside = [...updatedTraits.darkside, newTrait]
          break
      }
      
      set({ 
        character: { ...character, personalityTraits: updatedTraits },
        hasUnsavedChanges: true 
      })
    },

    // Relationship management
    addNPC: (npc) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          npcs: [...character.npcs, npc]
        },
        hasUnsavedChanges: true 
      })
    },

    removeNPC: (npcId) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          npcs: character.npcs.filter(npc => npc.id !== npcId)
        },
        hasUnsavedChanges: true 
      })
    },

    updateNPC: (npcId, updates) => {
      const { character } = get()
      if (!character) return
      
      const updatedNPCs = character.npcs.map(npc => 
        npc.id === npcId ? { ...npc, ...updates } : npc
      )
      
      set({ 
        character: {
          ...character,
          npcs: updatedNPCs
        },
        hasUnsavedChanges: true 
      })
    },

    addCompanion: (companion) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          companions: [...character.companions, companion]
        },
        hasUnsavedChanges: true 
      })
    },

    removeCompanion: (companionId) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          companions: character.companions.filter(c => c.id !== companionId)
        },
        hasUnsavedChanges: true 
      })
    },

    addRival: (rival) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          rivals: [...character.rivals, rival]
        },
        hasUnsavedChanges: true 
      })
    },

    removeRival: (rivalId) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          rivals: character.rivals.filter(r => r.id !== rivalId)
        },
        hasUnsavedChanges: true 
      })
    },

    addRelationship: (relationship) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          relationships: [...character.relationships, relationship]
        },
        hasUnsavedChanges: true 
      })
    },

    removeRelationship: (relationshipId) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          relationships: character.relationships.filter(r => r.id !== relationshipId)
        },
        hasUnsavedChanges: true 
      })
    },

    // Special Items management
    addGift: (gift) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          gifts: [...character.gifts, gift]
        },
        hasUnsavedChanges: true 
      })
    },

    removeGift: (giftId) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          gifts: character.gifts.filter(g => g.id !== giftId)
        },
        hasUnsavedChanges: true 
      })
    },

    addLegacy: (legacy) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          legacies: [...character.legacies, legacy]
        },
        hasUnsavedChanges: true 
      })
    },

    removeLegacy: (legacyId) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          legacies: character.legacies.filter(l => l.id !== legacyId)
        },
        hasUnsavedChanges: true 
      })
    },

    addSpecialItem: (item) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          specialItems: [...character.specialItems, item]
        },
        hasUnsavedChanges: true 
      })
    },

    removeSpecialItem: (itemId) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          specialItems: character.specialItems.filter(i => i.id !== itemId)
        },
        hasUnsavedChanges: true 
      })
    },

    // Modifier management
    addModifier: (key, value) => {
      const { character } = get()
      if (!character) return
      
      const updatedModifiers = {
        ...character.activeModifiers,
        [key]: (character.activeModifiers[key] || 0) + value
      }
      
      set({ 
        character: {
          ...character,
          activeModifiers: updatedModifiers
        },
        hasUnsavedChanges: true 
      })
    },

    removeModifier: (key) => {
      const { character } = get()
      if (!character) return
      
      const updatedModifiers = { ...character.activeModifiers }
      delete updatedModifiers[key]
      
      set({ 
        character: {
          ...character,
          activeModifiers: updatedModifiers
        },
        hasUnsavedChanges: true 
      })
    },

    updateModifier: (key, value) => {
      const { character } = get()
      if (!character) return
      
      const updatedModifiers = {
        ...character.activeModifiers,
        [key]: value
      }
      
      set({ 
        character: {
          ...character,
          activeModifiers: updatedModifiers
        },
        hasUnsavedChanges: true 
      })
    },

    calculateTotalModifier: (type) => {
      const { character } = get()
      if (!character) return 0
      
      return character.activeModifiers[type] || 0
    },

    getActiveModifiers: () => {
      const { character } = get()
      return character?.activeModifiers || {
        cuMod: 0,
        solMod: 0,
        tiMod: 0,
        biMod: 0,
        legitMod: 0
      }
    },

    // Generation History
    addGenerationStep: (step) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          generationHistory: [...character.generationHistory, step]
        },
        hasUnsavedChanges: true 
      })
    },

    removeGenerationStep: (stepId) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          generationHistory: character.generationHistory.filter(step => step.id !== stepId)
        },
        hasUnsavedChanges: true 
      })
    },

    getGenerationHistory: () => {
      const { character } = get()
      return character?.generationHistory || []
    },

    clearGenerationHistory: () => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          generationHistory: []
        },
        hasUnsavedChanges: true 
      })
    },

    // D&D Integration
    updateDNDStats: (stats) => {
      const { character } = get()
      if (!character) return
      
      set({ 
        character: {
          ...character,
          dndIntegration: { ...character.dndIntegration, ...stats }
        },
        hasUnsavedChanges: true 
      })
    },

    calculateDNDModifiers: () => {
      const { character } = get()
      if (!character) return createEmptyCharacter().dndIntegration

      // Calculate ability scores using the intelligent generator
      const abilityScores = abilityScoreGenerator.generateScores(character, 'intelligent')
      const finalScores = abilityScoreGenerator.applyRacialModifiers(abilityScores, character.race.name)
      const abilityModifiers = abilityScoreGenerator.calculateModifiers(finalScores)

      // Calculate skill bonuses
      const skillBonuses: SkillBonuses = {}
      character.skills.forEach(skill => {
        skillBonuses[skill.name] = {
          totalBonus: skill.rank,
          ranks: skill.rank,
          synergy: 0,
          circumstance: 0,
          racial: 0,
          background: 0,
          sources: [skill.source],
          description: skill.description
        }
      })

      // Calculate starting gold based on social status
      const startingGold = Math.floor(100 * character.socialStatus.moneyMultiplier)

      // Gather background features from events
      const backgroundFeatures: BackgroundFeature[] = []

      character.youthEvents.forEach(event => {
        backgroundFeatures.push({
          name: event.name,
          description: event.description,
          gameEffect: 'Youth event experience',
          source: 'Youth Events',
          category: 'Personal'
        })
      })

      character.adulthoodEvents.forEach(event => {
        backgroundFeatures.push({
          name: event.name,
          description: event.description,
          gameEffect: 'Life experience',
          source: 'Adulthood Events',
          category: 'Personal'
        })
      })

      // Gather traits from personality
      const traits = [
        ...character.personalityTraits.lightside.map(t => t.name),
        ...character.personalityTraits.neutral.map(t => t.name)
      ]

      const flaws = character.personalityTraits.darkside.map(t => t.name)

      // Map special items to equipment
      const equipment: Item[] = character.specialItems.map(item => ({
        name: item.name || 'Unknown Item',
        type: 'Miscellaneous',
        description: '',
        value: 0,
        magical: false,
        history: ''
      }))

      const dndStats: DDStats = {
        abilityModifiers,
        skillBonuses,
        startingGold,
        bonusLanguages: [],
        traits,
        flaws,
        equipment,
        specialAbilities: [],
        backgroundFeatures
      }

      // Update character with calculated stats
      set({
        character: {
          ...character,
          dndIntegration: dndStats
        }
      })

      return dndStats
    },

    // Computed properties
    getTotalEvents: () => {
      const { character } = get()
      if (!character) return 0
      
      return character.youthEvents.length + 
             character.adulthoodEvents.length + 
             character.miscellaneousEvents.length
    },

    getTotalSkills: () => {
      const { character } = get()
      return character?.skills ? character.skills.length : 0
    },

    getTotalOccupations: () => {
      const { character } = get()
      return character?.occupations.length || 0
    },

    getCharacterSummary: () => {
      const { character } = get()
      if (!character) return ''
      
      const parts = [
        `${character.name}, age ${character.age}`,
        `${character.race.name} from ${character.culture.name} culture`,
        `${character.socialStatus.level} social status`,
        `${get().getTotalEvents()} life events`,
        `${get().getTotalSkills()} skills`,
        `${get().getTotalOccupations()} occupations`
      ]
      
      return parts.join(' • ')
    },

    // Validation
    validateCharacter: () => {
      const { character } = get()
      if (!character) {
        return { isValid: false, errors: ['No character loaded'], warnings: [] }
      }
      
      const errors: string[] = []
      const warnings: string[] = []
      
      // Basic validation
      if (!character.name.trim()) errors.push('Character name is required')
      if (character.age < 0 || character.age > 200) warnings.push('Unusual character age')
      
      // More validation logic can be added here
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings
      }
    },

    // Roster Management
    saveCharacterToRoster: () => {
      const { character } = get()
      if (!character) return false
      
      try {
        // Load existing roster
        const existingRoster = get().loadCharacterRoster()
        
        // Check if character already exists in roster and update, or add new
        const existingIndex = existingRoster.findIndex(c => c.id === character.id)
        let updatedRoster: Character[]
        
        if (existingIndex >= 0) {
          // Update existing character
          updatedRoster = [...existingRoster]
          updatedRoster[existingIndex] = { ...character, lastModified: new Date() }
        } else {
          // Add new character
          updatedRoster = [...existingRoster, { ...character, lastModified: new Date() }]
        }
        
        // Save to localStorage
        localStorage.setItem('pancasting-characters', JSON.stringify(updatedRoster))
        set({ hasUnsavedChanges: false })
        return true
      } catch (error) {
        set({ error: 'Failed to save character to roster' })
        return false
      }
    },

    loadCharacterRoster: () => {
      try {
        const stored = localStorage.getItem('pancasting-characters')
        if (stored) {
          return JSON.parse(stored) as Character[]
        }
        return []
      } catch (error) {
        set({ error: 'Failed to load character roster' })
        return []
      }
    },

    deleteCharacterFromRoster: (characterId: string) => {
      try {
        const existingRoster = get().loadCharacterRoster()
        const updatedRoster = existingRoster.filter(c => c.id !== characterId)
        localStorage.setItem('pancasting-characters', JSON.stringify(updatedRoster))
        
        // If we're deleting the currently loaded character, reset it
        const { character } = get()
        if (character?.id === characterId) {
          set({ character: null, hasUnsavedChanges: false })
        }
      } catch (error) {
        set({ error: 'Failed to delete character from roster' })
      }
    },

    finalizeCharacter: () => {
      const { character } = get()
      if (!character) return false
      
      try {
        // Set completion timestamp
        const finalizedCharacter = {
          ...character,
          completedAt: new Date(),
          lastModified: new Date(),
          isFinalized: true
        }
        
        // Update current character
        set({ character: finalizedCharacter })
        
        // Save to roster
        const saved = get().saveCharacterToRoster()
        
        if (saved) {
          console.log('✅ Character finalized and saved to roster:', finalizedCharacter.name)
        }
        
        return saved
      } catch (error) {
        set({ error: 'Failed to finalize character' })
        return false
      }
    },

    // Persistence
    saveToLocalStorage: () => {
      const { character } = get()
      if (!character) return
      
      try {
        const data = JSON.stringify(character)
        localStorage.setItem(`${character.id}`, data)
        set({ hasUnsavedChanges: false })
      } catch (error) {
        set({ error: 'Failed to save character to local storage' })
      }
    },

    loadFromLocalStorage: (characterId) => {
      try {
        const data = localStorage.getItem(characterId)
        if (data) {
          const character = JSON.parse(data)
          set({ character, hasUnsavedChanges: false, error: null })
          return true
        }
        return false
      } catch (error) {
        set({ error: 'Failed to load character from local storage' })
        return false
      }
    },

    exportCharacter: () => {
      const { character } = get()
      if (!character) return ''
      
      return JSON.stringify(character, null, 2)
    },

    importCharacter: (data) => {
      try {
        const character = JSON.parse(data)
        set({ character, hasUnsavedChanges: true, error: null })
        return true
      } catch (error) {
        set({ error: 'Failed to import character data' })
        return false
      }
    },

    // Utilities
    setLoading: (isLoading) => {
      set({ isLoading })
    },

    setError: (error) => {
      set({ error })
    },

    markSaved: () => {
      set({ hasUnsavedChanges: false })
    },

    markUnsaved: () => {
      set({ hasUnsavedChanges: true })
    },

    // Balanced Modifier System
    applyBalancedEffect: (effect, sourceEvent, sourceTable) => {
      const { character } = get()
      if (!character) return
      
      const updatedCharacter = modifierCalculator.applyBalancedEffect(
        character, 
        effect, 
        sourceEvent, 
        sourceTable
      )
      
      set({ 
        character: updatedCharacter,
        hasUnsavedChanges: true 
      })
    },

    getModifierSummary: () => {
      const { character } = get()
      if (!character?.modifierSummary) return null
      
      return character.modifierSummary
    },

    validateCharacterBalance: () => {
      const { character } = get()
      if (!character) return null
      
      return modifierCalculator.validateCharacterBalance(character)
    },

    getModifierBreakdown: () => {
      const { character } = get()
      if (!character) return []
      
      return modifierCalculator.getModifierBreakdown(character)
    }
  }))
)