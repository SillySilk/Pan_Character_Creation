// Streamlined Occupation Selector - Automatic dice rolling with excitement
// No accept/decline buttons - pure dice-driven character development

import { useState, useEffect } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableEngine } from '../../../services/tableEngine'
import { balancedApprenticeshipsTable } from '../../../data/tables/occupations-balanced'
import { BalanceWarningSystem } from '../../ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'

interface StreamlinedOccupationSelectorProps {
  onStepComplete?: () => void
}

type OccupationPhase = 'ready' | 'rolling' | 'complete'

export function StreamlinedOccupationSelector({ onStepComplete }: StreamlinedOccupationSelectorProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [phase, setPhase] = useState<OccupationPhase>('ready')
  const [currentRoll, setCurrentRoll] = useState<number | null>(null)
  const [lastEvent, setLastEvent] = useState<string>('')
  const [isRolling, setIsRolling] = useState(false)

  // Initialize balanced table
  useEffect(() => {
    try {
      tableEngine.registerTable(balancedApprenticeshipsTable)
    } catch (error) {
      console.warn('Table may already be registered:', error)
    }
  }, [])

  // Simulate exciting dice roll animation
  const rollDice = (callback: (roll: number) => void) => {
    setIsRolling(true)
    let rollCount = 0
    const maxRolls = 22 // Professional training takes consideration
    
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
        }, 900) // Show final roll before processing
      }
    }, 55) // Steady professional pace
  }

  const processApprenticeship = () => {
    if (!character) return
    setPhase('rolling')
    
    rollDice((roll) => {
      const result = tableEngine.processTable(
        balancedApprenticeshipsTable.id,
        character,
        { manualSelection: roll }
      )
      
      if (result.success) {
        const entry = balancedApprenticeshipsTable.entries.find(e => 
          roll >= e.rollRange[0] && roll <= e.rollRange[1]
        )
        setLastEvent(entry?.result || 'Apprenticeship')
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
              <span>✅</span>
              Professional Training Complete
            </CardTitle>
            <CardDescription>
              Your character has completed their apprenticeship and gained professional skills
            </CardDescription>
          </CardHeader>
        </Card>
        
        <BalanceWarningSystem character={character} />
        
        <div className="text-center">
          <div className="text-2xl mb-2">⚒️</div>
          <p className="text-medieval-600">Moving to personality development...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🛠️</span>
            Professional Training
          </CardTitle>
          <CardDescription>
            Learn a trade or profession with specialized skills and realistic limitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={(phase as string) === 'complete' ? 'success' : phase === 'rolling' ? 'default' : 'secondary'}>
              Apprenticeship Training
            </Badge>
            <Badge variant="outline">Skill Specialization</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dice Rolling Display */}
      {(phase === 'rolling' || currentRoll !== null) && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">🎲</div>
            <div className="text-3xl font-bold text-amber-800 mb-2">
              {currentRoll || '...'}
            </div>
            <p className="text-amber-700">
              {isRolling ? 'Determining professional path...' : `Rolled ${currentRoll}!`}
            </p>
            {!isRolling && lastEvent && (
              <p className="text-sm text-amber-600 mt-2 font-medium">
                Apprenticeship: {lastEvent}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Phase-specific content */}
      {phase === 'ready' && (
        <Card>
          <CardHeader>
            <CardTitle>Apprenticeships & Professional Training</CardTitle>
            <CardDescription>
              Roll to discover what profession your character learned during their formative training years
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={processApprenticeship} 
              className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
            >
              🎲 Roll for Apprenticeship
            </Button>
            <p className="text-sm text-medieval-600 text-center">
              Each apprenticeship provides valuable professional skills but creates realistic limitations and blind spots
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">Apprenticeship Categories</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <p><strong>Academic (10-25):</strong> Scholar, scribe, researcher - high INT, low physical</p>
                <p><strong>Crafting (26-45):</strong> Smith, artisan, builder - practical skills, specialization</p>
                <p><strong>Military (46-65):</strong> Soldier, guard, knight - combat skills, rigid thinking</p>
                <p><strong>Social (66-85):</strong> Merchant, entertainer, diplomat - charisma, reputation risks</p>
                <p><strong>Specialized (86-100):</strong> Unique professions with major tradeoffs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(phase as string) === 'complete' && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-green-800 mb-2">
              Professional Training Complete!
            </h3>
            <p className="text-green-700 mb-4">
              Your character has mastered their chosen profession and gained specialized capabilities
            </p>
            <Button 
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue to Personality Development
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