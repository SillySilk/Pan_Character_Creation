// Tradeoff Preview Component for Character Generation
// Shows balanced effects before they are applied during table selection

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './Dialog'
import type { Effect, BalancedModifier } from '../../types/tables'

interface TradeoffPreviewProps {
  effect: Effect
  eventName: string
  eventDescription?: string
  onAccept: () => void
  onDecline: () => void
  showButtons?: boolean
}

/**
 * Preview of balanced effects before application
 */
function TradeoffPreview({ 
  effect, 
  eventName, 
  eventDescription,
  onAccept, 
  onDecline,
  showButtons = true 
}: TradeoffPreviewProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (effect.type !== 'balanced' || !effect.positiveEffects || !effect.negativeEffects) {
    return null
  }

  const getEffectSummary = (effects: BalancedModifier[], isPositive: boolean) => {
    const categories = effects.reduce((acc, effect) => {
      acc[effect.category] = (acc[effect.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categories).map(([category, count]) => (
      <Badge 
        key={category} 
        variant={isPositive ? 'success' : 'destructive'} 
        className="text-xs mr-1"
      >
        {count} {category}
      </Badge>
    ))
  }

  return (
    <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>⚖️</span>
            {eventName}
          </CardTitle>
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{eventName} - Complete Effects</DialogTitle>
                <DialogDescription>
                  {eventDescription || effect.tradeoffReason}
                </DialogDescription>
              </DialogHeader>
              <DetailedEffectsView 
                positive={effect.positiveEffects}
                negative={effect.negativeEffects}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {eventDescription && (
          <CardDescription>
            {eventDescription}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {/* Quick Summary */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-emerald-700 flex items-center gap-2">
              <span>✅</span>
              Benefits ({effect.positiveEffects.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {getEffectSummary(effect.positiveEffects, true)}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-red-700 flex items-center gap-2">
              <span>❌</span>
              Tradeoffs ({effect.negativeEffects.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {getEffectSummary(effect.negativeEffects, false)}
            </div>
          </div>
        </div>

        {/* Tradeoff Explanation */}
        {effect.tradeoffReason && (
          <div className="p-3 bg-amber-100 border border-amber-200 rounded-lg mb-4">
            <h5 className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
              <span>🤔</span>
              Why This Tradeoff?
            </h5>
            <p className="text-sm text-amber-700">
              {effect.tradeoffReason}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showButtons && (
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={onDecline}
              className="flex items-center gap-2"
            >
              <span>❌</span>
              Decline
            </Button>
            <Button 
              onClick={onAccept}
              className="flex items-center gap-2"
            >
              <span>✅</span>
              Accept Tradeoffs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DetailedEffectsViewProps {
  positive: BalancedModifier[]
  negative: BalancedModifier[]
}

/**
 * Detailed view of all effects in a modal
 */
function DetailedEffectsView({ positive, negative }: DetailedEffectsViewProps) {
  const renderEffect = (effect: BalancedModifier, isPositive: boolean) => (
    <div 
      key={`${effect.type}-${effect.target}`}
      className={`p-3 rounded-lg border ${
        isPositive 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">
          {effect.target}
        </span>
        <Badge variant={isPositive ? 'success' : 'destructive'}>
          {typeof effect.value === 'number' 
            ? (isPositive ? `+${Math.abs(effect.value)}` : `-${Math.abs(effect.value)}`)
            : effect.value.toString()
          }
        </Badge>
      </div>
      <p className="text-sm text-gray-600">{effect.description}</p>
      <div className="mt-2">
        <Badge variant="outline" className="text-xs">
          {effect.type} • {effect.category}
        </Badge>
      </div>
    </div>
  )

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Positive Effects */}
      <div>
        <h4 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
          <span>✅</span>
          Benefits ({positive.length})
        </h4>
        <div className="space-y-3">
          {positive.map(effect => renderEffect(effect, true))}
        </div>
      </div>

      {/* Negative Effects */}
      <div>
        <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
          <span>❌</span>
          Tradeoffs ({negative.length})
        </h4>
        <div className="space-y-3">
          {negative.map(effect => renderEffect(effect, false))}
        </div>
      </div>
    </div>
  )
}

interface CompactTradeoffSummaryProps {
  effect: Effect
  className?: string
}

/**
 * Compact summary for table entries
 */
function CompactTradeoffSummary({ effect, className }: CompactTradeoffSummaryProps) {
  if (effect.type !== 'balanced' || !effect.positiveEffects || !effect.negativeEffects) {
    return null
  }

  const positiveCount = effect.positiveEffects.length
  const negativeCount = effect.negativeEffects.length

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Badge variant="success" className="text-xs">
        +{positiveCount}
      </Badge>
      <span className="text-gray-400">/</span>
      <Badge variant="destructive" className="text-xs">
        -{negativeCount}
      </Badge>
      <span className="text-gray-600 text-xs">effects</span>
    </div>
  )
}

interface BalanceIndicatorBadgeProps {
  positiveCount: number
  negativeCount: number
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Small badge showing balance ratio
 */
function BalanceIndicatorBadge({ positiveCount, negativeCount, size = 'sm' }: BalanceIndicatorBadgeProps) {
  const ratio = negativeCount > 0 ? positiveCount / negativeCount : Infinity
  
  let variant: 'success' | 'warning' | 'destructive' = 'success'
  let text: string
  
  if (ratio > 2) {
    variant = 'warning'
    text = 'Overpowered'
  } else if (ratio < 0.5) {
    variant = 'destructive' 
    text = 'Harsh'
  } else {
    variant = 'success'
    text = 'Balanced'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <Badge variant={variant} className={sizeClasses[size]}>
      ⚖️ {text}
    </Badge>
  )
}

export {
  TradeoffPreview,
  CompactTradeoffSummary,
  BalanceIndicatorBadge,
  DetailedEffectsView
}