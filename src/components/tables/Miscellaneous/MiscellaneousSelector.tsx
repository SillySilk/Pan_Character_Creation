// Miscellaneous Events Selection Component for PanCasting

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { MiscellaneousTable } from './MiscellaneousTable'
import { useGenerationHistory } from '../../../hooks/useGenerationHistory'

interface MiscellaneousSelectorProps {
  onComplete?: () => void
}

export function MiscellaneousSelector({ onComplete }: MiscellaneousSelectorProps) {
  const [currentTableIndex, setCurrentTableIndex] = useState(0)
  const [completedTables, setCompletedTables] = useState<Set<string>>(new Set())
  const [selectedEvents, setSelectedEvents] = useState<any[]>([])
  const [eventCount, setEventCount] = useState(2) // Default number of events
  
  const { character } = useCharacterStore()
  const { nextStep } = useGenerationStore()
  const { saveToHistory } = useGenerationHistory()

  // Available miscellaneous event tables
  const tables = [
    { id: '624', name: 'Tragedy', type: 'tragedy', description: 'Life-changing tragic events' },
    { id: '625', name: 'Good Fortune', type: 'fortune', description: 'Positive unexpected events' },
    { id: '626', name: 'Strange Encounter', type: 'encounter', description: 'Unusual meetings and discoveries' },
    { id: '627', name: 'Adventure Hook', type: 'adventure', description: 'Events that lead to adventures' }
  ]

  const availableTables = tables.filter(t => !completedTables.has(t.id))
  const currentTable = availableTables[currentTableIndex] || null

  // Check if character already has miscellaneous events
  useEffect(() => {
    if (character?.events) {
      const miscEvents = character.events.filter(e => e.category === 'miscellaneous')
      if (miscEvents.length > 0) {
        setSelectedEvents(miscEvents)
        // Mark some tables as completed based on existing events
        const completed = new Set<string>()
        miscEvents.forEach(event => {
          // Try to match events to table types
          if (event.type?.includes('tragedy')) completed.add('624')
          if (event.type?.includes('fortune')) completed.add('625')
          if (event.type?.includes('encounter')) completed.add('626')
          if (event.type?.includes('adventure')) completed.add('627')
        })
        setCompletedTables(completed)
      }
    }
  }, [character])

  const handleTableComplete = (result: any) => {
    if (!currentTable) return

    const tableId = currentTable.id
    const newCompleted = new Set(completedTables)
    newCompleted.add(tableId)
    setCompletedTables(newCompleted)

    // Store the result
    const eventData = {
      id: `misc_${Date.now()}`,
      tableId,
      type: currentTable.type,
      result: result.entry?.result || 'Unknown Event',
      description: result.entry?.description || '',
      category: 'miscellaneous',
      timestamp: Date.now()
    }
    
    setSelectedEvents(prev => [...prev, eventData])

    // Save to history
    saveToHistory(
      'Misc Event',
      `Added ${currentTable.name}: ${result.entry?.result || 'Unknown'}`,
      { tableId, eventType: currentTable.type }
    )

    // Check if we should continue or complete
    if (selectedEvents.length + 1 >= eventCount || availableTables.length <= 1) {
      handleAllComplete()
    } else {
      // Move to next available table
      const nextIndex = (currentTableIndex + 1) % availableTables.length
      setCurrentTableIndex(nextIndex)
    }
  }

  const handleAllComplete = () => {
    saveToHistory(
      'Misc Events Complete',
      `Generated ${selectedEvents.length + 1} miscellaneous events`,
      { eventCount: selectedEvents.length + 1 }
    )

    setTimeout(() => {
      nextStep()
      if (onComplete) {
        onComplete()
      }
    }, 1000)
  }

  const handleSkipEvent = () => {
    if (selectedEvents.length > 0) {
      handleAllComplete()
    } else {
      // Skip to next table
      if (availableTables.length > 1) {
        const nextIndex = (currentTableIndex + 1) % availableTables.length
        setCurrentTableIndex(nextIndex)
      } else {
        handleAllComplete()
      }
    }
  }

  const handleSelectTable = (tableId: string) => {
    const tableIndex = availableTables.findIndex(t => t.id === tableId)
    if (tableIndex !== -1) {
      setCurrentTableIndex(tableIndex)
    }
  }

  const getProgressPercentage = () => {
    return Math.round((selectedEvents.length / eventCount) * 100)
  }

  const canComplete = selectedEvents.length >= 1

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-orange-100 border-2 border-orange-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-orange-800 mb-2">Miscellaneous Events</h2>
        <p className="text-orange-700 mb-3">
          Generate special events, encounters, and unusual circumstances that shaped your character
        </p>
        
        {/* Event Count Selector */}
        <div className="flex items-center gap-4 mb-3">
          <label className="text-sm font-medium text-orange-700">Number of events:</label>
          <select 
            value={eventCount}
            onChange={(e) => setEventCount(parseInt(e.target.value))}
            className="px-2 py-1 border border-orange-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value={1}>1 event</option>
            <option value={2}>2 events</option>
            <option value={3}>3 events</option>
            <option value={4}>4 events</option>
          </select>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-orange-200 rounded-full h-3">
          <div 
            className="bg-orange-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-orange-700 mt-1">
          <span>Progress: {selectedEvents.length} of {eventCount} events</span>
          <span>{getProgressPercentage()}%</span>
        </div>
      </div>

      {/* Table Selection */}
      {availableTables.length > 1 && (
        <div className="space-y-2">
          <h3 className="font-medium text-orange-800">Choose Event Type:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableTables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleSelectTable(table.id)}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  currentTable?.id === table.id
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-orange-300 bg-white hover:bg-orange-50'
                }`}
              >
                <div className="font-medium text-orange-800">{table.name}</div>
                <div className="text-orange-600 text-sm">{table.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Table */}
      {currentTable && (
        <div className="bg-white rounded-lg border-2 border-orange-600 overflow-hidden">
          <div className="bg-orange-50 border-b border-orange-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-orange-800">
                  {currentTable.name}
                </h3>
                <p className="text-orange-600 text-sm">
                  Event {selectedEvents.length + 1} of {eventCount} • {currentTable.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkipEvent}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                >
                  Skip Event
                </button>
                
                {canComplete && (
                  <button
                    onClick={handleAllComplete}
                    className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <MiscellaneousTable 
              tableId={currentTable.id}
              onComplete={handleTableComplete}
              key={`${currentTable.id}-${selectedEvents.length}`}
            />
          </div>
        </div>
      )}

      {/* Selected Events Summary */}
      {selectedEvents.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">
            Generated Events
          </h4>
          <div className="space-y-3">
            {selectedEvents.map((event, index) => {
              const table = tables.find(t => t.id === event.tableId)
              return (
                <div key={index} className="bg-white p-3 rounded-md border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-blue-800">
                        {table?.name}: {event.result}
                      </div>
                      {event.description && (
                        <div className="text-blue-700 text-sm mt-1">
                          {event.description}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-blue-600 ml-2">
                      {table?.type}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Completion Status */}
      {selectedEvents.length >= eventCount && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🌟</div>
          <h4 className="text-lg font-semibold text-amber-800 mb-2">
            Miscellaneous Events Complete!
          </h4>
          <p className="text-amber-700 text-sm">
            Your character has experienced {selectedEvents.length} significant miscellaneous events. 
            These experiences have shaped their unique story and personality.
          </p>
        </div>
      )}
    </div>
  )
}