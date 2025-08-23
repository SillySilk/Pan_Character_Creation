// Table registry for PanCasting - Central repository for all game tables

import type { Table, TableCategory } from '../../types/tables'
import { heritageTables } from './heritage'
import { youthTables } from './youth'
import { occupationTables } from './occupations'
import { adulthoodTables } from './adulthood'
import { personalityTables } from './personality'
import { miscellaneousTables } from './miscellaneous'
import { contactTables } from './contacts'
import { specialTables } from './special'
import { lifeDetailsTables } from './lifeDetails'

// Table registry organized by category
export const tableRegistry: Record<TableCategory, Table[]> = {
  'heritage': heritageTables,
  '100s': heritageTables,
  
  'youth': youthTables,
  '200s': youthTables,
  
  'occupations': occupationTables,
  '300s': occupationTables,
  
  'adulthood': adulthoodTables,
  '400s': adulthoodTables,
  
  'personality': personalityTables,
  '500s': personalityTables,
  
  'miscellaneous': miscellaneousTables,
  '600s': miscellaneousTables,
  
  'contacts': contactTables,
  '700s': contactTables,
  
  'special': specialTables,
  '800s': specialTables,
  
  'lifeDetails': lifeDetailsTables,
  '900s': lifeDetailsTables
}

// Flattened table lookup by ID
export const tableById: Record<string, Table> = {}

// Populate the lookup table
Object.values(tableRegistry).flat().forEach(table => {
  tableById[table.id] = table
})

// Helper functions for table access
export function getTableById(id: string): Table | undefined {
  return tableById[id]
}

export function getTablesByCategory(category: TableCategory): Table[] {
  return tableRegistry[category] || []
}

export function getAllTables(): Table[] {
  return Object.values(tableRegistry).flat()
}

export function getTableCount(): number {
  return getAllTables().length
}

export function getTableCategories(): TableCategory[] {
  return Object.keys(tableRegistry) as TableCategory[]
}

// Validation helpers
export function validateTableRegistry(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const allTables = getAllTables()
  const seenIds = new Set<string>()
  
  // Check for duplicate IDs
  allTables.forEach(table => {
    if (seenIds.has(table.id)) {
      errors.push(`Duplicate table ID: ${table.id}`)
    }
    seenIds.add(table.id)
  })
  
  // Check table structure
  allTables.forEach(table => {
    if (!table.id || !table.name || !table.category) {
      errors.push(`Invalid table structure: ${table.id || 'unknown'}`)
    }
    
    if (!table.entries || table.entries.length === 0) {
      errors.push(`Table ${table.id} has no entries`)
    }
    
    // Check for range overlaps
    if (table.entries.length > 1) {
      const sortedEntries = [...table.entries].sort((a, b) => a.rollRange[0] - b.rollRange[0])
      
      for (let i = 0; i < sortedEntries.length - 1; i++) {
        const current = sortedEntries[i]
        const next = sortedEntries[i + 1]
        
        if (current.rollRange[1] >= next.rollRange[0]) {
          errors.push(
            `Overlapping ranges in table ${table.id}: ` +
            `[${current.rollRange.join('-')}] and [${next.rollRange.join('-')}]`
          )
        }
      }
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Cross-reference validation
export function validateCrossReferences(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  const allTables = getAllTables()
  
  allTables.forEach(table => {
    table.entries.forEach(entry => {
      if (entry.goto) {
        // Extract table ID from goto reference
        const match = entry.goto.match(/(\d+)/)
        if (match) {
          const referencedId = match[1]
          if (!getTableById(referencedId)) {
            errors.push(`Table ${table.id}, entry ${entry.id}: references missing table ${referencedId}`)
          }
        } else {
          warnings.push(`Table ${table.id}, entry ${entry.id}: could not parse goto reference "${entry.goto}"`)
        }
      }
      
      if (entry.subtableReference) {
        const subtable = table.subtables?.find(sub => sub.id === entry.subtableReference)
        if (!subtable) {
          errors.push(`Table ${table.id}, entry ${entry.id}: references missing subtable ${entry.subtableReference}`)
        }
      }
    })
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Statistics
export function getTableStatistics() {
  const allTables = getAllTables()
  const categories = getTableCategories()
  
  const stats = {
    totalTables: allTables.length,
    totalEntries: allTables.reduce((sum, table) => sum + table.entries.length, 0),
    categoryCounts: {} as Record<string, number>,
    diceTypeUsage: {} as Record<string, number>,
    crossReferences: 0,
    subtables: 0
  }
  
  // Count by category
  categories.forEach(category => {
    stats.categoryCounts[category] = getTablesByCategory(category).length
  })
  
  // Count dice types and cross-references
  allTables.forEach(table => {
    const diceType = table.diceType
    stats.diceTypeUsage[diceType] = (stats.diceTypeUsage[diceType] || 0) + 1
    
    table.entries.forEach(entry => {
      if (entry.goto) stats.crossReferences++
      if (entry.subtableReference) stats.subtables++
    })
    
    if (table.subtables) {
      stats.subtables += table.subtables.length
    }
  })
  
  return stats
}

// Export main collections
export {
  heritageTables,
  youthTables, 
  occupationTables,
  adulthoodTables,
  personalityTables,
  miscellaneousTables,
  contactTables,
  specialTables,
  lifeDetailsTables
}

// Default export
export default tableRegistry