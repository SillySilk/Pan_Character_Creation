// Undo/Redo Manager for PanCasting Generation Wizard

import React, { useEffect, useCallback, useState } from 'react'
import { Character } from '../../types/character'
import { useCharacterStore } from '../../stores/characterStore'
import { useGenerationStore } from '../../stores/generationStore'
import { useGenerationHistory } from '../../hooks/useGenerationHistory'

interface HistoryEntry {
  id: string
  timestamp: number
  character: Character
  step: string
  action: string
  description: string
}

interface UndoRedoManagerProps {
  maxHistorySize?: number
  onUndo?: (entry: HistoryEntry) => void
  onRedo?: (entry: HistoryEntry) => void
  className?: string
}

export function UndoRedoManager({ 
  maxHistorySize = 50,
  onUndo,
  onRedo,
  className = ''
}: UndoRedoManagerProps) {
  const [showHistory, setShowHistory] = useState(false)
  
  const {
    history,
    currentIndex,
    canUndo,
    canRedo,
    undo,
    redo,
    clearHistory,
    jumpToEntry
  } = useGenerationHistory({ maxHistorySize })

  // Undo to previous state
  const handleUndo = useCallback(() => {
    const previousEntry = undo()
    if (previousEntry && onUndo) {
      onUndo(previousEntry)
    }
  }, [undo, onUndo])

  // Redo to next state
  const handleRedo = useCallback(() => {
    const nextEntry = redo()
    if (nextEntry && onRedo) {
      onRedo(nextEntry)
    }
  }, [redo, onRedo])

  // Jump to specific history entry
  const handleJumpToEntry = (index: number) => {
    jumpToEntry(index)
    setShowHistory(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        handleUndo()
      } else if (
        ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
      ) {
        event.preventDefault()
        handleRedo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  return (
    <div className={`relative ${className}`}>
      {/* Main Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors relative"
          title="Show History"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {history.length}
            </span>
          )}
        </button>
        
        {history.length > 0 && (
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {history.length}
          </span>
        )}
      </div>

      {/* History Dropdown */}
      {showHistory && (
        <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Generation History</h3>
            <p className="text-sm text-gray-600">
              Click any entry to restore that state
            </p>
          </div>
          
          <div className="p-2">
            {history.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-sm">No history yet</p>
                <p className="text-xs">Actions will appear here</p>
              </div>
            ) : (
              <div className="space-y-1">
                {history.map((entry, index) => (
                  <button
                    key={entry.id}
                    onClick={() => handleJumpToEntry(index)}
                    className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                      index === currentIndex
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : index < currentIndex
                        ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{entry.action}</div>
                        <div className="text-xs opacity-75">{entry.description}</div>
                        <div className="text-xs opacity-50">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {index === currentIndex && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        {index < currentIndex && (
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {history.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>Use Ctrl+Z/Ctrl+Y for quick undo/redo</span>
                <button
                  onClick={() => {
                    clearHistory()
                    setShowHistory(false)
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear History
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showHistory && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowHistory(false)}
        />
      )}
    </div>
  )
}

// Legacy hook - use useGenerationHistory instead
export function useUndoRedo(maxHistorySize = 50) {
  return useGenerationHistory({ maxHistorySize })
}

// Snapshot Component for automatic state saving
interface UndoRedoSnapshotProps {
  action: string
  description: string
  trigger: any // Any value that when changed, triggers a snapshot
  children?: React.ReactNode
}

export function UndoRedoSnapshot({ action, description, trigger, children }: UndoRedoSnapshotProps) {
  const { saveToHistory } = useUndoRedo()
  const prevTrigger = React.useRef(trigger)

  useEffect(() => {
    if (prevTrigger.current !== trigger && prevTrigger.current !== undefined) {
      saveToHistory(action, description)
    }
    prevTrigger.current = trigger
  }, [trigger, action, description, saveToHistory])

  return <>{children}</>
}