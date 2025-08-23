// Life Details Table Component - Handles Relationships, Items, and Events

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { tableService } from '../../../services/tableService'
import { getGlobalTableEngine } from '../../../services/globalTableEngine'
import type { DiceRoll, Table } from '../../../types/tables'
import { rollWithModifiers } from '../../../utils/dice'

interface LifeDetailsTableProps {
  tableId: string
  onComplete?: (result: any) => void
}

export function LifeDetailsTable({ tableId, onComplete }: LifeDetailsTableProps) {
  const [table, setTable] = useState<Table | null>(null)
  const [loading, setLoading] = useState(true)
  const [rolling, setRolling] = useState(false)
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null)
  
  const { character, updateCharacter } = useCharacterStore()
  const { getCurrentStep, createSnapshot } = useGenerationStore()
  const currentStep = getCurrentStep()
  
  const tableEngine = getGlobalTableEngine()

  useEffect(() => {
    loadTable()
  }, [tableId])

  const loadTable = async () => {
    try {
      setLoading(true)
      console.log('🟡 LifeDetailsTable: Loading table ID:', tableId)
      console.log('🟡 LifeDetailsTable: TableService instance:', tableService)
      console.log('🟡 LifeDetailsTable: TableService.getTable method:', typeof tableService.getTable)
      
      const loadedTable = await tableService.getTable(tableId)
      console.log('🟡 LifeDetailsTable: Loaded table:', loadedTable)
      
      if (loadedTable) {
        setTable(loadedTable as Table)
        // Register the table with the engine
        tableEngine.registerTable(loadedTable)
        console.log('✅ LifeDetailsTable: Table set successfully:', loadedTable.name)
        console.log('✅ LifeDetailsTable: Table registered with engine:', loadedTable.id)
      } else {
        console.error('❌ LifeDetailsTable: Table not found:', { 
          loadedTable, 
          tableId
        })
      }
    } catch (error) {
      console.error('❌ LifeDetailsTable: Failed to load table:', error)
      console.error('❌ LifeDetailsTable: Error details:', {
        tableId,
        errorMessage: error.message,
        errorStack: error.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoll = async () => {
    if (!table) return
    
    setRolling(true)
    
    try {
      // Use d100 roll for life details tables
      const combinedRoll = rollWithModifiers('d100', {})
      const totalRoll = combinedRoll.finalResult
      
      setCurrentRoll(combinedRoll)
      
      // Process the table result with the calculated roll
      const result = await tableEngine.processTable(table.id, character, undefined, totalRoll)
      
      if (result.success && result.entry) {
        setSelectedEntry(result.entry)
        
        // Apply effects to character based on table type
        let updatedCharacter = { ...character }
        
        if (result.character) {
          updatedCharacter = result.character
        } else {
          // Manual character updates based on table ID
          if (tableId === '901') { // Relationships
            updatedCharacter.relationships = [...(character.relationships || []), {
              id: `rel_${Date.now()}`,
              name: result.entry.result,
              description: result.entry.description,
              type: 'important',
              category: 'relationship'
            }]
          } else if (tableId === '902') { // Special Items
            updatedCharacter.specialItems = [...(character.specialItems || []), {
              id: `item_${Date.now()}`,
              name: result.entry.result,
              description: result.entry.description,
              type: 'special',
              category: 'possession'
            }]
          } else if (tableId === '903') { // Life Events
            updatedCharacter.lifeEvents = [...(character.lifeEvents || []), {
              id: `event_${Date.now()}`,
              name: result.entry.result,
              description: result.entry.description,
              type: 'defining',
              category: 'life_event'
            }]
          }
        }
        
        updateCharacter(updatedCharacter)
        
        // Add to generation history
        const tableTypeNames = {
          '901': 'Important Relationship',
          '902': 'Special Possession', 
          '903': 'Defining Life Event'
        }
        
        createSnapshot(
          `Rolled on ${tableTypeNames[tableId] || table.name}: ${result.entry.result}`,
          updatedCharacter
        )
        
        // Call completion callback
        if (onComplete) {
          onComplete({
            table,
            roll: combinedRoll,
            entry: result.entry,
            character: updatedCharacter
          })
        }
      }
    } catch (error) {
      console.error('Error rolling on life details table:', error)
    } finally {
      setRolling(false)
    }
  }

  const handleManualSelect = async (entryId: string) => {
    if (!table) return
    
    const entry = table.entries.find(e => e.id === entryId)
    if (!entry) return
    
    setSelectedEntry(entry)
    
    // Create a fake roll in the middle of the range
    const midPoint = Math.floor((entry.rollRange[0] + entry.rollRange[1]) / 2)
    const fakeRoll: DiceRoll = {
      diceType: 'd100',
      baseRoll: midPoint,
      modifiers: {},
      totalModifier: 0,
      finalResult: midPoint,
      breakdown: `d100: ${midPoint} = ${midPoint}`,
      timestamp: new Date()
    }
    setCurrentRoll(fakeRoll)
    
    // Process effects
    try {
      const result = await tableEngine.processTable(table.id, character, entry.id)
      
      let updatedCharacter = { ...character }
      
      if (result.success && result.character) {
        updatedCharacter = result.character
      } else {
        // Manual character updates based on table type
        if (tableId === '901') { // Relationships
          updatedCharacter.relationships = [...(character.relationships || []), {
            id: `rel_${Date.now()}`,
            name: entry.result,
            description: entry.description,
            type: 'important',
            category: 'relationship'
          }]
        } else if (tableId === '902') { // Special Items
          updatedCharacter.specialItems = [...(character.specialItems || []), {
            id: `item_${Date.now()}`,
            name: entry.result,
            description: entry.description,
            type: 'special',
            category: 'possession'
          }]
        } else if (tableId === '903') { // Life Events
          updatedCharacter.lifeEvents = [...(character.lifeEvents || []), {
            id: `event_${Date.now()}`,
            name: entry.result,
            description: entry.description,
            type: 'defining',
            category: 'life_event'
          }]
        }
      }
      
      updateCharacter(updatedCharacter)
      
      // Add to history
      const tableTypeNames = {
        '901': 'Important Relationship',
        '902': 'Special Possession',
        '903': 'Defining Life Event'
      }
      
      createSnapshot(
        `Selected from ${tableTypeNames[tableId] || table.name}: ${entry.result}`,
        updatedCharacter
      )
      
      if (onComplete) {
        onComplete({
          table,
          roll: fakeRoll,
          entry,
          character: updatedCharacter
        })
      }
    } catch (error) {
      console.error('Error processing manual selection:', error)
    }
  }

  const getTableIcon = (tableId: string) => {
    switch (tableId) {
      case '901': return '🤝'
      case '902': return '💎'
      case '903': return '⚡'
      default: return '📋'
    }
  }

  const getTableColor = (tableId: string) => {
    switch (tableId) {
      case '901': return 'cyan'
      case '902': return 'indigo' 
      case '903': return 'orange'
      default: return 'gray'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-parchment-700">Loading life details table...</span>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Failed to load life details table: {tableId}</p>
      </div>
    )
  }

  const tableColor = getTableColor(tableId)

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{getTableIcon(tableId)}</span>
          <h3 className="text-xl font-bold text-amber-800">{table.name}</h3>
        </div>
        
        <p className="text-parchment-700 mb-3">{table.instructions}</p>
        
        {/* Roll Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleRoll}
            disabled={rolling}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {rolling ? 'Rolling...' : 'Roll d100'}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-parchment-700">or</span>
            <select 
              onChange={(e) => e.target.value && handleManualSelect(e.target.value)}
              value=""
              className="px-3 py-2 border border-amber-600 rounded-md text-amber-800 bg-parchment-50"
            >
              <option value="">Manual Select...</option>
              {table.entries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.rollRange[0]}-{entry.rollRange[1]}: {entry.result}
                </option>
              ))}
            </select>
          </div>
          
          {currentRoll && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-800">Result:</span>
              <div className="flex items-center gap-1">
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm font-mono">
                  {currentRoll.breakdown}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Selection */}
      {selectedEntry && (
        <div className={`bg-${tableColor}-50 border-2 border-${tableColor}-500 rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 bg-white text-${tableColor}-800 rounded text-sm font-bold`}>
              {selectedEntry.rollRange[0]}-{selectedEntry.rollRange[1]}
            </span>
            <h4 className={`text-lg font-semibold text-${tableColor}-800`}>
              {selectedEntry.result}
            </h4>
          </div>
          
          {selectedEntry.description && (
            <p className={`text-${tableColor}-700 mb-3`}>{selectedEntry.description}</p>
          )}
          
          {/* Cross-reference navigation */}
          {selectedEntry.goto && (
            <div className="mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm">
                → Continue to Table {selectedEntry.goto}
              </span>
            </div>
          )}
          
          {/* Effects Display */}
          {selectedEntry.effects && selectedEntry.effects.length > 0 && (
            <div className="space-y-3">
              <h5 className={`font-semibold text-${tableColor}-800`}>Effects:</h5>
              <div className="grid gap-3">
                {selectedEntry.effects.map((effect, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    {effect.type === 'modifier' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Modifier:</span>
                          <span className="font-semibold">{effect.target}</span>
                          <span className={`font-bold text-lg ${effect.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {effect.value > 0 ? '+' : ''}{effect.value}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {effect.type === 'trait' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Acquired Trait:</span>
                        <span className="font-semibold">{effect.value?.name}</span>
                        {effect.value?.type && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs">
                            {effect.value.type}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {effect.type === 'relationship' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">New Relationship:</span>
                        <span className="font-semibold">{effect.value?.name}</span>
                        {effect.value?.type && (
                          <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                            {effect.value.type}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {effect.type === 'item' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Acquired:</span>
                        <span className="font-semibold">{effect.value?.name}</span>
                        {effect.value?.quality && (
                          <span className="text-gray-600">({effect.value.quality})</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}