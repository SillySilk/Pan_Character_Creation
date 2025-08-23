// Table service for loading and managing table data

import { tableEngine, TableEngine } from './tableEngine'
import type { Table, TableCategory, TableProcessingOptions, TableProcessingResult } from '../types/tables'
import type { Character } from '../types/character'
import { getTablesByCategory } from '../data/tables'

export interface TableServiceConfig {
  autoLoadTables: boolean
  enableCaching: boolean
  validateOnLoad: boolean
}

export class TableService {
  private engine: TableEngine
  private config: TableServiceConfig
  private loadedCategories: Set<TableCategory> = new Set()
  private cache: Map<string, any> = new Map()

  constructor(engine: TableEngine = tableEngine, config: Partial<TableServiceConfig> = {}) {
    this.engine = engine
    this.config = {
      autoLoadTables: true,
      enableCaching: true,
      validateOnLoad: true,
      ...config
    }
  }

  /**
   * Load tables for a specific category
   */
  async loadTableCategory(category: TableCategory): Promise<void> {
    if (this.loadedCategories.has(category)) {
      return // Already loaded
    }

    try {
      const tables = await this.fetchTablesForCategory(category)
      
      if (this.config.validateOnLoad) {
        this.validateTables(tables)
      }

      tables.forEach(table => this.engine.registerTable(table))
      this.loadedCategories.add(category)
      
      console.log(`Loaded ${tables.length} tables for category: ${category}`)
    } catch (error) {
      console.error(`Failed to load tables for category ${category}:`, error)
      throw error
    }
  }

  /**
   * Load all table categories
   */
  async loadAllTables(): Promise<void> {
    const categories: TableCategory[] = ['100s', '200s', '300s', '400s', '500s', '600s', '700s', '800s']
    
    await Promise.all(
      categories.map(category => this.loadTableCategory(category))
    )
  }

  /**
   * Process a table with character context
   */
  async processTable(
    tableId: string,
    character: Partial<Character>,
    options: Partial<TableProcessingOptions> = {}
  ): Promise<TableProcessingResult> {
    // Ensure required tables are loaded
    const table = this.engine.getTable(tableId)
    if (!table) {
      // Try to determine category from table ID and load it
      const category = this.getCategoryFromTableId(tableId)
      if (category) {
        await this.loadTableCategory(category)
      }
    }

    return this.engine.processTable(tableId, character, options)
  }

  /**
   * Get tables available for character in specific category
   */
  async getAvailableTablesForCategory(
    category: TableCategory, 
    character: Partial<Character>
  ): Promise<Table[]> {
    await this.loadTableCategory(category)
    return this.engine.getAvailableTables(character, category)
  }

  /**
   * Get a specific table by ID
   */
  async getTable(tableId: string): Promise<Table | undefined> {
    let table = this.engine.getTable(tableId)
    
    if (!table) {
      // Try to load the category if not already loaded
      const category = this.getCategoryFromTableId(tableId)
      if (category && !this.loadedCategories.has(category)) {
        await this.loadTableCategory(category)
        table = this.engine.getTable(tableId)
      }
    }

    return table
  }

  /**
   * Search tables by name or description
   */
  async searchTables(_query: string): Promise<Table[]> {
    // Ensure all tables are loaded for search
    if (this.loadedCategories.size < 8) {
      await this.loadAllTables()
    }

    const searchResults: Table[] = []

    // Get all registered tables and search them
    // Note: This is a simplified search - in a real implementation,
    // you'd have access to the actual table objects
    
    return searchResults
  }

  /**
   * Get random table from category
   */
  async getRandomTableFromCategory(category: TableCategory): Promise<Table | undefined> {
    const tables = await this.getAvailableTablesForCategory(category, {})
    if (tables.length === 0) return undefined
    
    const randomIndex = Math.floor(Math.random() * tables.length)
    return tables[randomIndex]
  }

  /**
   * Validate table data integrity
   */
  private validateTables(tables: Table[]): void {
    tables.forEach(table => {
      if (!table.id || !table.name || !table.category) {
        throw new Error(`Invalid table structure: ${JSON.stringify(table)}`)
      }
      
      if (!table.entries || table.entries.length === 0) {
        throw new Error(`Table ${table.id} has no entries`)
      }
    })
  }

  /**
   * Determine table category from table ID
   */
  private getCategoryFromTableId(tableId: string): TableCategory | undefined {
    const idNum = parseInt(tableId)
    
    if (idNum >= 100 && idNum < 200) return '100s'
    if (idNum >= 200 && idNum < 300) return '200s'
    if (idNum >= 300 && idNum < 400) return '300s'
    if (idNum >= 400 && idNum < 500) return '400s'
    if (idNum >= 500 && idNum < 600) return '500s'
    if (idNum >= 600 && idNum < 700) return '600s'
    if (idNum >= 700 && idNum < 800) return '700s'
    if (idNum >= 800 && idNum < 900) return '800s'
    
    return undefined
  }

  /**
   * Fetch tables for a category (placeholder for actual data loading)
   */
  private async fetchTablesForCategory(category: TableCategory): Promise<Table[]> {
    const cacheKey = `tables_${category}`
    if (this.config.enableCaching && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    // Use the centralized table registry
    const tables = getTablesByCategory(category)
    console.log(`✅ Loaded ${tables.length} tables for category ${category}:`, tables.map(t => `${t.id}: ${t.name}`))

    if (this.config.enableCaching) {
      this.cache.set(cacheKey, tables)
    }

    return tables
  }

  /**
   * Get mock table ID for category
   */
  private getMockTableId(category: TableCategory): string {
    const baseIds: Record<string, string> = {
      '100s': '101',
      '200s': '208', 
      '300s': '309',
      '400s': '419',
      '500s': '501',
      '600s': '601',
      '700s': '701',
      '800s': '801',
      'heritage': '101',
      'youth': '208',
      'occupations': '309',
      'adulthood': '419',
      'personality': '501',
      'miscellaneous': '601',
      'contacts': '701',
      'special': '801'
    }
    return baseIds[category] || '101'
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear()
    this.loadedCategories.clear()
  }

  /**
   * Get service statistics
   */
  getStatistics(): any {
    return {
      loadedCategories: Array.from(this.loadedCategories),
      cacheSize: this.cache.size,
      engineStats: this.engine.getStatistics(),
      config: this.config
    }
  }
}

// Default service instance
export const tableService = new TableService()