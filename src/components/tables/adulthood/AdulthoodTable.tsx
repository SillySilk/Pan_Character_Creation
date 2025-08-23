// Adulthood Events Table Component for PanCasting

import React, { useState, useEffect } from 'react'
import { AdulthoodTable as AdulthoodTableType } from '../../../types/tables'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { getGlobalTableEngine } from '../../../services/globalTableEngine'
import { tableService } from '../../../services/tableService'
import type { DiceRoll } from '../../../types/tables'
import { rollWithModifiers } from '../../../utils/dice'

interface AdulthoodTableProps {
  tableId: string
  onComplete?: (result: any) => void
}

export function AdulthoodTable({ tableId, onComplete }: AdulthoodTableProps) {
  const [table, setTable] = useState<AdulthoodTableType | null>(null)
  const [loading, setLoading] = useState(true)
  const [rolling, setRolling] = useState(false)
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null)
  const [modifierApplied, setModifierApplied] = useState(false)
  const [showModifierDetails, setShowModifierDetails] = useState(false)
  
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
      console.log('🟡 AdulthoodTable: Loading table ID:', tableId)
      console.log('🟡 AdulthoodTable: TableService instance:', tableService)
      console.log('🟡 AdulthoodTable: TableService.getTable method:', typeof tableService.getTable)
      
      const loadedTable = await tableService.getTable(tableId)
      console.log('🟡 AdulthoodTable: Loaded table:', loadedTable)
      
      if (loadedTable && loadedTable.category === 'adulthood') {
        setTable(loadedTable as AdulthoodTableType)
        // Register the table with the engine
        tableEngine.registerTable(loadedTable)
        console.log('✅ AdulthoodTable: Table set successfully:', loadedTable.name)
        console.log('✅ AdulthoodTable: Table registered with engine:', loadedTable.id)
      } else {
        console.error('❌ AdulthoodTable: Table not found or wrong category:', { 
          loadedTable, 
          expectedCategory: 'adulthood',
          tableCategory: loadedTable?.category,
          tableId: loadedTable?.id 
        })
      }
    } catch (error) {
      console.error('❌ AdulthoodTable: Failed to load adulthood table:', error)
      console.error('❌ AdulthoodTable: Error details:', {
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
      // Calculate SolMod for adulthood tables
      const solMod = character.activeModifiers?.solMod || 0
      
      // Roll 2d20 + SolMod as per Central Casting rules
      const combinedRoll = rollWithModifiers('2d20', { solMod })
      const totalRoll = combinedRoll.finalResult
      
      setCurrentRoll(combinedRoll)
      setModifierApplied(solMod !== 0)
      
      // Process the table result with the calculated roll
      const result = await tableEngine.processTable(table.id, character, undefined, totalRoll)
      
      if (result.success && result.entry) {
        setSelectedEntry(result.entry)
        
        // Apply effects to character
        if (result.character) {
          updateCharacter(result.character)
        }
        
        // Add to generation history
        createSnapshot(
          `Rolled on ${table.name}: ${result.entry.result}`,
          result.character
        )
        
        // Show modifier details if significant modifiers were applied
        if (result.entry.effects?.some(effect => 
          effect.type === 'modifier' && Math.abs(effect.value) >= 2
        )) {
          setShowModifierDetails(true)
        }
        
        // Call completion callback
        if (onComplete) {
          onComplete({
            table,
            roll: combinedRoll,
            entry: result.entry,
            character: result.character
          })
        }
      }
    } catch (error) {
      console.error('Error rolling on adulthood table:', error)
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
      diceType: '2d20',
      baseRoll: midPoint,
      modifiers: {},
      totalModifier: 0,
      finalResult: midPoint,
      breakdown: `2d20: ${midPoint} = ${midPoint}`,
      timestamp: new Date()
    }
    setCurrentRoll(fakeRoll)
    
    // Process effects
    try {
      const result = await tableEngine.processTable(table.id, character, entry.id)
      
      if (result.success && result.character) {
        updateCharacter(result.character)
      }
      
      // Add to history
      createSnapshot(
        `Selected from ${table.name}: ${entry.result}`,
        result.character
      )
      
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

  const getSolModValue = () => {
    return character.activeModifiers?.solMod || 0
  }

  const getLifeStageIcon = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'young adult': return '🌱'
      case 'adult': return '🌳'
      case 'mature': return '🍂'
      case 'elder': return '🎋'
      default: return '🎭'
    }
  }

  const getModifierImpact = (value: number) => {
    if (value >= 3) return { color: 'text-green-600', label: 'Major Positive' }
    if (value >= 1) return { color: 'text-blue-600', label: 'Positive' }
    if (value <= -3) return { color: 'text-red-600', label: 'Major Negative' }
    if (value <= -1) return { color: 'text-orange-600', label: 'Negative' }
    return { color: 'text-gray-600', label: 'Neutral' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-parchment-700">Loading adulthood table...</span>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Failed to load adulthood table: {tableId}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{getLifeStageIcon(table.lifeStage)}</span>
          <h3 className="text-xl font-bold text-amber-800">{table.name}</h3>
          {table.lifeStage && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              {table.lifeStage}
            </span>
          )}
        </div>
        
        <p className="text-parchment-700 mb-3">{table.instructions}</p>
        
        {/* Dice Mechanics Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
          <h5 className="font-semibold text-purple-800 mb-2">Adulthood Roll Mechanics:</h5>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-purple-700">Base Roll:</span>
              <span className="px-2 py-1 bg-white text-purple-800 rounded font-mono">2d20</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-purple-700">SolMod:</span>
              <span className={`px-2 py-1 bg-white rounded font-mono ${
                getSolModValue() > 0 ? 'text-green-700' : getSolModValue() < 0 ? 'text-red-700' : 'text-gray-700'
              }`}>
                {getSolModValue() > 0 ? '+' : ''}{getSolModValue()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-purple-700">Total Range:</span>
              <span className="px-2 py-1 bg-white text-purple-800 rounded font-mono">
                {2 + getSolModValue()} - {40 + getSolModValue()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Roll Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleRoll}
            disabled={rolling}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {rolling ? 'Rolling...' : 'Roll 2d20 + SolMod'}
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
        <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-white text-purple-800 rounded text-sm font-bold">
              {selectedEntry.rollRange[0]}-{selectedEntry.rollRange[1]}
            </span>
            <h4 className="text-lg font-semibold text-purple-800">
              {selectedEntry.result}
            </h4>
          </div>
          
          {selectedEntry.description && (
            <p className="text-purple-700 mb-3">{selectedEntry.description}</p>
          )}
          
          {/* Cross-reference navigation */}
          {selectedEntry.goto && (
            <div className="mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm">
                → Continue to Table {selectedEntry.goto}
              </span>
            </div>
          )}
          
          {/* Complex Effects Display */}
          {selectedEntry.effects && selectedEntry.effects.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-semibold text-purple-800">Life Impact:</h5>
              <div className="grid gap-3">
                {selectedEntry.effects.map((effect, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    {effect.type === 'modifier' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Modifier:</span>
                          <span className="font-semibold">{effect.target}</span>
                          <span className={`font-bold text-lg ${getModifierImpact(effect.value).color}`}>
                            {effect.value > 0 ? '+' : ''}{effect.value}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getModifierImpact(effect.value).color}`}>
                          {getModifierImpact(effect.value).label}
                        </span>
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
                        {effect.value?.description && (
                          <span className="text-gray-600 italic">- {effect.value.description}</span>
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
                    
                    {effect.type === 'skill' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Skill Development:</span>
                        <span className="font-semibold">{effect.value?.name}</span>
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-bold">
                          Rank {effect.value?.rank}
                        </span>
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

      {/* Modifier Impact Details */}
      {showModifierDetails && selectedEntry && (
        <div className="bg-indigo-50 border-2 border-indigo-500 rounded-lg p-4">
          <h5 className="text-lg font-semibold text-indigo-800 mb-3">
            Life-Changing Event
          </h5>
          <p className="text-indigo-700 mb-3">
            This adulthood event has significantly impacted your character's capabilities and outlook. 
            Major life events can reshape personality, skills, and future opportunities.
          </p>
          
          <div className="bg-white p-3 rounded border">
            <h6 className="font-semibold text-indigo-800 mb-2">Modifier Impact Guide:</h6>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div><span className="text-green-600 font-medium">+3 or higher:</span> Life-changing positive impact</div>
              <div><span className="text-blue-600 font-medium">+1 to +2:</span> Beneficial experience</div>
              <div><span className="text-orange-600 font-medium">-1 to -2:</span> Challenging setback</div>
              <div><span className="text-red-600 font-medium">-3 or lower:</span> Traumatic or devastating event</div>
            </div>
          </div>
        </div>
      )}


      {/* Adulthood Specific Information */}
      {table.socialComplexity && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h5 className="font-semibold text-amber-800 mb-2">Social Complexity Level: {table.socialComplexity}</h5>
          <p className="text-amber-700 text-sm">
            Adulthood events reflect the complexity of mature relationships, career challenges, 
            and major life decisions. These experiences shape long-term character development.
          </p>
        </div>
      )}
    </div>
  )
}