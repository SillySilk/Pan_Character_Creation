// Hook for managing D&D character view state and conversion

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Character } from '../types/character'
import type { DDCharacterSheet } from '../types/dnd'
import { dndMappingService } from '../services/dndMappingService'

export interface UseCharacterDNDViewOptions {
  character: Character | null
  autoConvert?: boolean
  persistViewState?: boolean
  onConversionError?: (error: Error) => void
}

export interface UseCharacterDNDViewReturn {
  // View state
  currentView: 'narrative' | 'dnd'
  setCurrentView: (view: 'narrative' | 'dnd') => void

  // D&D conversion state
  dndCharacter: DDCharacterSheet | null
  isConverting: boolean
  conversionError: string | null

  // Conversion methods
  convertToDND: () => Promise<void>
  refreshDNDData: () => Promise<void>

  // Utility methods
  canShowDNDView: boolean
  hasUnsavedChanges: boolean

  // Status information
  conversionStatus: 'ready' | 'converting' | 'error' | 'unavailable'
  statusMessage: string
}

export function useCharacterDNDView({
  character,
  autoConvert = false,
  persistViewState = true,
  onConversionError
}: UseCharacterDNDViewOptions): UseCharacterDNDViewReturn {
  // View state
  const [currentView, setCurrentViewState] = useState<'narrative' | 'dnd'>(() => {
    if (!persistViewState || !character?.id) return 'narrative'

    const saved = localStorage.getItem(`character-view-${character.id}`)
    return (saved as 'narrative' | 'dnd') || 'narrative'
  })

  // D&D conversion state
  const [dndCharacter, setDndCharacter] = useState<DDCharacterSheet | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionError, setConversionError] = useState<string | null>(null)
  const [lastConvertedCharacterId, setLastConvertedCharacterId] = useState<string | null>(null)
  const [lastConvertedTimestamp, setLastConvertedTimestamp] = useState<number>(0)

  // Check if character can show D&D view
  const canShowDNDView = useMemo(() => {
    if (!character) return false

    // Has ability scores
    const hasAbilityScores = character.strength && character.dexterity &&
                            character.constitution && character.intelligence &&
                            character.wisdom && character.charisma

    // Has skills or other convertible data
    const hasConvertibleData = character.skills && character.skills.length > 0

    return hasAbilityScores || hasConvertibleData
  }, [character])

  // Check if there are unsaved changes that need re-conversion
  const hasUnsavedChanges = useMemo(() => {
    if (!character || !dndCharacter) return false

    const characterTimestamp = character.lastModified?.getTime() || 0
    return characterTimestamp > lastConvertedTimestamp
  }, [character, dndCharacter, lastConvertedTimestamp])

  // Conversion status
  const conversionStatus = useMemo(() => {
    if (!canShowDNDView) return 'unavailable'
    if (isConverting) return 'converting'
    if (conversionError) return 'error'
    return 'ready'
  }, [canShowDNDView, isConverting, conversionError])

  // Status message
  const statusMessage = useMemo(() => {
    switch (conversionStatus) {
      case 'unavailable':
        return 'D&D view requires ability scores or skills'
      case 'converting':
        return 'Converting character to D&D format...'
      case 'error':
        return conversionError || 'Conversion failed'
      case 'ready':
        if (hasUnsavedChanges) {
          return 'Character data has changed - conversion needs refresh'
        }
        return dndCharacter ? 'D&D character sheet ready' : 'Ready to convert'
    }
  }, [conversionStatus, conversionError, hasUnsavedChanges, dndCharacter])

  // Set current view with persistence
  const setCurrentView = useCallback((view: 'narrative' | 'dnd') => {
    setCurrentViewState(view)

    if (persistViewState && character?.id) {
      localStorage.setItem(`character-view-${character.id}`, view)
    }
  }, [persistViewState, character?.id])

  // Convert character to D&D format
  const convertToDND = useCallback(async () => {
    if (!character || !canShowDNDView) {
      setConversionError('Cannot convert character - missing required data')
      return
    }

    setIsConverting(true)
    setConversionError(null)

    try {
      // Simulate async operation (conversion is actually synchronous)
      await new Promise(resolve => setTimeout(resolve, 100))

      const converted = dndMappingService.convertToDNDCharacter(character)

      setDndCharacter(converted)
      setLastConvertedCharacterId(character.id)
      setLastConvertedTimestamp(Date.now())

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown conversion error'
      setConversionError(errorMessage)
      onConversionError?.(error instanceof Error ? error : new Error(errorMessage))
    } finally {
      setIsConverting(false)
    }
  }, [character, canShowDNDView, onConversionError])

  // Refresh D&D data (force re-conversion)
  const refreshDNDData = useCallback(async () => {
    setDndCharacter(null)
    setLastConvertedTimestamp(0)
    await convertToDND()
  }, [convertToDND])

  // Auto-convert when character changes or when switching to D&D view
  useEffect(() => {
    if (!character || !canShowDNDView) {
      setDndCharacter(null)
      setLastConvertedCharacterId(null)
      setLastConvertedTimestamp(0)
      return
    }

    // Character changed - clear old D&D data
    if (character.id !== lastConvertedCharacterId) {
      setDndCharacter(null)
      setLastConvertedTimestamp(0)
    }

    // Auto-convert if enabled and switching to D&D view
    if (autoConvert && currentView === 'dnd' && !dndCharacter && !isConverting) {
      convertToDND()
    }
  }, [character, canShowDNDView, currentView, dndCharacter, isConverting, lastConvertedCharacterId, autoConvert, convertToDND])

  // Switch back to narrative view if D&D view becomes unavailable
  useEffect(() => {
    if (currentView === 'dnd' && !canShowDNDView) {
      setCurrentView('narrative')
    }
  }, [currentView, canShowDNDView, setCurrentView])

  // Clear conversion error when character changes
  useEffect(() => {
    if (character?.id !== lastConvertedCharacterId) {
      setConversionError(null)
    }
  }, [character?.id, lastConvertedCharacterId])

  return {
    // View state
    currentView,
    setCurrentView,

    // D&D conversion state
    dndCharacter,
    isConverting,
    conversionError,

    // Conversion methods
    convertToDND,
    refreshDNDData,

    // Utility methods
    canShowDNDView,
    hasUnsavedChanges,

    // Status information
    conversionStatus,
    statusMessage
  }
}

// Simplified hook for basic view toggling
export function useCharacterViewToggle(characterId: string) {
  const [currentView, setCurrentView] = useState<'narrative' | 'dnd'>(() => {
    const saved = localStorage.getItem(`character-view-${characterId}`)
    return (saved as 'narrative' | 'dnd') || 'narrative'
  })

  const handleViewChange = useCallback((view: 'narrative' | 'dnd') => {
    setCurrentView(view)
    localStorage.setItem(`character-view-${characterId}`, view)
  }, [characterId])

  return {
    currentView,
    handleViewChange
  }
}

// Hook for managing conversion state across multiple characters
export function useCharacterDNDCache() {
  const [cache, setCache] = useState<Map<string, DDCharacterSheet>>(new Map())
  const [converting, setConverting] = useState<Set<string>>(new Set())

  const getCachedDNDCharacter = useCallback((characterId: string): DDCharacterSheet | null => {
    return cache.get(characterId) || null
  }, [cache])

  const isCharacterConverting = useCallback((characterId: string): boolean => {
    return converting.has(characterId)
  }, [converting])

  const convertAndCache = useCallback(async (character: Character): Promise<DDCharacterSheet> => {
    const characterId = character.id

    // Check cache first
    const cached = cache.get(characterId)
    if (cached) {
      return cached
    }

    // Mark as converting
    setConverting(prev => new Set(prev).add(characterId))

    try {
      // Convert character
      const converted = dndMappingService.convertToDNDCharacter(character)

      // Cache result
      setCache(prev => new Map(prev).set(characterId, converted))

      return converted
    } finally {
      // Remove from converting set
      setConverting(prev => {
        const newSet = new Set(prev)
        newSet.delete(characterId)
        return newSet
      })
    }
  }, [cache])

  const clearCache = useCallback((characterId?: string) => {
    if (characterId) {
      setCache(prev => {
        const newMap = new Map(prev)
        newMap.delete(characterId)
        return newMap
      })
    } else {
      setCache(new Map())
    }
  }, [])

  const refreshCache = useCallback(async (character: Character): Promise<DDCharacterSheet> => {
    clearCache(character.id)
    return convertAndCache(character)
  }, [clearCache, convertAndCache])

  return {
    getCachedDNDCharacter,
    isCharacterConverting,
    convertAndCache,
    clearCache,
    refreshCache,
    cacheSize: cache.size
  }
}