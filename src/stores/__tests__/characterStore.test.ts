import { describe, it, expect, beforeEach } from 'vitest'
import { useCharacterStore } from '../characterStore'
import type { Character, Skill, Occupation } from '@/types/character'

// Mock character data
const mockCharacter: Character = {
  id: 'test-character-1',
  name: 'Test Character',
  age: 25,
  race: {
    name: 'Human',
    type: 'Human',
    events: [],
    modifiers: {}
  },
  culture: {
    name: 'Civilized',
    type: 'Civilized',
    cuMod: 0,
    nativeEnvironment: ['Urban'],
    survival: 6,
    benefits: [],
    literacyRate: 85
  },
  socialStatus: {
    level: 'Comfortable',
    solMod: 0,
    survivalMod: 0,
    moneyMultiplier: 1,
    literacyMod: 0,
    benefits: []
  },
  birthCircumstances: {
    legitimacy: 'Legitimate',
    familyHead: 'Father',
    siblings: 1,
    birthOrder: 1,
    birthplace: 'City',
    unusualCircumstances: [],
    biMod: 0
  },
  family: {
    head: 'Father',
    members: [],
    occupations: [],
    relationships: [],
    notableFeatures: [],
    socialConnections: []
  },
  youthEvents: [],
  adulthoodEvents: [],
  miscellaneousEvents: [],
  occupations: [],
  apprenticeships: [],
  hobbies: [],
  skills: [],
  values: {
    mostValuedPerson: 'Family',
    mostValuedThing: 'Honor',
    mostValuedAbstraction: 'Justice',
    strength: 'Strong',
    motivations: ['Protect the innocent']
  },
  alignment: {
    primary: 'Lightside',
    attitude: 'Helpful',
    description: 'Tries to do good',
    behaviorGuidelines: ['Help others', 'Be honest']
  },
  personalityTraits: {
    lightside: [{
      name: 'Honest',
      description: 'Always tells the truth',
      type: 'Lightside',
      strength: 'Strong',
      source: 'Background'
    }],
    neutral: [],
    darkside: [],
    exotic: []
  },
  npcs: [],
  companions: [],
  rivals: [],
  relationships: [],
  gifts: [],
  legacies: [],
  specialItems: [],
  activeModifiers: {
    cuMod: 0,
    solMod: 0,
    tiMod: 0,
    biMod: 0,
    legitMod: 0
  },
  generationHistory: [],
  dndIntegration: {
    abilityModifiers: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    },
    skillBonuses: {},
    startingGold: 100,
    bonusLanguages: [],
    traits: [],
    flaws: [],
    equipment: [],
    specialAbilities: [],
    backgroundFeatures: []
  }
}

describe('Character Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCharacterStore.getState().resetCharacter()
  })

  describe('Character Management', () => {
    it('should create a new character with default values', () => {
      const store = useCharacterStore.getState()
      const character = store.createNewCharacter('Test Hero')
      
      expect(character).toBeDefined()
      expect(character.name).toBe('Test Hero')
      expect(character.id).toMatch(/^char_/)
      expect(character.age).toBeGreaterThan(0)
      expect(character.race.name).toBeDefined()
      expect(store.character).toEqual(character)
      expect(store.hasUnsavedChanges).toBe(true)
    })

    it('should load a character', () => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
      
      expect(store.character).toEqual(mockCharacter)
      expect(store.hasUnsavedChanges).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should reset character to null', () => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
      store.resetCharacter()
      
      expect(store.character).toBeNull()
      expect(store.hasUnsavedChanges).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should clone a character with new ID', () => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
      
      const cloned = store.cloneCharacter()
      
      expect(cloned).toBeDefined()
      expect(cloned!.id).not.toBe(mockCharacter.id)
      expect(cloned!.name).toBe(mockCharacter.name)
      expect(cloned!.age).toBe(mockCharacter.age)
    })

    it('should return null when cloning with no character loaded', () => {
      const store = useCharacterStore.getState()
      const cloned = store.cloneCharacter()
      
      expect(cloned).toBeNull()
    })

    it('should update character and mark as unsaved', () => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
      
      store.updateCharacter({ name: 'Updated Name', age: 30 })
      
      expect(store.character!.name).toBe('Updated Name')
      expect(store.character!.age).toBe(30)
      expect(store.hasUnsavedChanges).toBe(true)
      expect(store.character!.lastModified).toBeInstanceOf(Date)
    })
  })

  describe('Character Properties Updates', () => {
    beforeEach(() => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
    })

    it('should update character name', () => {
      const store = useCharacterStore.getState()
      store.updateCharacterName('New Name')
      
      expect(store.character!.name).toBe('New Name')
      expect(store.hasUnsavedChanges).toBe(true)
    })

    it('should update character age', () => {
      const store = useCharacterStore.getState()
      store.updateCharacterAge(35)
      
      expect(store.character!.age).toBe(35)
      expect(store.hasUnsavedChanges).toBe(true)
    })

    it('should update race', () => {
      const store = useCharacterStore.getState()
      const newRace = {
        name: 'Elf',
        type: 'Elf' as const,
        events: ['Forest born'],
        modifiers: { dexterity: 2 }
      }
      
      store.updateRace(newRace)
      
      expect(store.character!.race).toEqual(newRace)
      expect(store.hasUnsavedChanges).toBe(true)
    })

    it('should update culture and recalculate modifiers', () => {
      const store = useCharacterStore.getState()
      const newCulture = {
        name: 'Barbaric',
        type: 'Barbaric' as const,
        cuMod: 2,
        nativeEnvironment: ['Wilderness'],
        survival: 8,
        benefits: ['Toughness'],
        literacyRate: 25
      }
      
      store.updateCulture(newCulture)
      
      expect(store.character!.culture).toEqual(newCulture)
      expect(store.character!.activeModifiers.cuMod).toBe(2)
      expect(store.hasUnsavedChanges).toBe(true)
    })

    it('should update social status and recalculate modifiers', () => {
      const store = useCharacterStore.getState()
      const newStatus = {
        level: 'Wealthy' as const,
        solMod: 3,
        survivalMod: 1,
        moneyMultiplier: 5,
        literacyMod: 2,
        benefits: ['High society connections']
      }
      
      store.updateSocialStatus(newStatus)
      
      expect(store.character!.socialStatus).toEqual(newStatus)
      expect(store.character!.activeModifiers.solMod).toBe(3)
      expect(store.hasUnsavedChanges).toBe(true)
    })
  })

  describe('Skills Management', () => {
    beforeEach(() => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
    })

    it('should add a new skill', () => {
      const store = useCharacterStore.getState()
      const skill: Skill = {
        name: 'Diplomacy',
        rank: 3,
        type: 'Social',
        source: 'Background'
      }
      
      store.addSkill(skill)
      
      expect(store.character!.skills).toContain(skill)
      expect(store.hasUnsavedChanges).toBe(true)
    })

    it('should update existing skill rank when adding duplicate', () => {
      const store = useCharacterStore.getState()
      const skill1: Skill = {
        name: 'Diplomacy',
        rank: 2,
        type: 'Social',
        source: 'Background'
      }
      const skill2: Skill = {
        name: 'Diplomacy',
        rank: 4,
        type: 'Social',
        source: 'Training'
      }
      
      store.addSkill(skill1)
      store.addSkill(skill2)
      
      expect(store.character!.skills.length).toBe(1)
      expect(store.character!.skills[0].rank).toBe(4) // Should take higher rank
    })

    it('should remove a skill by name', () => {
      const store = useCharacterStore.getState()
      const skill: Skill = {
        name: 'Bluff',
        rank: 2,
        type: 'Social',
        source: 'Background'
      }
      
      store.addSkill(skill)
      expect(store.character!.skills.length).toBe(1)
      
      store.removeSkill('Bluff')
      expect(store.character!.skills.length).toBe(0)
    })

    it('should update skill properties', () => {
      const store = useCharacterStore.getState()
      const skill: Skill = {
        name: 'Craft',
        rank: 1,
        type: 'Craft',
        source: 'Apprenticeship'
      }
      
      store.addSkill(skill)
      store.updateSkill('Craft', { rank: 3, description: 'Weaponsmithing' })
      
      const updatedSkill = store.character!.skills.find(s => s.name === 'Craft')
      expect(updatedSkill!.rank).toBe(3)
      expect(updatedSkill!.description).toBe('Weaponsmithing')
    })
  })

  describe('Occupations Management', () => {
    beforeEach(() => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
    })

    it('should add occupation', () => {
      const store = useCharacterStore.getState()
      const occupation: Occupation = {
        name: 'Soldier',
        type: 'Military',
        culture: ['Any'],
        rank: 2,
        duration: 5,
        achievements: ['Veteran of border wars'],
        workAttitudes: ['Disciplined'],
        benefits: ['Weapon training'],
        skills: []
      }
      
      store.addOccupation(occupation)
      
      expect(store.character!.occupations).toContain(occupation)
      expect(store.hasUnsavedChanges).toBe(true)
    })

    it('should remove occupation by index', () => {
      const store = useCharacterStore.getState()
      const occupation: Occupation = {
        name: 'Merchant',
        type: 'Professional',
        culture: ['Civilized'],
        rank: 1,
        duration: 3,
        achievements: [],
        workAttitudes: [],
        benefits: [],
        skills: []
      }
      
      store.addOccupation(occupation)
      expect(store.character!.occupations.length).toBe(1)
      
      store.removeOccupation(0)
      expect(store.character!.occupations.length).toBe(0)
    })

    it('should update occupation properties', () => {
      const store = useCharacterStore.getState()
      const occupation: Occupation = {
        name: 'Scholar',
        type: 'Academic',
        culture: ['Civilized'],
        rank: 1,
        duration: 2,
        achievements: [],
        workAttitudes: [],
        benefits: [],
        skills: []
      }
      
      store.addOccupation(occupation)
      store.updateOccupation(0, { rank: 3, achievements: ['Published research'] })
      
      const updated = store.character!.occupations[0]
      expect(updated.rank).toBe(3)
      expect(updated.achievements).toContain('Published research')
    })
  })

  describe('Computed Properties', () => {
    beforeEach(() => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
    })

    it('should calculate total events correctly', () => {
      const store = useCharacterStore.getState()
      
      // Add some events
      store.updateCharacter({
        youthEvents: [{ id: '1', name: 'Youth Event', description: 'Test', category: 'Youth', period: 'Childhood' }],
        adulthoodEvents: [
          { id: '2', name: 'Adult Event 1', description: 'Test', category: 'Adulthood', period: 'Adulthood' },
          { id: '3', name: 'Adult Event 2', description: 'Test', category: 'Adulthood', period: 'Adulthood' }
        ],
        miscellaneousEvents: [{ id: '4', name: 'Misc Event', description: 'Test', category: 'Miscellaneous', period: 'Adulthood' }]
      })
      
      expect(store.getTotalEvents()).toBe(4)
    })

    it('should calculate total skills correctly', () => {
      const store = useCharacterStore.getState()
      
      store.addSkill({ name: 'Skill 1', rank: 1, type: 'Combat', source: 'Training' })
      store.addSkill({ name: 'Skill 2', rank: 2, type: 'Social', source: 'Background' })
      
      expect(store.getTotalSkills()).toBe(2)
    })

    it('should calculate total occupations correctly', () => {
      const store = useCharacterStore.getState()
      
      store.addOccupation({
        name: 'Job 1',
        type: 'Professional',
        culture: ['Any'],
        rank: 1,
        duration: 2,
        achievements: [],
        workAttitudes: [],
        benefits: [],
        skills: []
      })
      
      expect(store.getTotalOccupations()).toBe(1)
    })

    it('should generate character summary', () => {
      const store = useCharacterStore.getState()
      const summary = store.getCharacterSummary()
      
      expect(summary).toContain('Test Character')
      expect(summary).toContain('age 25')
      expect(summary).toContain('Human')
      expect(summary).toContain('Civilized')
      expect(summary).toContain('Comfortable')
    })
  })

  describe('Character Validation', () => {
    it('should validate complete character as valid', () => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
      
      const validation = store.validateCharacter()
      
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should detect invalid character with missing name', () => {
      const store = useCharacterStore.getState()
      store.createNewCharacter('')
      
      const validation = store.validateCharacter()
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('Character name is required')
    })

    it('should provide warnings for unusual age', () => {
      const store = useCharacterStore.getState()
      store.loadCharacter({ ...mockCharacter, age: 300 })
      
      const validation = store.validateCharacter()
      
      expect(validation.warnings).toContain('Unusual character age')
    })

    it('should return invalid when no character loaded', () => {
      const store = useCharacterStore.getState()
      const validation = store.validateCharacter()
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('No character loaded')
    })
  })

  describe('Persistence', () => {
    it('should export character as JSON string', () => {
      const store = useCharacterStore.getState()
      store.loadCharacter(mockCharacter)
      
      const exported = store.exportCharacter()
      const parsed = JSON.parse(exported)
      
      expect(parsed.name).toBe(mockCharacter.name)
      expect(parsed.id).toBe(mockCharacter.id)
    })

    it('should return empty string when no character to export', () => {
      const store = useCharacterStore.getState()
      const exported = store.exportCharacter()
      
      expect(exported).toBe('')
    })

    it('should import character from JSON string', () => {
      const store = useCharacterStore.getState()
      const jsonData = JSON.stringify(mockCharacter)
      
      const success = store.importCharacter(jsonData)
      
      expect(success).toBe(true)
      expect(store.character).toEqual(mockCharacter)
      expect(store.hasUnsavedChanges).toBe(true)
    })

    it('should handle invalid JSON during import', () => {
      const store = useCharacterStore.getState()
      
      const success = store.importCharacter('invalid json')
      
      expect(success).toBe(false)
      expect(store.error).toBe('Failed to import character data')
    })
  })

  describe('State Management', () => {
    it('should set loading state', () => {
      const store = useCharacterStore.getState()
      
      store.setLoading(true)
      expect(store.isLoading).toBe(true)
      
      store.setLoading(false)
      expect(store.isLoading).toBe(false)
    })

    it('should set error state', () => {
      const store = useCharacterStore.getState()
      
      store.setError('Test error')
      expect(store.error).toBe('Test error')
      
      store.setError(null)
      expect(store.error).toBeNull()
    })

    it('should mark as saved and unsaved', () => {
      const store = useCharacterStore.getState()
      
      store.markUnsaved()
      expect(store.hasUnsavedChanges).toBe(true)
      
      store.markSaved()
      expect(store.hasUnsavedChanges).toBe(false)
    })
  })
})