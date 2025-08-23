// Special Items & Gifts Selection Component for PanCasting

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { SpecialTable } from './SpecialTable'
import { useGenerationHistory } from '../../../hooks/useGenerationHistory'

interface SpecialSelectorProps {
  onComplete?: () => void
}

export function SpecialSelector({ onComplete }: SpecialSelectorProps) {
  const [currentTableIndex, setCurrentTableIndex] = useState(0)
  const [completedTables, setCompletedTables] = useState<Set<string>>(new Set())
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [itemCount, setItemCount] = useState(2) // Default number of special items
  
  const { character } = useCharacterStore()
  const { nextStep } = useGenerationStore()
  const { saveToHistory } = useGenerationHistory()

  // Available special item tables
  const tables = [
    { id: '801', name: 'Gifts & Legacies', type: 'gift', description: 'Inherited items and precious gifts' },
    { id: '802', name: 'Special Items', type: 'special', description: 'Unique magical or unusual items' },
    { id: '803', name: 'Treasured Possessions', type: 'treasure', description: 'Personally meaningful objects' },
    { id: '804', name: 'Tools & Equipment', type: 'equipment', description: 'Professional tools and gear' }
  ]

  const availableTables = tables.filter(t => !completedTables.has(t.id))
  const currentTable = availableTables[currentTableIndex] || null

  // Check if character already has special items
  useEffect(() => {
    if (character?.gifts || character?.specialItems || character?.legacies) {
      const existingItems = [
        ...(character.gifts || []),
        ...(character.specialItems || []),
        ...(character.legacies || [])
      ]
      
      if (existingItems.length > 0) {
        setSelectedItems(existingItems)
        // Mark some tables as completed based on existing items
        const completed = new Set<string>()
        existingItems.forEach(item => {
          if (item.type === 'gift') completed.add('801')
          if (item.type === 'special') completed.add('802')
          if (item.type === 'treasure') completed.add('803')
          if (item.type === 'equipment') completed.add('804')
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
    const itemData = {
      id: `item_${Date.now()}`,
      tableId,
      type: currentTable.type,
      name: result.entry?.result || 'Unknown Item',
      description: result.entry?.description || '',
      quality: result.entry?.effects?.[0]?.value?.quality || 'Standard',
      value: result.entry?.effects?.[0]?.value?.value || 'Unknown',
      history: result.entry?.effects?.[0]?.value?.history || 'Acquired during generation',
      category: 'special',
      timestamp: Date.now()
    }
    
    setSelectedItems(prev => [...prev, itemData])

    // Save to history
    saveToHistory(
      'Special Item',
      `Added ${currentTable.name}: ${result.entry?.result || 'Unknown'}`,
      { tableId, itemType: currentTable.type }
    )

    // Check if we should continue or complete
    if (selectedItems.length + 1 >= itemCount || availableTables.length <= 1) {
      handleAllComplete()
    } else {
      // Move to next available table
      const nextIndex = (currentTableIndex + 1) % availableTables.length
      setCurrentTableIndex(nextIndex)
    }
  }

  const handleAllComplete = () => {
    saveToHistory(
      'Special Items Complete',
      `Generated ${selectedItems.length + 1} special items and possessions`,
      { itemCount: selectedItems.length + 1 }
    )

    setTimeout(() => {
      nextStep()
      if (onComplete) {
        onComplete()
      }
    }, 1000)
  }

  const handleSkipItem = () => {
    if (selectedItems.length > 0) {
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
    return Math.round((selectedItems.length / itemCount) * 100)
  }

  const canComplete = selectedItems.length >= 1

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'gift': return '🎁'
      case 'special': return '✨'
      case 'treasure': return '💎'
      case 'equipment': return '🛠️'
      default: return '📦'
    }
  }

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'gift': return 'pink'
      case 'special': return 'purple'
      case 'treasure': return 'yellow'
      case 'equipment': return 'gray'
      default: return 'indigo'
    }
  }

  const getValueColor = (value: string) => {
    switch (value?.toLowerCase()) {
      case 'high': return 'text-red-600'
      case 'moderate': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-indigo-100 border-2 border-indigo-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-indigo-800 mb-2">Special Items & Possessions</h2>
        <p className="text-indigo-700 mb-3">
          Discover unique items, gifts, legacies, and treasured possessions that define your character
        </p>
        
        {/* Item Count Selector */}
        <div className="flex items-center gap-4 mb-3">
          <label className="text-sm font-medium text-indigo-700">Number of items:</label>
          <select 
            value={itemCount}
            onChange={(e) => setItemCount(parseInt(e.target.value))}
            className="px-2 py-1 border border-indigo-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={1}>1 item</option>
            <option value={2}>2 items</option>
            <option value={3}>3 items</option>
            <option value={4}>4 items</option>
          </select>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-indigo-200 rounded-full h-3">
          <div 
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-indigo-700 mt-1">
          <span>Progress: {selectedItems.length} of {itemCount} items</span>
          <span>{getProgressPercentage()}%</span>
        </div>
      </div>

      {/* Item Type Selection */}
      {availableTables.length > 1 && (
        <div className="space-y-2">
          <h3 className="font-medium text-indigo-800">Choose Item Type:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableTables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleSelectTable(table.id)}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  currentTable?.id === table.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-indigo-300 bg-white hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getItemTypeIcon(table.type)}</span>
                  <div>
                    <div className="font-medium text-indigo-800">{table.name}</div>
                    <div className="text-indigo-600 text-sm">{table.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Table */}
      {currentTable && (
        <div className="bg-white rounded-lg border-2 border-indigo-600 overflow-hidden">
          <div className="bg-indigo-50 border-b border-indigo-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getItemTypeIcon(currentTable.type)}</span>
                <div>
                  <h3 className="text-xl font-bold text-indigo-800">
                    {currentTable.name}
                  </h3>
                  <p className="text-indigo-600 text-sm">
                    Item {selectedItems.length + 1} of {itemCount} • {currentTable.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkipItem}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                >
                  Skip Item
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
            <SpecialTable 
              tableId={currentTable.id}
              onComplete={handleTableComplete}
              key={`${currentTable.id}-${selectedItems.length}`}
            />
          </div>
        </div>
      )}

      {/* Selected Items Summary */}
      {selectedItems.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-amber-800 mb-3">
            Your Possessions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedItems.map((item, index) => {
              const table = tables.find(t => t.id === item.tableId)
              const typeColor = getItemTypeColor(item.type)
              return (
                <div key={index} className="bg-white p-3 rounded-md border border-amber-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getItemTypeIcon(item.type)}</span>
                      <div className="flex-1">
                        <div className="font-medium text-amber-800">
                          {item.name}
                        </div>
                        <div className={`text-${typeColor}-600 text-xs mb-1`}>
                          {table?.name}
                        </div>
                        {item.description && (
                          <div className="text-amber-700 text-sm">
                            {item.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          {item.quality && (
                            <span className="bg-gray-100 px-1 rounded">
                              {item.quality}
                            </span>
                          )}
                          {item.value && (
                            <span className={`${getValueColor(item.value)} font-medium`}>
                              {item.value} Value
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Completion Status */}
      {selectedItems.length >= itemCount && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🏆</div>
          <h4 className="text-lg font-semibold text-emerald-800 mb-2">
            Possessions Complete!
          </h4>
          <p className="text-emerald-700 text-sm">
            Your character now has {selectedItems.length} special items and possessions. 
            These unique objects reflect their history, achievements, and personal significance.
          </p>
        </div>
      )}
    </div>
  )
}