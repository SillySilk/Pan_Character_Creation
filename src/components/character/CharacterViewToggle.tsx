// Character View Toggle Component
// Allows switching between narrative and D&D 3.5 views

import React from 'react'
import type { Character } from '../../types/character'

export interface CharacterViewToggleProps {
  currentView: 'narrative' | 'dnd'
  onViewChange: (view: 'narrative' | 'dnd') => void
  character: Character
  showDNDAvailable?: boolean
  className?: string
}

export function CharacterViewToggle({
  currentView,
  onViewChange,
  character,
  showDNDAvailable = true,
  className = ''
}: CharacterViewToggleProps) {
  const hasAbilityScores = character?.strength && character?.dexterity &&
                          character?.constitution && character?.intelligence &&
                          character?.wisdom && character?.charisma

  const canShowDND = showDNDAvailable && (hasAbilityScores || character?.skills?.length > 0)

  if (!canShowDND) {
    return null // Don't show toggle if D&D view isn't available
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-1">
          {/* Narrative View Button */}
          <button
            onClick={() => onViewChange('narrative')}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${currentView === 'narrative'
                ? 'bg-white text-amber-800 shadow-sm border border-amber-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }
            `}
            aria-pressed={currentView === 'narrative'}
            aria-label="Switch to narrative character view"
          >
            <span className="text-lg">📜</span>
            <span>Narrative</span>
          </button>

          {/* D&D View Button */}
          <button
            onClick={() => onViewChange('dnd')}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 relative
              ${currentView === 'dnd'
                ? 'bg-white text-red-800 shadow-sm border border-red-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }
            `}
            aria-pressed={currentView === 'dnd'}
            aria-label="Switch to D&D 3.5 character sheet view"
          >
            <span className="text-lg">🎲</span>
            <span>D&D 3.5</span>

            {/* New Feature Badge */}
            {currentView !== 'dnd' && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                New
              </span>
            )}
          </button>
        </div>
      </div>

      {/* View Description */}
      <div className="ml-3 text-sm text-gray-600 hidden md:block">
        {currentView === 'narrative' ? (
          <span>Story-focused character view</span>
        ) : (
          <span>Game-ready D&D character sheet</span>
        )}
      </div>
    </div>
  )
}

// Enhanced version with conversion status
export interface CharacterViewToggleWithStatusProps extends CharacterViewToggleProps {
  conversionStatus?: 'ready' | 'converting' | 'error'
  conversionMessage?: string
}

export function CharacterViewToggleWithStatus({
  conversionStatus,
  conversionMessage,
  ...props
}: CharacterViewToggleWithStatusProps) {
  return (
    <div className="space-y-2">
      <CharacterViewToggle {...props} />

      {/* Conversion Status */}
      {conversionStatus && conversionStatus !== 'ready' && (
        <div className="flex items-center justify-center">
          <div className={`
            text-xs px-3 py-1 rounded-full flex items-center gap-2
            ${conversionStatus === 'converting'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-red-100 text-red-700'
            }
          `}>
            {conversionStatus === 'converting' ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Converting to D&D format...</span>
              </>
            ) : (
              <>
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{conversionMessage || 'Conversion failed'}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for mobile/smaller spaces
export interface CompactCharacterViewToggleProps {
  currentView: 'narrative' | 'dnd'
  onViewChange: (view: 'narrative' | 'dnd') => void
  character: Character
  showLabels?: boolean
}

export function CompactCharacterViewToggle({
  currentView,
  onViewChange,
  character,
  showLabels = false
}: CompactCharacterViewToggleProps) {
  const hasAbilityScores = character?.strength && character?.dexterity &&
                          character?.constitution && character?.intelligence &&
                          character?.wisdom && character?.charisma

  const canShowDND = hasAbilityScores || character?.skills?.length > 0

  if (!canShowDND) {
    return null
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
      <button
        onClick={() => onViewChange('narrative')}
        className={`
          p-2 rounded-md transition-all duration-200 flex items-center gap-1
          ${currentView === 'narrative'
            ? 'bg-white text-amber-800 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
          }
        `}
        aria-label="Narrative view"
        title="Narrative character view"
      >
        <span className="text-lg">📜</span>
        {showLabels && <span className="text-xs">Story</span>}
      </button>

      <button
        onClick={() => onViewChange('dnd')}
        className={`
          p-2 rounded-md transition-all duration-200 flex items-center gap-1 relative
          ${currentView === 'dnd'
            ? 'bg-white text-red-800 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
          }
        `}
        aria-label="D&D 3.5 view"
        title="D&D 3.5 character sheet"
      >
        <span className="text-lg">🎲</span>
        {showLabels && <span className="text-xs">D&D</span>}

        {currentView !== 'dnd' && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-2 h-2 rounded-full"></span>
        )}
      </button>
    </div>
  )
}

// Hook for managing view state with persistence
export function useCharacterViewState(characterId: string) {
  const [currentView, setCurrentView] = React.useState<'narrative' | 'dnd'>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem(`character-view-${characterId}`)
    return (saved as 'narrative' | 'dnd') || 'narrative'
  })

  const handleViewChange = React.useCallback((view: 'narrative' | 'dnd') => {
    setCurrentView(view)
    // Persist to localStorage
    localStorage.setItem(`character-view-${characterId}`, view)
  }, [characterId])

  return {
    currentView,
    handleViewChange
  }
}

// Animated transition wrapper
export interface AnimatedViewToggleProps extends CharacterViewToggleProps {
  animationDuration?: number
}

export function AnimatedViewToggle({
  animationDuration = 200,
  ...props
}: AnimatedViewToggleProps) {
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const handleViewChange = React.useCallback((view: 'narrative' | 'dnd') => {
    if (view === props.currentView) return

    setIsTransitioning(true)

    // Small delay to show transition state
    setTimeout(() => {
      props.onViewChange(view)
      setTimeout(() => {
        setIsTransitioning(false)
      }, animationDuration / 2)
    }, animationDuration / 2)
  }, [props.currentView, props.onViewChange, animationDuration])

  return (
    <div className={`transition-opacity duration-${animationDuration} ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
      <CharacterViewToggle
        {...props}
        onViewChange={handleViewChange}
      />
    </div>
  )
}