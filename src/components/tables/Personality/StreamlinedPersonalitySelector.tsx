// Streamlined Personality Selector - Automatic dice rolling with excitement
// No accept/decline buttons - pure dice-driven character development

import { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableEngine } from '../../../services/tableEngine'
import { balancedPersonalityTables } from '../../../data/tables/personality-balanced'
import { BalanceWarningSystem } from '../../ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'

interface StreamlinedPersonalitySelectorProps {
  onStepComplete?: () => void
}

type PersonalityPhase = 'ready' | 'rolling-values' | 'values-complete' | 'rolling-traits' | 'traits-complete' | 'complete'

export function StreamlinedPersonalitySelector({ onStepComplete }: StreamlinedPersonalitySelectorProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [phase, setPhase] = useState<PersonalityPhase>('ready')
  const [currentRoll, setCurrentRoll] = useState<number | null>(null)
  const [lastEvent, setLastEvent] = useState<string>('')
  const [isRolling, setIsRolling] = useState(false)

  // Initialize balanced tables
  useEffect(() => {
    try {
      balancedPersonalityTables.forEach(table => {
        tableEngine.registerTable(table)
      })
    } catch (error) {
      console.warn('Tables may already be registered:', error)
    }
  }, [])

  // Simulate exciting dice roll animation
  const rollDice = (callback: (roll: number) => void) => {
    setIsRolling(true)
    let rollCount = 0
    const maxRolls = 18 // Quick personality assessment
    
    const rollAnimation = setInterval(() => {
      const randomRoll = Math.floor(Math.random() * 100) + 1
      setCurrentRoll(randomRoll)
      rollCount++
      
      if (rollCount >= maxRolls) {
        clearInterval(rollAnimation)
        // Final actual roll
        const finalRoll = Math.floor(Math.random() * 100) + 1
        setCurrentRoll(finalRoll)
        setIsRolling(false)
        
        setTimeout(() => {
          callback(finalRoll)
        }, 700) // Quick transition for personality
      }
    }, 45) // Fast personality reveal
  }

  const processCoreValues = () => {
    if (!character) return
    setPhase('rolling-values')
    
    rollDice((roll) => {
      const result = tableEngine.processTable(
        '501_balanced', // Core Values table
        character,
        { manualSelection: roll }
      )
      
      if (result.success) {
        const valuesTable = balancedPersonalityTables.find(t => t.id === '501_balanced')
        const entry = valuesTable?.entries.find(e => 
          roll >= e.rollRange[0] && roll <= e.rollRange[1]
        )
        setLastEvent(entry?.result || 'Core Value')
        updateCharacter(character)
        setPhase('values-complete')
      }
    })
  }

  const processPersonalityTraits = () => {
    if (!character) return
    setPhase('rolling-traits')
    
    rollDice((roll) => {
      const result = tableEngine.processTable(
        '502_balanced', // Personality Traits table
        character,
        { manualSelection: roll }
      )
      
      if (result.success) {
        const traitsTable = balancedPersonalityTables.find(t => t.id === '502_balanced')
        const entry = traitsTable?.entries.find(e => 
          roll >= e.rollRange[0] && roll <= e.rollRange[1]
        )
        setLastEvent(entry?.result || 'Personality Trait')
        updateCharacter(character)
        setPhase('traits-complete')
      }
    })
  }

  const handleContinue = () => {
    if (phase === 'values-complete') {
      processPersonalityTraits()
    } else if (phase === 'traits-complete') {
      setPhase('complete')
      setTimeout(() => {
        onStepComplete?.()
      }, 1500)
    }
  }


  if (!character) {
    return (
      <div className="text-center py-8">
        <p className="text-medieval-600">No character selected</p>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div className="space-y-6">
        <Card className="border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>✅</span>
              Personality Development Complete
            </CardTitle>
            <CardDescription>
              Core values and personality traits have been established with realistic tradeoffs
            </CardDescription>
          </CardHeader>
        </Card>
        
        <BalanceWarningSystem character={character} />
        
        <div className="text-center">
          <div className="text-2xl mb-2">🎭</div>
          <p className="text-medieval-600">Character generation complete!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎭</span>
            Personality Development
          </CardTitle>
          <CardDescription>
            Core values and personality traits with realistic strengths and weaknesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={phase === 'values-complete' || phase === 'rolling-traits' || (phase as string) === 'traits-complete' || (phase as string) === 'complete' ? 'success' : phase.includes('values') ? 'default' : 'secondary'}>
              Core Values
            </Badge>
            <Badge variant={(phase as string) === 'traits-complete' || (phase as string) === 'complete' ? 'success' : phase.includes('traits') ? 'default' : 'secondary'}>
              Personality Traits
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dice Rolling Display */}
      {(phase.includes('rolling') || currentRoll !== null) && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">🎲</div>
            <div className="text-3xl font-bold text-amber-800 mb-2">
              {currentRoll || '...'}
            </div>
            <p className="text-amber-700">
              {isRolling ? (
                phase.includes('values') ? 'Discovering core values...' : 'Revealing personality traits...'
              ) : `Rolled ${currentRoll}!`}
            </p>
            {!isRolling && lastEvent && (
              <p className="text-sm text-amber-600 mt-2 font-medium">
                Result: {lastEvent}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Phase-specific content */}
      {phase === 'ready' && (
        <Card>
          <CardHeader>
            <CardTitle>Core Values</CardTitle>
            <CardDescription>
              Roll to discover what drives your character and defines their moral compass
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={processCoreValues} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-3"
            >
              🎲 Roll for Core Values
            </Button>
            <p className="text-sm text-medieval-600 text-center">
              Core values shape how your character makes moral decisions and interacts with others
            </p>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h4 className="font-medium text-indigo-800 mb-2">Value Categories</h4>
              <div className="text-sm text-indigo-700 space-y-1">
                <p><strong>Family/Love:</strong> Interpersonal bonds and relationships</p>
                <p><strong>Honor/Justice:</strong> Moral principles and fairness</p>
                <p><strong>Knowledge/Freedom:</strong> Intellectual and personal growth</p>
                <p><strong>Power/Survival:</strong> Material success and self-preservation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 'values-complete' && (
        <Card>
          <CardHeader>
            <CardTitle>Personality Traits</CardTitle>
            <CardDescription>
              Now roll to see how your character interacts with the world and makes decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleContinue} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
            >
              🎲 Roll for Personality Traits
            </Button>
            <p className="text-sm text-medieval-600 text-center">
              Personality traits determine behavioral patterns and social interactions
            </p>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">Trait Categories</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <p><strong>Lightside (1-25):</strong> Virtuous traits with social benefits</p>
                <p><strong>Neutral (26-75):</strong> Practical traits focused on effectiveness</p>
                <p><strong>Darkside (76-95):</strong> Selfish traits with social costs</p>
                <p><strong>Exotic (96-100):</strong> Supernatural or unusual characteristics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 'traits-complete' && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-green-800 mb-2">
              Personality Complete!
            </h3>
            <p className="text-green-700 mb-4">
              Your character's core values and personality traits have been established with realistic tradeoffs
            </p>
            <Button 
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Character Generation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Character Progress */}
      {character && (
        <BalanceWarningSystem character={character} compact={true} />
      )}
    </div>
  )
}