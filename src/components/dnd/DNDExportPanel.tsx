import { useState } from 'react'
import { useCharacterStore } from '@/stores/characterStore'
import { dndIntegrationService, type DNDEdition } from '@/services/dndIntegrationService'
import type { DDExportOptions } from '@/types/dnd'
import type { DD5eExportOptions } from '@/types/dnd5e'

interface DNDExportPanelProps {
  onClose?: () => void
}

export function DNDExportPanel({ onClose }: DNDExportPanelProps) {
  const { character } = useCharacterStore()
  const [selectedEdition, setSelectedEdition] = useState<DNDEdition>('5e')
  const [exportFormat, setExportFormat] = useState<string>('json')
  const [includeBackstory, setIncludeBackstory] = useState(true)
  const [includePersonality, setIncludePersonality] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  if (!character) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-medieval-800 mb-4">D&D Export</h2>
        <p className="text-medieval-600">No character loaded. Please create or load a character first.</p>
        {onClose && (
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    )
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportError(null)
    setExportResult(null)

    try {
      const options = createExportOptions()
      const result = await dndIntegrationService.exportCharacter(character, selectedEdition, options)
      
      if (result.success) {
        setExportResult(result.data as string)
      } else {
        setExportError(result.errors?.join(', ') || 'Export failed')
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsExporting(false)
    }
  }

  const createExportOptions = (): DDExportOptions | DD5eExportOptions => {
    if (selectedEdition === '3.5') {
      return {
        format: exportFormat as any,
        includeBackstory,
        includeRelationships: true,
        includeTimeline: true,
        includeNotes: true
      } as DDExportOptions
    } else {
      return {
        format: exportFormat as any,
        includeBackstory,
        includePersonality,
        includeAppearance: true,
        includeNotes: true,
        officialContent: true
      } as DD5eExportOptions
    }
  }

  const downloadExport = () => {
    if (!exportResult) return

    const filename = `${character.name.replace(/\s+/g, '_')}_DnD${selectedEdition.replace('.', '')}.${exportFormat}`
    const blob = new Blob([exportResult], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!exportResult) return
    
    try {
      await navigator.clipboard.writeText(exportResult)
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-medieval-800">D&D Character Export</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-medieval-600 hover:text-medieval-800 text-xl"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-medieval-700 mb-2">
              D&D Edition
            </label>
            <div className="flex gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="3.5"
                  checked={selectedEdition === '3.5'}
                  onChange={(e) => setSelectedEdition(e.target.value as DNDEdition)}
                  className="mr-2"
                />
                D&D 3.5
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="5e"
                  checked={selectedEdition === '5e'}
                  onChange={(e) => setSelectedEdition(e.target.value as DNDEdition)}
                  className="mr-2"
                />
                D&D 5th Edition
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-medieval-700 mb-2">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-medieval-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="json">JSON</option>
              <option value="text">Text Sheet</option>
              {selectedEdition === '5e' && (
                <>
                  <option value="dndbeyond">D&D Beyond Format</option>
                  <option value="roll20">Roll20 Format</option>
                  <option value="foundry">Foundry VTT Format</option>
                </>
              )}
              <option value="pdf">PDF (Coming Soon)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeBackstory}
                onChange={(e) => setIncludeBackstory(e.target.checked)}
                className="mr-2"
              />
              Include Backstory
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includePersonality}
                onChange={(e) => setIncludePersonality(e.target.checked)}
                className="mr-2"
              />
              Include Personality Traits
            </label>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exporting...' : `Export to D&D ${selectedEdition}`}
          </button>
        </div>

        {/* Character Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-medieval-800">Character Preview</h3>
          
          <div className="bg-parchment-50 p-4 rounded-lg">
            <div className="text-sm space-y-2">
              <div><strong>Name:</strong> {character.name}</div>
              <div><strong>Age:</strong> {character.age}</div>
              <div><strong>Race:</strong> {character.race.name}</div>
              <div><strong>Culture:</strong> {character.culture.name}</div>
              <div><strong>Social Status:</strong> {character.socialStatus.level}</div>
              <div><strong>Occupations:</strong> {character.occupations.map(o => o.name).join(', ') || 'None'}</div>
              <div><strong>Skills:</strong> {character.skills.length}</div>
              <div><strong>Life Events:</strong> {
                character.youthEvents.length + character.adulthoodEvents.length + character.miscellaneousEvents.length
              }</div>
            </div>
          </div>

          {/* Class Suggestions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Suggested Classes</h4>
            <ClassSuggestions character={character} edition={selectedEdition} />
          </div>
        </div>
      </div>

      {/* Export Result */}
      {exportError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">Export Error</h3>
          <p className="text-red-700">{exportError}</p>
        </div>
      )}

      {exportResult && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-medieval-800">Export Result</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={downloadExport}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">{exportResult}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

interface ClassSuggestionsProps {
  character: any
  edition: DNDEdition
}

function ClassSuggestions({ character, edition }: ClassSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])

  useState(() => {
    const getSuggestions = async () => {
      try {
        const classSuggestions = dndIntegrationService.suggestClasses(character, edition)
        setSuggestions(classSuggestions.slice(0, 3)) // Top 3 suggestions
      } catch (error) {
        console.error('Failed to get class suggestions:', error)
      }
    }
    getSuggestions()
  })

  if (suggestions.length === 0) {
    return <p className="text-blue-600 text-sm">Analyzing character background...</p>
  }

  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-800">{suggestion.className}</span>
            <span className="text-blue-600">{suggestion.suitability}%</span>
          </div>
          <p className="text-blue-700 text-xs">{suggestion.reasons.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}