# PanCasting Technical Implementation Plan for Balanced Modifiers

## Overview

This document outlines the technical implementation strategy for integrating the balanced positive/negative modifier system into the PanCasting codebase. The plan focuses on maintaining the existing table structure while extending it to support realistic character development tradeoffs.

---

## 1. Data Structure Modifications

### Current Table Entry Structure (Simplified)
```typescript
interface TableEntry {
  id: string
  rollRange: [number, number]
  result: string
  description: string
  effects?: Effect[]
  goto?: string
}

interface Effect {
  type: string
  target: string
  value: any
}
```

### Enhanced Effect Structure
```typescript
interface BalancedEffect {
  // Existing structure
  type: 'ability' | 'skill' | 'trait' | 'modifier' | 'item' | 'relationship'
  target: string
  value: any
  
  // New fields for balanced modifiers
  positiveEffects: ModifierEffect[]
  negativeEffects: ModifierEffect[]
  tradeoffReason?: string  // Thematic explanation
}

interface ModifierEffect {
  type: 'ability' | 'skill' | 'trait' | 'social' | 'special'
  target: string           // Specific ability/skill name
  value: number           // Modifier value (+/-)
  description: string     // Human-readable description
  category: 'physical' | 'intellectual' | 'social' | 'psychological'
}
```

### Character Store Enhancements
```typescript
interface Character {
  // Existing fields...
  
  // Enhanced modifier tracking
  appliedModifiers: AppliedModifier[]
  modifierSummary: ModifierSummary
}

interface AppliedModifier {
  sourceEvent: string      // Event that granted this modifier
  sourceTable: string     // Table ID
  positive: ModifierEffect[]
  negative: ModifierEffect[]
  appliedAt: Date
}

interface ModifierSummary {
  abilityScores: Record<string, number>    // Net ability score changes
  skills: Record<string, number>           // Net skill bonuses/penalties
  traits: string[]                         // Special traits gained
  socialModifiers: SocialModifier[]        // Situational social effects
}
```

---

## 2. Table Data Updates

### Example: Enhanced Youth Event Entry
```typescript
// Before (current structure)
{
  id: '209_03',
  rollRange: [16, 25],
  result: 'Mentored by Elder',
  description: 'Wise elder takes interest in education',
  effects: [
    {
      type: 'skill',
      target: 'skills',
      value: { name: 'Lore', rank: 2, type: 'Academic' }
    }
  ]
}

// After (balanced structure)
{
  id: '209_03',
  rollRange: [16, 25],
  result: 'Mentored by Elder',
  description: 'Wise elder takes interest in education',
  effects: [
    {
      type: 'balanced',
      target: 'character',
      positiveEffects: [
        {
          type: 'skill',
          target: 'Knowledge (chosen)',
          value: 4,
          description: 'Intensive academic tutoring',
          category: 'intellectual'
        },
        {
          type: 'skill',
          target: 'Research',
          value: 3,
          description: 'Library and study techniques',
          category: 'intellectual'
        },
        {
          type: 'special',
          target: 'languages',
          value: 2,
          description: 'Elder taught multiple languages',
          category: 'intellectual'
        }
      ],
      negativeEffects: [
        {
          type: 'skill',
          target: 'Handle Animal',
          value: -2,
          description: 'Sheltered from nature and animals',
          category: 'physical'
        },
        {
          type: 'skill',
          target: 'Survival',
          value: -2,
          description: 'Focused on books instead of practical skills',
          category: 'physical'
        },
        {
          type: 'social',
          target: 'peer_relations',
          value: -1,
          description: 'Age-inappropriate interests',
          category: 'social'
        }
      ],
      tradeoffReason: 'Intensive academic focus creates scholarly excellence but social disconnection from peers and practical inexperience'
    }
  ]
}
```

---

## 3. Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
1. **Extend Type Definitions**
   - Update table entry interfaces
   - Add balanced modifier types
   - Enhance character store structure

2. **Modifier Engine**
   - Create `ModifierCalculator` service
   - Implement positive/negative effect application
   - Add modifier summary generation

3. **Character Store Updates**
   - Add `applyBalancedModifier()` method
   - Implement `calculateModifierSummary()`
   - Update character finalization to include modifier calculation

### Phase 2: Table Data Migration (Week 3-4)
1. **Convert Existing Tables**
   - Update youth events with balanced effects
   - Convert occupation effects
   - Migrate heritage modifiers

2. **Quality Assurance**
   - Verify all effects have appropriate tradeoffs
   - Test modifier calculations
   - Validate balance principles

### Phase 3: UI Integration (Week 5-6)
1. **Character Sheet Enhancement**
   - Display positive and negative modifiers
   - Show modifier sources and explanations
   - Add modifier summary section

2. **Generation Wizard Updates**
   - Show tradeoffs during event selection
   - Display running modifier totals
   - Add balance warnings for extreme builds

### Phase 4: Testing & Refinement (Week 7-8)
1. **Character Build Testing**
   - Test each archetype pattern
   - Verify balance across different builds
   - Adjust modifiers based on testing

2. **User Experience**
   - Ensure tradeoffs are clearly communicated
   - Test GM override capabilities
   - Validate export/import functionality

---

## 4. Key Service Implementations

### ModifierCalculator Service
```typescript
export class ModifierCalculator {
  
  // Apply a balanced effect to character
  applyBalancedEffect(character: Character, effect: BalancedEffect): Character {
    const appliedModifier: AppliedModifier = {
      sourceEvent: effect.sourceEvent,
      sourceTable: effect.sourceTable,
      positive: effect.positiveEffects,
      negative: effect.negativeEffects,
      appliedAt: new Date()
    }
    
    // Apply positive effects
    character = this.applyModifierEffects(character, effect.positiveEffects)
    
    // Apply negative effects
    character = this.applyModifierEffects(character, effect.negativeEffects)
    
    // Track the application
    character.appliedModifiers.push(appliedModifier)
    
    // Update summary
    character.modifierSummary = this.calculateModifierSummary(character)
    
    return character
  }
  
  // Calculate net modifier effects
  calculateModifierSummary(character: Character): ModifierSummary {
    const summary: ModifierSummary = {
      abilityScores: {},
      skills: {},
      traits: [],
      socialModifiers: []
    }
    
    // Aggregate all applied modifiers
    character.appliedModifiers.forEach(modifier => {
      // Process positive effects
      modifier.positive.forEach(effect => {
        this.addToSummary(summary, effect)
      })
      
      // Process negative effects
      modifier.negative.forEach(effect => {
        this.addToSummary(summary, effect)
      })
    })
    
    return summary
  }
  
  // Validate modifier balance
  validateModifierBalance(character: Character): BalanceReport {
    const summary = character.modifierSummary
    
    return {
      abilityScoreBalance: this.checkAbilityBalance(summary.abilityScores),
      skillDistribution: this.analyzeSkillDistribution(summary.skills),
      overallBalance: this.assessOverallBalance(summary),
      warnings: this.generateBalanceWarnings(summary)
    }
  }
}
```

### Character Store Enhancements
```typescript
// Add to existing character store
export const useCharacterStore = create<CharacterStore>()(
  subscribeWithSelector((set, get) => ({
    
    // Existing methods...
    
    // New methods for balanced modifiers
    applyBalancedModifier: (effect: BalancedEffect) => {
      const { character } = get()
      if (!character) return
      
      const modifierCalculator = new ModifierCalculator()
      const updatedCharacter = modifierCalculator.applyBalancedEffect(character, effect)
      
      set({ 
        character: updatedCharacter,
        hasUnsavedChanges: true 
      })
    },
    
    getModifierSummary: () => {
      const { character } = get()
      if (!character?.modifierSummary) return null
      
      return character.modifierSummary
    },
    
    validateCharacterBalance: () => {
      const { character } = get()
      if (!character) return null
      
      const modifierCalculator = new ModifierCalculator()
      return modifierCalculator.validateModifierBalance(character)
    }
    
  }))
)
```

---

## 5. UI Component Updates

### Enhanced Character Sheet Component
```typescript
// ModifierSummaryComponent.tsx
export function ModifierSummaryComponent({ character }: { character: Character }) {
  const modifierSummary = character.modifierSummary
  
  return (
    <div className="modifier-summary">
      <h3>Character Modifiers</h3>
      
      {/* Ability Score Changes */}
      <div className="ability-modifiers">
        <h4>Ability Score Changes</h4>
        {Object.entries(modifierSummary.abilityScores).map(([ability, modifier]) => (
          <div key={ability} className={`modifier ${modifier >= 0 ? 'positive' : 'negative'}`}>
            {ability}: {modifier >= 0 ? '+' : ''}{modifier}
          </div>
        ))}
      </div>
      
      {/* Skill Modifiers */}
      <div className="skill-modifiers">
        <h4>Skill Modifiers</h4>
        {Object.entries(modifierSummary.skills).map(([skill, modifier]) => (
          <div key={skill} className={`modifier ${modifier >= 0 ? 'positive' : 'negative'}`}>
            {skill}: {modifier >= 0 ? '+' : ''}{modifier}
          </div>
        ))}
      </div>
      
      {/* Modifier Sources */}
      <div className="modifier-sources">
        <h4>Modifier Sources</h4>
        {character.appliedModifiers.map((modifier, index) => (
          <ModifierSourceComponent key={index} modifier={modifier} />
        ))}
      </div>
    </div>
  )
}

// Individual modifier source display
function ModifierSourceComponent({ modifier }: { modifier: AppliedModifier }) {
  return (
    <div className="modifier-source">
      <h5>{modifier.sourceEvent}</h5>
      <div className="positive-effects">
        <strong>Benefits:</strong>
        {modifier.positive.map((effect, i) => (
          <span key={i}>{effect.description}</span>
        ))}
      </div>
      <div className="negative-effects">
        <strong>Tradeoffs:</strong>
        {modifier.negative.map((effect, i) => (
          <span key={i}>{effect.description}</span>
        ))}
      </div>
    </div>
  )
}
```

### Balance Warning Component
```typescript
// BalanceWarningComponent.tsx
export function BalanceWarningComponent({ character }: { character: Character }) {
  const balanceReport = useMemo(() => {
    const calculator = new ModifierCalculator()
    return calculator.validateModifierBalance(character)
  }, [character])
  
  if (balanceReport.warnings.length === 0) {
    return (
      <div className="balance-status good">
        ✅ Character modifiers are well-balanced
      </div>
    )
  }
  
  return (
    <div className="balance-warnings">
      <h4>⚠️ Balance Warnings</h4>
      {balanceReport.warnings.map((warning, index) => (
        <div key={index} className="warning">
          {warning.message}
          {warning.suggestion && (
            <div className="suggestion">{warning.suggestion}</div>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## 6. Migration Strategy

### Data Migration Steps
1. **Backup Current Tables**: Create copies of existing table files
2. **Incremental Conversion**: Convert one table category at a time
3. **Parallel Testing**: Run both old and new systems during transition
4. **Gradual Rollout**: Enable balanced modifiers as optional feature first

### Backward Compatibility
- Maintain support for existing character data
- Add migration utility for old characters
- Provide conversion tools for existing saves

### Testing Strategy
1. **Unit Tests**: Individual modifier calculations
2. **Integration Tests**: Full character generation with balanced modifiers
3. **Archetype Tests**: Verify each character archetype produces expected results
4. **Balance Tests**: Automated checks for modifier balance violations

---

## 7. Configuration Options

### GM Customization
```typescript
interface ModifierConfiguration {
  enableBalancedModifiers: boolean
  allowNegativeModifierOverride: boolean
  balanceStrictness: 'strict' | 'moderate' | 'lenient'
  maxAbilityScoreModifier: number
  maxSkillModifier: number
  customTradeoffRules: TradeoffRule[]
}
```

### Player Options
- Toggle display of negative modifiers
- Show/hide tradeoff explanations
- Enable balance warnings
- Custom modifier themes (grimdark vs optimistic)

---

## 8. Rollout Timeline

### Immediate (Week 1-2)
- [ ] Implement core data structures
- [ ] Create ModifierCalculator service
- [ ] Update character store with balanced modifier support

### Short Term (Week 3-4)
- [ ] Convert youth event tables
- [ ] Update occupation tables
- [ ] Implement basic UI display

### Medium Term (Week 5-6)
- [ ] Complete all table conversions
- [ ] Add balance validation
- [ ] Implement GM override options

### Long Term (Week 7-8)
- [ ] Full UI integration
- [ ] Character migration utilities
- [ ] Comprehensive testing and refinement

This implementation plan provides a structured approach to integrating realistic character development tradeoffs while maintaining the existing PanCasting table system's flexibility and narrative richness.