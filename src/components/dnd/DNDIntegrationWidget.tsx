import { useState, useEffect } from 'react'
import { useCharacterStore } from '@/stores/characterStore'
import { dndIntegrationService, type DNDEdition } from '@/services/dndIntegrationService'
import type { DDClassSuggestion } from '@/types/dnd'
import type { DD5eClassSuggestion, DD5eBackgroundSuggestion } from '@/types/dnd5e'
import { DNDExportPanel } from './DNDExportPanel'

export function DNDIntegrationWidget() {
  const { character } = useCharacterStore()
  const [selectedEdition, setSelectedEdition] = useState<DNDEdition>('5e')
  const [classSuggestions, setClassSuggestions] = useState<(DDClassSuggestion | DD5eClassSuggestion)[]>([])
  const [backgroundSuggestions, setBackgroundSuggestions] = useState<DD5eBackgroundSuggestion[]>([])
  const [showExportPanel, setShowExportPanel] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (character) {
      loadSuggestions()
    }
  }, [character, selectedEdition])

  const loadSuggestions = async () => {
    if (!character) return
    
    setIsLoading(true)
    try {
      const classes = dndIntegrationService.suggestClasses(character, selectedEdition)
      setClassSuggestions(classes)
      
      if (selectedEdition === '5e') {
        const backgrounds = dndIntegrationService.suggestBackgrounds(character)
        setBackgroundSuggestions(backgrounds)
      } else {
        setBackgroundSuggestions([])
      }
    } catch (error) {
      console.error('Failed to load D&D suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!character) {
    return (
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-medieval-800 mb-2">D&D Integration</h3>
        <p className="text-medieval-600">Load a character to see D&D conversion options.</p>
      </div>
    )
  }

  if (showExportPanel) {
    return (
      <DNDExportPanel onClose={() => setShowExportPanel(false)} />
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-medieval-800">D&D Integration</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedEdition('3.5')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              selectedEdition === '3.5' 
                ? 'bg-amber-600 text-white' 
                : 'bg-medieval-100 text-medieval-700 hover:bg-medieval-200'
            }`}
          >
            3.5e
          </button>
          <button
            onClick={() => setSelectedEdition('5e')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              selectedEdition === '5e' 
                ? 'bg-amber-600 text-white' 
                : 'bg-medieval-100 text-medieval-700 hover:bg-medieval-200'
            }`}
          >
            5e
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-medieval-600 mt-2">Analyzing character...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Character Stats Summary */}
          <div className="bg-parchment-50 p-4 rounded-lg">
            <h4 className="font-medium text-medieval-800 mb-3">Character Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div><strong>Race:</strong> {character.race.name}</div>
                <div><strong>Culture:</strong> {character.culture.name}</div>
                <div><strong>Age:</strong> {character.age}</div>
              </div>
              <div>
                <div><strong>Skills:</strong> {character.skills.length}</div>
                <div><strong>Occupations:</strong> {character.occupations.length}</div>
                <div><strong>Life Events:</strong> {
                  character.youthEvents.length + character.adulthoodEvents.length + character.miscellaneousEvents.length
                }</div>
              </div>
            </div>
          </div>

          {/* Class Suggestions */}
          <div>
            <h4 className="font-medium text-medieval-800 mb-3">Suggested Classes</h4>
            {classSuggestions.length > 0 ? (
              <div className="space-y-3">
                {classSuggestions.slice(0, 3).map((suggestion, index) => (
                  <ClassSuggestionCard 
                    key={index} 
                    suggestion={suggestion} 
                    edition={selectedEdition}
                  />
                ))}
              </div>
            ) : (
              <p className="text-medieval-600 text-sm">No class suggestions available.</p>
            )}
          </div>

          {/* Background Suggestions (5e only) */}
          {selectedEdition === '5e' && backgroundSuggestions.length > 0 && (
            <div>
              <h4 className="font-medium text-medieval-800 mb-3">Suggested Backgrounds</h4>
              <div className="space-y-3">
                {backgroundSuggestions.slice(0, 2).map((suggestion, index) => (
                  <BackgroundSuggestionCard 
                    key={index} 
                    suggestion={suggestion}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Character Validation */}
          <CharacterValidation character={character} edition={selectedEdition} />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-medieval-200">
            <button
              onClick={() => setShowExportPanel(true)}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Export to D&D {selectedEdition}
            </button>
            <button
              onClick={loadSuggestions}
              className="px-4 py-2 bg-medieval-600 text-white rounded-lg hover:bg-medieval-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface ClassSuggestionCardProps {
  suggestion: DDClassSuggestion | DD5eClassSuggestion
  edition: DNDEdition
}

function ClassSuggestionCard({ suggestion, edition }: ClassSuggestionCardProps) {
  const suitabilityColor = 
    suggestion.suitability >= 80 ? 'text-green-600' :
    suggestion.suitability >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="bg-white p-3 rounded-lg border border-medieval-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="font-medium text-medieval-800">
            {suggestion.className}
            {'subclass' in suggestion && suggestion.subclass && (
              <span className="text-medieval-600"> ({suggestion.subclass})</span>
            )}
          </h5>
          <span className={`text-sm font-medium ${suitabilityColor}`}>
            {suggestion.suitability}% match ({suggestion.potential})
          </span>
        </div>
        {edition === '5e' && 'primaryAbility' in suggestion && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {suggestion.primaryAbility.toUpperCase()}
          </span>
        )}
      </div>
      
      <div className="text-sm text-medieval-700">
        <div className="mb-1">
          <strong>Reasons:</strong> {suggestion.reasons.join(', ')}
        </div>
        {suggestion.backgroundSupport.length > 0 && (
          <div>
            <strong>Background Support:</strong> {suggestion.backgroundSupport.join(', ')}
          </div>
        )}
      </div>
    </div>
  )
}

interface BackgroundSuggestionCardProps {
  suggestion: DD5eBackgroundSuggestion
}

function BackgroundSuggestionCard({ suggestion }: BackgroundSuggestionCardProps) {
  return (
    <div className="bg-white p-3 rounded-lg border border-medieval-200">
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-medium text-medieval-800">{suggestion.name}</h5>
        <span className="text-sm font-medium text-green-600">
          {suggestion.suitability}% match
        </span>
      </div>
      
      <div className="text-sm text-medieval-700 mb-2">
        {suggestion.description}
      </div>
      
      <div className="text-xs text-medieval-600">
        <div><strong>Skills:</strong> {suggestion.skillProficiencies.join(', ')}</div>
        <div><strong>Feature:</strong> {suggestion.feature}</div>
      </div>
    </div>
  )
}

interface CharacterValidationProps {
  character: any
  edition: DNDEdition
}

function CharacterValidation({ character, edition }: CharacterValidationProps) {
  const [validation, setValidation] = useState<any>(null)

  useEffect(() => {
    if (character) {
      const result = dndIntegrationService.validateCharacter(character, edition)
      setValidation(result)
    }
  }, [character, edition])

  if (!validation) {
    return null
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-medieval-800 mb-3">Character Validation</h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${
            validation.isValid ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
          <span className="font-medium">
            {validation.isValid ? 'Valid Character' : 'Invalid Character'}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${
            validation.rulesCompliant ? 'bg-green-500' : 'bg-yellow-500'
          }`}></span>
          <span className="font-medium">
            {validation.rulesCompliant ? 'Rules Compliant' : 'Has Warnings'}
          </span>
        </div>
        
        {edition === '5e' && 'levelAppropriate' in validation && (
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${
              validation.levelAppropriate ? 'bg-green-500' : 'bg-yellow-500'
            }`}></span>
            <span className="font-medium">
              {validation.levelAppropriate ? 'Level Appropriate' : 'Level Issues'}
            </span>
          </div>
        )}
      </div>

      {validation.errors.length > 0 && (
        <div className="mt-3">
          <h5 className="font-medium text-red-800 mb-1">Errors:</h5>
          <ul className="text-xs text-red-700 list-disc list-inside">
            {validation.errors.map((error: string, index: number) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="mt-3">
          <h5 className="font-medium text-yellow-800 mb-1">Warnings:</h5>
          <ul className="text-xs text-yellow-700 list-disc list-inside">
            {validation.warnings.map((warning: string, index: number) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.suggestions.length > 0 && (
        <div className="mt-3">
          <h5 className="font-medium text-blue-800 mb-1">Suggestions:</h5>
          <ul className="text-xs text-blue-700 list-disc list-inside">
            {validation.suggestions.map((suggestion: string, index: number) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}