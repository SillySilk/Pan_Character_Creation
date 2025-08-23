// Table initialization service for PanCasting

import { getGlobalTableEngine } from './globalTableEngine'
import { getAllTables } from '../data/tables'

/**
 * Initialize the global table engine with all available tables
 */
export async function initializeTables(): Promise<void> {
  const tableEngine = getGlobalTableEngine()
  const allTables = getAllTables()
  
  console.log('🔧 Initializing table engine with', allTables.length, 'tables...')
  
  // Register all tables with the engine
  for (const table of allTables) {
    tableEngine.registerTable(table)
    console.log(`✅ Registered table ${table.id}: ${table.name}`)
  }
  
  console.log('🎯 Table engine initialization complete!')
}