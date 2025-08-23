import { describe, it, expect, beforeEach } from 'vitest'
import { DNDIntegrationService } from '../dndIntegrationService'
import type { Character } from '@/types/character'

// Mock character for testing
const mockCharacter: Character = {
  id: 'test-char-1',
  name: 'Test Warrior',
  age: 28,
  level: 3,
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
  youthEvents: [
    { id: '1', name: 'Military Training', description: 'Learned combat basics', category: 'Youth', period: 'Adolescence' }
  ],
  adulthoodEvents: [
    { id: '2', name: 'Battle Experience', description: 'Fought in border skirmishes', category: 'Adulthood', period: 'Adulthood' }
  ],
  miscellaneousEvents: [],
  occupations: [
    {
      name: 'Soldier',
      type: 'Military',
      culture: ['Any'],
      rank: 2,
      duration: 5,
      achievements: ['Veteran of border wars'],
      workAttitudes: ['Disciplined'],
      benefits: ['Weapon training'],
      skills: []
    },
    {
      name: 'Guard',
      type: 'Military',
      culture: ['Civilized'],
      rank: 1,
      duration: 2,
      achievements: [],
      workAttitudes: [],
      benefits: [],
      skills: []
    }
  ],
  apprenticeships: [],
  hobbies: [],
  skills: [
    { name: 'Weapon Use', rank: 4, type: 'Combat', source: 'Military Training' },
    { name: 'Intimidation', rank: 2, type: 'Social', source: 'Guard Duty' },
    { name: 'Athletics', rank: 3, type: 'Combat', source: 'Physical Training' }
  ],
  values: {
    mostValuedPerson: 'Comrades',
    mostValuedThing: 'Honor',
    mostValuedAbstraction: 'Duty',
    strength: 'Strong',
    motivations: ['Protect the innocent', 'Serve with honor']
  },
  alignment: {
    primary: 'Lightside',
    attitude: 'Lawful',
    description: 'Believes in order and justice',
    behaviorGuidelines: ['Follow orders', 'Protect civilians']
  },
  personalityTraits: {
    lightside: [
      { name: 'Brave', description: 'Never backs down from danger', type: 'Lightside', strength: 'Strong', source: 'Military Service' },
      { name: 'Loyal', description: 'Faithful to friends and cause', type: 'Lightside', strength: 'Average', source: 'Upbringing' }
    ],
    neutral: [
      { name: 'Practical', description: 'Focuses on what works', type: 'Neutral', strength: 'Average', source: 'Experience' }
    ],
    darkside: [],
    exotic: []
  },
  npcs: [],
  companions: [
    { id: 'comp-1', name: 'Marcus', type: 'Companion', loyalty: 'Strong' }
  ],
  rivals: [],
  relationships: [],
  gifts: [],
  legacies: [],
  specialItems: [
    { id: 'item-1', name: 'Family Sword', type: 'Weapon', rarity: 'Common' }
  ],
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

describe('DND Integration Service', () => {
  let service: DNDIntegrationService

  beforeEach(() => {
    service = new DNDIntegrationService()
  })

  describe('Character Conversion', () => {
    describe('D&D 3.5 Conversion', () => {
      it('should convert character to D&D 3.5 character sheet', () => {
        const result = service.convertCharacter(mockCharacter, '3.5')
        
        expect(result.characterName).toBe('Test Warrior')
        expect(result.age).toBe(28)
        expect(result.level).toBe(3)
        expect(result.race).toBe('Human')
        expect(result.classes).toBeDefined()
        expect(result.abilities).toBeDefined()
        expect(result.skills).toBeDefined()
        expect(result.equipment).toBeDefined()
        expect(result.background).toBeDefined()
        expect(result.backstory).toBeDefined()
      })

      it('should include racial traits for humans', () => {
        const result = service.convertCharacter(mockCharacter, '3.5')
        
        expect(result.racialTraits).toContain('Extra Feat')
        expect(result.racialTraits).toContain('Extra Skill Points')
      })

      it('should map skills correctly', () => {
        const result = service.convertCharacter(mockCharacter, '3.5')
        
        expect(result.skills.length).toBeGreaterThan(0)
        
        const weaponSkill = result.skills.find(s => s.name.includes('Weapon') || s.name.includes('Handle'))
        expect(weaponSkill).toBeDefined()
        expect(weaponSkill!.ranks).toBeGreaterThan(0)
      })

      it('should generate appropriate background text', () => {
        const result = service.convertCharacter(mockCharacter, '3.5')
        
        expect(result.background).toContain('Civilized culture')
        expect(result.background).toContain('Comfortable social standing')
      })
    })

    describe('D&D 5e Conversion', () => {
      it('should convert character to D&D 5e character sheet', () => {
        const result = service.convertCharacter(mockCharacter, '5e')
        
        expect(result.characterName).toBe('Test Warrior')
        expect(result.level).toBe(3)
        expect(result.race).toBe('Human')
        expect(result.abilityScores).toBeDefined()
        expect(result.abilityModifiers).toBeDefined()
        expect(result.skills).toBeDefined()
        expect(result.proficiencyBonus).toBe(2) // Level 3 = +2 proficiency
        expect(result.personalityTraits).toBeDefined()
        expect(result.ideals).toBeDefined()
        expect(result.bonds).toBeDefined()
        expect(result.flaws).toBeDefined()
      })

      it('should calculate correct proficiency bonus', () => {
        const testCharacter = { ...mockCharacter, level: 5 }
        const result = service.convertCharacter(testCharacter, '5e')
        
        expect(result.proficiencyBonus).toBe(3) // Level 5 = +3 proficiency
      })

      it('should map personality traits correctly', () => {
        const result = service.convertCharacter(mockCharacter, '5e')
        
        expect(result.personalityTraits).toContain('Never backs down from danger')
        expect(result.bonds).toContain('Comrades')
        expect(result.ideals).toContain('Duty')
      })

      it('should include racial traits for humans', () => {
        const result = service.convertCharacter(mockCharacter, '5e')
        
        expect(result.featuresAndTraits).toContain('Extra Feat')
        expect(result.featuresAndTraits).toContain('Extra Skill')
      })
    })

    it('should throw error for unsupported edition', () => {
      expect(() => {
        service.convertCharacter(mockCharacter, 'unsupported' as any)
      }).toThrow('Unsupported D&D edition: unsupported')
    })
  })

  describe('Class Suggestions', () => {
    describe('D&D 3.5 Class Suggestions', () => {
      it('should suggest Fighter for military character', () => {
        const suggestions = service.suggestClasses(mockCharacter, '3.5')
        
        expect(suggestions.length).toBeGreaterThan(0)
        
        const fighterSuggestion = suggestions.find(s => s.className === 'Fighter')
        expect(fighterSuggestion).toBeDefined()
        expect(fighterSuggestion!.suitability).toBeGreaterThan(70)
        expect(fighterSuggestion!.reasons).toContain('Strong combat background')
      })

      it('should suggest classes based on skills', () => {
        const magicCharacter = {
          ...mockCharacter,
          skills: [
            { name: 'Magic Theory', rank: 3, type: 'Academic', source: 'Study' },
            { name: 'Spellcraft', rank: 2, type: 'Academic', source: 'Training' }
          ],
          occupations: [
            {
              name: 'Scholar',
              type: 'Academic' as const,
              culture: ['Civilized'],
              rank: 2,
              duration: 4,
              achievements: [],
              workAttitudes: [],
              benefits: [],
              skills: []
            }
          ]
        }
        
        const suggestions = service.suggestClasses(magicCharacter, '3.5')
        const wizardSuggestion = suggestions.find(s => s.className === 'Wizard')
        
        expect(wizardSuggestion).toBeDefined()
        expect(wizardSuggestion!.suitability).toBeGreaterThan(50)
      })

      it('should rank suggestions by suitability', () => {
        const suggestions = service.suggestClasses(mockCharacter, '3.5')
        
        for (let i = 1; i < suggestions.length; i++) {
          expect(suggestions[i-1].suitability).toBeGreaterThanOrEqual(suggestions[i].suitability)
        }
      })
    })

    describe('D&D 5e Class Suggestions', () => {
      it('should suggest Fighter for military character', () => {
        const suggestions = service.suggestClasses(mockCharacter, '5e')
        
        const fighterSuggestion = suggestions.find(s => s.className === 'Fighter')
        expect(fighterSuggestion).toBeDefined()
        expect(fighterSuggestion!.suitability).toBeGreaterThan(70)
        expect('primaryAbility' in fighterSuggestion!).toBe(true)
        expect('savingThrows' in fighterSuggestion!).toBe(true)
      })

      it('should include 5e-specific class information', () => {
        const suggestions = service.suggestClasses(mockCharacter, '5e')
        
        const suggestion = suggestions[0]
        expect('primaryAbility' in suggestion).toBe(true)
        expect('savingThrows' in suggestion).toBe(true)
      })
    })
  })

  describe('Background Suggestions (5e only)', () => {
    it('should suggest appropriate backgrounds', () => {
      const suggestions = service.suggestBackgrounds(mockCharacter)
      
      expect(suggestions.length).toBeGreaterThan(0)
      
      const soldierSuggestion = suggestions.find(s => s.name === 'Soldier')
      expect(soldierSuggestion).toBeDefined()
      expect(soldierSuggestion!.suitability).toBeGreaterThan(80)
      expect(soldierSuggestion!.skillProficiencies).toContain('Athletics')
      expect(soldierSuggestion!.skillProficiencies).toContain('Intimidation')
    })

    it('should suggest academic backgrounds for scholars', () => {
      const scholarCharacter = {
        ...mockCharacter,
        occupations: [
          {
            name: 'Scholar',
            type: 'Academic' as const,
            culture: ['Civilized'],
            rank: 2,
            duration: 4,
            achievements: ['Published research'],
            workAttitudes: [],
            benefits: [],
            skills: []
          }
        ]
      }
      
      const suggestions = service.suggestBackgrounds(scholarCharacter)
      const sageSuggestion = suggestions.find(s => s.name === 'Sage')
      
      expect(sageSuggestion).toBeDefined()
      expect(sageSuggestion!.suitability).toBeGreaterThan(70)
    })
  })

  describe('Character Validation', () => {
    it('should validate complete character as valid', () => {
      const validation = service.validateCharacter(mockCharacter, '5e')
      
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
      expect(validation.legalCharacter).toBe(true)
    })

    it('should detect missing character name', () => {
      const invalidCharacter = { ...mockCharacter, name: '' }
      const validation = service.validateCharacter(invalidCharacter, '3.5')
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('Character name is required')
    })

    it('should warn about unusual age', () => {
      const youngCharacter = { ...mockCharacter, age: 12 }
      const validation = service.validateCharacter(youngCharacter, '5e')
      
      expect(validation.warnings).toContain('Character age seems very young for an adventurer')
    })

    it('should warn about missing skills', () => {
      const noSkillsCharacter = { ...mockCharacter, skills: [] }
      const validation = service.validateCharacter(noSkillsCharacter, '3.5')
      
      expect(validation.warnings).toContain('Character has no skills')
    })

    it('should include level appropriate check for 5e', () => {
      const validation = service.validateCharacter(mockCharacter, '5e')
      
      expect('levelAppropriate' in validation).toBe(true)
      expect(validation.levelAppropriate).toBe(true)
    })
  })

  describe('Export Functionality', () => {
    it('should export character as JSON', async () => {
      const options = {
        format: 'json' as const,
        includeBackstory: true,
        includePersonality: true,
        includeAppearance: true,
        includeNotes: true,
        officialContent: true
      }
      
      const result = await service.exportCharacter(mockCharacter, '5e', options)
      
      expect(result.success).toBe(true)
      expect(result.format).toBe('json')
      expect(result.data).toBeDefined()
      
      const parsed = JSON.parse(result.data as string)
      expect(parsed.characterName).toBe('Test Warrior')
    })

    it('should export character as text sheet', async () => {
      const options = {
        format: 'text' as const,
        includeBackstory: true,
        includePersonality: true,
        includeAppearance: true,
        includeNotes: true,
        officialContent: true
      }
      
      const result = await service.exportCharacter(mockCharacter, '5e', options)
      
      expect(result.success).toBe(true)
      expect(result.format).toBe('text')
      expect(result.data).toContain('D&D 5TH EDITION CHARACTER SHEET')
      expect(result.data).toContain('Test Warrior')
      expect(result.data).toContain('Human')
    })

    it('should handle export errors gracefully', async () => {
      const options = { 
        format: 'unsupported' as any,
        includeBackstory: true,
        includePersonality: true,
        includeAppearance: true,
        includeNotes: true,
        officialContent: true
      }
      
      const result = await service.exportCharacter(mockCharacter, '5e', options)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })

    it('should return error for PDF export (not yet implemented)', async () => {
      const options = {
        format: 'pdf' as const,
        includeBackstory: true,
        includePersonality: true,
        includeAppearance: true,
        includeNotes: true,
        officialContent: true
      }
      
      const result = await service.exportCharacter(mockCharacter, '5e', options)
      
      expect(result.success).toBe(false)
      expect(result.errors).toContain('PDF export not yet implemented')
    })
  })

  describe('Unified Stats Generation', () => {
    it('should generate unified stats for both editions', () => {
      const unifiedStats = service.generateUnifiedStats(mockCharacter)
      
      expect(unifiedStats.edition).toBe('5e')
      expect(unifiedStats.stats35).toBeDefined()
      expect(unifiedStats.stats5e).toBeDefined()
      
      expect(unifiedStats.stats35!.abilityModifiers).toBeDefined()
      expect(unifiedStats.stats5e!.abilityScores).toBeDefined()
      expect(unifiedStats.stats5e!.proficiencyBonus).toBe(2)
    })
  })

  describe('Error Handling', () => {
    it('should throw error for unsupported edition in class suggestions', () => {
      expect(() => {
        service.suggestClasses(mockCharacter, 'unsupported' as any)
      }).toThrow('Unsupported D&D edition: unsupported')
    })

    it('should throw error for unsupported edition in validation', () => {
      expect(() => {
        service.validateCharacter(mockCharacter, 'unsupported' as any)
      }).toThrow('Unsupported D&D edition: unsupported')
    })
  })
})