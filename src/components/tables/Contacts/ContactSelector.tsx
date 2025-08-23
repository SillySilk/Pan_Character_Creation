// Contacts & Relationships Selection Component for PanCasting

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { useGenerationStore } from '../../../stores/generationStore'
import { ContactTable } from './ContactTable'
import { useGenerationHistory } from '../../../hooks/useGenerationHistory'

interface ContactSelectorProps {
  onComplete?: () => void
}

export function ContactSelector({ onComplete }: ContactSelectorProps) {
  const [currentTableIndex, setCurrentTableIndex] = useState(0)
  const [completedTables, setCompletedTables] = useState<Set<string>>(new Set())
  const [selectedContacts, setSelectedContacts] = useState<any[]>([])
  const [contactCount, setContactCount] = useState(3) // Default number of contacts
  
  const { character } = useCharacterStore()
  const { nextStep } = useGenerationStore()
  const { saveToHistory } = useGenerationHistory()

  // Available contact/relationship tables
  const tables = [
    { id: '753', name: 'Companions & Allies', type: 'companion', description: 'Loyal friends and allies' },
    { id: '754', name: 'Rivals & Enemies', type: 'rival', description: 'Antagonists and competitors' },
    { id: '755', name: 'Family & Relations', type: 'family', description: 'Family members and relatives' },
    { id: '756', name: 'Professional Contacts', type: 'professional', description: 'Work associates and mentors' }
  ]

  const availableTables = tables.filter(t => !completedTables.has(t.id))
  const currentTable = availableTables[currentTableIndex] || null

  // Check if character already has contacts
  useEffect(() => {
    if (character?.npcs || character?.companions || character?.rivals) {
      const existingContacts = [
        ...(character.npcs || []),
        ...(character.companions || []),
        ...(character.rivals || [])
      ]
      
      if (existingContacts.length > 0) {
        setSelectedContacts(existingContacts)
        // Mark some tables as completed based on existing contacts
        const completed = new Set<string>()
        existingContacts.forEach(contact => {
          if (contact.type === 'companion') completed.add('753')
          if (contact.type === 'rival') completed.add('754')
          if (contact.type === 'family') completed.add('755')
          if (contact.type === 'professional') completed.add('756')
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
    const contactData = {
      id: `contact_${Date.now()}`,
      tableId,
      type: currentTable.type,
      name: result.entry?.result || 'Unknown Contact',
      description: result.entry?.description || '',
      relationship: currentTable.type,
      loyalty: result.entry?.effects?.[0]?.value?.loyalty || 'Unknown',
      skills: result.entry?.effects?.[0]?.value?.skills || [],
      category: 'contact',
      timestamp: Date.now()
    }
    
    setSelectedContacts(prev => [...prev, contactData])

    // Save to history
    saveToHistory(
      'Contact Added',
      `Added ${currentTable.name}: ${result.entry?.result || 'Unknown'}`,
      { tableId, contactType: currentTable.type }
    )

    // Check if we should continue or complete
    if (selectedContacts.length + 1 >= contactCount || availableTables.length <= 1) {
      handleAllComplete()
    } else {
      // Move to next available table
      const nextIndex = (currentTableIndex + 1) % availableTables.length
      setCurrentTableIndex(nextIndex)
    }
  }

  const handleAllComplete = () => {
    saveToHistory(
      'Contacts Complete',
      `Generated ${selectedContacts.length + 1} contacts and relationships`,
      { contactCount: selectedContacts.length + 1 }
    )

    setTimeout(() => {
      nextStep()
      if (onComplete) {
        onComplete()
      }
    }, 1000)
  }

  const handleSkipContact = () => {
    if (selectedContacts.length > 0) {
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
    return Math.round((selectedContacts.length / contactCount) * 100)
  }

  const canComplete = selectedContacts.length >= 1

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'companion': return '🤝'
      case 'rival': return '⚔️'
      case 'family': return '👨‍👩‍👧‍👦'
      case 'professional': return '💼'
      default: return '👤'
    }
  }

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'companion': return 'green'
      case 'rival': return 'red'
      case 'family': return 'blue'
      case 'professional': return 'purple'
      default: return 'gray'
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-cyan-100 border-2 border-cyan-600 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-cyan-800 mb-2">Contacts & Relationships</h2>
        <p className="text-cyan-700 mb-3">
          Build your character's network of allies, rivals, family, and professional contacts
        </p>
        
        {/* Contact Count Selector */}
        <div className="flex items-center gap-4 mb-3">
          <label className="text-sm font-medium text-cyan-700">Number of contacts:</label>
          <select 
            value={contactCount}
            onChange={(e) => setContactCount(parseInt(e.target.value))}
            className="px-2 py-1 border border-cyan-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value={2}>2 contacts</option>
            <option value={3}>3 contacts</option>
            <option value={4}>4 contacts</option>
            <option value={5}>5 contacts</option>
          </select>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-cyan-200 rounded-full h-3">
          <div 
            className="bg-cyan-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-cyan-700 mt-1">
          <span>Progress: {selectedContacts.length} of {contactCount} contacts</span>
          <span>{getProgressPercentage()}%</span>
        </div>
      </div>

      {/* Contact Type Selection */}
      {availableTables.length > 1 && (
        <div className="space-y-2">
          <h3 className="font-medium text-cyan-800">Choose Contact Type:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableTables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleSelectTable(table.id)}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  currentTable?.id === table.id
                    ? 'border-cyan-600 bg-cyan-50'
                    : 'border-cyan-300 bg-white hover:bg-cyan-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getContactTypeIcon(table.type)}</span>
                  <div>
                    <div className="font-medium text-cyan-800">{table.name}</div>
                    <div className="text-cyan-600 text-sm">{table.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Table */}
      {currentTable && (
        <div className="bg-white rounded-lg border-2 border-cyan-600 overflow-hidden">
          <div className="bg-cyan-50 border-b border-cyan-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getContactTypeIcon(currentTable.type)}</span>
                <div>
                  <h3 className="text-xl font-bold text-cyan-800">
                    {currentTable.name}
                  </h3>
                  <p className="text-cyan-600 text-sm">
                    Contact {selectedContacts.length + 1} of {contactCount} • {currentTable.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkipContact}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                >
                  Skip Contact
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
            <ContactTable 
              tableId={currentTable.id}
              onComplete={handleTableComplete}
              key={`${currentTable.id}-${selectedContacts.length}`}
            />
          </div>
        </div>
      )}

      {/* Selected Contacts Summary */}
      {selectedContacts.length > 0 && (
        <div className="bg-indigo-50 border-2 border-indigo-500 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-indigo-800 mb-3">
            Your Network
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedContacts.map((contact, index) => {
              const table = tables.find(t => t.id === contact.tableId)
              const typeColor = getContactTypeColor(contact.type)
              return (
                <div key={index} className="bg-white p-3 rounded-md border border-indigo-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getContactTypeIcon(contact.type)}</span>
                      <div className="flex-1">
                        <div className="font-medium text-indigo-800">
                          {contact.name}
                        </div>
                        <div className={`text-${typeColor}-600 text-xs mb-1`}>
                          {table?.name}
                        </div>
                        {contact.description && (
                          <div className="text-indigo-700 text-sm">
                            {contact.description}
                          </div>
                        )}
                        {contact.loyalty && (
                          <div className="text-indigo-600 text-xs mt-1">
                            Loyalty: {contact.loyalty}
                          </div>
                        )}
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
      {selectedContacts.length >= contactCount && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">👥</div>
          <h4 className="text-lg font-semibold text-amber-800 mb-2">
            Network Complete!
          </h4>
          <p className="text-amber-700 text-sm">
            Your character has established {selectedContacts.length} important relationships. 
            These connections will shape their adventures and provide both allies and challenges.
          </p>
        </div>
      )}
    </div>
  )
}