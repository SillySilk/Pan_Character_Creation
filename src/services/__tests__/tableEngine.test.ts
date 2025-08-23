import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TableEngine } from '../tableEngine'
import type { Table, TableEntry, TableProcessingResult } from '@/types/tables'

// Mock table for testing
const mockTable: Table = {
  id: 'test-table-001',
  name: 'Test Events Table',
  category: 'Youth',
  description: 'A test table for unit testing',
  diceType: 'd20',
  modifier: 'cuMod',
  entries: [
    {
      id: 'entry-001',
      rollRange: [1, 5],
      result: 'Simple Event',
      description: 'A basic event with no special effects',
      effects: []
    },
    {
      id: 'entry-002', 
      rollRange: [6, 10],
      result: 'Skill Event',
      description: 'An event that grants a skill',
      effects: [
        {
          type: 'skill',
          target: 'character',
          value: 'Diplomacy',
          modifier: 2,
          description: 'Gain 2 ranks in Diplomacy'
        }
      ]
    },
    {
      id: 'entry-003',
      rollRange: [11, 15], 
      result: 'Complex Event',
      description: 'An event with multiple effects',
      effects: [
        {
          type: 'skill',
          target: 'character',
          value: 'Athletics',
          modifier: 1,
          description: 'Gain 1 rank in Athletics'
        },
        {
          type: 'modifier',
          target: 'character', 
          value: 'strength',
          modifier: 1,
          description: '+1 Strength modifier'
        }
      ]
    },
    {
      id: 'entry-004',
      rollRange: [16, 18],
      result: 'Choice Event',
      description: 'An event where player makes a choice',
      effects: [],
      choices: [
        {
          id: 'choice-001',
          description: 'Be cautious',
          effects: [
            {
              type: 'trait',
              value: 'Cautious',
              description: 'Gained Cautious trait'
            }
          ]
        },
        {
          id: 'choice-002',
          description: 'Be bold',
          effects: [
            {
              type: 'trait',
              value: 'Bold',
              description: 'Gained Bold trait'
            }
          ]
        }
      ]
    },
    {
      id: 'entry-005',
      rollRange: [19, 20],
      result: 'Goto Event',
      description: 'An event that references another table',
      effects: [],
      goto: {
        tableId: 'another-table'
      }
    }
  ]
}

// Mock character data
const mockCharacter = {
  id: 'test-char',
  name: 'Test Character',
  race: { name: 'Human' },
  culture: { cuMod: 1 },
  socialStatus: { solMod: 0 },
  activeModifiers: { cuMod: 1, solMod: 0, tiMod: 0, biMod: 0, legitMod: 0 },
  skills: [],
  occupations: []
}

describe('Table Engine', async () => {
  let engine: TableEngine

  beforeEach(() => {
    engine = new TableEngine()
    // Register the mock table
    engine.registerTable(mockTable)
    // Reset any mocks
    vi.restoreAllMocks()
  })

  describe('Basic Roll Processing', async () => {
    it('should process a simple table roll', async () => {
      // Mock Math.random to return 0.2 (should hit entry 1-5 range)
      vi.spyOn(Math, 'random').mockReturnValue(0.2)
      
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result.success).toBe(true)
      expect(result.tableId).toBe('test-table-001')
      expect(result.tableName).toBe('Test Events Table')
      expect(result.rollResult).toBe(4) // 0.2 * 20 = 4, +1 cuMod = 5, but entry is 4 base
      expect(result.selectedEntry.id).toBe('entry-001')
      expect(result.selectedEntry.result).toBe('Simple Event')
    })

    it('should apply modifiers to roll', async () => {
      // Mock Math.random to return 0.2 (base roll of 4)
      vi.spyOn(Math, 'random').mockReturnValue(0.2)
      
      const characterWithMods = {
        ...mockCharacter,
        activeModifiers: { cuMod: 3, solMod: 2, tiMod: 0, biMod: 0, legitMod: 0 }
      }
      
      const result = engine.processTable(mockTable, characterWithMods)
      
      // Base roll 4 + cuMod 3 + solMod 2 = 9, should hit entry-002 (6-10)
      expect(result.modifiersApplied).toBe(5)
      expect(result.selectedEntry.id).toBe('entry-002')
    })

    it('should handle rolls that exceed maximum range', async () => {
      // Mock Math.random to return 0.95 (should be high roll)
      vi.spyOn(Math, 'random').mockReturnValue(0.95)
      
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result.success).toBe(true)
      // Should cap at highest entry (19-20)
      expect(result.selectedEntry.id).toBe('entry-005')
    })

    it('should handle rolls below minimum range', async () => {
      // Mock Math.random to return very low value
      vi.spyOn(Math, 'random').mockReturnValue(0.01)
      
      const characterWithNegativeMods = {
        ...mockCharacter,
        activeModifiers: { cuMod: -10, solMod: -10, tiMod: 0, biMod: 0, legitMod: 0 }
      }
      
      const result = engine.processTable(mockTable, characterWithNegativeMods)
      
      expect(result.success).toBe(true)
      // Should still hit lowest entry
      expect(result.selectedEntry.id).toBe('entry-001')
    })
  })

  describe('Effect Processing', async () => {
    it('should process skill effects correctly', async () => {
      // Mock to hit the skill event (entry-002)
      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result.effects).toHaveLength(1)
      expect(result.effects[0].type).toBe('skill')
      expect(result.effects[0].value).toBe('Diplomacy')
      expect(result.effects[0].modifier).toBe(2)
    })

    it('should process multiple effects correctly', async () => {
      // Mock to hit the complex event (entry-003)
      vi.spyOn(Math, 'random').mockReturnValue(0.6)
      
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result.effects).toHaveLength(2)
      expect(result.effects[0].type).toBe('skill')
      expect(result.effects[0].value).toBe('Athletics')
      expect(result.effects[1].type).toBe('modifier')
      expect(result.effects[1].value).toBe('strength')
    })

    it('should handle entries with no effects', async () => {
      // Mock to hit simple event (entry-001)
      vi.spyOn(Math, 'random').mockReturnValue(0.2)
      
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result.effects).toHaveLength(0)
    })
  })

  describe('Choice Handling', async () => {
    it('should identify entries with choices', async () => {
      // Mock to hit choice event (entry-004)
      vi.spyOn(Math, 'random').mockReturnValue(0.8)
      
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result.selectedEntry.choices).toBeDefined()
      expect(result.selectedEntry.choices).toHaveLength(2)
      expect(result.requiresChoice).toBe(true)
    })

    it('should process choice selection', async () => {
      // First get the choice entry
      vi.spyOn(Math, 'random').mockReturnValue(0.8)
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      // Then make a choice
      const choiceResult = engine.processChoice(result, 'choice-001')
      
      expect(choiceResult.success).toBe(true)
      expect(choiceResult.effects).toHaveLength(1)
      expect(choiceResult.effects[0].value).toBe('Cautious')
    })

    it('should handle invalid choice selection', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.8)
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      const choiceResult = engine.processChoice(result, 'invalid-choice')
      
      expect(choiceResult.success).toBe(false)
      expect(choiceResult.errors).toContain('Invalid choice selected')
    })
  })

  describe('Goto Processing', async () => {
    it('should identify goto entries', async () => {
      // Mock to hit goto event (entry-005)
      vi.spyOn(Math, 'random').mockReturnValue(0.95)
      
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result.selectedEntry.goto).toBeDefined()
      expect(result.selectedEntry.goto!.tableId).toBe('another-table')
      expect(result.requiresGoto).toBe(true)
    })

    it('should process conditional goto', async () => {
      const conditionalGotoEntry: TableEntry = {
        id: 'entry-goto-conditional',
        rollRange: [1, 1],
        result: 'Conditional Goto',
        description: 'Goes to table based on condition',
        effects: [],
        goto: {
          tableId: 'conditional-table',
          condition: 'race=Elf'
        }
      }

      const testTable = {
        ...mockTable,
        entries: [conditionalGotoEntry]
      }

      const elfCharacter = {
        ...mockCharacter,
        race: { name: 'Elf' }
      }

      vi.spyOn(Math, 'random').mockReturnValue(0.05)
      const result = engine.processTable(testTable, elfCharacter)
      
      expect(result.requiresGoto).toBe(true)
      expect(result.selectedEntry.goto!.condition).toBe('race=Elf')
    })
  })

  describe('Cross-References', async () => {
    it('should apply cross-reference modifiers', async () => {
      const elfCharacter = {
        ...mockCharacter,
        race: { name: 'Elf' }
      }

      // Add a cross-reference effect to test table
      const tableWithCrossRef = {
        ...mockTable,
        crossReferences: [
          {
            condition: 'race=Elf',
            modifiers: { dexterity: 2 },
            description: 'Elves get bonus to dexterity events'
          }
        ]
      }

      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      const result = engine.processTable(tableWithCrossRef, elfCharacter)
      
      expect(result.crossReferencesApplied).toContain('race=Elf')
    })

    it('should not apply cross-references that do not match', async () => {
      const humanCharacter = {
        ...mockCharacter,
        race: { name: 'Human' }
      }

      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      const result = engine.processTable(mockTable, humanCharacter)
      
      expect(result.crossReferencesApplied).not.toContain('race=Elf')
    })
  })

  describe('Special Rules', async () => {
    it('should identify special rules', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result.specialRulesApplied).toBeDefined()
    })

    it('should handle reroll scenarios', async () => {
      // Create table with reroll rule
      const rerollTable = {
        ...mockTable,
        specialRules: ['Reroll on natural 1']
      }

      // Mock to get natural 1 first, then 10
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.05) // Natural 1
        .mockReturnValueOnce(0.5)  // Reroll to 10

      const result = engine.processTable(rerollTable, mockCharacter)
      
      expect(result.rerolled).toBe(true)
      expect(result.selectedEntry.id).toBe('entry-002') // Should hit 6-10 range after reroll
    })
  })

  describe('Manual Selection', async () => {
    it('should allow manual entry selection', async () => {
      const result = engine.processManualSelection(mockTable, 'entry-003', mockCharacter)
      
      expect(result.success).toBe(true)
      expect(result.selectedEntry.id).toBe('entry-003')
      expect(result.manualSelection).toBe(true)
      expect(result.rollResult).toBeUndefined() // No roll made
    })

    it('should handle invalid manual selection', async () => {
      const result = engine.processManualSelection(mockTable, 'invalid-entry', mockCharacter)
      
      expect(result.success).toBe(false)
      expect(result.errors).toContain('Entry not found: invalid-entry')
    })
  })

  describe('Error Handling', async () => {
    it('should handle missing table data gracefully', async () => {
      const emptyTable = {
        ...mockTable,
        entries: []
      }

      const result = engine.processTable(emptyTable, mockCharacter)
      
      expect(result.success).toBe(false)
      expect(result.errors).toContain('No valid entries found in table')
    })

    it('should handle invalid dice type', async () => {
      const invalidTable = {
        ...mockTable,
        diceType: 'invalid' as any
      }

      const result = engine.processTable(invalidTable, mockCharacter)
      
      expect(result.success).toBe(true) // Should still work with fallback
      expect(result.rollResult).toBeGreaterThanOrEqual(1)
    })

    it('should handle missing character data', async () => {
      const result = engine.processTable(mockTable, null as any)
      
      expect(result.success).toBe(false)
      expect(result.errors).toContain('Invalid character data')
    })
  })

  describe('Result Validation', async () => {
    it('should validate complete processing result', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result).toMatchObject({
        success: true,
        tableId: expect.any(String),
        tableName: expect.any(String),
        rollResult: expect.any(Number),
        naturalRoll: expect.any(Number),
        modifiersApplied: expect.any(Number),
        selectedEntry: expect.any(Object),
        effects: expect.any(Array),
        timestamp: expect.any(Date)
      })
    })

    it('should include all required fields in successful result', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      const result = await engine.processTable(mockTable.id, mockCharacter)
      
      expect(result.success).toBe(true)
      expect(result.tableId).toBeDefined()
      expect(result.tableName).toBeDefined()
      expect(result.selectedEntry).toBeDefined()
      expect(result.effects).toBeDefined()
      expect(result.timestamp).toBeInstanceOf(Date)
    })

    it('should include error information in failed result', async () => {
      const result = engine.processTable(mockTable, null as any)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })
  })

  describe('Performance', async () => {
    it('should process table efficiently', async () => {
      const startTime = performance.now()
      
      // Process multiple times
      for (let i = 0; i < 100; i++) {
        engine.processTable(mockTable, mockCharacter)
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(1000) // Should complete 100 iterations in under 1 second
    })

    it('should handle large tables efficiently', async () => {
      // Create a table with many entries
      const largeTable = {
        ...mockTable,
        entries: Array.from({ length: 1000 }, (_, i) => ({
          id: `entry-${i}`,
          rollRange: [i + 1, i + 1] as [number, number],
          result: `Result ${i}`,
          description: `Description for entry ${i}`,
          effects: []
        }))
      }
      
      const startTime = performance.now()
      const result = engine.processTable(largeTable, mockCharacter)
      const endTime = performance.now()
      
      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in under 100ms
    })
  })
})