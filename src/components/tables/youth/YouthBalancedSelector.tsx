// Balanced Youth Event Selector for Main Generation System
// Integrates balanced modifier tables with existing wizard interface

import React, { useState } from 'react'
import { useCharacterStore } from '../../../stores/characterStore'
import { tableEngine } from '../../../services/tableEngine'
import { balancedChildhoodEventsTable } from '../../../data/tables/youth-balanced'
import balancedAdolescenceEventsTable from '../../../data/tables/adolescence-balanced'
import { TradeoffPreview, BalanceWarningSystem } from '../../ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'
import type { Character } from '../../../types/character'
import type { Effect } from '../../../types/tables'

interface YouthBalancedSelectorProps {
  onStepComplete?: () => void
}

export function YouthBalancedSelector({ onStepComplete }: YouthBalancedSelectorProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [currentPhase, setCurrentPhase] = useState<'childhood' | 'adolescence' | 'complete'>('childhood')
  const [selectedEvent, setSelectedEvent] = useState<Effect | null>(null)

  // Initialize balanced tables if not already registered
  React.useEffect(() => {
    try {
      tableEngine.registerTable(balancedChildhoodEventsTable)
      tableEngine.registerTable(balancedAdolescenceEventsTable)
    } catch (error) {
      console.warn('Tables may already be registered:', error)
    }
  }, [])

  const processChildhoodEvent = (eventSelection?: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      balancedChildhoodEventsTable.id,
      character,
      eventSelection ? { manualSelection: eventSelection } : {}
    )
    
    if (result.success) {
      updateCharacter(character)
      setCurrentPhase('adolescence')
    }
  }

  const processAdolescenceEvent = (eventSelection?: number) => {
    if (!character) return
    
    const result = tableEngine.processTable(
      balancedAdolescenceEventsTable.id,
      character,
      eventSelection ? { manualSelection: eventSelection } : {}
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
    if (currentPhase === 'childhood') {
      processChildhoodEvent()
    } else if (currentPhase === 'adolescence') {
      processAdolescenceEvent()
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
              Youth Development Complete
            </CardTitle>
            <CardDescription>
              Childhood and adolescence events have shaped your character's early development
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
      <Card className="border-amber-300 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎭</span>
            Balanced Youth Development
          </CardTitle>
          <CardDescription>
            Experience formative events with realistic tradeoffs and character growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant={currentPhase === 'childhood' ? 'default' : 'success'}>
              Childhood (Ages 1-12)
            </Badge>
            <Badge variant={currentPhase === 'adolescence' ? 'default' : 'secondary'}>
              Adolescence (Ages 13-18)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {currentPhase === 'childhood' && (
        <Card>
          <CardHeader>
            <CardTitle>Childhood Events (Ages 1-12)</CardTitle>
            <CardDescription>
              Foundational experiences that shape your character's basic capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={rollRandom} className="bg-amber-600 hover:bg-amber-700">
                🎲 Roll Random Childhood Event
              </Button>
              <Button 
                onClick={() => processChildhoodEvent(75)} 
                variant="outline"
              >
                📚 Academic Achievement (Sample)
              </Button>
            </div>
            <p className="text-sm text-medieval-600">
              Each event provides both positive benefits and realistic limitations based on your character's focus during childhood.
            </p>
          </CardContent>
        </Card>
      )}

      {currentPhase === 'adolescence' && (
        <Card>
          <CardHeader>
            <CardTitle>Adolescence Events (Ages 13-18)</CardTitle>
            <CardDescription>
              Teenage experiences that develop personality and social skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={rollRandom} className="bg-blue-600 hover:bg-blue-700">
                🎲 Roll Random Adolescence Event
              </Button>
              <Button 
                onClick={() => processAdolescenceEvent(10)} 
                variant="outline"
              >
                💕 First Love (Sample)
              </Button>
            </div>
            <p className="text-sm text-medieval-600">
              Adolescent events shape social abilities and emotional development with realistic consequences.
            </p>
          </CardContent>
        </Card>
      )}

      {character && (
        <BalanceWarningSystem character={character} compact={true} />
      )}
    </div>
  )
}