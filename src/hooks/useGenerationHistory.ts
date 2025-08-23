// Hook for managing generation history and undo/redo functionality

import { useState, useCallback, useRef, useEffect } from 'react'
import { Character } from '../types/character'
import { useCharacterStore } from '../stores/characterStore'
import { useGenerationStore } from '../stores/generationStore'

export interface HistoryEntry {
  id: string
  timestamp: number
  character: Character
  step: string
  action: string
  description: string
  metadata?: Record<string, any>
}

export interface UseGenerationHistoryOptions {
  maxHistorySize?: number
  enableKeyboardShortcuts?: boolean
  autoSave?: boolean
  debounceMs?: number
}

export interface UseGenerationHistoryReturn {
  // History state
  history: HistoryEntry[]
  currentIndex: number
  canUndo: boolean
  canRedo: boolean
  
  // Actions
  saveToHistory: (action: string, description: string, metadata?: Record<string, any>) => void
  undo: () => HistoryEntry | null
  redo: () => HistoryEntry | null
  jumpToEntry: (index: number) => HistoryEntry | null
  clearHistory: () => void
  
  // Utilities
  getHistoryEntry: (index: number) => HistoryEntry | null
  getCurrentEntry: () => HistoryEntry | null
  getHistorySize: () => number
}

export function useGenerationHistory(
  options: UseGenerationHistoryOptions = {}
): UseGenerationHistoryReturn {
  const {
    maxHistorySize = 50,
    enableKeyboardShortcuts = true,
    autoSave = false,
    debounceMs = 1000
  } = options

  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const { character, loadCharacter } = useCharacterStore()
  const { getCurrentStep } = useGenerationStore()
  
  const debounceTimer = useRef<number>()
  const lastCharacterRef = useRef<Character | null>(null)

  // Save current state to history
  const saveToHistory = useCallback((
    action: string, 
    description: string, 
    metadata?: Record<string, any>
  ) => {
    if (!character) return

    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      character: JSON.parse(JSON.stringify(character)), // Deep clone
      step: getCurrentStep()?.title || 'unknown',
      action,
      description,
      metadata
    }

    setHistory(prev => {
      // Remove any entries after current index (when undoing then making new changes)
      const newHistory = prev.slice(0, currentIndex + 1)
      
      // Add new entry
      newHistory.push(entry)
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift()
        setCurrentIndex(curr => Math.max(0, curr - 1))
        return newHistory
      }
      
      return newHistory
    })

    setCurrentIndex(prev => prev + 1)

    // Store in localStorage
    try {
      const historyToStore = history.slice(-10) // Keep last 10 entries in localStorage
      localStorage.setItem('pancasting-generation-history', JSON.stringify(historyToStore))
    } catch (error) {
      console.warn('Failed to save history to localStorage:', error)
    }
  }, [character, getCurrentStep, currentIndex, maxHistorySize, history])

  // Undo to previous state
  const undo = useCallback((): HistoryEntry | null => {
    if (currentIndex > 0) {
      const previousEntry = history[currentIndex - 1]
      loadCharacter(previousEntry.character)
      setCurrentIndex(prev => prev - 1)
      return previousEntry
    }
    return null
  }, [currentIndex, history, loadCharacter])

  // Redo to next state
  const redo = useCallback((): HistoryEntry | null => {
    if (currentIndex < history.length - 1) {
      const nextEntry = history[currentIndex + 1]
      loadCharacter(nextEntry.character)
      setCurrentIndex(prev => prev + 1)
      return nextEntry
    }
    return null
  }, [currentIndex, history, loadCharacter])

  // Jump to specific history entry
  const jumpToEntry = useCallback((index: number): HistoryEntry | null => {
    if (index >= 0 && index < history.length) {
      const entry = history[index]
      loadCharacter(entry.character)
      setCurrentIndex(index)
      return entry
    }
    return null
  }, [history, loadCharacter])

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
    localStorage.removeItem('pancasting-generation-history')
  }, [])

  // Get specific history entry
  const getHistoryEntry = useCallback((index: number): HistoryEntry | null => {
    return history[index] || null
  }, [history])

  // Get current history entry
  const getCurrentEntry = useCallback((): HistoryEntry | null => {
    return history[currentIndex] || null
  }, [history, currentIndex])

  // Get history size
  const getHistorySize = useCallback(() => {
    return history.length
  }, [history])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !character) return

    // Debounce auto-save
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      const currentCharacterStr = JSON.stringify(character)
      const lastCharacterStr = JSON.stringify(lastCharacterRef.current)
      
      if (currentCharacterStr !== lastCharacterStr) {
        saveToHistory('Auto Save', 'Automatic state save', { autoSave: true })
        lastCharacterRef.current = character
      }
    }, debounceMs)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [character, autoSave, debounceMs, saveToHistory])

  // Keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboardShortcuts) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undo()
      } else if (
        ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
      ) {
        event.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboardShortcuts, undo, redo])

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pancasting-generation-history')
      if (stored) {
        const parsedHistory = JSON.parse(stored) as HistoryEntry[]
        setHistory(parsedHistory)
        if (parsedHistory.length > 0) {
          setCurrentIndex(parsedHistory.length - 1)
        }
      }
    } catch (error) {
      console.warn('Failed to load history from localStorage:', error)
    }
  }, [])

  // Computed properties
  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return {
    // State
    history,
    currentIndex,
    canUndo,
    canRedo,
    
    // Actions
    saveToHistory,
    undo,
    redo,
    jumpToEntry,
    clearHistory,
    
    // Utilities
    getHistoryEntry,
    getCurrentEntry,
    getHistorySize
  }
}

// Hook for automatically saving to history when a value changes
export function useAutoSaveHistory(
  value: any,
  action: string,
  description: string,
  options: { enabled?: boolean; debounceMs?: number } = {}
) {
  const { enabled = true, debounceMs = 1000 } = options
  const { saveToHistory } = useGenerationHistory({ autoSave: false })
  const previousValue = useRef(value)
  const debounceTimer = useRef<number>()

  useEffect(() => {
    if (!enabled) return

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      const currentValueStr = JSON.stringify(value)
      const previousValueStr = JSON.stringify(previousValue.current)
      
      if (currentValueStr !== previousValueStr && previousValue.current !== undefined) {
        saveToHistory(action, description, { 
          autoSave: true,
          oldValue: previousValue.current,
          newValue: value
        })
      }
      
      previousValue.current = value
    }, debounceMs)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [value, action, description, enabled, debounceMs, saveToHistory])
}

// Hook for creating snapshots at specific points
export function useHistorySnapshot() {
  const { saveToHistory } = useGenerationHistory()
  
  const snapshot = useCallback((
    action: string, 
    description: string, 
    metadata?: Record<string, any>
  ) => {
    saveToHistory(action, description, metadata)
  }, [saveToHistory])

  return { snapshot }
}