// Character Export Service
// Handles exporting characters to various formats

import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import type { Character } from '@/types/character'
import type { DDCharacterSheet } from '@/types/dnd'
import { dndIntegrationService, type DNDEdition } from './dndIntegrationService'
import { DD35CharacterSheet } from '@/components/character/DD35CharacterSheet'
import {
  downloadTextFile,
  downloadJSON,
  downloadHTML,
  openPrintWindow,
  sanitizeFilename
} from '@/utils/downloadHelper'

export type ExportFormat = 'json' | 'text' | 'html' | 'dnd35' | 'dnd5e' | 'print'

export interface ExportOptions {
  format: ExportFormat
  edition?: DNDEdition
  includeBackstory?: boolean
  includeHistory?: boolean
}

export class ExportService {
  /**
   * Export character to the specified format
   */
  async exportCharacter(character: Character, options: ExportOptions): Promise<void> {
    const { format, edition = '3.5' } = options

    try {
      switch (format) {
        case 'json':
          this.exportAsJSON(character)
          break

        case 'text':
          await this.exportAsText(character, edition)
          break

        case 'html':
        case 'dnd35':
          this.exportAsHTML(character, edition)
          break

        case 'print':
          this.openPrintWindow(character, edition)
          break

        default:
          throw new Error(`Unsupported export format: ${format}`)
      }
    } catch (error) {
      console.error('Export failed:', error)
      throw error
    }
  }

  /**
   * Export character as JSON
   */
  private exportAsJSON(character: Character): void {
    const filename = `${sanitizeFilename(character.name)}_character`
    downloadJSON(character, filename)
  }

  /**
   * Export character as text
   */
  private async exportAsText(character: Character, edition: DNDEdition): Promise<void> {
    const result = await dndIntegrationService.exportCharacter(character, edition, {
      format: 'text',
      includeBackstory: true,
      includeRelationships: true,
      includeTimeline: true,
      includeNotes: true
    })

    if (result.success && result.data) {
      const filename = `${sanitizeFilename(character.name)}_${edition.replace('.', '_')}.txt`
      downloadTextFile(result.data as string, {
        filename,
        mimeType: 'text/plain'
      })
    } else {
      throw new Error(result.errors?.join(', ') || 'Export failed')
    }
  }

  /**
   * Export character as HTML (D&D 3.5 character sheet)
   */
  private exportAsHTML(character: Character, edition: DNDEdition): void {
    const characterSheet = dndIntegrationService.convertCharacter(character, edition) as DDCharacterSheet

    // Render the React component to static HTML
    const componentHTML = renderToStaticMarkup(
      React.createElement(DD35CharacterSheet, { characterSheet })
    )

    // Wrap in full HTML document
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${character.name} - D&D ${edition} Character Sheet</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #f0f0f0;
      font-family: 'Times New Roman', serif;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  ${componentHTML}
</body>
</html>
    `.trim()

    const filename = `${sanitizeFilename(character.name)}_${edition.replace('.', '_')}_sheet.html`
    downloadHTML(fullHTML, filename)
  }

  /**
   * Open character sheet in print window
   */
  private openPrintWindow(character: Character, edition: DNDEdition): void {
    const characterSheet = dndIntegrationService.convertCharacter(character, edition) as DDCharacterSheet

    // Render the React component to static HTML
    const componentHTML = renderToStaticMarkup(
      React.createElement(DD35CharacterSheet, { characterSheet })
    )

    openPrintWindow(componentHTML, `${character.name} - Character Sheet`)
  }

  /**
   * Export character as D&D Beyond compatible JSON (future feature)
   */
  async exportToDnDBeyond(_character: Character): Promise<void> {
    // This would require mapping to D&D Beyond's JSON schema
    // For now, throw not implemented error
    throw new Error('D&D Beyond export not yet implemented')
  }

  /**
   * Export character as Roll20 compatible format (future feature)
   */
  async exportToRoll20(_character: Character): Promise<void> {
    // This would require mapping to Roll20's character format
    throw new Error('Roll20 export not yet implemented')
  }

  /**
   * Export character as Foundry VTT compatible format (future feature)
   */
  async exportToFoundryVTT(_character: Character): Promise<void> {
    // This would require mapping to Foundry VTT's actor format
    throw new Error('Foundry VTT export not yet implemented')
  }

  /**
   * Generate a summary text for the character
   */
  generateSummary(character: Character): string {
    const parts: string[] = []

    parts.push(`=== ${character.name} ===`)
    parts.push(`${character.race.name} - Level ${character.level || 1}`)
    parts.push(`Age: ${character.age}`)
    parts.push('')

    if (character.occupations.length > 0) {
      parts.push('OCCUPATIONS:')
      character.occupations.forEach(occ => {
        parts.push(`  - ${occ.name} (${occ.type})`)
      })
      parts.push('')
    }

    if (character.skills.length > 0) {
      parts.push('SKILLS:')
      character.skills.forEach(skill => {
        parts.push(`  - ${skill.name} (Rank ${skill.rank})`)
      })
      parts.push('')
    }

    if (character.personalityTraits) {
      const allTraits = [
        ...character.personalityTraits.lightside,
        ...character.personalityTraits.neutral,
        ...character.personalityTraits.darkside
      ]

      if (allTraits.length > 0) {
        parts.push('PERSONALITY:')
        allTraits.forEach(trait => {
          parts.push(`  - ${trait.name}: ${trait.description}`)
        })
        parts.push('')
      }
    }

    if (character.values) {
      parts.push('VALUES:')
      if (character.values.mostValuedPerson) {
        parts.push(`  Most Valued Person: ${character.values.mostValuedPerson}`)
      }
      if (character.values.mostValuedAbstraction) {
        parts.push(`  Most Valued: ${character.values.mostValuedAbstraction}`)
      }
      parts.push('')
    }

    return parts.join('\n')
  }

  /**
   * Download character summary as text
   */
  exportSummary(character: Character): void {
    const summary = this.generateSummary(character)
    const filename = `${sanitizeFilename(character.name)}_summary.txt`

    downloadTextFile(summary, {
      filename,
      mimeType: 'text/plain'
    })
  }
}

// Export singleton instance
export const exportService = new ExportService()
