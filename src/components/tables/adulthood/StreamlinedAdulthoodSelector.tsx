// Streamlined Adulthood Selector - Automatic dice rolling with excitement
// No accept/decline buttons - pure dice-driven character development

import React, { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableEngine } from '../../../services/tableEngine'
import balancedAdulthoodEventsTable from '../../../data/tables/adulthood-balanced'
import { BalanceWarningSystem } from '../../ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'
import type { Character } from '../../../types/character'

interface StreamlinedAdulthoodSelectorProps {
  onStepComplete?: () => void
}

type AdulthoodPhase = 'ready' | 'rolling' | 'complete'

export function StreamlinedAdulthoodSelector({ onStepComplete }: StreamlinedAdulthoodSelectorProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [phase, setPhase] = useState<AdulthoodPhase>('ready')
  const [currentRoll, setCurrentRoll] = useState<number | null>(null)
  const [lastEvent, setLastEvent] = useState<string>('')
  const [isRolling, setIsRolling] = useState(false)

  // Initialize balanced table
  useEffect(() => {
    try {
      tableEngine.registerTable(balancedAdulthoodEventsTable)
    } catch (error) {
      console.warn('Table may already be registered:', error)
    }
  }, [])

  // Simulate exciting dice roll animation
  const rollDice = (callback: (roll: number) => void) => {
    setIsRolling(true)
    let rollCount = 0
    const maxRolls = 25 // Longer animation for dramatic adult events
    
    const rollAnimation = setInterval(() => {
      const randomRoll = Math.floor(Math.random() * 40) + 2 // 2d20 visual simulation
      setCurrentRoll(randomRoll)
      rollCount++
      
      if (rollCount >= maxRolls) {
        clearInterval(rollAnimation)
        
        // Calculate actual 2d20 + SolMod roll
        const die1 = Math.floor(Math.random() * 20) + 1
        const die2 = Math.floor(Math.random() * 20) + 1
        const solMod = character?.social || 0
        const finalRoll = die1 + die2 + solMod
        
        setCurrentRoll(finalRoll)
        setIsRolling(false)
        
        setTimeout(() => {
          callback(finalRoll)
        }, 1000) // Longer pause to show final roll
      }
    }, 60) // Slightly slower for dramatic effect
  }

  const processAdulthoodEvent = () => {
    if (!character) return
    setPhase('rolling')
    
    rollDice((roll) => {
      const result = tableEngine.processTable(
        balancedAdulthoodEventsTable.id,
        character,
        { manualSelection: roll }
      )
      
      if (result.success) {
        const entry = balancedAdulthoodEventsTable.entries.find(e => 
          roll >= e.rollRange[0] && roll <= e.rollRange[1]
        )
        setLastEvent(entry?.result || 'Adult Life Event')
        updateCharacter(character)
        setPhase('complete')
      }
    })
  }

  const handleContinue = () => {
    setTimeout(() => {
      onStepComplete?.()
    }, 1500)
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
              Adult Life Event Complete
            </CardTitle>
            <CardDescription>
              A major adult experience has shaped your character's mature perspective
            </CardDescription>
          </CardHeader>
        </Card>
        
        <BalanceWarningSystem character={character} />
        
        <div className="text-center">
          <div className="text-2xl mb-2">✨</div>
          <p className="text-medieval-600">Moving to professional training...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-300 bg-gradient-to-r from-purple-50 to-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🌟</span>
            Adult Life Events
          </CardTitle>
          <CardDescription>
            Major experiences that shape your character's mature worldview (Ages 18+)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={phase === 'complete' ? 'success' : phase === 'rolling' ? 'default' : 'secondary'}>
              Major Life Experience
            </Badge>
            <Badge variant="outline">2d20 + Social Modifier</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dice Rolling Display */}
      {(phase === 'rolling' || currentRoll !== null) && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">🎲🎲</div>
            <div className="text-3xl font-bold text-amber-800 mb-2">
              {currentRoll || '...'}
            </div>
            <p className="text-amber-700">
              {isRolling ? 'Rolling 2d20 + Social Modifier...' : `Rolled ${currentRoll}!`}
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
            <CardTitle>Major Adult Life Event</CardTitle>
            <CardDescription>
              Roll to discover what significant experience has shaped your adult years
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={processAdulthoodEvent} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
            >
              🎲 Roll for Adult Life Event
            </Button>
            <p className="text-sm text-medieval-600 text-center">
              Adult events use 2d20 + Social Modifier and create both significant benefits and realistic challenges
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">Event Categories</h4>
              <div className="text-sm text-amber-700 space-y-1">
                <p><strong>Challenging (2-15):</strong> Hardship teaches hard lessons</p>
                <p><strong>Mixed (16-30):</strong> Varied life experiences with complexity</p>
                <p><strong>Positive (31-40):</strong> Great opportunities with responsibilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 'complete' && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-green-800 mb-2">
              Adult Experience Complete!
            </h3>
            <p className="text-green-700 mb-4">
              A major life event has shaped your character's mature perspective and capabilities
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