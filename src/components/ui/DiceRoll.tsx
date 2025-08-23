import { useState } from 'react'
import { Dices, RotateCcw } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'
import type { DiceType } from '../../types/tables'

export interface DiceRollProps {
  diceType: DiceType
  modifiers?: number
  label?: string
  onRoll?: (result: number, naturalRoll: number) => void
  disabled?: boolean
  showHistory?: boolean
}

interface RollResult {
  naturalRoll: number
  modifiers: number
  total: number
  timestamp: Date
}

export function DiceRoll({ 
  diceType, 
  modifiers = 0, 
  label, 
  onRoll, 
  disabled = false,
  showHistory = false 
}: DiceRollProps) {
  const [isRolling, setIsRolling] = useState(false)
  const [lastResult, setLastResult] = useState<RollResult | null>(null)
  const [rollHistory, setRollHistory] = useState<RollResult[]>([])

  const rollDice = async () => {
    if (disabled || isRolling) return

    setIsRolling(true)
    
    // Simulate dice roll animation delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Calculate dice roll based on type
    let naturalRoll: number
    
    switch (diceType) {
      case 'd4':
        naturalRoll = Math.floor(Math.random() * 4) + 1
        break
      case 'd6':
        naturalRoll = Math.floor(Math.random() * 6) + 1
        break
      case 'd8':
        naturalRoll = Math.floor(Math.random() * 8) + 1
        break
      case 'd10':
        naturalRoll = Math.floor(Math.random() * 10) + 1
        break
      case 'd12':
        naturalRoll = Math.floor(Math.random() * 12) + 1
        break
      case 'd20':
        naturalRoll = Math.floor(Math.random() * 20) + 1
        break
      case 'd100':
        naturalRoll = Math.floor(Math.random() * 100) + 1
        break
      case '2d10':
        naturalRoll = Math.floor(Math.random() * 10) + 1 + Math.floor(Math.random() * 10) + 1
        break
      case '2d20':
        naturalRoll = Math.floor(Math.random() * 20) + 1 + Math.floor(Math.random() * 20) + 1
        break
      case '3d6':
        naturalRoll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1
        break
      default:
        naturalRoll = 1
    }
    
    const total = naturalRoll + modifiers
    const result: RollResult = {
      naturalRoll,
      modifiers,
      total,
      timestamp: new Date()
    }
    
    setLastResult(result)
    setRollHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 rolls
    setIsRolling(false)
    
    onRoll?.(total, naturalRoll)
  }

  const getDiceDisplay = () => {
    if (diceType.includes('d')) {
      return diceType.toUpperCase()
    }
    return diceType
  }

  const getModifierDisplay = () => {
    if (modifiers === 0) return ''
    return modifiers > 0 ? `+${modifiers}` : `${modifiers}`
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Dices className="h-5 w-5 text-amber-600" />
          {label || 'Roll Dice'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Dice Display */}
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {getDiceDisplay()}
            {getModifierDisplay()}
          </Badge>
        </div>

        {/* Roll Button */}
        <div className="flex justify-center">
          <Button
            variant="dice"
            size="lg"
            onClick={rollDice}
            disabled={disabled || isRolling}
            className={isRolling ? 'animate-pulse' : ''}
          >
            {isRolling ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                Rolling...
              </>
            ) : (
              <>
                <Dices className="mr-2 h-4 w-4" />
                Roll {getDiceDisplay()}
              </>
            )}
          </Button>
        </div>

        {/* Last Result */}
        {lastResult && (
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-900 mb-1">
              {lastResult.total}
            </div>
            <div className="text-sm text-amber-700">
              {lastResult.naturalRoll}
              {lastResult.modifiers !== 0 && (
                <span>
                  {lastResult.modifiers > 0 ? ' + ' : ' - '}
                  {Math.abs(lastResult.modifiers)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Roll History */}
        {showHistory && rollHistory.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-amber-900">Recent Rolls:</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {rollHistory.map((roll, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center text-xs text-amber-700 bg-amber-25 px-2 py-1 rounded"
                >
                  <span>{roll.naturalRoll}{roll.modifiers !== 0 && ` ${roll.modifiers > 0 ? '+' : ''}${roll.modifiers}`}</span>
                  <span className="font-medium">{roll.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}