// Personality Table Component for PanCasting

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableService } from '../../../services/tableService'
import { getGlobalTableEngine } from '../../../services/globalTableEngine'
import type { TableProcessingResult, PersonalityTable as PersonalityTableType } from '../../../types/tables'

interface PersonalityTableProps {
  tableId: string
  onComplete?: (result: TableProcessingResult) => void
}

export function PersonalityTable({ tableId, onComplete }: PersonalityTableProps) {
  const [table, setTable] = useState<PersonalityTableType | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<TableProcessingResult | null>(null)
  const [manualRoll, setManualRoll] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { character, updateValues, updatePersonalityTraits } = useCharacterStore()
  const tableEngine = getGlobalTableEngine()

  // Load table data
  useEffect(() => {
    const loadTable = async () => {
      try {
        console.log('🟡 PersonalityTable: Loading table ID:', tableId)
        const tableData = await tableService.getTable(tableId)
        console.log('🟡 PersonalityTable: Loaded table:', tableData)
        
        if (tableData && tableData.category === 'personality') {
          setTable(tableData as PersonalityTableType)
          // Register the table with the engine
          tableEngine.registerTable(tableData)
          console.log('✅ PersonalityTable: Table set successfully:', tableData.name)
        } else {
          console.error('❌ PersonalityTable: Table not found or wrong category:', { 
            tableData, 
            expectedCategory: 'personality',
            tableCategory: tableData?.category 
          })
          setError(`Table ${tableId} not found or not a personality table`)
        }
      } catch (err) {
        console.error('❌ PersonalityTable: Failed to load table:', err)
        setError(`Failed to load table ${tableId}: ${err}`)
      }
    }

    loadTable()
  }, [tableId, tableEngine])

  const handleRoll = async (rollValue?: number) => {
    if (!table || !character) return

    setIsRolling(true)
    setError(null)

    try {
      const rollResult = await tableEngine.processTable(table.id, character, undefined, rollValue)
      setResult(rollResult)

      // Apply the result to character
      if (rollResult.entry?.effects) {
        for (const effect of rollResult.entry.effects) {
          if (effect.type === 'trait' && effect.target === 'values') {
            // Update character values
            const currentValues = character.values || {
              mostValuedPerson: '',
              mostValuedPossession: '',
              mostValuedConcept: '',
              personalCode: '',
              attitude: 'Neutral'
            }
            
            updateValues({
              ...currentValues,
              ...effect.value
            })
          } else if (effect.type === 'trait' && effect.target === 'personality') {
            // Update personality traits
            const newTrait = {
              name: rollResult.entry.result,
              description: rollResult.entry.description || '',
              type: effect.value?.type || 'Neutral' as 'Lightside' | 'Neutral' | 'Darkside'
            }

            updatePersonalityTraits({
              ...character.personalityTraits,
              [effect.value?.category || 'neutral']: [
                ...(character.personalityTraits?.[effect.value?.category || 'neutral'] || []),
                newTrait
              ]
            })
          }
        }
      }

      // Auto-complete after a delay
      setTimeout(() => {
        if (onComplete) {
          onComplete(rollResult)
        }
      }, 1500)

    } catch (err) {
      setError(`Failed to process roll: ${err}`)
    } finally {
      setIsRolling(false)
    }
  }

  const handleManualRoll = () => {
    const rollValue = parseInt(manualRoll)
    if (isNaN(rollValue) || rollValue < 1 || rollValue > 100) {
      setError('Please enter a valid roll between 1 and 100')
      return
    }
    handleRoll(rollValue)
  }

  const getTableDescription = () => {
    switch (tableId) {
      case '501':
        return 'Who does your character value most in their life? This shapes their deepest emotional connections.'
      case '502':
        return 'What possession means the most to your character? This reveals their material attachments.'
      case '503':
        return 'What concept or ideal does your character hold dear? This defines their philosophical core.'
      case '504':
        return 'What personality traits define your character? These shape how they interact with the world.'
      default:
        return table?.instructions || 'Roll to determine personality aspect'
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-medium">Error</div>
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-purple-600">Loading table...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-purple-800 mb-2">{table.name}</h3>
        <p className="text-purple-600 text-sm max-w-2xl mx-auto">
          {getTableDescription()}
        </p>
        <div className="mt-2 text-xs text-purple-500">
          Roll {table.diceType} • Table {table.id}
        </div>
      </div>

      {/* Roll Controls */}
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={() => handleRoll()}
            disabled={isRolling}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isRolling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Rolling...
              </>
            ) : (
              <>
                🎲 Roll {table.diceType}
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-purple-600">or</span>
            <input
              type="number"
              min="1"
              max="100"
              value={manualRoll}
              onChange={(e) => setManualRoll(e.target.value)}
              placeholder="Enter roll"
              className="w-24 px-2 py-1 border border-purple-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleManualRoll}
              disabled={isRolling || !manualRoll}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Use
            </button>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 animate-fade-in">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-green-800 mb-2">
              🎯 Rolled: {result.rollResult?.finalResult}
            </div>
            <div className="text-lg font-semibold text-green-700">
              {result.entry?.result}
            </div>
            {result.entry?.description && (
              <div className="text-green-600 text-sm mt-2 max-w-md mx-auto">
                {result.entry.description}
              </div>
            )}
          </div>

          {/* Effects Display */}
          {result.entry?.effects && result.entry.effects.length > 0 && (
            <div className="border-t border-green-300 pt-3 mt-3">
              <h4 className="font-medium text-green-800 mb-2">Character Impact:</h4>
              <div className="space-y-1">
                {result.entry.effects.map((effect, index) => (
                  <div key={index} className="text-sm text-green-700 flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      {effect.type === 'trait' && effect.target === 'values' && (
                        <>Added to values: {JSON.stringify(effect.value)}</>
                      )}
                      {effect.type === 'trait' && effect.target === 'personality' && (
                        <>Added personality trait: {result.entry.result}</>
                      )}
                      {effect.type === 'skill' && (
                        <>Skill bonus: {effect.target} +{effect.value}</>
                      )}
                      {effect.type === 'attribute' && (
                        <>Attribute: {effect.target} {effect.value > 0 ? '+' : ''}{effect.value}</>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <div className="text-xs text-green-600">
              Result will be applied automatically. Moving to next step...
            </div>
          </div>
        </div>
      )}

      {/* Sample Entries Display */}
      {!result && table.entries && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Sample Results (Roll {table.diceType}):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {table.entries.slice(0, 6).map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between py-1">
                <span className="text-gray-600">
                  {Array.isArray(entry.rollRange) ? 
                    `${entry.rollRange[0]}-${entry.rollRange[1]}` : 
                    entry.rollRange
                  }:
                </span>
                <span className="text-gray-800 font-medium">
                  {entry.result}
                </span>
              </div>
            ))}
            {table.entries.length > 6 && (
              <div className="text-gray-500 text-xs col-span-full text-center">
                ... and {table.entries.length - 6} more results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}