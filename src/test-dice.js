// Quick test script
import { rollDice, getDiceRange } from './utils/dice.js'

try {
  console.log('Testing invalid dice...')
  const result = rollDice('invalid')
  console.log('rollDice("invalid") returned:', result)
} catch (error) {
  console.log('rollDice("invalid") threw:', error.message)
}

try {
  const range = getDiceRange('invalid')
  console.log('getDiceRange("invalid") returned:', range)
} catch (error) {
  console.log('getDiceRange("invalid") threw:', error.message)
}