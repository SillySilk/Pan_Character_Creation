// Streamlined Youth Selector - Automatic dice rolling with excitement
// No accept/decline buttons - pure dice-driven character development

import { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableEngine } from '../../../services/tableEngine'
import { balancedChildhoodEventsTable } from '../../../data/tables/youth-balanced'
import balancedAdolescenceEventsTable from '../../../data/tables/adolescence-balanced'
import { BalanceWarningSystem } from '../../ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'

interface StreamlinedYouthSelectorProps {
  onStepComplete?: () => void
}

type YouthPhase = 'ready' | 'rolling-childhood' | 'childhood-complete' | 'rolling-adolescence' | 'adolescence-complete' | 'complete'

export function StreamlinedYouthSelector({ onStepComplete }: StreamlinedYouthSelectorProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [phase, setPhase] = useState<YouthPhase>('ready')
  const [currentRoll, setCurrentRoll] = useState<number | null>(null)
  const [lastEvent, setLastEvent] = useState<string>('')
  const [isRolling, setIsRolling] = useState(false)

  // Initialize balanced tables
  useEffect(() => {
    try {
      tableEngine.registerTable(balancedChildhoodEventsTable)
      tableEngine.registerTable(balancedAdolescenceEventsTable)
    } catch (error) {
      console.warn('Tables may already be registered:', error)
    }
  }, [])

  // Simulate exciting dice roll animation
  const rollDice = (callback: (roll: number) => void) => {
    setIsRolling(true)
    let rollCount = 0
    const maxRolls = 20 // Number of rapid rolls for animation
    
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
        }, 800) // Pause to show final roll
      }
    }, 50) // Fast animation
  }

  const processChildhoodEvent = () => {
    if (!character) return
    setPhase('rolling-childhood')
    
    rollDice((roll) => {
      const result = tableEngine.processTable(
        balancedChildhoodEventsTable.id,
        character,
        { manualSelection: roll }
      )
      
      if (result.success) {
        const entry = balancedChildhoodEventsTable.entries.find(e => 
          roll >= e.rollRange[0] && roll <= e.rollRange[1]
        )
        setLastEvent(entry?.result || 'Childhood Event')
        updateCharacter(character)
        setPhase('childhood-complete')
      }
    })
  }

  const processAdolescenceEvent = () => {
    if (!character) return
    setPhase('rolling-adolescence')
    
    rollDice((roll) => {
      const result = tableEngine.processTable(
        balancedAdolescenceEventsTable.id,
        character,
        { manualSelection: roll }
      )
      
      if (result.success) {
        const entry = balancedAdolescenceEventsTable.entries.find(e => 
          roll >= e.rollRange[0] && roll <= e.rollRange[1]
        )
        setLastEvent(entry?.result || 'Adolescence Event')
        updateCharacter(character)
        setPhase('adolescence-complete')
      }
    })
  }

  const handleContinue = () => {
    if (phase === 'childhood-complete') {
      processAdolescenceEvent()
    } else if (phase === 'adolescence-complete') {
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
              <span>🌟</span>
              Youth Development Complete
            </CardTitle>
            <CardDescription>
              Your character's formative years have shaped their foundational capabilities
            </CardDescription>
          </CardHeader>
        </Card>
        
        <BalanceWarningSystem character={character} />
        
        <div className="text-center">
          <div className="text-2xl mb-2">✨</div>
          <p className="text-medieval-600">Moving to the next stage...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-emerald-300 bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🌱</span>
            Youth Development
          </CardTitle>
          <CardDescription>
            Your character's formative experiences from childhood through adolescence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={phase === 'childhood-complete' || phase === 'adolescence-complete' ? 'success' : phase.includes('childhood') ? 'default' : 'secondary'}>
              Childhood (Ages 1-12)
            </Badge>
            <Badge variant={phase === 'adolescence-complete' ? 'success' : phase.includes('adolescence') ? 'default' : 'secondary'}>
              Adolescence (Ages 13-18)
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
              {isRolling ? 'Rolling the dice...' : `Rolled ${currentRoll}!`}
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
            <CardTitle>Childhood Years (Ages 1-12)</CardTitle>
            <CardDescription>
              Roll to discover what formative experience shaped your early years
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={processChildhoodEvent} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
            >
              🎲 Roll for Childhood Event
            </Button>
            <p className="text-sm text-medieval-600 text-center">
              Each childhood experience creates both strengths and natural limitations
            </p>
          </CardContent>
        </Card>
      )}

      {phase === 'childhood-complete' && (
        <Card>
          <CardHeader>
            <CardTitle>Adolescent Years (Ages 13-18)</CardTitle>
            <CardDescription>
              Now roll to see how your teenage years further developed your character
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleContinue} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
            >
              🎲 Roll for Adolescence Event
            </Button>
            <p className="text-sm text-medieval-600 text-center">
              Teenage experiences shape social skills and emotional development
            </p>
          </CardContent>
        </Card>
      )}

      {phase === 'adolescence-complete' && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-green-800 mb-2">
              Youth Development Complete!
            </h3>
            <p className="text-green-700 mb-4">
              Your character's foundational years have been shaped by chance and circumstance
            </p>
            <Button 
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue to Professional Training
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