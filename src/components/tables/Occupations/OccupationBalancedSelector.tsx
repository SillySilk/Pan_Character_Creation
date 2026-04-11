// Balanced Occupation Selector for Main Generation System
// Integrates balanced apprenticeship/occupation tables with existing wizard interface

import React, { useState } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableEngine } from '../../../services/tableEngine'
import { balancedApprenticeshipsTable } from '../../../data/tables/occupations-balanced'
import { BalanceWarningSystem } from '../../ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'
import type { Character } from '../../../types/character'

interface OccupationBalancedSelectorProps {
  onStepComplete?: () => void
}

export function OccupationBalancedSelector({ onStepComplete }: OccupationBalancedSelectorProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [isComplete, setIsComplete] = useState(false)

  // Initialize balanced table if not already registered
  React.useEffect(() => {
    try {
      tableEngine.registerTable(balancedApprenticeshipsTable)
    } catch (error) {
      console.warn('Table may already be registered:', error)
    }
  }, [])

  const processApprenticeship = (apprenticeshipSelection?: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      balancedApprenticeshipsTable.id,
      character,
      apprenticeshipSelection ? { manualSelection: apprenticeshipSelection } : {}
    )
    
    if (result.success) {
      updateCharacter(character)
      setIsComplete(true)
      // Small delay before calling completion to show results
      setTimeout(() => {
        onStepComplete?.()
      }, 1000)
    }
  }

  const rollRandom = () => {
    processApprenticeship()
  }

  if (!character) {
    return (
      <div className="text-center py-8">
        <p className="text-medieval-600">No character selected</p>
      </div>
    )
  }

  if (isComplete) {
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
          <Button onClick={onStepComplete} className="bg-green-600 hover:bg-green-700">
            Continue to Next Stage
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-300 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🛠️</span>
            Balanced Apprenticeships & Occupations
          </CardTitle>
          <CardDescription>
            Professional training with specialized skills and realistic limitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Professional Training</Badge>
            <Badge variant="outline">Skill Specialization</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Apprenticeships & Professional Training</CardTitle>
          <CardDescription>
            Learn a trade or profession that provides specialized skills but creates limitations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={rollRandom} className="bg-orange-600 hover:bg-orange-700">
              🎲 Roll Random Apprenticeship
            </Button>
            <Button 
              onClick={() => processApprenticeship(18)} 
              variant="outline"
            >
              📚 Scholar's Assistant
            </Button>
            <Button 
              onClick={() => processApprenticeship(35)} 
              variant="outline"
            >
              ⚒️ Blacksmith
            </Button>
            <Button 
              onClick={() => processApprenticeship(55)} 
              variant="outline"
            >
              🗡️ Soldier
            </Button>
            <Button 
              onClick={() => processApprenticeship(78)} 
              variant="outline"
            >
              🎭 Entertainer
            </Button>
          </div>
          
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
          
          <p className="text-sm text-medieval-600">
            Each apprenticeship provides valuable professional skills but creates realistic limitations and blind spots in other areas.
          </p>
        </CardContent>
      </Card>

      {character && (
        <BalanceWarningSystem character={character} compact={true} />
      )}
    </div>
  )
}