// Markdown Character Viewer - Real-time markdown display of character
// Updates automatically as character is generated piece by piece

import React, { useState } from 'react'
import { useCharacterStore } from '../../stores/characterStore'

interface MarkdownCharacterViewerProps {
  className?: string
  collapsible?: boolean
}

export function MarkdownCharacterViewer({ 
  className = '', 
  collapsible = false 
}: MarkdownCharacterViewerProps) {
  const { character, getCharacterMarkdown, downloadCharacterMarkdown } = useCharacterStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!character) {
    return (
      <div className={`bg-parchment-50 border-2 border-amber-400 rounded-lg p-4 ${className}`}>
        <h3 className="text-xl font-bold text-amber-800 mb-4">Character Sheet</h3>
        <p className="text-medieval-600">No character loaded</p>
      </div>
    )
  }

  const markdownContent = getCharacterMarkdown()

  if (collapsible && isCollapsed) {
    return (
      <div className={`bg-parchment-50 border-2 border-amber-400 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-amber-800">Character: {character.name}</h3>
            <span className="text-xs text-amber-600">
              {character.isFinalized ? 'Complete' : 'In Progress'}
            </span>
          </div>
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-amber-600 hover:text-amber-800 text-lg font-bold"
            title="Expand character sheet"
          >
            ▼
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-parchment-50 border-2 border-amber-400 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-amber-300">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-amber-800">Character Sheet</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadCharacterMarkdown}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
              title="Download as Markdown file"
            >
              📄 Export
            </button>
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="text-amber-600 hover:text-amber-800 text-lg font-bold"
                title="Collapse character sheet"
              >
                ▲
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="p-4">
        <div className="bg-white rounded-lg border border-amber-200 p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
            {markdownContent}
          </pre>
        </div>
        
        {/* Live Preview Note */}
        <div className="mt-3 text-xs text-amber-600 text-center">
          Live preview • Updates automatically as character is generated • 
          <button 
            onClick={downloadCharacterMarkdown}
            className="underline hover:text-amber-800 ml-1"
          >
            Download .md file
          </button>
        </div>
      </div>
    </div>
  )
}