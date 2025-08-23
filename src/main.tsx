import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeTables } from './services/tableInitialization'

// Initialize tables at startup
initializeTables().catch(console.error)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)