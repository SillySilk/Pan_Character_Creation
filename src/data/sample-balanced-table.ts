// Sample table demonstrating the new balanced modifier system
// This shows how existing Central Casting events would be converted

import type { Table, TableEntry, Effect } from '../types/tables'

export const sampleBalancedYouthTable: Table = {
  id: 'sample_balanced_209',
  name: 'Sample Balanced Youth Events (Ages 1-12)',
  category: 'youth',
  diceType: 'd100',
  modifier: 'cuMod',
  description: 'Major formative events during childhood with realistic tradeoffs',
  instructions: 'Roll 1d100 + Culture Modifier to determine childhood event',
  entries: [
    {
      id: 'sample_209_01',
      rollRange: [1, 15],
      result: 'Intensive Academic Tutoring',
      description: 'A wise elder takes special interest in your education, providing intensive academic instruction',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (any)',
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
              description: 'Age-inappropriate interests create social distance',
              category: 'social'
            }
          ],
          tradeoffReason: 'Intensive academic focus creates scholarly excellence but social disconnection from peers and practical inexperience'
        }
      ]
    },
    
    {
      id: 'sample_209_02', 
      rollRange: [16, 30],
      result: 'Athletic Training',
      description: 'Rigorous physical training and sports participation builds strength and agility',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'ability',
              target: 'Strength',
              value: 1,
              description: 'Physical conditioning builds muscle',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Athletics',
              value: 4,
              description: 'Intensive sports training',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Acrobatics', 
              value: 2,
              description: 'Agility and coordination drills',
              category: 'physical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Knowledge (any)',
              value: -3,
              description: 'Time spent training instead of studying',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Craft (any)',
              value: -2,
              description: 'No time for detailed handiwork',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Impatience',
              value: 'Minor',
              description: 'Used to physical solutions, impatient with complex problems',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Physical excellence comes at the cost of intellectual development and patience for complex solutions'
        }
      ]
    },
    
    {
      id: 'sample_209_03',
      rollRange: [31, 45], 
      result: 'Family Tragedy',
      description: 'Loss of close family member forces early maturation and responsibility',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'ability',
              target: 'Wisdom',
              value: 1,
              description: 'Early exposure to life\'s harsh realities',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 3,
              description: 'Understanding of grief and human nature',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Resilience',
              value: 'Strong',
              description: 'Developed emotional strength through adversity',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'ability',
              target: 'Charisma',
              value: -1,
              description: 'Emotional withdrawal and trust issues',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -2,
              description: 'Difficulty forming new relationships',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Melancholy',
              value: 'Minor',
              description: 'Underlying sadness affects mood',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Trauma creates wisdom and strength but also emotional barriers and social withdrawal'
        }
      ]
    }
  ]
}

// Example of how this would be used in the system:
export function demonstrateBalancedSystem() {
  console.log('=== Balanced Modifier System Demonstration ===')
  console.log()
  
  console.log('Traditional System (OLD):')
  console.log('- Academic Achievement: +4 Knowledge, +2 Research')
  console.log('- No downsides or tradeoffs')
  console.log('- Characters become overpowered')
  console.log()
  
  console.log('Balanced System (NEW):')
  console.log('- Academic Achievement: +4 Knowledge, +3 Research, +2 Languages')
  console.log('- BUT ALSO: -2 Handle Animal, -2 Survival, -1 Peer Relations')
  console.log('- Realistic tradeoffs: scholarly excellence vs practical skills')
  console.log()
  
  console.log('Character Archetype Results:')
  console.log('- Scholar: Brilliant but physically weak and socially awkward')
  console.log('- Warrior: Strong and brave but uneducated and impatient')
  console.log('- Survivor: Tough and adaptable but emotionally damaged')
  console.log()
  
  console.log('This creates more interesting, balanced, and realistic characters!')
}