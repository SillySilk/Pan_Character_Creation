// Global singleton TableEngine instance for PanCasting

import { TableEngine } from './tableEngine'

// Create a single global instance that all components can share
export const globalTableEngine = new TableEngine({
  validateTables: true,
  enableLogging: true,
  maxRecursionDepth: 10
})

// Export singleton accessor
export function getGlobalTableEngine(): TableEngine {
  return globalTableEngine
}