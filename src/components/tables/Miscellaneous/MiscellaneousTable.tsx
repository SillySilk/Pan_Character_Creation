// Miscellaneous Events Table Component for PanCasting

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { TableService } from '../../../services/tableService'
import { TableEngine } from '../../../services/tableEngine'
import type { TableProcessingResult, MiscellaneousTable as MiscellaneousTableType } from '../../../types/tables'
import type { Event } from '../../../types/character'

interface MiscellaneousTableProps {
  tableId: string
  onComplete?: (result: TableProcessingResult) => void
}

export function MiscellaneousTable({ tableId, onComplete }: MiscellaneousTableProps) {
  const [table, setTable] = useState<MiscellaneousTableType | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<TableProcessingResult | null>(null)
  const [manualRoll, setManualRoll] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { character, addEvent, addPersonalityTrait } = useCharacterStore()

  // Load table data
  useEffect(() => {
    const loadTable = async () => {
      try {
        const tableData = await TableService.getTable(tableId)
        if (tableData && tableData.category === 'miscellaneous') {
          setTable(tableData as MiscellaneousTableType)
        } else {
          setError(`Table ${tableId} not found or not a miscellaneous table`)
        }
      } catch (err) {
        setError(`Failed to load table ${tableId}: ${err}`)
      }
    }

    loadTable()
  }, [tableId])

  const handleRoll = async (rollValue?: number) => {
    if (!table || !character) return

    setIsRolling(true)
    setError(null)

    try {
      const rollResult = await TableEngine.processTable(table, character, rollValue)
      setResult(rollResult)

      // Apply the result to character
      if (rollResult.entry) {
        // Create the event
        const newEvent: Event = {
          id: `misc_${Date.now()}`,
          type: table.eventType || 'miscellaneous',
          category: 'miscellaneous',
          period: 'Miscellaneous',
          age: character.age || 0,
          result: rollResult.entry.result,
          description: rollResult.entry.description || '',
          tableId: table.id,
          rollValue: rollResult.rollResult?.finalResult || 0,
          effects: rollResult.entry.effects || [],
          timestamp: Date.now()
        }

        // Add event to character
        addEvent(newEvent)

        // Apply effects
        if (rollResult.entry.effects) {
          for (const effect of rollResult.entry.effects) {
            if (effect.type === 'trait' && effect.target === 'personalityTraits') {
              // Add personality trait from tragic/fortunate events
              addPersonalityTrait({
                name: effect.value?.name || rollResult.entry.result,
                description: effect.value?.description || rollResult.entry.description || '',
                type: effect.value?.type || 'Neutral'
              })
            }
          }
        }
      }

      // Auto-complete after a delay
      setTimeout(() => {
        if (onComplete) {
          onComplete(rollResult)
        }
      }, 2000)

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
      case '624':
        return 'Roll for tragic events that may have shaped your character\'s darker aspects and personal struggles.'
      case '625':
        return 'Roll for fortunate events that brought positive changes and opportunities to your character\'s life.'
      case '626':
        return 'Roll for strange encounters with unusual people, creatures, or phenomena that left lasting impressions.'
      case '627':
        return 'Roll for events that could serve as hooks for future adventures and ongoing character motivations.'
      default:
        return table?.instructions || 'Roll for miscellaneous life event'
    }
  }

  const getEventTypeIcon = () => {
    switch (table?.eventType) {
      case 'tragedy': return '💔'
      case 'fortune': return '🍀'
      case 'encounter': return '👁️'
      case 'adventure': return '⚔️'
      default: return '🎲'
    }
  }

  const getEventTypeColor = () => {
    switch (table?.eventType) {
      case 'tragedy': return 'red'
      case 'fortune': return 'green'
      case 'encounter': return 'purple'
      case 'adventure': return 'blue'
      default: return 'orange'
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <span className="ml-2 text-orange-600">Loading table...</span>
      </div>
    )
  }

  const colorClass = getEventTypeColor()

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">{getEventTypeIcon()}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{table.name}</h3>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          {getTableDescription()}
        </p>
        <div className="mt-2 text-xs text-gray-500">
          Roll {table.diceType} • Table {table.id} • {table.eventType}
        </div>
      </div>

      {/* Roll Controls */}
      <div className={`bg-${colorClass}-50 rounded-lg p-4`}>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={() => handleRoll()}
            disabled={isRolling}
            className={`px-6 py-3 bg-${colorClass}-600 text-white rounded-lg font-medium hover:bg-${colorClass}-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2`}
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
            <span className={`text-sm text-${colorClass}-600`}>or</span>
            <input
              type="number"
              min="1"
              max="100"
              value={manualRoll}
              onChange={(e) => setManualRoll(e.target.value)}
              placeholder="Enter roll"
              className={`w-24 px-2 py-1 border border-${colorClass}-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-${colorClass}-500`}
            />
            <button
              onClick={handleManualRoll}
              disabled={isRolling || !manualRoll}
              className={`px-3 py-1 bg-${colorClass}-500 text-white rounded text-sm hover:bg-${colorClass}-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              Use
            </button>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className={`bg-${colorClass}-50 border-2 border-${colorClass}-500 rounded-lg p-4 animate-fade-in`}>
          <div className="text-center mb-4">
            <div className={`text-2xl font-bold text-${colorClass}-800 mb-2`}>
              🎯 Rolled: {result.rollResult?.finalResult}
            </div>
            <div className={`text-lg font-semibold text-${colorClass}-700`}>
              {result.entry?.result}
            </div>
            {result.entry?.description && (
              <div className={`text-${colorClass}-600 text-sm mt-2 max-w-md mx-auto`}>
                {result.entry.description}
              </div>
            )}
          </div>

          {/* Effects Display */}
          {result.entry?.effects && result.entry.effects.length > 0 && (
            <div className={`border-t border-${colorClass}-300 pt-3 mt-3`}>
              <h4 className={`font-medium text-${colorClass}-800 mb-2`}>Character Impact:</h4>
              <div className="space-y-1">
                {result.entry.effects.map((effect, index) => (
                  <div key={index} className={`text-sm text-${colorClass}-700 flex items-start gap-2`}>
                    <span className={`text-${colorClass}-500`}>•</span>
                    <span>
                      {effect.type === 'trait' && (
                        <>Added trait: {effect.value?.name || result.entry?.result}</>
                      )}
                      {effect.type === 'skill' && (
                        <>Skill bonus: {effect.target} +{effect.value}</>
                      )}
                      {effect.type === 'attribute' && (
                        <>Attribute: {effect.target} {effect.value > 0 ? '+' : ''}{effect.value}</>
                      )}
                      {effect.type === 'event' && (
                        <>Event added to character history</>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <div className={`text-xs text-${colorClass}-600`}>
              Event added to character history. Moving to next event...
            </div>
          </div>
        </div>
      )}

      {/* Sample Entries Display */}
      {!result && table.entries && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Sample Events (Roll {table.diceType}):</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {table.entries.slice(0, 5).map((entry, index) => (
              <div key={entry.id} className="flex items-start justify-between py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-600 font-mono text-xs">
                  {Array.isArray(entry.rollRange) ? 
                    `${entry.rollRange[0]}-${entry.rollRange[1]}` : 
                    entry.rollRange
                  }:
                </span>
                <span className="text-gray-800 font-medium flex-1 ml-3">
                  {entry.result}
                </span>
              </div>
            ))}
            {table.entries.length > 5 && (
              <div className="text-gray-500 text-xs text-center pt-2">
                ... and {table.entries.length - 5} more events
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}