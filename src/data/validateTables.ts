// Table validation utility for PanCasting

import { 
  validateTableRegistry, 
  validateCrossReferences, 
  getTableStatistics,
  getAllTables 
} from './tables'

/**
 * Comprehensive table validation and reporting
 */
export function validateAllTables() {
  console.log('🎲 PanCasting Table Validation Report')
  console.log('=====================================')
  
  // Basic structure validation
  const registryValidation = validateTableRegistry()
  console.log('\n📋 Registry Validation:')
  if (registryValidation.isValid) {
    console.log('✅ All tables have valid structure')
  } else {
    console.log('❌ Structure validation failed:')
    registryValidation.errors.forEach(error => console.log(`  - ${error}`))
  }
  
  // Cross-reference validation
  const crossRefValidation = validateCrossReferences()
  console.log('\n🔗 Cross-Reference Validation:')
  if (crossRefValidation.isValid) {
    console.log('✅ All cross-references are valid')
  } else {
    console.log('❌ Cross-reference validation failed:')
    crossRefValidation.errors.forEach(error => console.log(`  - ${error}`))
  }
  
  if (crossRefValidation.warnings.length > 0) {
    console.log('⚠️  Cross-reference warnings:')
    crossRefValidation.warnings.forEach(warning => console.log(`  - ${warning}`))
  }
  
  // Statistics
  const stats = getTableStatistics()
  console.log('\n📊 Table Statistics:')
  console.log(`  📁 Total Tables: ${stats.totalTables}`)
  console.log(`  📄 Total Entries: ${stats.totalEntries}`)
  console.log(`  🔗 Cross-References: ${stats.crossReferences}`)
  console.log(`  📋 Subtables: ${stats.subtables}`)
  
  console.log('\n📂 Tables by Category:')
  Object.entries(stats.categoryCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} tables`)
  })
  
  console.log('\n🎲 Dice Type Usage:')
  Object.entries(stats.diceTypeUsage).forEach(([dice, count]) => {
    console.log(`  ${dice}: ${count} tables`)
  })
  
  // Coverage analysis
  console.log('\n🎯 Coverage Analysis:')
  const allTables = getAllTables()
  const coverageByCategory = {
    'Heritage (100s)': allTables.filter(t => t.category === 'heritage' || t.category === '100s').length,
    'Youth (200s)': allTables.filter(t => t.category === 'youth' || t.category === '200s').length,
    'Occupations (300s)': allTables.filter(t => t.category === 'occupations' || t.category === '300s').length,
    'Adulthood (400s)': allTables.filter(t => t.category === 'adulthood' || t.category === '400s').length,
    'Personality (500s)': allTables.filter(t => t.category === 'personality' || t.category === '500s').length,
    'Miscellaneous (600s)': allTables.filter(t => t.category === 'miscellaneous' || t.category === '600s').length,
    'Contacts (700s)': allTables.filter(t => t.category === 'contacts' || t.category === '700s').length,
    'Special (800s)': allTables.filter(t => t.category === 'special' || t.category === '800s').length
  }
  
  Object.entries(coverageByCategory).forEach(([category, count]) => {
    const status = count > 0 ? '✅' : '❌'
    console.log(`  ${status} ${category}: ${count} tables`)
  })
  
  // Overall assessment
  const overallValid = registryValidation.isValid && crossRefValidation.isValid
  console.log('\n🏆 Overall Assessment:')
  if (overallValid) {
    console.log('✅ Table system is ready for use!')
    console.log(`📈 ${stats.totalTables} tables with ${stats.totalEntries} total entries`)
    console.log(`🔗 ${stats.crossReferences} cross-references for dynamic navigation`)
  } else {
    console.log('❌ Table system has validation issues that need to be resolved')
  }
  
  return {
    isValid: overallValid,
    statistics: stats,
    registryValidation,
    crossRefValidation,
    coverage: coverageByCategory
  }
}

/**
 * Quick validation for development
 */
export function quickValidation(): boolean {
  const registryValidation = validateTableRegistry()
  const crossRefValidation = validateCrossReferences()
  return registryValidation.isValid && crossRefValidation.isValid
}

/**
 * Get table coverage summary
 */
export function getTableCoverage() {
  const allTables = getAllTables()
  const categories = ['heritage', 'youth', 'occupations', 'adulthood', 'personality', 'miscellaneous', 'contacts', 'special']
  
  return categories.map(category => ({
    category,
    tables: allTables.filter(t => t.category === category).length,
    hasData: allTables.some(t => t.category === category)
  }))
}

// Export validation functions
export default validateAllTables