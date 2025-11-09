// Debug test component
import { tableEngine } from '../services/tableEngine'
import { childhoodEventsTable } from '../data/tables/youth'
import type { Character } from '../types/character'

export function DebugTest() {
  const testTableEngine = () => {
    try {
      console.log('🧪 Testing table engine...')
      
      // Register table
      tableEngine.registerTable(childhoodEventsTable)
      console.log('✅ Table registered')
      
      // Test character
      const testCharacter: Partial<Character> = {
        race: { name: 'Human' } as any,
        activeModifiers: { cuMod: 1 } as any
      }

      // Process table
      const result = tableEngine.processTable(childhoodEventsTable, testCharacter)
      console.log('✅ Table processed:', result)
      
      return result
    } catch (error) {
      console.error('❌ Test failed:', error)
      return null
    }
  }

  return (
    <div className="p-4 bg-yellow-100 border-2 border-yellow-500 rounded">
      <h3 className="font-bold">Debug Test</h3>
      <button 
        onClick={testTableEngine}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Table Engine
      </button>
    </div>
  )
}