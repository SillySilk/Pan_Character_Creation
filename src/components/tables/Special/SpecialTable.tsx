// Special Items Table Component for PanCasting

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { TableService } from '../../../services/tableService'
import { TableEngine } from '../../../services/tableEngine'
import type { TableProcessingResult, SpecialTable as SpecialTableType } from '../../../types/tables'
import type { Gift, Legacy, SpecialItem } from '../../../types/character'

interface SpecialTableProps {
  tableId: string
  onComplete?: (result: TableProcessingResult) => void
}

export function SpecialTable({ tableId, onComplete }: SpecialTableProps) {
  const [table, setTable] = useState<SpecialTableType | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<TableProcessingResult | null>(null)
  const [manualRoll, setManualRoll] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { character, addGift, addLegacy, addSpecialItem } = useCharacterStore()

  // Load table data
  useEffect(() => {
    const loadTable = async () => {
      try {
        const tableData = await TableService.getTable(tableId)
        if (tableData && tableData.category === 'special') {
          setTable(tableData as SpecialTableType)
        } else {
          setError(`Table ${tableId} not found or not a special table`)
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
      if (rollResult.entry?.effects) {
        for (const effect of rollResult.entry.effects) {
          if (effect.type === 'item') {
            const itemData = effect.value
            
            // Create item based on target
            switch (effect.target) {
              case 'gifts':
                const gift: Gift = {
                  id: `gift_${Date.now()}`,
                  name: itemData.name || rollResult.entry.result,
                  description: rollResult.entry.description || '',
                  type: itemData.type || 'Item',
                  quality: itemData.quality || 'Standard',
                  value: itemData.value || 'Unknown',
                  giver: itemData.giver || 'Unknown',
                  occasion: itemData.occasion || 'Character generation',
                  significance: itemData.significance || 'Personal'
                }
                addGift(gift)
                break

              case 'legacies':
                const legacy: Legacy = {
                  id: `legacy_${Date.now()}`,
                  name: itemData.name || rollResult.entry.result,
                  description: rollResult.entry.description || '',
                  type: itemData.type || 'Item',
                  quality: itemData.quality || 'Standard',
                  value: itemData.value || 'Unknown',
                  origin: itemData.origin || 'Family heirloom',
                  history: itemData.history || 'Passed down through generations',
                  significance: itemData.significance || 'Ancestral'
                }
                addLegacy(legacy)
                break

              case 'specialItems':
                const specialItem: SpecialItem = {
                  id: `special_${Date.now()}`,
                  name: itemData.name || rollResult.entry.result,
                  description: rollResult.entry.description || '',
                  type: itemData.type || 'Unique',
                  rarity: itemData.rarity || 'Uncommon',
                  properties: itemData.properties || [],
                  origin: itemData.origin || 'Acquired during generation',
                  significance: itemData.significance || 'Special'
                }
                addSpecialItem(specialItem)
                break
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
      case '801':
        return 'Generate precious gifts and family legacies that carry emotional and monetary value.'
      case '802':
        return 'Discover unique magical or unusual items with special properties and significance.'
      case '803':
        return 'Determine personally meaningful objects that define your character\'s identity and memories.'
      case '804':
        return 'Acquire professional tools and specialized equipment related to your character\'s skills and trade.'
      default:
        return table?.instructions || 'Roll for special item'
    }
  }

  const getItemTypeIcon = () => {
    switch (table?.itemType) {
      case 'gift': return '🎁'
      case 'legacy': return '👑'
      case 'special': return '✨'
      case 'equipment': return '🛠️'
      default: return '📦'
    }
  }

  const getItemTypeColor = () => {
    switch (table?.itemType) {
      case 'gift': return 'pink'
      case 'legacy': return 'purple'
      case 'special': return 'indigo'
      case 'equipment': return 'gray'
      default: return 'blue'
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-indigo-600">Loading table...</span>
      </div>
    )
  }

  const colorClass = getItemTypeColor()

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">{getItemTypeIcon()}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{table.name}</h3>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          {getTableDescription()}
        </p>
        <div className="mt-2 text-xs text-gray-500">
          Roll {table.diceType} • Table {table.id} • {table.itemType}
          {table.valuationRequired && ' • Valuation Required'}
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

          {/* Item Details */}
          {result.entry?.effects && result.entry.effects.length > 0 && (
            <div className={`border-t border-${colorClass}-300 pt-3 mt-3`}>
              <h4 className={`font-medium text-${colorClass}-800 mb-2`}>Item Details:</h4>
              <div className="space-y-2">
                {result.entry.effects.map((effect, index) => {
                  if (effect.type === 'item' && effect.value) {
                    const item = effect.value
                    return (
                      <div key={index} className={`bg-white rounded-md p-3 border border-${colorClass}-200`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {item.type && (
                            <div>
                              <span className="font-medium">Type:</span> {item.type}
                            </div>
                          )}
                          {item.quality && (
                            <div>
                              <span className="font-medium">Quality:</span> {item.quality}
                            </div>
                          )}
                          {item.value && (
                            <div>
                              <span className="font-medium">Value:</span> {item.value}
                            </div>
                          )}
                          {item.rarity && (
                            <div>
                              <span className="font-medium">Rarity:</span> {item.rarity}
                            </div>
                          )}
                          {item.history && (
                            <div className="md:col-span-2">
                              <span className="font-medium">History:</span> {item.history}
                            </div>
                          )}
                          {item.properties && item.properties.length > 0 && (
                            <div className="md:col-span-2">
                              <span className="font-medium">Properties:</span> {item.properties.join(', ')}
                            </div>
                          )}
                          {item.significance && (
                            <div className="md:col-span-2">
                              <span className="font-medium">Significance:</span> {item.significance}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <div className={`text-xs text-${colorClass}-600`}>
              Item added to character possessions. Moving to next item...
            </div>
          </div>
        </div>
      )}

      {/* Sample Entries Display */}
      {!result && table.entries && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Sample Items (Roll {table.diceType}):</h4>
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
                ... and {table.entries.length - 5} more items
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}