// Character Editor Component for PanCasting

import { useState, useEffect } from 'react'
import { Character, PersonalityTraits, PersonalityTrait } from '../../types/character'
import { useCharacterStore } from '../../stores/characterStore'

interface CharacterEditorProps {
  character?: Character
  onSave?: (character: Character) => void
  onCancel?: () => void
  className?: string
}

export function CharacterEditor({ 
  character: propCharacter, 
  onSave, 
  onCancel, 
  className = '' 
}: CharacterEditorProps) {
  const { character: storeCharacter, updateCharacter } = useCharacterStore()
  const baseCharacter = propCharacter || storeCharacter
  
  const [editedCharacter, setEditedCharacter] = useState<Character | null>(null)
  const [activeSection, setActiveSection] = useState<'basic' | 'attributes' | 'traits' | 'skills'>('basic')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (baseCharacter) {
      setEditedCharacter({ ...baseCharacter })
      setHasChanges(false)
    }
  }, [baseCharacter])

  if (!baseCharacter || !editedCharacter) {
    return (
      <div className={`bg-gray-50 border border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-500">
          <div className="text-4xl mb-2">✏️</div>
          <p className="text-lg font-medium">No Character to Edit</p>
          <p className="text-sm">Select a character to begin editing</p>
        </div>
      </div>
    )
  }

  const handleBasicInfoChange = (field: keyof Character, value: any) => {
    if (!editedCharacter) return
    
    const updated = { ...editedCharacter, [field]: value }
    setEditedCharacter(updated)
    setHasChanges(true)
  }

  const handleAttributeChange = (attribute: string, value: number) => {
    if (!editedCharacter) return
    
    const updated = {
      ...editedCharacter,
      attributes: {
        ...editedCharacter.attributes,
        [attribute]: value
      }
    }
    setEditedCharacter(updated)
    setHasChanges(true)
  }

  const handleModifierChange = (modifier: string, value: number) => {
    if (!editedCharacter) return
    
    const updated = {
      ...editedCharacter,
      activeModifiers: {
        ...editedCharacter.activeModifiers,
        [modifier]: value
      }
    }
    setEditedCharacter(updated)
    setHasChanges(true)
  }

  const getPersonalityTraitsArray = (traits: PersonalityTraits): (PersonalityTrait & { category: string })[] => {
    const result: (PersonalityTrait & { category: string })[] = []
    
    traits.lightside?.forEach(trait => result.push({ ...trait, category: 'lightside' }))
    traits.neutral?.forEach(trait => result.push({ ...trait, category: 'neutral' }))
    traits.darkside?.forEach(trait => result.push({ ...trait, category: 'darkside' }))
    traits.exotic?.forEach(trait => result.push({ ...trait, category: 'exotic' }))
    
    return result
  }

  const updatePersonalityTraits = (newTraits: (PersonalityTrait & { category: string })[]) => {
    if (!editedCharacter) return
    
    const updated: PersonalityTraits = {
      lightside: [],
      neutral: [],
      darkside: [],
      exotic: []
    }
    
    newTraits.forEach(trait => {
      const { category, ...traitData } = trait
      if (category === 'lightside') updated.lightside?.push(traitData as PersonalityTrait)
      else if (category === 'neutral') updated.neutral?.push(traitData as PersonalityTrait)
      else if (category === 'darkside') updated.darkside?.push(traitData as PersonalityTrait)
      else if (category === 'exotic') updated.exotic?.push(traitData as any)
    })
    
    setEditedCharacter({
      ...editedCharacter,
      personalityTraits: updated
    })
    setHasChanges(true)
  }

  const handleTraitChange = (index: number, field: string, value: any) => {
    if (!editedCharacter?.personalityTraits) return
    
    const currentTraits = getPersonalityTraitsArray(editedCharacter.personalityTraits)
    const updatedTraits = [...currentTraits]
    
    if (field === 'category') {
      // Handle category change by moving trait to different category
      updatedTraits[index] = { ...updatedTraits[index], category: value }
    } else {
      updatedTraits[index] = { ...updatedTraits[index], [field]: value }
    }
    
    updatePersonalityTraits(updatedTraits)
  }

  const addPersonalityTrait = () => {
    if (!editedCharacter) return
    
    const currentTraits = editedCharacter.personalityTraits ? 
      getPersonalityTraitsArray(editedCharacter.personalityTraits) : []
    
    const newTrait: PersonalityTrait & { category: string } = {
      name: '',
      description: '',
      type: 'Neutral',
      strength: 'Average',
      source: 'Manual Entry',
      category: 'neutral'
    }
    
    updatePersonalityTraits([...currentTraits, newTrait])
  }

  const removePersonalityTrait = (index: number) => {
    if (!editedCharacter?.personalityTraits) return
    
    const currentTraits = getPersonalityTraitsArray(editedCharacter.personalityTraits)
    const updatedTraits = currentTraits.filter((_, i) => i !== index)
    
    updatePersonalityTraits(updatedTraits)
  }

  const handleSkillChange = (skillName: string, rank: number) => {
    if (!editedCharacter) return
    
    const updated = {
      ...editedCharacter,
      skills: {
        ...editedCharacter.skills,
        [skillName]: { rank, specialty: undefined }
      }
    }
    setEditedCharacter(updated)
    setHasChanges(true)
  }

  const addSkill = () => {
    const skillName = prompt('Enter skill name:')
    if (skillName && editedCharacter) {
      handleSkillChange(skillName, 1)
    }
  }

  const removeSkill = (skillName: string) => {
    if (!editedCharacter || !editedCharacter.skills) return
    
    const updated = { ...editedCharacter }
    delete updated.skills[skillName]
    setEditedCharacter(updated)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!editedCharacter) return
    
    const savedCharacter = {
      ...editedCharacter,
      lastModified: new Date().toISOString()
    }
    
    updateCharacter(savedCharacter)
    
    // Save to localStorage
    try {
      const stored = localStorage.getItem('pancasting-characters')
      const characters = stored ? JSON.parse(stored) : []
      const index = characters.findIndex((c: Character) => c.id === savedCharacter.id)
      
      if (index >= 0) {
        characters[index] = savedCharacter
      } else {
        characters.push(savedCharacter)
      }
      
      localStorage.setItem('pancasting-characters', JSON.stringify(characters))
    } catch (error) {
      console.error('Failed to save character:', error)
    }
    
    if (onSave) {
      onSave(savedCharacter)
    }
    
    setHasChanges(false)
  }

  const handleCancel = () => {
    if (hasChanges && !window.confirm('Discard unsaved changes?')) {
      return
    }
    
    if (baseCharacter) {
      setEditedCharacter({ ...baseCharacter })
    }
    setHasChanges(false)
    
    if (onCancel) {
      onCancel()
    }
  }

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'attributes', label: 'Attributes', icon: '💪' },
    { id: 'traits', label: 'Personality', icon: '🎭' },
    { id: 'skills', label: 'Skills', icon: '⚔️' }
  ]

  return (
    <div className={`bg-white border-2 border-amber-600 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-amber-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Edit Character</h2>
            <div className="text-amber-100 text-sm">
              {editedCharacter.name || 'Unnamed Character'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded text-xs font-medium">
                Unsaved Changes
              </span>
            )}
            <div className="text-2xl">✏️</div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-amber-100 border-b border-amber-200 flex">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-white text-amber-800 border-b-2 border-amber-600'
                : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Basic Info Section */}
        {activeSection === 'basic' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Character Name
                </label>
                <input
                  type="text"
                  value={editedCharacter.name || ''}
                  onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter character name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={editedCharacter.level || 1}
                  onChange={(e) => handleBasicInfoChange('level', parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Race
                </label>
                <input
                  type="text"
                  value={editedCharacter.race?.name || ''}
                  onChange={(e) => handleBasicInfoChange('race', { name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Character race"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Culture
                </label>
                <input
                  type="text"
                  value={editedCharacter.culture?.name || ''}
                  onChange={(e) => handleBasicInfoChange('culture', { name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Cultural background"
                />
              </div>
            </div>
          </div>
        )}

        {/* Attributes Section */}
        {activeSection === 'attributes' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Core Attributes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(attr => (
                  <div key={attr}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {attr}
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="25"
                      value={editedCharacter.attributes?.[attr] || 10}
                      onChange={(e) => handleAttributeChange(attr, parseInt(e.target.value) || 10)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Modifiers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['solMod', 'tiMod', 'cuMod', 'biMod'].map(mod => (
                  <div key={mod}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {mod}
                    </label>
                    <input
                      type="number"
                      min="-10"
                      max="10"
                      value={editedCharacter.activeModifiers?.[mod] || 0}
                      onChange={(e) => handleModifierChange(mod, parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Personality Traits Section */}
        {activeSection === 'traits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Personality Traits</h3>
              <button
                onClick={addPersonalityTrait}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Add Trait
              </button>
            </div>

            <div className="space-y-3">
              {editedCharacter.personalityTraits && getPersonalityTraitsArray(editedCharacter.personalityTraits).map((trait, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid md:grid-cols-5 gap-4 items-start">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={trait.name}
                        onChange={(e) => handleTraitChange(index, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={trait.category}
                        onChange={(e) => handleTraitChange(index, 'category', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="lightside">Lightside</option>
                        <option value="neutral">Neutral</option>
                        <option value="darkside">Darkside</option>
                        <option value="exotic">Exotic</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={trait.type}
                        onChange={(e) => handleTraitChange(index, 'type', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Lightside">Lightside</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Darkside">Darkside</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={trait.description || ''}
                        onChange={(e) => handleTraitChange(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => removePersonalityTrait(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!editedCharacter.personalityTraits || getPersonalityTraitsArray(editedCharacter.personalityTraits).length === 0) && (
                <div className="text-center text-gray-500 py-8">
                  <p>No personality traits defined</p>
                  <p className="text-sm">Add traits to define your character's personality</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Skills & Abilities</h3>
              <button
                onClick={addSkill}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Add Skill
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {editedCharacter.skills && Object.entries(editedCharacter.skills).map(([skillName, skillData]) => {
                const rank = typeof skillData === 'object' ? skillData.rank : skillData
                
                return (
                  <div key={skillName} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{skillName}</span>
                      <button
                        onClick={() => removeSkill(skillName)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rank
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={rank}
                        onChange={(e) => handleSkillChange(skillName, parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )
              })}
              
              {(!editedCharacter.skills || Object.keys(editedCharacter.skills).length === 0) && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  <p>No skills defined</p>
                  <p className="text-sm">Add skills to define your character's abilities</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {hasChanges && 'You have unsaved changes'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}