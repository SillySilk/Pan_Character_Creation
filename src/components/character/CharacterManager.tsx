// Character Management Interface for PanCasting

import { useState } from 'react'
import { Character } from '../../types/character'
import { useCharacterStore } from '../../stores/characterStore'
import { CharacterList } from './CharacterList'
import { CharacterSheet } from './CharacterSheet'
import { CharacterSummary } from './CharacterSummary'
import { CharacterEditor } from './CharacterEditor'
import { DNDIntegrationWidget } from '../dnd/DNDIntegrationWidget'

interface CharacterManagerProps {
  onStartGeneration?: () => void
  className?: string
}

export function CharacterManager({ onStartGeneration, className = '' }: CharacterManagerProps) {
  const [view, setView] = useState<'library' | 'sheet' | 'summary' | 'editor' | 'dnd'>('library')
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const { character: currentCharacter, createNewCharacter } = useCharacterStore()

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character)
    setView('sheet')
  }

  const handleCreateNew = () => {
    createNewCharacter()
    if (onStartGeneration) {
      onStartGeneration()
    }
  }

  const handleBackToLibrary = () => {
    setView('library')
    setSelectedCharacter(null)
  }

  const viewCharacter = selectedCharacter || currentCharacter

  return (
    <div className={`min-h-screen bg-parchment-100 ${className}`}>
      {/* Navigation Header */}
      <div className="bg-white border-b-2 border-amber-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Navigation Breadcrumb */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('library')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'library' 
                    ? 'bg-amber-600 text-white' 
                    : 'text-amber-600 hover:bg-amber-50'
                }`}
              >
                📚 Character Library
              </button>
              
              {viewCharacter && view !== 'library' && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 text-sm">
                    {viewCharacter.name || 'Unnamed Character'}
                  </span>
                </>
              )}
            </div>

            {/* View Controls */}
            {viewCharacter && view !== 'library' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('summary')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'summary'
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  📋 Summary
                </button>
                <button
                  onClick={() => setView('sheet')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'sheet'
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  📜 Full Sheet
                </button>
                <button
                  onClick={() => setView('dnd')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'dnd'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  🎲 D&D
                </button>
                <button
                  onClick={() => setView('editor')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'editor'
                      ? 'bg-green-600 text-white'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  ✏️ Edit
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {view !== 'library' && (
                <button
                  onClick={handleBackToLibrary}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                >
                  ← Back to Library
                </button>
              )}
              
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Character
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {view === 'library' && (
          <CharacterList
            onCharacterSelect={handleCharacterSelect}
            selectedCharacterId={selectedCharacter?.id || currentCharacter?.id}
            onCreateNew={handleCreateNew}
          />
        )}

        {view === 'summary' && viewCharacter && (
          <div className="max-w-4xl mx-auto">
            <CharacterSummary 
              character={viewCharacter} 
              showFullDetails={true}
            />
          </div>
        )}

        {view === 'sheet' && viewCharacter && (
          <div className="max-w-6xl mx-auto">
            <CharacterSheet 
              character={viewCharacter}
              editable={false}
            />
          </div>
        )}

        {view === 'dnd' && viewCharacter && (
          <div className="max-w-5xl mx-auto">
            <DNDIntegrationWidget />
          </div>
        )}

        {view === 'editor' && viewCharacter && (
          <div className="max-w-4xl mx-auto">
            <CharacterEditor 
              character={viewCharacter}
              onSave={(character) => {
                setSelectedCharacter(character)
                setView('sheet')
              }}
              onCancel={() => setView('sheet')}
            />
          </div>
        )}

        {/* Empty State */}
        {!viewCharacter && view !== 'library' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-parchment-50 border-2 border-dashed border-amber-300 rounded-lg p-12 text-center">
              <div className="text-parchment-600">
                <div className="text-6xl mb-4">🎭</div>
                <p className="text-xl font-medium text-amber-800 mb-2">No Character Selected</p>
                <p className="text-parchment-700 mb-6">
                  Choose a character from your library or create a new one to get started.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setView('library')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Browse Library
                  </button>
                  <button
                    onClick={handleCreateNew}
                    className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Create New Character
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      {view === 'library' && (
        <div className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-6">
                <span>PanCasting Character Manager</span>
                <span>•</span>
                <span>Powered by Central Casting Tables</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600">🎲</span>
                <span>Ready for Adventure</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}