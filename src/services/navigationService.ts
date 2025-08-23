// Navigation service for table cross-references and workflow management

import type { Table } from '../types/tables'
import type { Character } from '../types/character'
import { tableService } from './tableService'

export interface NavigationStep {
  tableId: string
  tableName: string
  timestamp: Date
  rollResult?: number
  selectedEntry?: any
  reason: 'initial' | 'goto' | 'manual' | 'wizard_step'
}

export interface NavigationHistory {
  steps: NavigationStep[]
  currentIndex: number
  maxHistorySize: number
}

export interface GotoReference {
  originalText: string
  targetTableId: string
  description?: string
  conditions?: string[]
}

export class NavigationService {
  private history: NavigationHistory = {
    steps: [],
    currentIndex: -1,
    maxHistorySize: 50
  }

  private readonly gotoPatterns = [
    /(\d+)\s*[-\s]*([A-Za-z\s]+)/,  // "627 Elven Events"
    /Table\s*(\d+)/i,               // "Table 310"
    /(\d+)-(\d+)\s*([A-Za-z\s]+)/,  // "310-312 Occupation Tables"
    /Go\s*to\s*(\d+)/i,             // "Go to 624"
    /See\s*(\d+)/i                  // "See 425"
  ]

  /**
   * Parse a goto reference from table entry text
   */
  parseGotoReference(gotoText: string): GotoReference | null {
    if (!gotoText) return null

    for (const pattern of this.gotoPatterns) {
      const match = gotoText.match(pattern)
      if (match) {
        const tableId = match[1]
        const description = match[2]?.trim() || match[3]?.trim()
        
        return {
          originalText: gotoText,
          targetTableId: tableId,
          description
        }
      }
    }

    return null
  }

  /**
   * Navigate to a table and record in history
   */
  async navigateToTable(
    tableId: string,
    _character: Partial<Character>,
    reason: NavigationStep['reason'] = 'manual',
    context?: any
  ): Promise<Table | null> {
    try {
      const table = await tableService.getTable(tableId)
      if (!table) {
        console.warn(`Table not found: ${tableId}`)
        return null
      }

      // Add to navigation history
      this.addToHistory({
        tableId,
        tableName: table.name,
        timestamp: new Date(),
        reason,
        ...context
      })

      return table
    } catch (error) {
      console.error(`Navigation error for table ${tableId}:`, error)
      return null
    }
  }

  /**
   * Process a goto reference and navigate
   */
  async processGotoReference(
    gotoText: string,
    character: Partial<Character>,
    sourceTable?: string
  ): Promise<Table | null> {
    const gotoRef = this.parseGotoReference(gotoText)
    if (!gotoRef) {
      console.warn(`Could not parse goto reference: ${gotoText}`)
      return null
    }

    console.log(`Following goto reference: ${gotoRef.originalText} -> Table ${gotoRef.targetTableId}`)
    
    return this.navigateToTable(
      gotoRef.targetTableId,
      character,
      'goto',
      {
        sourceTable,
        gotoReference: gotoRef
      }
    )
  }

  /**
   * Get suggested next tables based on character state
   */
  async getSuggestedNextTables(character: Partial<Character>): Promise<Table[]> {
    const suggestions: Table[] = []

    // Logic for suggesting tables based on character progress
    // This would analyze what's been completed and what's needed next

    // Example logic:
    if (!character.race) {
      // Suggest heritage tables (100s)
      const heritageTable = await tableService.getTable('101')
      if (heritageTable) suggestions.push(heritageTable)
    }

    if (character.race && !character.youthEvents?.length) {
      // Suggest youth events (200s)
      const youthTable = await tableService.getTable('208')
      if (youthTable) suggestions.push(youthTable)
    }

    if (character.youthEvents?.length && !character.occupations?.length) {
      // Suggest occupation tables (300s)
      const occupationTable = await tableService.getTable('309')
      if (occupationTable) suggestions.push(occupationTable)
    }

    return suggestions
  }

  /**
   * Add step to navigation history
   */
  private addToHistory(step: NavigationStep): void {
    // Remove any steps after current index (if we're not at the end)
    this.history.steps = this.history.steps.slice(0, this.history.currentIndex + 1)
    
    // Add new step
    this.history.steps.push(step)
    this.history.currentIndex++

    // Maintain max history size
    if (this.history.steps.length > this.history.maxHistorySize) {
      this.history.steps.shift()
      this.history.currentIndex--
    }
  }

  /**
   * Navigate back in history
   */
  async navigateBack(): Promise<NavigationStep | null> {
    if (this.history.currentIndex > 0) {
      this.history.currentIndex--
      return this.history.steps[this.history.currentIndex]
    }
    return null
  }

  /**
   * Navigate forward in history
   */
  async navigateForward(): Promise<NavigationStep | null> {
    if (this.history.currentIndex < this.history.steps.length - 1) {
      this.history.currentIndex++
      return this.history.steps[this.history.currentIndex]
    }
    return null
  }

  /**
   * Get current navigation step
   */
  getCurrentStep(): NavigationStep | null {
    if (this.history.currentIndex >= 0 && this.history.currentIndex < this.history.steps.length) {
      return this.history.steps[this.history.currentIndex]
    }
    return null
  }

  /**
   * Get full navigation history
   */
  getHistory(): NavigationHistory {
    return { ...this.history }
  }

  /**
   * Clear navigation history
   */
  clearHistory(): void {
    this.history = {
      steps: [],
      currentIndex: -1,
      maxHistorySize: 50
    }
  }

  /**
   * Get navigation breadcrumbs for UI
   */
  getBreadcrumbs(): { label: string; tableId: string; active: boolean }[] {
    return this.history.steps.map((step, index) => ({
      label: step.tableName,
      tableId: step.tableId,
      active: index === this.history.currentIndex
    }))
  }

  /**
   * Check if we can navigate back
   */
  canNavigateBack(): boolean {
    return this.history.currentIndex > 0
  }

  /**
   * Check if we can navigate forward
   */
  canNavigateForward(): boolean {
    return this.history.currentIndex < this.history.steps.length - 1
  }

  /**
   * Generate table flow recommendations
   */
  async generateTableFlow(character: Partial<Character>): Promise<{
    completed: string[]
    current: string | null
    upcoming: string[]
    optional: string[]
  }> {
    const completed: string[] = []
    const upcoming: string[] = []
    const optional: string[] = []
    let current: string | null = null

    // Analyze character state to determine flow
    
    // Heritage (100s)
    if (character.race && character.culture && character.socialStatus) {
      completed.push('Heritage & Birth (100s)')
    } else {
      if (!current) current = 'Heritage & Birth (100s)'
      upcoming.push('Heritage & Birth (100s)')
    }

    // Youth Events (200s)
    if (character.youthEvents && character.youthEvents.length > 0) {
      completed.push('Youth Events (200s)')
    } else if (completed.includes('Heritage & Birth (100s)')) {
      if (!current) current = 'Youth Events (200s)'
      upcoming.push('Youth Events (200s)')
    }

    // Occupations (300s)
    if (character.occupations && character.occupations.length > 0) {
      completed.push('Occupations (300s)')
    } else if (completed.includes('Youth Events (200s)')) {
      if (!current) current = 'Occupations (300s)'
      upcoming.push('Occupations (300s)')
    }

    // Continue for other categories...
    
    // Optional tables based on character state
    if (character.race?.type !== 'Human') {
      optional.push('Racial Events (627-630)')
    }

    return { completed, current, upcoming, optional }
  }

  /**
   * Validate table navigation path
   */
  validateNavigationPath(tableIds: string[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Check for circular references
    const visited = new Set<string>()
    for (const tableId of tableIds) {
      if (visited.has(tableId)) {
        errors.push(`Circular reference detected: Table ${tableId} appears multiple times`)
      }
      visited.add(tableId)
    }

    // Additional validation logic would go here
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Get navigation statistics
   */
  getStatistics(): any {
    return {
      totalSteps: this.history.steps.length,
      currentIndex: this.history.currentIndex,
      canGoBack: this.canNavigateBack(),
      canGoForward: this.canNavigateForward(),
      uniqueTablesVisited: new Set(this.history.steps.map(s => s.tableId)).size
    }
  }
}

// Default navigation service instance
export const navigationService = new NavigationService()