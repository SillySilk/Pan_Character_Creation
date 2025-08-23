// Character List Component for PanCasting

import React, { useState, useEffect } from 'react'
import { Character } from '../../types/character'
import { useCharacterStore } from '../../stores/characterStore'
import { CharacterCard } from './CharacterCard'

interface CharacterListProps {
  onCharacterSelect?: (character: Character) => void
  selectedCharacterId?: string
  showCreateButton?: boolean
  onCreateNew?: () => void
  className?: string
}

export function CharacterList({
  onCharacterSelect,
  selectedCharacterId,
  showCreateButton = true,
  onCreateNew,
  className = ''
}: CharacterListProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'completion'>('modified')
  const [filterBy, setFilterBy] = useState<'all' | 'complete' | 'incomplete'>('all')
  const { character: currentCharacter, loadCharacter, deleteCharacter } = useCharacterStore()

  useEffect(() => {
    loadStoredCharacters()
  }, [])

  const loadStoredCharacters = () => {
    try {
      const stored = localStorage.getItem('pancasting-characters')
      if (stored) {
        const parsedCharacters = JSON.parse(stored) as Character[]
        setCharacters(parsedCharacters)
      }
    } catch (error) {
      console.error('Failed to load characters:', error)
    }
  }

  const handleCharacterDelete = (character: Character) => {
    try {
      const updatedCharacters = characters.filter(c => c.id !== character.id)
      setCharacters(updatedCharacters)
      localStorage.setItem('pancasting-characters', JSON.stringify(updatedCharacters))
      
      // If we're deleting the currently selected character, clear it
      if (currentCharacter?.id === character.id) {
        deleteCharacter()
      }
    } catch (error) {
      console.error('Failed to delete character:', error)
    }
  }

  const handleCharacterSelect = (character: Character) => {
    loadCharacter(character)
    if (onCharacterSelect) {
      onCharacterSelect(character)
    }
  }

  const getCompletionPercentage = (character: Character) => {
    let completed = 0
    const total = 8
    
    if (character.race) completed++
    if (character.youthEvents && character.youthEvents.length > 0) completed++
    if (character.occupations && character.occupations.length > 0) completed++
    if (character.adulthoodEvents && character.adulthoodEvents.length > 0) completed++
    if (character.personalityTraits && character.personalityTraits.length > 0) completed++
    if (character.relationships && character.relationships.length > 0) completed++
    if (character.specialItems && character.specialItems.length > 0) completed++
    if (character.attributes && Object.keys(character.attributes).length > 0) completed++
    
    return Math.round((completed / total) * 100)
  }

  const getSortedAndFilteredCharacters = () => {
    let filtered = [...characters]

    // Apply filter
    switch (filterBy) {
      case 'complete':
        filtered = filtered.filter(char => getCompletionPercentage(char) >= 80)
        break
      case 'incomplete':
        filtered = filtered.filter(char => getCompletionPercentage(char) < 80)
        break
      // 'all' case - no filtering needed
    }

    // Apply sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => {
          const nameA = a.name || 'Unnamed'
          const nameB = b.name || 'Unnamed'
          return nameA.localeCompare(nameB)
        })
        break
      case 'completion':
        filtered.sort((a, b) => getCompletionPercentage(b) - getCompletionPercentage(a))
        break
      case 'modified':
      default:
        filtered.sort((a, b) => {
          const timeA = a.lastModified ? new Date(a.lastModified).getTime() : 0
          const timeB = b.lastModified ? new Date(b.lastModified).getTime() : 0
          return timeB - timeA // Most recent first
        })
        break
    }

    return filtered
  }

  const sortedCharacters = getSortedAndFilteredCharacters()

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-amber-800">Character Library</h2>
          <p className="text-sm text-parchment-700">
            {characters.length} character{characters.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        {showCreateButton && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New
          </button>
        )}
      </div>

      {/* Filters and Sorting */}
      {characters.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="modified">Last Modified</option>
                <option value="name">Name</option>
                <option value="completion">Completion</option>
              </select>
            </div>

            {/* Filter Options */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Characters</option>
                <option value="complete">Complete (80%+)</option>
                <option value="incomplete">In Progress</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 ml-auto">
              Showing {sortedCharacters.length} of {characters.length} characters
            </div>
          </div>
        </div>
      )}

      {/* Character Grid */}
      {sortedCharacters.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedCharacters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={handleCharacterSelect}
              onDelete={handleCharacterDelete}
              isSelected={character.id === selectedCharacterId || character.id === currentCharacter?.id}
            />
          ))}
        </div>
      ) : characters.length > 0 ? (
        // No characters match current filter
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-lg font-medium">No matching characters</p>
            <p className="text-sm">Try adjusting your filters to see more results</p>
          </div>
        </div>
      ) : (
        // No characters at all
        <div className="bg-parchment-50 border-2 border-dashed border-amber-300 rounded-lg p-8 text-center">
          <div className="text-parchment-600">
            <div className="text-6xl mb-4">🎭</div>
            <p className="text-xl font-medium text-amber-800 mb-2">No Characters Yet</p>
            <p className="text-parchment-700 mb-4">
              Start your adventure by generating your first character. Each character 
              tells a unique story through the tables of Central Casting.
            </p>
            {showCreateButton && onCreateNew && (
              <button
                onClick={onCreateNew}
                className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Create Your First Character
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {characters.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Library Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {characters.filter(c => getCompletionPercentage(c) >= 80).length}
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {characters.filter(c => getCompletionPercentage(c) >= 40 && getCompletionPercentage(c) < 80).length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {characters.filter(c => getCompletionPercentage(c) < 40).length}
              </div>
              <div className="text-sm text-gray-600">Early Stage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(characters.reduce((sum, c) => sum + getCompletionPercentage(c), 0) / characters.length)}%
              </div>
              <div className="text-sm text-gray-600">Average</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}