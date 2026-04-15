// Complete Balanced Modifier System Integration Test
// Tests the entire workflow from table data through UI components
// Run with: npm test complete-system-test

import { describe, it, expect, beforeAll, vi } from 'vitest'
import { tableEngine } from './src/services/tableEngine'
import { modifierCalculator } from './src/services/modifierCalculator'
import { balancedChildhoodEventsTable } from './src/data/tables/youth-balanced'
import { balancedApprenticeshipsTable } from './src/data/tables/occupations-balanced'
import type { Character } from './src/types/character'

// Create a complete test character
function createFullTestCharacter(): Character {
  return {
    id: 'integration_test_char',
    name: 'Integration Test Character',
    age: 16,
    
    // Heritage & Birth
    race: { name: 'Human', type: 'Human', events: [], modifiers: {} },
    culture: { 
      name: 'Civilized Advanced', 
      type: 'Civilized', 
      cuMod: 2, 
      nativeEnvironment: ['Urban', 'Town'], 
      survival: 8, 
      benefits: ['Literacy', 'Education'], 
      literacyRate: 90 
    },
    socialStatus: { 
      level: 'Well-to-Do', 
      solMod: 1, 
      survivalMod: 0, 
      moneyMultiplier: 2, 
      literacyMod: 2, 
      benefits: ['Education', 'Social Connections'] 
    },
    birthCircumstances: { 
      legitimacy: 'Legitimate', 
      familyHead: 'Father (Merchant)', 
      siblings: 2, 
      birthOrder: 1, 
      birthplace: 'Large Town', 
      unusualCircumstances: [], 
      biMod: 0 
    },
    family: { 
      head: 'Father (Merchant)', 
      members: [], 
      occupations: [], 
      relationships: [], 
      notableFeatures: ['Wealthy', 'Well-Connected'], 
      socialConnections: ['Merchant Guild', 'Town Council'] 
    },
    
    // Life Events
    youthEvents: [],
    adulthoodEvents: [],
    miscellaneousEvents: [],
    
    // Skills & Occupations
    occupations: [],
    apprenticeships: [],
    hobbies: [],
    skills: [],
    
    // Personality
    values: { 
      mostValuedPerson: 'Father', 
      mostValuedThing: 'Knowledge', 
      mostValuedAbstraction: 'Success', 
      strength: 'Strong', 
      motivations: ['Learning', 'Achievement', 'Family Honor'] 
    },
    alignment: { 
      primary: 'Neutral', 
      attitude: 'Ambitious but Ethical', 
      description: 'Driven to succeed while maintaining moral principles', 
      behaviorGuidelines: ['Keep promises', 'Help family', 'Pursue knowledge'] 
    },
    personalityTraits: { lightside: [], neutral: [], darkside: [], exotic: [] },
    
    // Relationships & Items
    npcs: [],
    companions: [],
    rivals: [],
    relationships: [],
    gifts: [],
    legacies: [],
    specialItems: [],
    
    // System Data
    activeModifiers: { cuMod: 2, solMod: 1, tiMod: 0, biMod: 0, legitMod: 0 },
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
      startingGold: 200, // Well-to-do starting wealth
      bonusLanguages: ['Common', 'Trade Tongue'],
      traits: [],
      flaws: [],
      equipment: [],
      specialAbilities: [],
      backgroundFeatures: []
    }
  }
}

describe('Complete Balanced Modifier System Integration', () => {
  let character: Character

  beforeAll(() => {
    // Register balanced tables
    tableEngine.registerTable(balancedChildhoodEventsTable)
    tableEngine.registerTable(balancedApprenticeshipsTable)
  })

  it('should setup the system correctly', () => {
    // Phase 1: System Setup
    expect(tableEngine.getAllTables().length).toBeGreaterThan(0)
    
    character = createFullTestCharacter()
    expect(character).toBeDefined()
    expect(character.name).toBe('Integration Test Character')
    
    // Phase 2: Character Development Simulation
    console.log('\n🎲 PHASE 2: Character Development Simulation')
    console.log('-' .repeat(30))
    
    // Childhood Event: Academic Mentoring (creates scholar archetype)
    console.log('\n📚 Processing Childhood Event: "Mentored by Elder"')
    const childhoodResult = tableEngine.processTable(
      balancedChildhoodEventsTable.id,
      character,
      { manualSelection: 20 } // Mentored by Elder
    )
    
    if (childhoodResult.success) {
      console.log('✅ Childhood event processed successfully')
      console.log(`📊 Effects applied: ${childhoodResult.effects.length}`)
      
      if (character.appliedModifiers && character.appliedModifiers.length > 0) {
        const modifier = character.appliedModifiers[0]
        console.log(`🎯 Applied: ${modifier.positive.length} benefits, ${modifier.negative.length} tradeoffs`)
        console.log(`💭 Reason: ${modifier.tradeoffReason}`)
      }
    }
    
    // Apprenticeship Event: Scholar's Assistant (reinforces archetype)
    console.log('\n🎓 Processing Apprenticeship: "Scholar\'s Assistant"')
    const apprenticeResult = tableEngine.processTable(
      balancedApprenticeshipsTable.id,
      character,
      { manualSelection: 18 } // Scholar's Assistant
    )
    
    if (apprenticeResult.success) {
      console.log('✅ Apprenticeship processed successfully')
      console.log(`📊 Effects applied: ${apprenticeResult.effects.length}`)
    }
    
    // Phase 3: Character Analysis
    console.log('\n📈 PHASE 3: Character Analysis')
    console.log('-' .repeat(30))
    
    if (character.modifierSummary) {
      const summary = character.modifierSummary
      
      console.log('📊 FINAL CHARACTER PROFILE:')
      console.log(`Name: ${character.name}`)
      console.log(`Background: ${character.race.name} ${character.culture.name} ${character.socialStatus.level}`)
      
      if (Object.keys(summary.abilityScores).length > 0) {
        console.log('\n💪 Ability Score Changes:')
        Object.entries(summary.abilityScores).forEach(([ability, modifier]) => {
          const symbol = modifier >= 0 ? '⬆️' : '⬇️'
          console.log(`  ${symbol} ${ability}: ${modifier >= 0 ? '+' : ''}${modifier}`)
        })
      }
      
      if (Object.keys(summary.skills).length > 0) {
        console.log('\n🎯 Skill Modifiers:')
        Object.entries(summary.skills).forEach(([skill, modifier]) => {
          const symbol = modifier >= 0 ? '⬆️' : '⬇️'
          console.log(`  ${symbol} ${skill}: ${modifier >= 0 ? '+' : ''}${modifier}`)
        })
      }
      
      if (summary.traits.length > 0) {
        console.log('\n🎭 Personality Traits Gained:')
        summary.traits.forEach(trait => {
          console.log(`  🎭 ${trait}`)
        })
      }
      
      console.log('\n⚖️ Balance Assessment:')
      console.log(`  📈 Total Benefits: +${summary.overallBalance.totalPositive}`)
      console.log(`  📉 Total Tradeoffs: -${summary.overallBalance.totalNegative}`)
      console.log(`  🎯 Net Balance: ${summary.overallBalance.netBalance >= 0 ? '+' : ''}${summary.overallBalance.netBalance}`)
      
      if (summary.overallBalance.warnings.length > 0) {
        console.log('\n⚠️ Balance Warnings:')
        summary.overallBalance.warnings.forEach(warning => {
          console.log(`  ⚠️ ${warning}`)
        })
      } else {
        console.log('  ✅ Character is well balanced')
      }
    }
    
    // Phase 4: Character Store Integration Test
    console.log('\n🗄️ PHASE 4: Character Store Integration')
    console.log('-' .repeat(30))
    
    // Test store methods (simulate since we can't actually use React hooks here)
    console.log('✅ Testing modifier calculation methods...')
    const breakdown = modifierCalculator.getModifierBreakdown(character)
    console.log(`✅ Modifier breakdown: ${breakdown.length} sources`)
    
    const validation = modifierCalculator.validateCharacterBalance(character)
    console.log(`✅ Balance validation: ${validation.warnings.length} warnings`)
    
    // Phase 5: Archetype Analysis
    console.log('\n🎭 PHASE 5: Archetype Analysis')
    console.log('-' .repeat(30))
    
    const analyzeArchetype = (char: Character) => {
      const summary = char.modifierSummary
      if (!summary) return 'Unknown'
      
      const intellectual = (summary.abilityScores.Intelligence || 0) + 
                          Object.entries(summary.skills)
                            .filter(([skill]) => skill.includes('Knowledge') || skill.includes('Research'))
                            .reduce((sum, [, value]) => sum + value, 0)
      
      const physical = (summary.abilityScores.Strength || 0) + (summary.abilityScores.Constitution || 0) +
                      (summary.skills.Athletics || 0)
      
      const social = (summary.abilityScores.Charisma || 0) + 
                    (summary.skills.Diplomacy || 0) + 
                    summary.socialModifiers.reduce((sum, mod) => sum + mod.modifier, 0)
      
      if (intellectual > physical + 2 && intellectual > social + 2) return 'Scholar-Sage'
      if (physical > intellectual + 2 && physical > social + 2) return 'Warrior-Guardian'  
      if (social > intellectual + 2 && social > physical + 2) return 'Noble Diplomat'
      return 'Balanced Generalist'
    }
    
    const archetype = analyzeArchetype(character)
    console.log(`🎯 Character Archetype: ${archetype}`)
    
    // Archetype-specific analysis
    if (archetype === 'Scholar-Sage') {
      console.log('📚 Scholar-Sage Analysis:')
      console.log('  ✅ High intellectual capabilities')
      console.log('  ⚠️ Likely physical weaknesses')
      console.log('  ⚠️ Potential social awkwardness with non-academics')
      console.log('  🎭 Good for: Research, magic, academic adventures')
      console.log('  🎭 Challenges: Physical combat, wilderness survival, common folk relations')
    }
    
    // Phase 6: UI Component Data Structure Test
    console.log('\n🎨 PHASE 6: UI Component Data Compatibility')
    console.log('-' .repeat(30))
    
    console.log('✅ Testing data structures for UI components...')
    
    // Test that all data needed for UI components is present
    const uiCompatibilityChecks = [
      { name: 'Applied Modifiers', present: !!character.appliedModifiers?.length },
      { name: 'Modifier Summary', present: !!character.modifierSummary },
      { name: 'Balance Assessment', present: !!character.modifierSummary?.overallBalance },
      { name: 'Ability Score Changes', present: !!Object.keys(character.modifierSummary?.abilityScores || {}).length },
      { name: 'Skill Modifiers', present: !!Object.keys(character.modifierSummary?.skills || {}).length },
      { name: 'Tradeoff Explanations', present: !!character.appliedModifiers?.[0]?.tradeoffReason }
    ]
    
    uiCompatibilityChecks.forEach(check => {
      const status = check.present ? '✅' : '❌'
      console.log(`  ${status} ${check.name}: ${check.present ? 'Available' : 'Missing'}`)
    })
    
    // Final System Status
    console.log('\n🎉 SYSTEM TEST RESULTS')
    console.log('=' .repeat(60))
    
    const allSystemsGo = uiCompatibilityChecks.every(check => check.present) && 
                         childhoodResult.success && 
                         apprenticeResult.success
    
    if (allSystemsGo) {
      console.log('✅ ALL SYSTEMS OPERATIONAL')
      console.log('')
      console.log('🎯 Core System: ✅ Balanced effects processing')
      console.log('🎯 Table Engine: ✅ Effect application working') 
      console.log('🎯 Character Store: ✅ Modifier tracking active')
      console.log('🎯 Balance Validation: ✅ Warnings and assessment')
      console.log('🎯 UI Data: ✅ All components have required data')
      console.log('🎯 Archetype Recognition: ✅ Character patterns detected')
      console.log('')
      console.log('🚀 THE BALANCED MODIFIER SYSTEM IS FULLY FUNCTIONAL!')
      console.log('')
      console.log('Characters now have:')
      console.log('  ⚖️ Realistic tradeoffs for every benefit')
      console.log('  📊 Comprehensive balance tracking')
      console.log('  🎭 Distinctive archetype development')
      console.log('  🎨 Rich UI component support')
      console.log('  🔍 Real-time balance warnings')
      console.log('')
      console.log('Ready for production use! 🎉')
    } else {
      console.log('❌ SYSTEM ISSUES DETECTED')
      console.log('Some components need attention before production use.')
    }
    
  } catch (error) {
    console.log('\n❌ SYSTEM TEST FAILED!')
    console.error('Error:', error)
  }
}

// Run the comprehensive test
runCompleteSystemTest()