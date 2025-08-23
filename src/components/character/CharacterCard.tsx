// Compact Character Card Component for PanCasting

import { Character, PersonalityTraits } from '../../types/character'

interface CharacterCardProps {
  character: Character
  onSelect?: (character: Character) => void
  onDelete?: (character: Character) => void
  isSelected?: boolean
  className?: string
}

export function CharacterCard({ 
  character, 
  onSelect, 
  onDelete, 
  isSelected = false,
  className = '' 
}: CharacterCardProps) {
  
  const getCompletionPercentage = () => {
    let completed = 0
    const total = 8 // Total major steps in character generation
    
    if (character.race) completed++
    if (character.youthEvents && character.youthEvents.length > 0) completed++
    if (character.occupations && character.occupations.length > 0) completed++
    if (character.adulthoodEvents && character.adulthoodEvents.length > 0) completed++
    if (character.personalityTraits && getPersonalityTraitsCount(character.personalityTraits) > 0) completed++
    if (character.relationships && character.relationships.length > 0) completed++
    if (character.specialItems && character.specialItems.length > 0) completed++
    if (character.attributes && Object.keys(character.attributes).length > 0) completed++
    
    return Math.round((completed / total) * 100)
  }

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100'
    if (percentage >= 60) return 'text-blue-600 bg-blue-100'
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getTotalSkills = () => {
    if (!character.skills) return 0
    return character.skills.length
  }

  const getPersonalityTraitsCount = (traits: PersonalityTraits): number => {
    return (traits.lightside?.length || 0) + 
           (traits.neutral?.length || 0) + 
           (traits.darkside?.length || 0) + 
           (traits.exotic?.length || 0)
  }

  const getAllPersonalityTraits = (traits: PersonalityTraits) => {
    return [
      ...(traits.lightside || []),
      ...(traits.neutral || []),
      ...(traits.darkside || []),
      ...(traits.exotic || [])
    ]
  }

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(character)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete && window.confirm(`Delete character "${character.name || 'Unnamed'}"?`)) {
      onDelete(character)
    }
  }

  const completion = getCompletionPercentage()

  return (
    <div 
      className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected 
          ? 'border-amber-500 shadow-md bg-amber-50' 
          : 'border-gray-200 hover:border-amber-300'
      } ${className}`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 truncate">
            {character.name || 'Unnamed Character'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {character.race && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                {character.race.name}
              </span>
            )}
            {character.culture && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                {character.culture.name}
              </span>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 ml-2">
          <div className={`px-2 py-1 rounded text-xs font-bold ${getCompletionColor(completion)}`}>
            {completion}%
          </div>
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete character"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">Generation Progress</span>
          <span className="text-xs text-gray-500">{completion}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              completion >= 80 ? 'bg-green-500' :
              completion >= 60 ? 'bg-blue-500' :
              completion >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-amber-600">
            {character.personalityTraits ? getPersonalityTraitsCount(character.personalityTraits) : 0}
          </div>
          <div className="text-xs text-gray-600">Traits</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-600">
            {getTotalSkills()}
          </div>
          <div className="text-xs text-gray-600">Skills</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">
            {character.occupations?.length || 0}
          </div>
          <div className="text-xs text-gray-600">Occupations</div>
        </div>
      </div>

      {/* Key Personality Traits */}
      {character.personalityTraits && getPersonalityTraitsCount(character.personalityTraits) > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-1">
            {getAllPersonalityTraits(character.personalityTraits).slice(0, 3).map((trait, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs"
              >
                {trait.name}
              </span>
            ))}
            {getPersonalityTraitsCount(character.personalityTraits) > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{getPersonalityTraitsCount(character.personalityTraits) - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Generation Status */}
      {character.generationStep && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Current Step:</span>
            <span className="font-medium text-amber-600">
              {character.generationStep}
            </span>
          </div>
        </div>
      )}

      {/* Last Modified */}
      {character.lastModified && (
        <div className="mt-2 text-xs text-gray-500 text-right">
          Modified: {new Date(character.lastModified).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}