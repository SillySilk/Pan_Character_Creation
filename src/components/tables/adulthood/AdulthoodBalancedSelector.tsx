// Balanced Adulthood Event Selector for Main Generation System
// Integrates balanced adult life events with existing wizard interface

import React, { useState } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableEngine } from '../../../services/tableEngine'
import balancedAdulthoodEventsTable from '../../../data/tables/adulthood-balanced'
import { BalanceWarningSystem } from '../../ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'

interface AdulthoodBalancedSelectorProps {
  onStepComplete?: () => void
}

export function AdulthoodBalancedSelector({ onStepComplete }: AdulthoodBalancedSelectorProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [isComplete, setIsComplete] = useState(false)

  // Initialize balanced table if not already registered
  React.useEffect(() => {
    try {
      tableEngine.registerTable(balancedAdulthoodEventsTable)
    } catch (error) {
      console.warn('Table may already be registered:', error)
    }
  }, [])

  const processAdulthoodEvent = (eventSelection?: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      balancedAdulthoodEventsTable.id,
      character,
      eventSelection ? { manualSelection: eventSelection } : {}
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
    processAdulthoodEvent()
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
              Adult Life Event Complete
            </CardTitle>
            <CardDescription>
              A major adult experience has shaped your character's mature perspective
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
      <Card className="border-purple-300 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🌟</span>
            Balanced Adult Life Events
          </CardTitle>
          <CardDescription>
            Major adult experiences with realistic consequences and character development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Ages 18+</Badge>
            <Badge variant="outline">2d20 + SolMod System</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adult Life Events</CardTitle>
          <CardDescription>
            Significant experiences that shape your character's mature worldview and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={rollRandom} className="bg-purple-600 hover:bg-purple-700">
              🎲 Roll Random Adult Event
            </Button>
            <Button 
              onClick={() => processAdulthoodEvent(24)} 
              variant="outline"
            >
              🗺️ Travel Experience
            </Button>
            <Button 
              onClick={() => processAdulthoodEvent(4)} 
              variant="outline"
            >
              😈 Made Enemy
            </Button>
            <Button 
              onClick={() => processAdulthoodEvent(34)} 
              variant="outline"
            >
              ✨ Something Wonderful
            </Button>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">Event Categories</h4>
            <div className="text-sm text-amber-700 space-y-1">
              <p><strong>Challenging (2-15):</strong> Hardship teaches hard lessons</p>
              <p><strong>Mixed (16-30):</strong> Varied life experiences with complexity</p>
              <p><strong>Positive (31-40):</strong> Great opportunities with responsibilities</p>
            </div>
          </div>
          
          <p className="text-sm text-medieval-600">
            Adult events use the 2d20 + Social Modifier system and create both significant benefits and realistic challenges.
          </p>
        </CardContent>
      </Card>

      {character && (
        <BalanceWarningSystem character={character} compact={true} />
      )}
    </div>
  )
}