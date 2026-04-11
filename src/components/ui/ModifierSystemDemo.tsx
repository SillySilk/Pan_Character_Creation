// Demo Component for Balanced Modifier System UI
// Showcases all the new components working together

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { Separator } from './Separator'
import { Badge } from './Badge'
import { 
  CharacterModifiersView, 
  ModifierSummaryDisplay, 
  BalanceIndicator 
} from './ModifierDisplay'
import { 
  TradeoffPreview, 
  CompactTradeoffSummary, 
  BalanceIndicatorBadge 
} from './TradeoffPreview'
import { 
  BalanceWarningSystem, 
  RealTimeBalanceTracker 
} from './BalanceWarning'
import type { Character, AppliedModifier, ModifierSummary } from '../../types/character'
import type { Effect } from '../../types/tables'

/**
 * Demo component showcasing the balanced modifier UI system
 */
export function ModifierSystemDemo() {
  const [selectedDemo, setSelectedDemo] = useState<string>('character')

  // Sample data for demonstrations
  const sampleCharacter = createSampleCharacter()
  const sampleEffect = createSampleEffect()

  const demoOptions = [
    { id: 'character', label: 'Character View', icon: '👤' },
    { id: 'tradeoff', label: 'Tradeoff Preview', icon: '⚖️' },
    { id: 'warnings', label: 'Balance Warnings', icon: '⚠️' },
    { id: 'tracker', label: 'Real-time Tracker', icon: '📊' }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Demo Header */}
      <Card className="border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span>🎲</span>
            Balanced Modifier System - UI Demo
          </CardTitle>
          <CardDescription>
            Interactive showcase of the new balanced character development system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {demoOptions.map(option => (
              <Button
                key={option.id}
                variant={selectedDemo === option.id ? 'default' : 'outline'}
                onClick={() => setSelectedDemo(option.id)}
                className="flex items-center gap-2"
              >
                <span>{option.icon}</span>
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Content */}
      {selectedDemo === 'character' && (
        <DemoSection title="Complete Character Modifier View">
          <CharacterModifiersView 
            character={sampleCharacter} 
            showBreakdown={true}
          />
        </DemoSection>
      )}

      {selectedDemo === 'tradeoff' && (
        <DemoSection title="Tradeoff Preview During Generation">
          <div className="space-y-4">
            <TradeoffPreview
              effect={sampleEffect}
              eventName="Scholar's Assistant Apprenticeship"
              eventDescription="Intensive academic training under a learned master"
              onAccept={() => alert('Effects applied!')}
              onDecline={() => alert('Event declined')}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compact Summary Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Sickly Child</span>
                  <CompactTradeoffSummary effect={sampleEffect} />
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Athletic Prodigy</span>
                  <BalanceIndicatorBadge positiveCount={3} negativeCount={2} />
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Noble Training</span>
                  <BalanceIndicatorBadge positiveCount={5} negativeCount={1} />
                </div>
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}

      {selectedDemo === 'warnings' && (
        <DemoSection title="Balance Warning System">
          <div className="space-y-4">
            <BalanceWarningSystem 
              character={sampleCharacter}
              onSuggestBalance={() => alert('Balance suggestions would appear here')}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compact Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Well Balanced Character</span>
                    <BalanceWarningSystem character={createBalancedCharacter()} compact />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Overpowered Character</span>
                    <BalanceWarningSystem character={createOverpoweredCharacter()} compact />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Harsh Character</span>
                    <BalanceWarningSystem character={sampleCharacter} compact />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}

      {selectedDemo === 'tracker' && (
        <DemoSection title="Real-time Balance Tracking">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generation Wizard Integration</CardTitle>
                <CardDescription>
                  Shows how balance tracking appears during character generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded bg-gray-50">
                  <h4 className="font-medium mb-2">Step 3: Youth Events</h4>
                  <RealTimeBalanceTracker character={createBalancedCharacter()} />
                </div>
                
                <div className="p-4 border rounded bg-gray-50">
                  <h4 className="font-medium mb-2">Step 4: Apprenticeship</h4>
                  <RealTimeBalanceTracker character={createOverpoweredCharacter()} />
                </div>
                
                <div className="p-4 border rounded bg-gray-50">
                  <h4 className="font-medium mb-2">Step 5: Adult Events</h4>
                  <RealTimeBalanceTracker character={sampleCharacter} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Character Sheet Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <ModifierSummaryDisplay summary={sampleCharacter.modifierSummary!} />
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}

      {/* System Status */}
      <Card className="border-emerald-300 bg-emerald-50">
        <CardContent className="py-4">
          <div className="text-center">
            <h3 className="font-bold text-emerald-800 mb-2 flex items-center justify-center gap-2">
              <span>🎉</span>
              Balanced Modifier System Status
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="success">✅ Core System</Badge>
              <Badge variant="success">✅ Character Store</Badge>
              <Badge variant="success">✅ Table Engine</Badge>
              <Badge variant="success">✅ UI Components</Badge>
              <Badge variant="success">✅ Balance Validation</Badge>
            </div>
            <p className="text-sm text-emerald-700 mt-2">
              All systems operational - Characters now have realistic tradeoffs!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface DemoSectionProps {
  title: string
  children: React.ReactNode
}

function DemoSection({ title, children }: DemoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
        <span>📋</span>
        {title}
      </h2>
      {children}
    </div>
  )
}

// Sample data creation functions
function createSampleCharacter(): Character {
  return {
    id: 'demo_char',
    name: 'Sample Character',
    age: 18,
    
    // Minimal required fields
    race: { name: 'Human', type: 'Human', events: [], modifiers: {} },
    culture: { name: 'Civilized', type: 'Civilized', cuMod: 0, nativeEnvironment: [], survival: 6, benefits: [], literacyRate: 50 },
    socialStatus: { level: 'Comfortable', solMod: 0, survivalMod: 0, moneyMultiplier: 1, literacyMod: 0, benefits: [] },
    birthCircumstances: { legitimacy: 'Legitimate', familyHead: 'Father', siblings: 1, birthOrder: 1, birthplace: 'Town', unusualCircumstances: [], biMod: 0 },
    family: { head: 'Father', members: [], occupations: [], relationships: [], notableFeatures: [], socialConnections: [] },
    
    youthEvents: [], adulthoodEvents: [], miscellaneousEvents: [],
    occupations: [], apprenticeships: [], hobbies: [], skills: [],
    values: { mostValuedPerson: '', mostValuedThing: '', mostValuedAbstraction: '', strength: 'Average', motivations: [] },
    alignment: { primary: 'Neutral', attitude: '', description: '', behaviorGuidelines: [] },
    personalityTraits: { lightside: [], neutral: [], darkside: [], exotic: [] },
    npcs: [], companions: [], rivals: [], relationships: [],
    gifts: [], legacies: [], specialItems: [],
    activeModifiers: { cuMod: 0, solMod: 0, tiMod: 0, biMod: 0, legitMod: 0 },
    generationHistory: [],
    
    // Sample modifier data showing a harsh character
    appliedModifiers: [
      {
        sourceEvent: 'Sickly Child',
        sourceTable: '209',
        appliedAt: new Date(),
        tradeoffReason: 'Chronic illness creates medical knowledge but weakens physical capabilities',
        positive: [
          { type: 'skill', target: 'Heal', value: 3, description: 'Understanding of illness and medicine', category: 'intellectual' },
          { type: 'trait', target: 'Empathy', value: 'Strong', description: 'Compassionate toward suffering', category: 'social' }
        ],
        negative: [
          { type: 'ability', target: 'Constitution', value: -2, description: 'Weakened by chronic illness', category: 'physical' },
          { type: 'skill', target: 'Athletics', value: -3, description: 'Limited physical activity', category: 'physical' }
        ]
      },
      {
        sourceEvent: 'Family Tragedy',
        sourceTable: '209',
        appliedAt: new Date(),
        tradeoffReason: 'Trauma creates wisdom but also emotional barriers',
        positive: [
          { type: 'ability', target: 'Wisdom', value: 1, description: 'Early exposure to harsh realities', category: 'psychological' },
          { type: 'skill', target: 'Sense Motive', value: 4, description: 'Understanding grief and human nature', category: 'social' }
        ],
        negative: [
          { type: 'ability', target: 'Charisma', value: -1, description: 'Emotional withdrawal', category: 'social' },
          { type: 'skill', target: 'Diplomacy', value: -2, description: 'Difficulty forming relationships', category: 'social' }
        ]
      }
    ],
    
    modifierSummary: {
      abilityScores: { Constitution: -2, Wisdom: 1, Charisma: -1 },
      skills: { Heal: 3, Athletics: -3, 'Sense Motive': 4, Diplomacy: -2 },
      traits: ['Empathy'],
      socialModifiers: [],
      overallBalance: {
        totalPositive: 8,
        totalNegative: 8,
        netBalance: 0,
        warnings: [
          'Constitution penalty (-2) is significant for survival',
          'Athletics penalty (-3) severely limits physical activities'
        ]
      }
    },
    
    dndIntegration: {
      abilityModifiers: { strength: 0, dexterity: 0, constitution: -2, intelligence: 0, wisdom: 1, charisma: -1 },
      skillBonuses: {},
      startingGold: 0,
      bonusLanguages: [], traits: [], flaws: [], equipment: [], specialAbilities: [], backgroundFeatures: []
    }
  } as Character
}

function createBalancedCharacter(): Character {
  const char = createSampleCharacter()
  char.modifierSummary!.overallBalance = {
    totalPositive: 6,
    totalNegative: 6,
    netBalance: 0,
    warnings: []
  }
  return char
}

function createOverpoweredCharacter(): Character {
  const char = createSampleCharacter()
  char.modifierSummary!.overallBalance = {
    totalPositive: 12,
    totalNegative: 2,
    netBalance: 10,
    warnings: ['Character has significantly more benefits than drawbacks']
  }
  return char
}

function createSampleEffect(): Effect {
  return {
    type: 'balanced',
    target: 'character',
    positiveEffects: [
      { type: 'ability', target: 'Intelligence', value: 1, description: 'Constant study sharpens mind', category: 'intellectual' },
      { type: 'skill', target: 'Knowledge', value: 4, description: 'Specialized academic training', category: 'intellectual' },
      { type: 'skill', target: 'Research', value: 3, description: 'Master library skills', category: 'intellectual' }
    ],
    negativeEffects: [
      { type: 'ability', target: 'Constitution', value: -1, description: 'Sedentary lifestyle', category: 'physical' },
      { type: 'skill', target: 'Athletics', value: -3, description: 'No physical activity', category: 'physical' }
    ],
    tradeoffReason: 'Academic specialization creates intellectual excellence but physical weakness'
  }
}

// Export handled by function declaration above