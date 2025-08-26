// Occupation Table Component for PanCasting

import React, { useState, useEffect, useRef } from 'react'
import { OccupationTable as OccupationTableType } from '../../../types/tables'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { getGlobalTableEngine } from '../../../services/globalTableEngine'
import { tableService } from '../../../services/tableService'
import type { DiceRoll } from '../../../types/tables'
import { rollWithModifiers } from '../../../utils/dice'

interface OccupationTableProps {
  tableId: string
  occupationType: 'apprenticeship' | 'civilized' | 'hobby'
  onComplete?: (result: any) => void
}

export function OccupationTable({ tableId, occupationType, onComplete }: OccupationTableProps) {
  const [table, setTable] = useState<OccupationTableType | null>(null)
  const [loading, setLoading] = useState(true)
  const [rolling, setRolling] = useState(false)
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null)
  const [showFullTable, setShowFullTable] = useState(false)
  const [showSkillDetails, setShowSkillDetails] = useState(false)
  
  const { character, updateCharacter } = useCharacterStore()
  const { currentStep } = useGenerationStore()
  
  // Use global singleton TableEngine and TableService
  const tableEngine = getGlobalTableEngine()

  useEffect(() => {
    loadTable()
  }, [tableId])

  const loadTable = async () => {
    try {
      setLoading(true)
      console.log('🟡 OccupationTable: Loading table ID:', tableId)
      const loadedTable = await tableService.getTable(tableId)
      console.log('🟡 OccupationTable: Loaded table:', loadedTable)
      console.log('🟡 OccupationTable: Table details:', {
        found: !!loadedTable,
        category: loadedTable?.category,
        name: loadedTable?.name,
        entriesCount: loadedTable?.entries?.length
      })
      
      if (loadedTable && loadedTable.category === 'occupations') {
        setTable(loadedTable as OccupationTableType)
        // Register the table with the engine
        tableEngine.registerTable(loadedTable)
        console.log('✅ OccupationTable: Table set successfully:', loadedTable.name)
        console.log('✅ OccupationTable: Table registered with engine:', loadedTable.id)
      } else {
        console.error('❌ OccupationTable: Table not found or wrong category:', { 
          loadedTable: !!loadedTable, 
          actualCategory: loadedTable?.category,
          expectedCategory: 'occupations',
          tableName: loadedTable?.name 
        })
      }
    } catch (error) {
      console.error('❌ OccupationTable: Failed to load occupation table:', error)
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
      
      // Process the table result with the actual roll
      const result = await tableEngine.processTable(table.id, character, {
        manualSelection: roll.finalResult
      })
      console.log('🔍 OccupationTable: Table processing result:', result)
      
      if (result.success && result.entry) {
        setSelectedEntry(result.entry)
        
        // Apply effects to character
        if (result.character) {
          updateCharacter(result.character)
        }
        
        // Generation history would be added here if needed
        
        // Show skill details if skills were assigned
        if (result.entry.effects?.some(effect => effect.type === 'skill')) {
          setShowSkillDetails(true)
        }
        
        // Call completion callback
        if (onComplete) {
          onComplete({
            table,
            roll,
            entry: result.entry,
            character: result.character
          })
        }
      }
    } catch (error) {
      console.error('Error rolling on occupation table:', error)
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
      
      // Show skill details if skills were assigned
      if (entry.effects?.some(effect => effect.type === 'skill')) {
        setShowSkillDetails(true)
      }
      
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

  const getOccupationTypeColor = () => {
    switch (occupationType) {
      case 'apprenticeship':
        return { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-800' }
      case 'civilized':
        return { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-800' }
      case 'hobby':
        return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800' }
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-500', text: 'text-gray-800' }
    }
  }

  const getSkillRankBadge = (rank: number) => {
    const colors = {
      1: 'bg-gray-200 text-gray-800',
      2: 'bg-blue-200 text-blue-800',
      3: 'bg-green-200 text-green-800',
      4: 'bg-yellow-200 text-yellow-800',
      5: 'bg-red-200 text-red-800'
    }
    return colors[rank as keyof typeof colors] || 'bg-purple-200 text-purple-800'
  }

  const calculateSkillBonus = (rank: number) => {
    // D&D 3.5 skill rank to bonus conversion
    return Math.floor((rank - 1) / 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-parchment-700">Loading occupation table...</span>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Failed to load occupation table: {tableId}</p>
      </div>
    )
  }


  const colors = getOccupationTypeColor()

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-3 py-1 ${colors.bg} ${colors.border} border rounded-full text-sm font-semibold ${colors.text}`}>
            {occupationType.charAt(0).toUpperCase() + occupationType.slice(1)}
          </span>
          <h3 className="text-xl font-bold text-amber-800">{table.name}</h3>
        </div>
        
        <p className="text-parchment-700 mb-3">{table.instructions}</p>
        
        {table.skillBonusCalculation && (
          <p className="text-sm text-parchment-600 mb-3">
            <span className="font-medium">Skill Calculation:</span> {table.skillBonusCalculation}
          </p>
        )}
        
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
              <span className={`px-2 py-1 bg-white ${colors.text} rounded text-sm font-bold`}>
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
          
          {/* Training Information */}
          {table.trainingTime && (
            <div className="mb-3">
              <span className={`inline-flex items-center px-3 py-1 ${colors.bg} ${colors.text} rounded text-sm font-medium`}>
                Training Time: {table.trainingTime}
              </span>
            </div>
          )}
          
          {/* Effects Display - Skills */}
          {selectedEntry.effects && selectedEntry.effects.length > 0 && (
            <div className="space-y-2">
              <h5 className={`font-semibold ${colors.text}`}>Skills & Benefits:</h5>
              <div className="grid gap-2">
                {selectedEntry.effects.map((effect, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    {effect.type === 'skill' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{effect.value?.name}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getSkillRankBadge(effect.value?.rank)}`}>
                            Rank {effect.value?.rank}
                          </span>
                          {effect.value?.rank && (
                            <span className="text-sm text-gray-600">
                              (+{calculateSkillBonus(effect.value.rank)} bonus)
                            </span>
                          )}
                        </div>
                        {effect.value?.specialty && (
                          <span className="text-sm text-gray-500 italic">
                            Specialty: {effect.value.specialty}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {effect.type === 'modifier' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Modifier:</span>
                        <span className="font-semibold">
                          {effect.target}: {effect.value > 0 ? '+' : ''}{effect.value}
                        </span>
                      </div>
                    )}
                    
                    {effect.type === 'trait' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Trait:</span>
                        <span className="font-semibold">{effect.value?.name}</span>
                        {effect.value?.description && (
                          <span className="text-gray-600">- {effect.value.description}</span>
                        )}
                      </div>
                    )}
                    
                    {effect.type === 'item' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Equipment:</span>
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

      {/* Skill Training Details */}
      {showSkillDetails && selectedEntry && (
        <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
          <h5 className="text-lg font-semibold text-blue-800 mb-3">
            Professional Training Complete
          </h5>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-semibold text-blue-800 mb-2">Skill Development:</h6>
              <p className="text-blue-700 text-sm">
                Through your {occupationType}, you've developed professional competencies. 
                Higher skill ranks provide better bonuses and allow for more complex tasks.
              </p>
            </div>
            <div>
              <h6 className="font-semibold text-blue-800 mb-2">Skill Rank Guide:</h6>
              <ul className="text-blue-700 text-sm space-y-1">
                <li><strong>Rank 1-2:</strong> Novice (+0 to +0 bonus)</li>
                <li><strong>Rank 3-4:</strong> Apprentice (+1 to +1 bonus)</li>
                <li><strong>Rank 5-6:</strong> Journeyman (+2 to +2 bonus)</li>
                <li><strong>Rank 7-8:</strong> Expert (+3 to +3 bonus)</li>
                <li><strong>Rank 9+:</strong> Master (+4+ bonus)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Table Entries - Only show when manual selection is enabled */}
      {showFullTable && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700">
              <div className="col-span-2">Range</div>
              <div className="col-span-5">Occupation</div>
              <div className="col-span-3">Key Skills</div>
              <div className="col-span-2">Action</div>
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
                <div className="col-span-5">
                  <div className="font-medium">{entry.result}</div>
                  {entry.description && (
                    <div className="text-sm text-gray-600">{entry.description}</div>
                  )}
                </div>
                <div className="col-span-3">
                  {entry.effects?.filter(e => e.type === 'skill').slice(0, 2).map((skill, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium">{skill.value?.name}</span>
                      {skill.value?.rank && (
                        <span className="text-gray-500"> (R{skill.value.rank})</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="col-span-2">
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

      {/* Culture Filtering */}
      {table.culturalRestrictions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-800 mb-2">Cultural Considerations:</h5>
          <p className="text-yellow-700 text-sm">
            Some occupations may not be available in all cultures. Consider your character's 
            cultural background when selecting an occupation.
          </p>
          {table.culturalRestrictions.length > 0 && (
            <ul className="list-disc list-inside mt-2 text-yellow-700 text-sm">
              {table.culturalRestrictions.map((restriction, index) => (
                <li key={index}>{restriction}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}