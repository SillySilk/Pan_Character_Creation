// Personality & Values Tables (500s) for PanCasting

import type { PersonalityTable, Table } from '../../types/tables'

// Table 501: Core Values (Consolidated)
export const coreValuesTable: PersonalityTable = {
  id: '501',
  name: 'Core Values',
  category: 'personality',
  diceType: 'd100',
  traitCategory: 'values',
  instructions: 'Roll d100 to determine core values and motivations',
  entries: [
    {
      id: '501_01',
      rollRange: [1, 10],
      result: 'Family Above All',
      description: 'Values family bonds and loyalty',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'Family',
            mostValuedConcept: 'Loyalty',
            personalCode: 'Protect family at any cost',
            strength: 'Strong'
          }
        }
      ]
    },
    {
      id: '501_02',
      rollRange: [11, 20],
      result: 'Love & Romance',
      description: 'Seeks meaningful romantic connection',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'Romantic Partner',
            mostValuedConcept: 'Love',
            personalCode: 'Follow your heart',
            strength: 'Driving'
          }
        }
      ]
    },
    {
      id: '501_03',
      rollRange: [21, 30],
      result: 'Honor & Duty',
      description: 'Lives by strict code of honor',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'Mentor/Superior',
            mostValuedConcept: 'Honor',
            personalCode: 'Duty before self',
            strength: 'Strong'
          }
        }
      ]
    },
    {
      id: '501_04',
      rollRange: [31, 40],
      result: 'Knowledge & Truth',
      description: 'Pursues wisdom and understanding',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'Teacher/Sage',
            mostValuedConcept: 'Truth',
            personalCode: 'Seek truth above comfort',
            strength: 'Average'
          }
        }
      ]
    },
    {
      id: '501_05',
      rollRange: [41, 50],
      result: 'Freedom & Independence',
      description: 'Values personal autonomy',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'Self',
            mostValuedConcept: 'Freedom',
            personalCode: 'Never be controlled by others',
            strength: 'Strong'
          }
        }
      ]
    },
    {
      id: '501_06',
      rollRange: [51, 60],
      result: 'Justice & Fairness',
      description: 'Fights for what is right',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'The Innocent',
            mostValuedConcept: 'Justice',
            personalCode: 'Protect those who cannot protect themselves',
            strength: 'Driving'
          }
        }
      ]
    },
    {
      id: '501_07',
      rollRange: [61, 70],
      result: 'Wealth & Power',
      description: 'Seeks material success and influence',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'Wealthy Patron',
            mostValuedConcept: 'Success',
            personalCode: 'Wealth brings security and respect',
            strength: 'Average'
          }
        }
      ]
    },
    {
      id: '501_08',
      rollRange: [71, 80],
      result: 'Faith & Spirituality',
      description: 'Devoted to divine purpose',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'Divine Figure',
            mostValuedConcept: 'Faith',
            personalCode: 'Serve the divine will',
            strength: 'Driving'
          }
        }
      ]
    },
    {
      id: '501_09',
      rollRange: [81, 90],
      result: 'Revenge & Justice',
      description: 'Obsessed with righting past wrongs',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'Enemy/Wrongdoer',
            mostValuedConcept: 'Vengeance',
            personalCode: 'Wrongs must be answered',
            strength: 'Obsessive'
          }
        }
      ]
    },
    {
      id: '501_10',
      rollRange: [91, 100],
      result: 'Survival Above All',
      description: 'Self-preservation is paramount',
      effects: [
        {
          type: 'trait',
          target: 'values',
          value: {
            mostValuedPerson: 'Self',
            mostValuedConcept: 'Survival',
            personalCode: 'Do whatever it takes to survive',
            strength: 'Obsessive'
          }
        }
      ]
    }
  ]
}

// Table 502: Personality Traits
export const personalityTraitsTable: PersonalityTable = {
  id: '502',
  name: 'Personality Traits',
  category: 'personality',
  diceType: 'd100',
  traitCategory: 'traits',
  strengthRating: true,
  instructions: 'Roll d100 to determine personality trait',
  entries: [
    {
      id: '502_01',
      rollRange: [1, 5],
      result: 'Honest [L]',
      description: 'Always speaks the truth',
      personalityTrait: 'L',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Honest',
            description: 'Always speaks the truth'
          }
        }
      ]
    },
    {
      id: '502_02',
      rollRange: [6, 10],
      result: 'Brave [L]',
      description: 'Faces danger with courage',
      personalityTrait: 'L',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Brave',
            description: 'Faces danger with courage'
          }
        }
      ]
    },
    {
      id: '502_03',
      rollRange: [11, 15],
      result: 'Compassionate [L]',
      description: 'Shows mercy and kindness',
      personalityTrait: 'L',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Compassionate',
            description: 'Shows mercy and kindness'
          }
        }
      ]
    },
    {
      id: '502_04',
      rollRange: [16, 30],
      result: 'Pragmatic [N]',
      description: 'Practical and realistic approach',
      personalityTrait: 'N',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Pragmatic',
            description: 'Practical and realistic approach'
          }
        }
      ]
    },
    {
      id: '502_05',
      rollRange: [31, 45],
      result: 'Cautious [N]',
      description: 'Careful and methodical',
      personalityTrait: 'N',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Cautious',
            description: 'Careful and methodical'
          }
        }
      ]
    },
    {
      id: '502_06',
      rollRange: [46, 60],
      result: 'Ambitious [N]',
      description: 'Driven to achieve goals',
      personalityTrait: 'N',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Ambitious',
            description: 'Driven to achieve goals'
          }
        }
      ]
    },
    {
      id: '502_07',
      rollRange: [61, 75],
      result: 'Selfish [D]',
      description: 'Puts own needs first',
      personalityTrait: 'D',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Selfish',
            description: 'Puts own needs first'
          }
        }
      ]
    },
    {
      id: '502_08',
      rollRange: [76, 85],
      result: 'Cruel [D]',
      description: 'Takes pleasure in others\' pain',
      personalityTrait: 'D',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Cruel',
            description: 'Takes pleasure in others\' pain'
          }
        }
      ]
    },
    {
      id: '502_09',
      rollRange: [86, 95],
      result: 'Dishonest [D]',
      description: 'Lies and deceives regularly',
      personalityTrait: 'D',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Dishonest',
            description: 'Lies and deceives regularly'
          }
        }
      ]
    },
    {
      id: '502_10',
      rollRange: [96, 100],
      result: 'Exotic Trait',
      description: 'Unusual psychological trait',
      goto: '503 Exotic Traits'
    }
  ]
}

// Export all personality tables
export const personalityTables: Table[] = [
  coreValuesTable,
  personalityTraitsTable
]