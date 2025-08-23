// Youth Events Table Component for PanCasting

import React, { useState, useEffect, useRef } from 'react'
import { YouthTable as YouthTableType } from '../../../types/tables'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { getGlobalTableEngine } from '../../../services/globalTableEngine'
import { TableService } from '../../../services/tableService'
import type { DiceRoll } from '../../../types/tables'
import { rollWithModifiers } from '../../../utils/dice'

interface YouthTableProps {
  tableId: string
  eventType: 'childhood' | 'adolescence'
  onComplete?: (result: any) => void
}

export function YouthTable({ tableId, eventType, onComplete }: YouthTableProps) {
  const [table, setTable] = useState<YouthTableType | null>(null)
  const [loading, setLoading] = useState(true)
  const [rolling, setRolling] = useState(false)
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null)
  const [showFullTable, setShowFullTable] = useState(false)
  
  const { character, updateCharacter } = useCharacterStore()
  const { currentStep } = useGenerationStore()
  
  // Use global singleton TableEngine and persistent TableService
  const tableEngine = getGlobalTableEngine()
  const tableServiceRef = useRef(new TableService())
  const tableService = tableServiceRef.current

  useEffect(() => {
    loadTable()
  }, [tableId])

  const loadTable = async () => {
    try {
      setLoading(true)
      console.log('🟡 YouthTable: Loading table ID:', tableId)
      const loadedTable = await tableService.getTable(tableId)
      console.log('🟡 YouthTable: Loaded table:', loadedTable)
      if (loadedTable && loadedTable.category === 'youth') {
        setTable(loadedTable as YouthTableType)
        // Register the table with the engine
        tableEngine.registerTable(loadedTable)
        console.log('✅ YouthTable: Table set successfully:', loadedTable.name)
        console.log('✅ YouthTable: Table registered with engine:', loadedTable.id)
      } else {
        console.error('❌ YouthTable: Table not found or wrong category:', { loadedTable, expectedCategory: 'youth' })
      }
    } catch (error) {
      console.error('❌ YouthTable: Failed to load youth table:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoll = async () => {
    if (!table) return
    
    setRolling(true)
    
    try {
      // Roll dice for this table
      const roll = rollWithModifiers(table.diceType)
      setCurrentRoll(roll)
      console.log('🎲 YouthTable: Rolled', roll.finalResult, 'on table', table.id)
      
      // Process the table result with the actual roll
      const result = await tableEngine.processTable(table.id, character, {
        manualSelection: roll.finalResult
      })
      console.log('🔍 YouthTable: Table processing result:', result)
      
      if (result.success && result.entry) {
        console.log('✅ YouthTable: Found matching entry:', result.entry)
        setSelectedEntry(result.entry)
        
        // Apply effects to character
        if (result.character) {
          console.log('🔄 YouthTable: Updating character with:', result.character)
          updateCharacter(result.character)
        }
        
        // Generation history would be added here if needed
        console.log('✅ Roll completed:', result.entry.result)
        
        // Call completion callback
        if (onComplete) {
          onComplete({
            table,
            roll,
            entry: result.entry,
            character: result.character
          })
        }
      } else {
        console.error('❌ YouthTable: No entry found for roll', roll.finalResult)
      }
    } catch (error) {
      console.error('Error rolling on youth table:', error)
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
      diceType: table.diceType,
      baseRoll: midPoint,
      modifiers: {},
      totalModifier: 0,
      finalResult: midPoint,
      breakdown: `${table.diceType}: ${midPoint} = ${midPoint}`,
      timestamp: new Date()
    }
    setCurrentRoll(fakeRoll)
    
    // Process effects
    try {
      const result = await tableEngine.processTable(table.id, character, {
        manualSelection: entry.id
      })
      
      if (result.success && result.character) {
        updateCharacter(result.character)
      }
      
      // Manual selection completed
      console.log('✅ Manual selection completed:', entry.result)
      
      if (onComplete) {
        onComplete({
          table,
          roll: fakeRoll,
          entry,
          character: result.character
        })
      }
    } catch (error) {
      console.error('Error processing manual selection:', error)
    }
  }

  const getEventTypeColor = () => {
    return eventType === 'childhood' 
      ? { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800' }
      : { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-800' }
  }

  const getTraitTypeIcon = (traitType: string) => {
    switch (traitType) {
      case 'Lightside': return '😇'
      case 'Darkside': return '😈'
      case 'Neutral': return '😐'
      case 'Exotic': return '✨'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-parchment-700">Loading youth table...</span>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Failed to load youth table: {tableId}</p>
      </div>
    )
  }

  const colors = getEventTypeColor()

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <h3 className="text-xl font-bold text-amber-800 mb-2">{table.name}</h3>
        <p className="text-parchment-700 mb-3">{table.instructions}</p>
        
        {/* Roll Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleRoll}
            disabled={rolling}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {rolling ? 'Rolling...' : `Roll ${table.diceType}`}
          </button>
          
          {!selectedEntry && (
            <button
              onClick={() => setShowFullTable(!showFullTable)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {showFullTable ? 'Hide Table' : 'Manual Selection'}
            </button>
          )}
          
          {currentRoll && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-800">Rolled:</span>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded font-bold">
                {currentRoll.finalResult}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Current Selection */}
      {selectedEntry && (
        <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 bg-white ${colors.text} rounded text-sm font-bold border`}>
                {selectedEntry.rollRange[0]}-{selectedEntry.rollRange[1]}
              </span>
              <h4 className={`text-lg font-semibold ${colors.text}`}>
                {selectedEntry.result}
              </h4>
            </div>
            
            <button
              onClick={() => {
                setSelectedEntry(null)
                setCurrentRoll(null)
                setShowFullTable(true)
              }}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Change Selection
            </button>
          </div>
          
          {selectedEntry.description && (
            <p className={`${colors.text} mb-3`}>{selectedEntry.description}</p>
          )}
          
          {/* Effects Display */}
          {selectedEntry.effects && selectedEntry.effects.length > 0 && (
            <div className="space-y-2">
              <h5 className={`font-semibold ${colors.text}`}>Effects:</h5>
              <div className="space-y-2">
                {selectedEntry.effects.map((effect, index) => (
                  <div key={index} className="p-2 bg-white rounded border">
                    {effect.type === 'trait' && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTraitTypeIcon(effect.value?.type)}</span>
                        <span className="font-medium text-gray-700">Personality Trait:</span>
                        <span className="font-semibold">{effect.value?.name}</span>
                        {effect.value?.description && (
                          <span className="text-gray-600 italic">- {effect.value.description}</span>
                        )}
                      </div>
                    )}
                    {effect.type === 'modifier' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Modifier:</span>
                        <span className="font-semibold">{effect.target}</span>
                        <span className={`font-bold ${effect.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {effect.value > 0 ? '+' : ''}{effect.value}
                        </span>
                      </div>
                    )}
                    {effect.type === 'skill' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Skill:</span>
                        <span className="font-semibold">{effect.value?.name}</span>
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-bold">
                          Rank {effect.value?.rank}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table Entries - Only show when manual selection is enabled */}
      {showFullTable && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700">
              <div className="col-span-2">Range</div>
              <div className="col-span-6">Result</div>
              <div className="col-span-4">Action</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {table.entries.map((entry) => (
              <div 
                key={entry.id} 
                className={`grid grid-cols-12 gap-4 p-3 hover:bg-gray-50 ${
                  selectedEntry?.id === entry.id ? `${colors.bg}` : ''
                }`}
              >
                <div className="col-span-2 font-mono text-sm">
                  {entry.rollRange[0]}-{entry.rollRange[1]}
                </div>
                <div className="col-span-6">
                  <div className="font-medium">{entry.result}</div>
                  {entry.description && (
                    <div className="text-sm text-gray-600">{entry.description}</div>
                  )}
                </div>
                <div className="col-span-4">
                  <button
                    onClick={() => handleManualSelect(entry.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}