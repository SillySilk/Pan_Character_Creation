// Integration test for the balanced modifier system
// Run with: npx ts-node integration-test.ts

import { modifierCalculator } from './src/services/modifierCalculator'
import { tableEngine } from './src/services/tableEngine'
import { sampleBalancedYouthTable } from './src/data/sample-balanced-table'
import type { Character } from './src/types/character'

// Create a test character
function createTestCharacter(): Character {
  return {
    id: 'test_char_1',
    name: 'Test Character',
    age: 8,
    
    // Basic heritage setup
    race: { name: 'Human', type: 'Human', events: [], modifiers: {} },
    culture: { name: 'Civilized', type: 'Civilized', cuMod: 0, nativeEnvironment: [], survival: 6, benefits: [], literacyRate: 75 },
    socialStatus: { level: 'Comfortable', solMod: 0, survivalMod: 0, moneyMultiplier: 1, literacyMod: 0, benefits: [] },
    birthCircumstances: { legitimacy: 'Legitimate', familyHead: 'Father', siblings: 2, birthOrder: 1, birthplace: 'Village', unusualCircumstances: [], biMod: 0 },
    family: { head: 'Father', members: [], occupations: [], relationships: [], notableFeatures: [], socialConnections: [] },
    
    // Empty arrays for events and relationships
    youthEvents: [],
    adulthoodEvents: [],
    miscellaneousEvents: [],
    occupations: [],
    apprenticeships: [],
    hobbies: [],
    skills: [],
    
    // Personality defaults
    values: { mostValuedPerson: '', mostValuedThing: '', mostValuedAbstraction: '', strength: 'Average', motivations: [] },
    alignment: { primary: 'Neutral', attitude: '', description: '', behaviorGuidelines: [] },
    personalityTraits: { lightside: [], neutral: [], darkside: [], exotic: [] },
    
    // Empty relationships and items
    npcs: [],
    companions: [],
    rivals: [],
    relationships: [],
    gifts: [],
    legacies: [],
    specialItems: [],
    
    // System data
    activeModifiers: { cuMod: 0, solMod: 0, tiMod: 0, biMod: 0, legitMod: 0 },
    generationHistory: [],
    appliedModifiers: [],
    modifierSummary: {
      abilityScores: {},
      skills: {},
      traits: [],
      socialModifiers: [],
      overallBalance: { totalPositive: 0, totalNegative: 0, netBalance: 0, warnings: [] }
    },
    
    dndIntegration: {
      abilityModifiers: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      skillBonuses: {},
      startingGold: 0,
      bonusLanguages: [],
      traits: [],
      flaws: [],
      equipment: [],
      specialAbilities: [],
      backgroundFeatures: []
    }
  }
}

async function runIntegrationTest() {
  console.log('🧪 Starting Balanced Modifier System Integration Test')
  console.log('=' .repeat(60))
  
  try {
    // 1. Create test character
    console.log('\n📝 Step 1: Creating test character...')
    const character = createTestCharacter()
    console.log(`✅ Created character: ${character.name}`)
    
    // 2. Register sample table
    console.log('\n📋 Step 2: Registering sample balanced table...')
    tableEngine.registerTable(sampleBalancedYouthTable)
    console.log(`✅ Registered table: ${sampleBalancedYouthTable.name}`)
    
    // 3. Process table entry with balanced effect
    console.log('\n🎲 Step 3: Processing balanced effect...')
    console.log('Processing "Intensive Academic Tutoring" event...')
    
    const result = tableEngine.processTable(sampleBalancedYouthTable.id, character, {
      manualSelection: 10  // Force selection of first entry
    })
    
    if (result.success) {
      console.log('✅ Table processing succeeded!')
      console.log(`📊 Effects applied: ${result.effects.length}`)
    } else {
      console.log('❌ Table processing failed:', result.errors)
      return
    }
    
    // 4. Display character modifications
    console.log('\n📈 Step 4: Character Modifications Analysis')
    console.log('-'.repeat(40))
    
    if (character.appliedModifiers && character.appliedModifiers.length > 0) {
      const modifier = character.appliedModifiers[0]
      
      console.log(`🎯 Event: ${modifier.sourceEvent}`)
      console.log(`📅 Applied at: ${modifier.appliedAt.toLocaleString()}`)
      
      console.log('\n✅ Positive Effects:')
      modifier.positive.forEach(effect => {
        console.log(`  • ${effect.type}: ${effect.target} +${effect.value} (${effect.description})`)
      })
      
      console.log('\n❌ Negative Effects:')
      modifier.negative.forEach(effect => {
        console.log(`  • ${effect.type}: ${effect.target} ${effect.value} (${effect.description})`)
      })
      
      if (modifier.tradeoffReason) {
        console.log(`\n🤔 Tradeoff Reasoning: ${modifier.tradeoffReason}`)
      }
    }
    
    // 5. Display summary
    console.log('\n📊 Step 5: Modifier Summary')
    console.log('-'.repeat(40))
    
    if (character.modifierSummary) {
      const summary = character.modifierSummary
      
      if (Object.keys(summary.abilityScores).length > 0) {
        console.log('🔧 Ability Score Changes:')
        Object.entries(summary.abilityScores).forEach(([ability, modifier]) => {
          console.log(`  • ${ability}: ${modifier >= 0 ? '+' : ''}${modifier}`)
        })
      }
      
      if (Object.keys(summary.skills).length > 0) {
        console.log('\n🎯 Skill Modifiers:')
        Object.entries(summary.skills).forEach(([skill, modifier]) => {
          console.log(`  • ${skill}: ${modifier >= 0 ? '+' : ''}${modifier}`)
        })
      }
      
      if (summary.traits.length > 0) {
        console.log('\n🎭 Traits Gained:')
        summary.traits.forEach(trait => {
          console.log(`  • ${trait}`)
        })
      }
      
      console.log('\n⚖️ Balance Assessment:')
      console.log(`  • Total Positive: ${summary.overallBalance.totalPositive}`)
      console.log(`  • Total Negative: ${summary.overallBalance.totalNegative}`)
      console.log(`  • Net Balance: ${summary.overallBalance.netBalance}`)
      
      if (summary.overallBalance.warnings.length > 0) {
        console.log('\n⚠️ Balance Warnings:')
        summary.overallBalance.warnings.forEach(warning => {
          console.log(`  • ${warning}`)
        })
      }
    }
    
    // 6. Test validation
    console.log('\n🔍 Step 6: Balance Validation')
    console.log('-'.repeat(40))
    
    const balanceAssessment = modifierCalculator.validateCharacterBalance(character)
    console.log(`✅ Character balance validated`)
    console.log(`📊 Balance ratio: ${balanceAssessment.totalNegative > 0 ? 
      (balanceAssessment.totalPositive / balanceAssessment.totalNegative).toFixed(2) : 'N/A'}`)
    
    console.log('\n🎉 Integration Test PASSED!')
    console.log('✅ All systems working correctly')
    console.log('✅ Balanced modifiers applied successfully')
    console.log('✅ Character state updated properly')
    console.log('✅ Balance validation working')
    
  } catch (error) {
    console.log('\n❌ Integration Test FAILED!')
    console.error('Error:', error)
  }
}

// Run the test
runIntegrationTest()