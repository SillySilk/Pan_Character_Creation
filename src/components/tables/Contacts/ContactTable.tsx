// Contact/Relationship Table Component for PanCasting

import { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableService } from '../../../services/tableService'
import { getGlobalTableEngine } from '../../../services/globalTableEngine'
import type { Table, Effect } from '../../../types/tables'
import type { NPC, Companion, Rival, Relationship } from '../../../types/character'

interface ContactTableProps {
  tableId: string
  onComplete?: (result: any) => void
}

export function ContactTable({ tableId, onComplete }: ContactTableProps) {
  const [table, setTable] = useState<Table | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [manualRoll, setManualRoll] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { character, addNPC, addCompanion, addRival, addRelationship } = useCharacterStore()
  const tableEngine = getGlobalTableEngine()

  // Load table data
  useEffect(() => {
    const loadTable = async () => {
      try {
        const tableData = await tableService.getTable(tableId)
        if (tableData) {
          setTable(tableData as Table)
          tableEngine.registerTable(tableData)
        } else {
          setError(`Table ${tableId} not found`)
        }
      } catch (err) {
        setError(`Failed to load table ${tableId}: ${err}`)
      }
    }

    loadTable()
  }, [tableId])

  const handleRoll = async (_rollValue?: number) => {
    if (!table || !character) return

    setIsRolling(true)
    setError(null)

    try {
      const rollResult = await tableEngine.processTable(table.id, character)
      setResult(rollResult)

      // Apply the result to character
      if (rollResult.entry?.effects) {
        for (const effect of rollResult.entry.effects) {
          if (effect.type === 'relationship') {
            const relationshipData = effect.value
            
            // Create relationship based on type
            switch (effect.target) {
              case 'companions':
                const companion: Companion = {
                  id: `comp_${Date.now()}`,
                  name: relationshipData.name || rollResult.entry.result,
                  type: 'Companion',
                  description: rollResult.entry.description || '',
                  loyalty: relationshipData.loyalty || 'Average'
                }
                addCompanion(companion)
                break

              case 'rivals':
                const rival: Rival = {
                  id: `rival_${Date.now()}`,
                  name: relationshipData.name || rollResult.entry.result,
                  type: 'Rival',
                  description: rollResult.entry.description || '',
                  conflictType: relationshipData.reason || 'Unknown conflict'
                }
                addRival(rival)
                break

              case 'npcs':
                const npc: NPC = {
                  id: `npc_${Date.now()}`,
                  name: relationshipData.name || rollResult.entry.result,
                  type: 'Other',
                  description: rollResult.entry.description || ''
                }
                addNPC(npc)
                break

              case 'relationships':
                const relationship: Relationship = {
                  id: `rel_${Date.now()}`,
                  person: {
                    id: `npc_${Date.now()}`,
                    name: relationshipData.name || rollResult.entry.result,
                    type: 'Contact',
                    description: rollResult.entry.description || ''
                  },
                  type: relationshipData.type || 'Professional',
                  name: relationshipData.name || rollResult.entry.result,
                  result: rollResult.entry.result
                }
                addRelationship(relationship)
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
      case '753':
        return 'Generate loyal companions and allies who support your character through adventures and challenges.'
      case '754':
        return 'Create rivals and enemies who oppose your character and provide ongoing conflict and drama.'
      case '755':
        return 'Establish family relationships and kinship ties that influence your character\'s background and motivations.'
      case '756':
        return 'Build professional contacts including mentors, colleagues, and business associates from your character\'s career.'
      default:
        return table?.instructions || 'Roll to determine relationship'
    }
  }

  const getRelationshipTypeIcon = () => {
    switch (table?.relationshipType) {
      case 'companion': return '🤝'
      case 'rival': return '⚔️'
      case 'family': return '👨‍👩‍👧‍👦'
      case 'contact': return '💼'
      case 'patron': return '👑'
      default: return '👤'
    }
  }

  const getRelationshipTypeColor = () => {
    switch (table?.relationshipType) {
      case 'companion': return 'green'
      case 'rival': return 'red'
      case 'family': return 'blue'
      case 'contact': return 'purple'
      case 'patron': return 'amber'
      default: return 'cyan'
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        <span className="ml-2 text-cyan-600">Loading table...</span>
      </div>
    )
  }

  const colorClass = getRelationshipTypeColor()

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">{getRelationshipTypeIcon()}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{table.name}</h3>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          {getTableDescription()}
        </p>
        <div className="mt-2 text-xs text-gray-500">
          Roll {table.diceType} • Table {table.id} • {table.relationshipType}
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
              🎯 Result
            </div>
            <div className={`text-lg font-semibold text-${colorClass}-700`}>
              {result.entry?.result}
            </div>
            {result.entry?.description && (
              <div className={`text-${colorClass}-600 text-sm mt-2 max-w-md mx-auto`}>
                {result.entry?.description}
              </div>
            )}
          </div>

          {/* Relationship Details */}
          {result.entry?.effects && result.entry.effects.length > 0 && (
            <div className={`border-t border-${colorClass}-300 pt-3 mt-3`}>
              <h4 className={`font-medium text-${colorClass}-800 mb-2`}>Relationship Details:</h4>
              <div className="space-y-2">
                {result.entry.effects.map((effect: Effect, index: number) => {
                  if (effect.type === 'relationship' && effect.value) {
                    const rel = effect.value
                    return (
                      <div key={index} className={`bg-white rounded-md p-3 border border-${colorClass}-200`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {rel.loyalty && (
                            <div>
                              <span className="font-medium">Loyalty:</span> {rel.loyalty}
                            </div>
                          )}
                          {rel.threat && (
                            <div>
                              <span className="font-medium">Threat Level:</span> {rel.threat}
                            </div>
                          )}
                          {rel.skills && rel.skills.length > 0 && (
                            <div className="md:col-span-2">
                              <span className="font-medium">Skills:</span> {rel.skills.join(', ')}
                            </div>
                          )}
                          {rel.relationship && (
                            <div>
                              <span className="font-medium">Relationship:</span> {rel.relationship}
                            </div>
                          )}
                          {rel.reason && (
                            <div>
                              <span className="font-medium">Conflict Reason:</span> {rel.reason}
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
              Contact added to character network. Moving to next contact...
            </div>
          </div>
        </div>
      )}

      {/* Sample Entries Display */}
      {!result && table.entries && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Sample Contacts (Roll {table.diceType}):</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {table.entries.slice(0, 5).map((entry) => (
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
                ... and {table.entries.length - 5} more contacts
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}