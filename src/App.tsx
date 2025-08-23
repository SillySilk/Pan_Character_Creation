
import { useState } from 'react'
import { GenerationWizard } from './components/wizard/GenerationWizard'
import { CharacterManager } from './components/character/CharacterManager'
import { ErrorBoundary } from './components/ui'

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'generate' | 'manage'>('landing')

  const handleStartGeneration = () => {
    setCurrentView('generate')
  }

  const handleGenerationComplete = () => {
    setCurrentView('manage')
  }

  const handleManageCharacters = () => {
    setCurrentView('manage')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  if (currentView === 'generate') {
    return (
      <ErrorBoundary>
        <GenerationWizard 
          onComplete={handleGenerationComplete}
          onCancel={handleBackToLanding}
        />
      </ErrorBoundary>
    )
  }

  if (currentView === 'manage') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-parchment-50 to-parchment-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-medieval-800">
                PanCasting - Character Manager
              </h1>
              <div className="flex gap-3">
                <button 
                  onClick={handleStartGeneration}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Generate New Character
                </button>
                <button 
                  onClick={handleBackToLanding}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
            <CharacterManager />
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  // Landing page
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-parchment-50 to-parchment-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-medieval-800 mb-4">
              🎲 PanCasting
            </h1>
            <p className="text-xl text-medieval-600 max-w-2xl mx-auto">
              Create rich, detailed character backgrounds for your D&D adventures with comprehensive table-driven generation
            </p>
          </header>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-semibold text-medieval-800 mb-4">
                Welcome to PanCasting
              </h2>
              <p className="text-medieval-700 mb-6">
                Generate compelling character backgrounds using an extensive system of interconnected tables covering heritage, youth events, occupations, personality development, and more.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleStartGeneration}
                  className="px-8 py-3 bg-amber-600 text-white rounded-lg text-lg font-medium hover:bg-amber-700 transition-colors"
                >
                  🎭 Start Character Generation
                </button>
                
                <button 
                  onClick={handleManageCharacters}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  📚 Manage Characters
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="text-3xl mb-3">🏰</div>
                <h3 className="text-lg font-semibold text-medieval-800 mb-2">8 Table Categories</h3>
                <p className="text-medieval-600 text-sm">Heritage, Youth, Occupations, Adulthood, Personality, Events, Contacts, and Special Items</p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="text-3xl mb-3">🎲</div>
                <h3 className="text-lg font-semibold text-medieval-800 mb-2">Smart Generation</h3>
                <p className="text-medieval-600 text-sm">Dice-driven tables with cross-references and character effect tracking</p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="text-3xl mb-3">📜</div>
                <h3 className="text-lg font-semibold text-medieval-800 mb-2">Full Export</h3>
                <p className="text-medieval-600 text-sm">Export to D&D 3.5 and 5e character sheets and other formats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App