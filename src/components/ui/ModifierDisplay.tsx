// UI Components for displaying balanced modifiers and tradeoffs
// Integrates with the existing parchment theme and design system

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'
import { Separator } from './Separator'
import type { 
  AppliedModifier, 
  ModifierSummary, 
  BalanceAssessment, 
  BalancedModifier,
  Character
} from '../../types/character'

interface ModifierEffectProps {
  effect: BalancedModifier
  isPositive: boolean
}

/**
 * Individual modifier effect display
 */
function ModifierEffect({ effect, isPositive }: ModifierEffectProps) {
  const getEffectIcon = (type: string) => {
    switch (type) {
      case 'ability': return '💪'
      case 'skill': return '🎯'
      case 'trait': return '🎭'
      case 'social': return '🤝'
      case 'special': return '✨'
      default: return '📝'
    }
  }

  const getValueDisplay = () => {
    if (typeof effect.value === 'number') {
      const value = isPositive ? Math.abs(effect.value) : -Math.abs(effect.value)
      return value >= 0 ? `+${value}` : `${value}`
    }
    return effect.value.toString()
  }

  return (
    <div className={`flex items-center gap-2 p-2 rounded-md ${
      isPositive 
        ? 'bg-emerald-50 border border-emerald-200' 
        : 'bg-red-50 border border-red-200'
    }`}>
      <span className="text-lg">{getEffectIcon(effect.type)}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {effect.target}
          </span>
          <Badge variant={isPositive ? 'success' : 'destructive'} className="text-xs">
            {getValueDisplay()}
          </Badge>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {effect.description}
        </p>
      </div>
    </div>
  )
}

interface ModifierSourceProps {
  appliedModifier: AppliedModifier
  showDetails?: boolean
}

/**
 * Display a single applied modifier with all its effects
 */
function ModifierSource({ appliedModifier, showDetails = true }: ModifierSourceProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          {appliedModifier.sourceEvent}
          <Badge variant="outline" className="text-xs">
            {appliedModifier.appliedAt.toLocaleDateString()}
          </Badge>
        </CardTitle>
        {appliedModifier.tradeoffReason && (
          <CardDescription className="text-sm italic">
            {appliedModifier.tradeoffReason}
          </CardDescription>
        )}
      </CardHeader>
      
      {showDetails && (
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Positive Effects */}
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                <span>✅</span>
                Benefits ({appliedModifier.positive.length})
              </h4>
              <div className="space-y-2">
                {appliedModifier.positive.map((effect, index) => (
                  <ModifierEffect 
                    key={`pos-${index}`} 
                    effect={effect} 
                    isPositive={true}
                  />
                ))}
              </div>
            </div>

            {/* Negative Effects */}
            <div>
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <span>❌</span>
                Tradeoffs ({appliedModifier.negative.length})
              </h4>
              <div className="space-y-2">
                {appliedModifier.negative.map((effect, index) => (
                  <ModifierEffect 
                    key={`neg-${index}`} 
                    effect={effect} 
                    isPositive={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

interface ModifierSummaryProps {
  summary: ModifierSummary
}

/**
 * Character modifier summary showing net effects
 */
function ModifierSummaryDisplay({ summary }: ModifierSummaryProps) {
  const hasAbilityChanges = Object.keys(summary.abilityScores).length > 0
  const hasSkillChanges = Object.keys(summary.skills).length > 0
  const hasTraits = summary.traits.length > 0
  const hasSocialMods = summary.socialModifiers.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📊</span>
          Character Modifier Summary
        </CardTitle>
        <CardDescription>
          Net effects from all background events and training
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ability Score Changes */}
          {hasAbilityChanges && (
            <div>
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <span>💪</span>
                Ability Score Changes
              </h4>
              <div className="space-y-2">
                {Object.entries(summary.abilityScores).map(([ability, modifier]) => (
                  <div key={ability} className="flex items-center justify-between p-2 bg-amber-50 rounded">
                    <span className="capitalize font-medium">{ability}</span>
                    <Badge variant={modifier >= 0 ? 'success' : 'destructive'}>
                      {modifier >= 0 ? '+' : ''}{modifier}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Modifiers */}
          {hasSkillChanges && (
            <div>
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <span>🎯</span>
                Skill Modifiers
              </h4>
              <div className="space-y-2">
                {Object.entries(summary.skills).map(([skill, modifier]) => (
                  <div key={skill} className="flex items-center justify-between p-2 bg-amber-50 rounded">
                    <span className="font-medium">{skill}</span>
                    <Badge variant={modifier >= 0 ? 'success' : 'destructive'}>
                      {modifier >= 0 ? '+' : ''}{modifier}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traits Gained */}
          {hasTraits && (
            <div>
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <span>🎭</span>
                Personality Traits
              </h4>
              <div className="space-y-2">
                {summary.traits.map((trait, index) => (
                  <Badge key={index} variant="neutral" className="mr-2 mb-2">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Social Modifiers */}
          {hasSocialMods && (
            <div>
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <span>🤝</span>
                Social Modifiers
              </h4>
              <div className="space-y-2">
                {summary.socialModifiers.map((social, index) => (
                  <div key={index} className="p-2 bg-amber-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{social.context}</span>
                      <Badge variant={social.modifier >= 0 ? 'success' : 'destructive'}>
                        {social.modifier >= 0 ? '+' : ''}{social.modifier}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{social.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Balance Assessment */}
        <Separator className="my-6" />
        <BalanceIndicator assessment={summary.overallBalance} />
      </CardContent>
    </Card>
  )
}

interface BalanceIndicatorProps {
  assessment: BalanceAssessment
}

/**
 * Visual indicator of character balance
 */
function BalanceIndicator({ assessment }: BalanceIndicatorProps) {
  const getBalanceStatus = () => {
    const ratio = assessment.totalNegative > 0 ? assessment.totalPositive / assessment.totalNegative : Infinity
    
    if (ratio > 2) return { status: 'overpowered', color: 'warning', text: 'Too Many Benefits' }
    if (ratio < 0.5) return { status: 'underpowered', color: 'destructive', text: 'Too Many Drawbacks' }
    return { status: 'balanced', color: 'success', text: 'Well Balanced' }
  }

  const balance = getBalanceStatus()

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-amber-800 flex items-center gap-2">
        <span>⚖️</span>
        Character Balance
      </h4>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-emerald-50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-700">
            +{assessment.totalPositive}
          </div>
          <div className="text-sm text-emerald-600">Benefits</div>
        </div>
        
        <div className="p-3 bg-amber-50 rounded-lg">
          <div className="text-2xl font-bold text-amber-700">
            {assessment.netBalance >= 0 ? '+' : ''}{assessment.netBalance}
          </div>
          <div className="text-sm text-amber-600">Net Balance</div>
        </div>
        
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-700">
            -{assessment.totalNegative}
          </div>
          <div className="text-sm text-red-600">Tradeoffs</div>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <Badge variant={balance.color as any} className="text-sm px-4 py-1">
          {balance.text}
        </Badge>
      </div>
      
      {assessment.warnings.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            Balance Warnings
          </h5>
          <ul className="space-y-1">
            {assessment.warnings.map((warning, index) => (
              <li key={index} className="text-sm text-yellow-700">
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

interface CharacterModifiersViewProps {
  character: Character
  showBreakdown?: boolean
}

/**
 * Complete modifier view for a character
 */
function CharacterModifiersView({ character, showBreakdown = true }: CharacterModifiersViewProps) {
  if (!character.modifierSummary || !character.appliedModifiers) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No modifier data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary View */}
      <ModifierSummaryDisplay summary={character.modifierSummary} />
      
      {/* Detailed Breakdown */}
      {showBreakdown && character.appliedModifiers.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span>📋</span>
            Modifier Sources ({character.appliedModifiers.length})
          </h3>
          {character.appliedModifiers.map((modifier, index) => (
            <ModifierSource 
              key={index} 
              appliedModifier={modifier}
              showDetails={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export {
  ModifierEffect,
  ModifierSource,
  ModifierSummaryDisplay,
  BalanceIndicator,
  CharacterModifiersView
}