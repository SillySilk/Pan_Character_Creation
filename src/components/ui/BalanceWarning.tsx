// Balance Warning System for Character Sheet
// Provides real-time feedback on character balance during generation

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import type { BalanceAssessment, Character } from '../../types/character'

interface BalanceWarningSystemProps {
  character: Character
  onSuggestBalance?: () => void
  compact?: boolean
}

/**
 * Complete balance warning system for character sheet
 */
function BalanceWarningSystem({ 
  character, 
  onSuggestBalance, 
  compact = false 
}: BalanceWarningSystemProps) {
  if (!character.modifierSummary?.overallBalance) {
    return null
  }

  const assessment = character.modifierSummary.overallBalance

  if (assessment.warnings.length === 0) {
    return compact ? (
      <Badge variant="success" className="flex items-center gap-1">
        <span>✅</span>
        Well Balanced
      </Badge>
    ) : (
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="flex items-center justify-center py-4">
          <div className="text-center">
            <span className="text-2xl mb-2 block">✅</span>
            <p className="font-semibold text-emerald-700">Character is Well Balanced</p>
            <p className="text-sm text-emerald-600 mt-1">
              Good mix of strengths and limitations
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <CompactWarningDisplay assessment={assessment} />
    )
  }

  return (
    <DetailedWarningDisplay 
      assessment={assessment} 
      onSuggestBalance={onSuggestBalance}
    />
  )
}

interface CompactWarningDisplayProps {
  assessment: BalanceAssessment
}

/**
 * Compact warning display for smaller spaces
 */
function CompactWarningDisplay({ assessment }: CompactWarningDisplayProps) {
  const severityLevel = getSeverityLevel(assessment)
  
  return (
    <div className="flex items-center gap-2">
      <Badge variant={severityLevel.variant} className="flex items-center gap-1">
        <span>{severityLevel.icon}</span>
        {severityLevel.text}
      </Badge>
      <span className="text-xs text-gray-500">
        {assessment.warnings.length} issue{assessment.warnings.length !== 1 ? 's' : ''}
      </span>
    </div>
  )
}

interface DetailedWarningDisplayProps {
  assessment: BalanceAssessment
  onSuggestBalance?: () => void
}

/**
 * Detailed warning display with full information
 */
function DetailedWarningDisplay({ assessment, onSuggestBalance }: DetailedWarningDisplayProps) {
  const severityLevel = getSeverityLevel(assessment)
  
  return (
    <Card className={`border-2 ${severityLevel.borderClass} ${severityLevel.bgClass}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${severityLevel.textClass}`}>
          <span className="text-2xl">{severityLevel.icon}</span>
          Character Balance Issues
        </CardTitle>
        <CardDescription>
          Your character may be unbalanced. Consider making adjustments.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Balance Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-emerald-100 rounded">
            <div className="text-xl font-bold text-emerald-700">
              +{assessment.totalPositive}
            </div>
            <div className="text-xs text-emerald-600">Benefits</div>
          </div>
          <div className="text-center p-3 bg-amber-100 rounded">
            <div className="text-xl font-bold text-amber-700">
              {assessment.netBalance >= 0 ? '+' : ''}{assessment.netBalance}
            </div>
            <div className="text-xs text-amber-600">Net</div>
          </div>
          <div className="text-center p-3 bg-red-100 rounded">
            <div className="text-xl font-bold text-red-700">
              -{assessment.totalNegative}
            </div>
            <div className="text-xs text-red-600">Tradeoffs</div>
          </div>
        </div>

        {/* Warning List */}
        <div className="space-y-2 mb-4">
          {assessment.warnings.map((warning, index) => (
            <WarningItem key={index} warning={warning} />
          ))}
        </div>

        {/* Suggestions */}
        <BalanceSuggestions assessment={assessment} />

        {/* Action Button */}
        {onSuggestBalance && (
          <div className="mt-4 text-center">
            <Button onClick={onSuggestBalance} variant="outline">
              Get Balance Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface WarningItemProps {
  warning: string
}

/**
 * Individual warning item with appropriate styling
 */
function WarningItem({ warning }: WarningItemProps) {
  const getWarningType = (warning: string) => {
    if (warning.includes('exceeds recommended limit')) return 'extreme'
    if (warning.includes('significantly more')) return 'imbalanced'
    if (warning.includes('very severe')) return 'harsh'
    return 'general'
  }

  const warningType = getWarningType(warning)
  const icons = {
    extreme: '🚨',
    imbalanced: '⚖️',
    harsh: '😰',
    general: '⚠️'
  }

  return (
    <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
      <span className="text-lg flex-shrink-0">{icons[warningType]}</span>
      <p className="text-sm text-yellow-800">{warning}</p>
    </div>
  )
}

interface BalanceSuggestionsProps {
  assessment: BalanceAssessment
}

/**
 * Suggestions for improving character balance
 */
function BalanceSuggestions({ assessment }: BalanceSuggestionsProps) {
  const suggestions = generateBalanceSuggestions(assessment)
  
  if (suggestions.length === 0) return null

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
        <span>💡</span>
        Balance Suggestions
      </h5>
      <ul className="space-y-1">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
            <span className="text-blue-500 flex-shrink-0">•</span>
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Generate balance suggestions based on assessment
 */
function generateBalanceSuggestions(assessment: BalanceAssessment): string[] {
  const suggestions: string[] = []
  const ratio = assessment.totalNegative > 0 ? assessment.totalPositive / assessment.totalNegative : Infinity

  if (ratio > 2) {
    suggestions.push("Consider accepting events with more challenging tradeoffs")
    suggestions.push("Look for opportunities to add realistic limitations")
    suggestions.push("Some struggle makes characters more interesting to roleplay")
  }

  if (ratio < 0.5) {
    suggestions.push("Seek out events that provide more benefits")
    suggestions.push("Consider if some negative effects might be too harsh")
    suggestions.push("Balance harsh backgrounds with some positive experiences")
  }

  // Specific warning-based suggestions
  assessment.warnings.forEach(warning => {
    if (warning.includes('Ability score total')) {
      suggestions.push("Consider events that modify different ability scores")
    }
    if (warning.includes('bonus') && warning.includes('exceeds')) {
      suggestions.push("Diversify skill development across multiple areas")
    }
    if (warning.includes('penalty') && warning.includes('very severe')) {
      suggestions.push("Look for ways to offset severe penalties with small bonuses")
    }
  })

  return [...new Set(suggestions)] // Remove duplicates
}

/**
 * Get severity level information for styling
 */
function getSeverityLevel(assessment: BalanceAssessment) {
  const ratio = assessment.totalNegative > 0 ? assessment.totalPositive / assessment.totalNegative : Infinity
  const hasExtremeWarnings = assessment.warnings.some(w => 
    w.includes('exceeds recommended limit') || w.includes('very severe')
  )

  if (hasExtremeWarnings || ratio > 3 || ratio < 0.3) {
    return {
      icon: '🚨',
      text: 'Severe Issues',
      variant: 'destructive' as const,
      borderClass: 'border-red-300',
      bgClass: 'bg-red-50',
      textClass: 'text-red-700'
    }
  }

  if (ratio > 2 || ratio < 0.5) {
    return {
      icon: '⚠️',
      text: 'Balance Issues',
      variant: 'warning' as const,
      borderClass: 'border-orange-300',
      bgClass: 'bg-orange-50',
      textClass: 'text-orange-700'
    }
  }

  return {
    icon: '⚖️',
    text: 'Minor Issues',
    variant: 'secondary' as const,
    borderClass: 'border-yellow-300',
    bgClass: 'bg-yellow-50',
    textClass: 'text-yellow-700'
  }
}

interface RealTimeBalanceTrackerProps {
  character: Character
  className?: string
}

/**
 * Real-time balance tracker for wizard steps
 */
function RealTimeBalanceTracker({ character, className }: RealTimeBalanceTrackerProps) {
  if (!character.modifierSummary?.overallBalance) {
    return null
  }

  const assessment = character.modifierSummary.overallBalance
  const ratio = assessment.totalNegative > 0 ? assessment.totalPositive / assessment.totalNegative : Infinity

  let balanceColor: string
  let balanceText: string

  if (ratio > 2) {
    balanceColor = 'text-orange-600'
    balanceText = 'Overpowered'
  } else if (ratio < 0.5) {
    balanceColor = 'text-red-600'
    balanceText = 'Underpowered'
  } else {
    balanceColor = 'text-emerald-600'
    balanceText = 'Balanced'
  }

  return (
    <div className={`flex items-center gap-3 p-2 rounded-lg bg-white border ${className}`}>
      <div className="flex items-center gap-1 text-sm">
        <span className="font-medium">Balance:</span>
        <span className={`font-bold ${balanceColor}`}>{balanceText}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="text-emerald-600">+{assessment.totalPositive}</span>
        <span>/</span>
        <span className="text-red-600">-{assessment.totalNegative}</span>
      </div>
      {assessment.warnings.length > 0 && (
        <Badge variant="warning" className="text-xs">
          {assessment.warnings.length} issues
        </Badge>
      )}
    </div>
  )
}

export {
  BalanceWarningSystem,
  CompactWarningDisplay,
  DetailedWarningDisplay,
  WarningItem,
  BalanceSuggestions,
  RealTimeBalanceTracker
}