// Adulthood Events Tables (400s) for PanCasting

import type { AdulthoodTable, Table } from '../../types/tables'

// Table 419: Adulthood Events
export const adulthoodEventsTable: AdulthoodTable = {
  id: '419',
  name: 'Adulthood Events',
  category: 'adulthood',
  diceType: '2d20',
  modifier: 'solMod',
  minimumAge: 18,
  eventFrequency: 'age_dependent',
  instructions: 'Roll 2d20 + SolMod for adult life events',
  entries: [
    {
      id: '419_01',
      rollRange: [2, 5],
      result: 'Major Tragedy',
      description: 'Devastating personal loss or disaster',
      goto: '624 Tragedy'
    },
    {
      id: '419_02',
      rollRange: [6, 10],
      result: 'Financial Ruin',
      description: 'Lost wealth through misfortune or poor decisions',
      effects: [
        {
          type: 'modifier',
          target: 'solMod',
          value: -2
        }
      ]
    },
    {
      id: '419_03',
      rollRange: [11, 15],
      result: 'Career Change',
      description: 'Switched to entirely new profession',
      goto: '310 Civilized Occupations'
    },
    {
      id: '419_04',
      rollRange: [16, 20],
      result: 'Made Enemy',
      description: 'Acquired dangerous rival or foe',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Adult Enemy',
            conflictType: 'Serious Antagonist'
          }
        }
      ]
    },
    {
      id: '419_05',
      rollRange: [21, 25],
      result: 'Travel Experience',
      description: 'Extended journey to distant lands',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Geography',
            rank: 2,
            type: 'Academic'
          }
        }
      ]
    },
    {
      id: '419_06',
      rollRange: [26, 30],
      result: 'Romantic Entanglement',
      description: 'Significant romantic relationship',
      goto: '640 Romantic Encounters'
    },
    {
      id: '419_07',
      rollRange: [31, 35],
      result: 'Something Wonderful',
      description: 'Great fortune or amazing opportunity',
      goto: '625 Something Wonderful'
    },
    {
      id: '419_08',
      rollRange: [36, 40],
      result: 'No Significant Events',
      description: 'Peaceful, uneventful period',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Content',
            description: 'Satisfied with simple life'
          }
        }
      ]
    }
  ]
}

// Export all adulthood tables
export const adulthoodTables: Table[] = [
  adulthoodEventsTable
]