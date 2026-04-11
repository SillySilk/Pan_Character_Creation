import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeTables } from './services/tableInitialization'
import { getGlobalTableEngine } from './services/globalTableEngine'

// Initialize tables at startup
initializeTables().then(() => {
  console.log('🎯 Table initialization complete!')
  
  // Expose table engine globally for debugging
  ;(window as any).tableEngine = getGlobalTableEngine()
  console.log('🔧 Table engine exposed as window.tableEngine for debugging')
  
  // Log some info about registered tables
  const engine = getGlobalTableEngine()
  const allTables = engine.getAllTables()
  console.log(`📊 Total tables registered: ${allTables.length}`)
  
  // Check for table 501 specifically
  const table501 = engine.getTable('501')
  if (table501) {
    console.log('✅ Table 501 (Core Values) is registered:', table501.name)
  } else {
    console.log('❌ Table 501 (Core Values) is NOT registered')
    console.log('Available personality tables:', allTables.filter(t => t.category === 'personality').map(t => `${t.id}: ${t.name}`))
  }
}).catch(console.error)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)