// Complete Integration Demo Component
// Demonstrates the entire balanced modifier system working together

import { useState, useEffect } from 'react'
import { tableEngine } from '../services/tableEngine'
import { balancedChildhoodEventsTable } from '../data/tables/youth-balanced'
import { balancedApprenticeshipsTable } from '../data/tables/occupations-balanced'
import balancedAdolescenceEventsTable from '../data/tables/adolescence-balanced'
import balancedAdulthoodEventsTable from '../data/tables/adulthood-balanced'
import { balancedPersonalityTables } from '../data/tables/personality-balanced'
import { 
  CharacterModifiersView,
  TradeoffPreview,
  BalanceWarningSystem,
  RealTimeBalanceTracker,
  ModifierSystemDemo
} from './ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Separator } from './ui/Separator'
import type { Character } from '../types/character'
import type { Effect } from '../types/tables'

/**
 * Complete integration demonstration of the balanced modifier system
 */
export function IntegrationDemo() {
  const [character, setCharacter] = useState<Character | null>(null)
  const [currentStep, setCurrentStep] = useState<'start' | 'childhood' | 'adolescence' | 'adulthood' | 'apprentice' | 'personality' | 'complete'>('start')
  const [systemStatus, setSystemStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  // Initialize the system on mount
  useEffect(() => {
    try {
      // Register balanced tables
      tableEngine.registerTable(balancedChildhoodEventsTable)
      tableEngine.registerTable(balancedAdolescenceEventsTable)
      tableEngine.registerTable(balancedAdulthoodEventsTable)
      tableEngine.registerTable(balancedApprenticeshipsTable)
      
      // Register personality tables
      balancedPersonalityTables.forEach(table => {
        tableEngine.registerTable(table)
      })
      
      setSystemStatus('ready')
    } catch (error) {
      console.error('System initialization failed:', error)
      setSystemStatus('error')
    }
  }, [])

  // Create initial character
  const createCharacter = () => {
    const newCharacter: Character = {
      id: 'demo_char',
      name: 'Demo Character',
      age: 12,
      
      // Basic heritage
      race: { name: 'Human', type: 'Human', events: [], modifiers: {} },
      culture: { name: 'Civilized', type: 'Civilized', cuMod: 1, nativeEnvironment: [], survival: 6, benefits: [], literacyRate: 75 },
      socialStatus: { level: 'Comfortable', solMod: 0, survivalMod: 0, moneyMultiplier: 1, literacyMod: 0, benefits: [] },
      birthCircumstances: { legitimacy: 'Legitimate', familyHead: 'Father', siblings: 1, birthOrder: 1, birthplace: 'Town', unusualCircumstances: [], biMod: 0 },
      family: { head: 'Father', members: [], occupations: [], relationships: [], notableFeatures: [], socialConnections: [] },
      
      // Empty arrays
      youthEvents: [], adulthoodEvents: [], miscellaneousEvents: [],
      occupations: [], apprenticeships: [], hobbies: [], skills: [],
      values: { mostValuedPerson: '', mostValuedThing: '', mostValuedAbstraction: '', strength: 'Average', motivations: [] },
      alignment: { primary: 'Neutral', attitude: '', description: '', behaviorGuidelines: [] },
      personalityTraits: { lightside: [], neutral: [], darkside: [], exotic: [] },
      npcs: [], companions: [], rivals: [], relationships: [],
      gifts: [], legacies: [], specialItems: [],
      
      // System data
      activeModifiers: { cuMod: 1, solMod: 0, tiMod: 0, biMod: 0, legitMod: 0 },
      generationHistory: [],
      appliedModifiers: [],
      modifierSummary: {
        abilityScores: {},
        skills: {},
        traits: [],
        socialModifiers: [],
        overallBalance: { totalPositive: 0, totalNegative: 0, netBalance: 0, warnings: [] }
      },
      
      dndIntegration: {
        abilityModifiers: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
        skillBonuses: {}, startingGold: 0, bonusLanguages: [], traits: [], flaws: [], equipment: [], specialAbilities: [], backgroundFeatures: []
      }
    }
    
    setCharacter(newCharacter)
    setCurrentStep('childhood')
  }

  // Process childhood event
  const processChildhoodEvent = (eventSelection: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      balancedChildhoodEventsTable.id,
      character,
      { manualSelection: eventSelection }
    )
    
    if (result.success) {
      setCharacter({ ...character })
      setCurrentStep('adolescence')
    }
  }

  // Process adolescence event
  const processAdolescenceEvent = (eventSelection: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      balancedAdolescenceEventsTable.id,
      character,
      { manualSelection: eventSelection }
    )
    
    if (result.success) {
      setCharacter({ ...character })
      setCurrentStep('adulthood')
    }
  }

  // Process adulthood event
  const processAdulthoodEvent = (eventSelection: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      balancedAdulthoodEventsTable.id,
      character,
      { manualSelection: eventSelection }
    )
    
    if (result.success) {
      setCharacter({ ...character })
      setCurrentStep('apprentice')
    }
  }

  // Process apprenticeship
  const processApprenticeship = (apprenticeSelection: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      balancedApprenticeshipsTable.id,
      character,
      { manualSelection: apprenticeSelection }
    )
    
    if (result.success) {
      setCharacter({ ...character })
      setCurrentStep('personality')
    }
  }

  // Process personality trait
  const processPersonality = (personalitySelection: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      '502_balanced', // Balanced Personality Traits table
      character,
      { manualSelection: personalitySelection }
    )
    
    if (result.success) {
      setCharacter({ ...character })
      setCurrentStep('complete')
    }
  }

  // Get sample effects for preview
  const getSampleEffect = (type: 'childhood' | 'adolescence' | 'adulthood' | 'apprentice' | 'personality'): Effect | null => {
    if (type === 'childhood') {
      // Academic Achievement effect
      return {
        type: 'balanced',
        target: 'character',
        positiveEffects: [
          { type: 'skill', target: 'Knowledge', value: 4, description: 'Exceptional academic performance', category: 'intellectual' },
          { type: 'skill', target: 'Research', value: 3, description: 'Mastered study techniques', category: 'intellectual' }
        ],
        negativeEffects: [
          { type: 'ability', target: 'Constitution', value: -1, description: 'Sedentary lifestyle', category: 'physical' },
          { type: 'skill', target: 'Athletics', value: -3, description: 'No time for physical activities', category: 'physical' }
        ],
        tradeoffReason: 'Academic excellence through intense study creates intellectual prowess but physical weakness'
      }
    } else if (type === 'adolescence') {
      // First Love effect
      return {
        type: 'balanced',
        target: 'character',
        positiveEffects: [
          { type: 'ability', target: 'Wisdom', value: 1, description: 'Gained emotional maturity', category: 'psychological' },
          { type: 'skill', target: 'Sense Motive', value: 1, description: 'Better understanding of others\' feelings', category: 'social' }
        ],
        negativeEffects: [
          { type: 'trait', target: 'Romantic Vulnerability', value: 'Minor', description: 'Can be distracted by romantic interests', category: 'psychological' }
        ],
        tradeoffReason: 'First love teaches emotional wisdom but creates romantic vulnerability'
      }
    } else if (type === 'adulthood') {
      // Travel Experience effect
      return {
        type: 'balanced',
        target: 'character',
        positiveEffects: [
          { type: 'ability', target: 'Wisdom', value: 1, description: 'Broadened perspective from diverse experiences', category: 'intellectual' },
          { type: 'skill', target: 'Knowledge (Geography)', value: 2, description: 'Firsthand knowledge of distant places', category: 'intellectual' },
          { type: 'skill', target: 'Survival', value: 1, description: 'Navigated unfamiliar terrains', category: 'physical' }
        ],
        negativeEffects: [
          { type: 'skill', target: 'Knowledge (Local)', value: -1, description: 'Out of touch with local developments', category: 'social' },
          { type: 'trait', target: 'Wanderlust', value: 'Strong', description: 'Difficulty settling in one place', category: 'psychological' }
        ],
        tradeoffReason: 'Extensive travel provides worldly wisdom but creates restlessness and local disconnect'
      }
    } else if (type === 'personality') {
      // Honest personality trait
      return {
        type: 'balanced',
        target: 'character',
        positiveEffects: [
          { type: 'skill', target: 'Diplomacy', value: 1, description: 'Trusted for honesty and integrity', category: 'social' },
          { type: 'trait', target: 'Trustworthy', value: 'Strong', description: 'Word is absolutely reliable', category: 'social' }
        ],
        negativeEffects: [
          { type: 'skill', target: 'Bluff', value: -2, description: 'Cannot lie convincingly', category: 'social' },
          { type: 'trait', target: 'Tactless', value: 'Minor', description: 'Sometimes hurtfully direct', category: 'social' }
        ],
        tradeoffReason: 'Complete honesty builds trust but eliminates deception abilities'
      }
    } else {
      // Scholar's Assistant effect
      return {
        type: 'balanced',
        target: 'character',
        positiveEffects: [
          { type: 'ability', target: 'Intelligence', value: 1, description: 'Constant study sharpens mind', category: 'intellectual' },
          { type: 'skill', target: 'Knowledge (any)', value: 4, description: 'Specialized academic training', category: 'intellectual' }
        ],
        negativeEffects: [
          { type: 'skill', target: 'Survival', value: -3, description: 'No practical outdoor experience', category: 'physical' },
          { type: 'social', target: 'common_people', value: -2, description: 'Difficulty relating to non-academics', category: 'social' }
        ],
        tradeoffReason: 'Academic specialization creates intellectual excellence but practical helplessness'
      }
    }
  }

  if (systemStatus === 'loading') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">⏳</div>
            <p>Loading balanced modifier system...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (systemStatus === 'error') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-700">System initialization failed</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span>🎲</span>
            Balanced Modifier System - Live Integration Demo
          </CardTitle>
          <CardDescription>
            Watch the complete system work from table selection to character display
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={systemStatus === 'ready' ? 'success' : 'destructive'}>
              System: {systemStatus}
            </Badge>
            {character && (
              <RealTimeBalanceTracker character={character} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Start */}
      {currentStep === 'start' && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create Character</CardTitle>
            <CardDescription>
              Start with a basic character to see the balanced modifier system in action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={createCharacter} className="flex items-center gap-2">
              <span>🎭</span>
              Create Demo Character
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Childhood Event */}
      {currentStep === 'childhood' && character && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Childhood Event Selection</CardTitle>
              <CardDescription>
                Choose a childhood event and see the tradeoff preview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TradeoffPreview
                effect={getSampleEffect('childhood')!}
                eventName="Academic Achievement"
                eventDescription="Excelled in studies through intense focus"
                onAccept={() => processChildhoodEvent(75)} // Academic Achievement
                onDecline={() => processChildhoodEvent(35)} // Different event
                showButtons={true}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Adolescence Event */}
      {currentStep === 'adolescence' && character && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Adolescence Event Selection</CardTitle>
              <CardDescription>
                Navigate the challenges of teenage years (ages 13-18)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TradeoffPreview
                effect={getSampleEffect('adolescence')!}
                eventName="First Love"
                eventDescription="Experienced first romantic relationship with all its joys and heartbreak"
                onAccept={() => processAdolescenceEvent(10)} // First Love
                onDecline={() => processAdolescenceEvent(45)} // Different event
                showButtons={true}
              />
            </CardContent>
          </Card>

          {/* Show current character state */}
          <BalanceWarningSystem character={character} compact={true} />
        </div>
      )}

      {/* Step 4: Adulthood Event */}
      {currentStep === 'adulthood' && character && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Adulthood Event</CardTitle>
              <CardDescription>
                Major life events that shape your adult character (ages 18+)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TradeoffPreview
                effect={getSampleEffect('adulthood')!}
                eventName="Travel Experience"
                eventDescription="Extended journey to distant lands and foreign cultures"
                onAccept={() => processAdulthoodEvent(24)} // Travel Experience
                onDecline={() => processAdulthoodEvent(15)} // Different event
                showButtons={true}
              />
            </CardContent>
          </Card>

          {/* Show current character state */}
          <BalanceWarningSystem character={character} compact={true} />
        </div>
      )}

      {/* Step 5: Apprenticeship */}
      {currentStep === 'apprentice' && character && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Apprenticeship Selection</CardTitle>
              <CardDescription>
                Choose an apprenticeship that builds on your life experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TradeoffPreview
                effect={getSampleEffect('apprentice')!}
                eventName="Scholar's Assistant"
                eventDescription="Academic apprenticeship under a learned master"
                onAccept={() => processApprenticeship(18)} // Scholar's Assistant
                onDecline={() => processApprenticeship(50)} // Different apprenticeship
                showButtons={true}
              />
            </CardContent>
          </Card>

          {/* Show current character state */}
          <BalanceWarningSystem character={character} compact={true} />
        </div>
      )}

      {/* Step 6: Personality Selection */}
      {currentStep === 'personality' && character && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 6: Personality Development</CardTitle>
              <CardDescription>
                Core personality traits that define character interactions and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TradeoffPreview
                effect={getSampleEffect('personality')!}
                eventName="Honest"
                eventDescription="Always speaks the truth, even when it hurts"
                onAccept={() => processPersonality(3)} // Honest
                onDecline={() => processPersonality(40)} // Different personality trait
                showButtons={true}
              />
            </CardContent>
          </Card>

          {/* Show current character state */}
          <BalanceWarningSystem character={character} compact={true} />
        </div>
      )}

      {/* Step 7: Complete Character */}
      {currentStep === 'complete' && character && (
        <div className="space-y-6">
          <Card className="border-emerald-300 bg-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎉</span>
                Character Development Complete!
              </CardTitle>
              <CardDescription>
                See how the balanced modifier system created a realistic character through all life stages and personality development
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Full character display */}
          <CharacterModifiersView 
            character={character}
            showBreakdown={true}
          />
        </div>
      )}

      {/* Component Showcase */}
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Component Showcase</CardTitle>
          <CardDescription>
            Explore all the UI components in the balanced modifier system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModifierSystemDemo />
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="border-blue-300 bg-blue-50">
        <CardContent className="py-4">
          <div className="text-center space-y-2">
            <h3 className="font-bold text-blue-800">🚀 System Integration Status</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="success">✅ Table Engine</Badge>
              <Badge variant="success">✅ Modifier Calculator</Badge>
              <Badge variant="success">✅ Character Store</Badge>
              <Badge variant="success">✅ UI Components</Badge>
              <Badge variant="success">✅ Balance Validation</Badge>
              <Badge variant="success">✅ Real-time Tracking</Badge>
            </div>
            <p className="text-sm text-blue-700">
              Complete balanced modifier system fully operational!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IntegrationDemo