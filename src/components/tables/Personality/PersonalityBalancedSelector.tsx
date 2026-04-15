// Balanced Personality Selector for Main Generation System
// Integrates balanced personality and values tables with existing wizard interface

import React, { useState } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableEngine } from '../../../services/tableEngine'
import { balancedPersonalityTables } from '../../../data/tables/personality-balanced'
import { BalanceWarningSystem } from '../../ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'

interface PersonalityBalancedSelectorProps {
  onStepComplete?: () => void
}

export function PersonalityBalancedSelector({ onStepComplete }: PersonalityBalancedSelectorProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [currentPhase, setCurrentPhase] = useState<'values' | 'traits' | 'complete'>('values')

  // Initialize balanced tables if not already registered
  React.useEffect(() => {
    try {
      balancedPersonalityTables.forEach(table => {
        tableEngine.registerTable(table)
      })
    } catch (error) {
      console.warn('Tables may already be registered:', error)
    }
  }, [])

  const processCoreValues = (valueSelection?: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      '501_balanced', // Core Values table
      character,
      valueSelection ? { manualSelection: valueSelection } : {}
    )
    
    if (result.success) {
      updateCharacter(character)
      setCurrentPhase('traits')
    }
  }

  const processPersonalityTraits = (traitSelection?: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      '502_balanced', // Personality Traits table
      character,
      traitSelection ? { manualSelection: traitSelection } : {}
    )
    
    if (result.success) {
      updateCharacter(character)
      setCurrentPhase('complete')
      // Small delay before calling completion to show results
      setTimeout(() => {
        onStepComplete?.()
      }, 1000)
    }
  }

  const rollRandom = () => {
    if (currentPhase === 'values') {
      processCoreValues()
    } else if (currentPhase === 'traits') {
      processPersonalityTraits()
    }
  }

  if (!character) {
    return (
      <div className="text-center py-8">
        <p className="text-medieval-600">No character selected</p>
      </div>
    )
  }

  if (currentPhase === 'complete') {
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
          <Button onClick={onStepComplete} className="bg-green-600 hover:bg-green-700">
            Continue to Next Stage
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-indigo-300 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎭</span>
            Balanced Personality Development
          </CardTitle>
          <CardDescription>
            Core values and personality traits with realistic strengths and weaknesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant={currentPhase === 'values' ? 'default' : 'success'}>
              Core Values
            </Badge>
            <Badge variant={currentPhase === 'traits' ? 'default' : 'secondary'}>
              Personality Traits
            </Badge>
          </div>
        </CardContent>
      </Card>

      {currentPhase === 'values' && (
        <Card>
          <CardHeader>
            <CardTitle>Core Values</CardTitle>
            <CardDescription>
              What drives your character and defines their moral compass
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Button onClick={rollRandom} className="bg-indigo-600 hover:bg-indigo-700">
                🎲 Roll Random Core Value
              </Button>
              <Button 
                onClick={() => processCoreValues(25)} 
                variant="outline"
              >
                👨‍👩‍👧‍👦 Family Above All
              </Button>
              <Button 
                onClick={() => processCoreValues(35)} 
                variant="outline"
              >
                🎓 Knowledge & Truth  
              </Button>
              <Button 
                onClick={() => processCoreValues(55)} 
                variant="outline"
              >
                ⚖️ Justice & Fairness
              </Button>
            </div>
            
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

      {currentPhase === 'traits' && (
        <Card>
          <CardHeader>
            <CardTitle>Personality Traits</CardTitle>
            <CardDescription>
              How your character interacts with the world and makes decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Button onClick={rollRandom} className="bg-purple-600 hover:bg-purple-700">
                🎲 Roll Random Personality Trait
              </Button>
              <Button 
                onClick={() => processPersonalityTraits(3)} 
                variant="outline"
              >
                😇 Honest [Light]
              </Button>
              <Button 
                onClick={() => processPersonalityTraits(45)} 
                variant="outline"
              >
                🤔 Cautious [Neutral]
              </Button>
              <Button 
                onClick={() => processPersonalityTraits(80)} 
                variant="outline"
              >
                😈 Selfish [Dark]
              </Button>
              <Button 
                onClick={() => processPersonalityTraits(98)} 
                variant="outline"
              >
                🌟 Exotic Trait
              </Button>
            </div>
            
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

      {character && (
        <BalanceWarningSystem character={character} compact={true} />
      )}
    </div>
  )
}