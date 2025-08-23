// Heritage & Birth Tables (100s) for PanCasting

import type { HeritageTable, Table } from '../../types/tables'

// Table 101a: Race Determination (D&D 3.5 Standard Races)
export const raceTable: HeritageTable = {
  id: '101a',
  name: 'Race Determination',
  category: 'heritage',
  diceType: 'd100',
  instructions: 'Roll d100 to determine character race with D&D 3.5 ability modifiers',
  entries: [
    {
      id: '101a_01',
      rollRange: [1, 50],
      result: 'Human',
      description: 'Versatile and adaptable, humans get extra skill points and a bonus feat',
      effects: [
        {
          type: 'race',
          target: 'race',
          value: { 
            name: 'Human', 
            type: 'Human',
            description: 'Versatile and ambitious',
            abilities: ['Extra feat at 1st level', 'Extra skill point per level'],
            languages: ['Common'],
            size: 'Medium',
            speed: 30
          }
        },
        {
          type: 'skill',
          target: 'skillPoints',
          value: 1
        }
      ]
    },
    {
      id: '101a_02', 
      rollRange: [51, 70],
      result: 'Elf',
      description: 'Graceful and intelligent, with keen senses and magical affinity',
      effects: [
        {
          type: 'race',
          target: 'race',
          value: { 
            name: 'Elf', 
            type: 'Elf',
            description: 'Grace and magical affinity',
            abilities: ['Low-light vision', 'Keen senses', 'Immunity to sleep spells'],
            languages: ['Common', 'Elven'],
            size: 'Medium',
            speed: 30
          }
        },
        {
          type: 'modifier',
          target: 'dexterity',
          value: 2
        },
        {
          type: 'modifier',
          target: 'constitution',
          value: -2
        }
      ]
    },
    {
      id: '101a_03',
      rollRange: [71, 85],
      result: 'Dwarf', 
      description: 'Hardy and resilient, with natural resistance to magic and poison',
      effects: [
        {
          type: 'race',
          target: 'race',
          value: { 
            name: 'Dwarf', 
            type: 'Dwarf',
            description: 'Stout and resilient mountain folk',
            abilities: ['Darkvision', 'Stonecunning', 'Resistance to magic and poison'],
            languages: ['Common', 'Dwarven'],
            size: 'Medium',
            speed: 20
          }
        },
        {
          type: 'modifier',
          target: 'constitution',
          value: 2
        },
        {
          type: 'modifier',
          target: 'charisma',
          value: -2
        }
      ]
    },
    {
      id: '101a_04',
      rollRange: [86, 95],
      result: 'Halfling',
      description: 'Small and nimble, with natural luck and bravery',
      effects: [
        {
          type: 'race',
          target: 'race',
          value: { 
            name: 'Halfling', 
            type: 'Halfling',
            description: 'Small but brave and lucky',
            abilities: ['Lucky', 'Brave', 'Skilled with thrown weapons'],
            languages: ['Common', 'Halfling'],
            size: 'Small',
            speed: 20
          }
        },
        {
          type: 'modifier',
          target: 'dexterity',
          value: 2
        },
        {
          type: 'modifier',
          target: 'strength',
          value: -2
        }
      ]
    },
    {
      id: '101a_05',
      rollRange: [96, 98],
      result: 'Half-Elf',
      description: 'Mixed human and elven heritage, adaptable with elven grace',
      effects: [
        {
          type: 'race',
          target: 'race',
          value: { 
            name: 'Half-Elf', 
            type: 'Half-Elf',
            description: 'Mixed human and elven heritage',
            abilities: ['Low-light vision', 'Immunity to sleep spells', 'Diplomatic'],
            languages: ['Common', 'Elven'],
            size: 'Medium',
            speed: 30
          }
        }
      ]
    },
    {
      id: '101a_06',
      rollRange: [99, 99],
      result: 'Half-Orc',
      description: 'Mixed human and orc heritage, strong but often mistrusted',
      effects: [
        {
          type: 'race',
          target: 'race',
          value: { 
            name: 'Half-Orc', 
            type: 'Half-Orc',
            description: 'Mixed human and orc heritage',
            abilities: ['Darkvision', 'Orc blood'],
            languages: ['Common', 'Orc'],
            size: 'Medium',
            speed: 30
          }
        },
        {
          type: 'modifier',
          target: 'strength',
          value: 2
        },
        {
          type: 'modifier',
          target: 'intelligence',
          value: -2
        },
        {
          type: 'modifier',
          target: 'charisma',
          value: -2
        }
      ]
    },
    {
      id: '101a_07',
      rollRange: [100, 100],
      result: 'Gnome',
      description: 'Small and clever, with natural magical abilities and keen intellect',
      effects: [
        {
          type: 'race',
          target: 'race',
          value: { 
            name: 'Gnome', 
            type: 'Gnome',
            description: 'Small and magically gifted',
            abilities: ['Low-light vision', 'Spell-like abilities', 'Small stature'],
            languages: ['Common', 'Gnome'],
            size: 'Small',
            speed: 20
          }
        },
        {
          type: 'modifier',
          target: 'constitution',
          value: 2
        },
        {
          type: 'modifier',
          target: 'strength',
          value: -2
        }
      ]
    }
  ]
}

// Table 102: Cultural Background
export const cultureTable: HeritageTable = {
  id: '102',
  name: 'Cultural Background',
  category: 'heritage',
  diceType: 'd100',
  modifier: 'cuMod',
  instructions: 'Roll d100 + CuMod to determine cultural background',
  entries: [
    {
      id: '102_01',
      rollRange: [1, 15],
      result: 'Primitive Degenerate',
      description: 'Fallen from higher civilization',
      effects: [
        {
          type: 'trait',
          target: 'culture',
          value: { 
            name: 'Primitive Degenerate',
            type: 'Primitive',
            subtype: 'Degenerate', 
            cuMod: -3,
            literacyRate: 5
          }
        }
      ]
    },
    {
      id: '102_02',
      rollRange: [16, 35],
      result: 'Primitive', 
      description: 'Simple tribal society',
      effects: [
        {
          type: 'trait',
          target: 'culture',
          value: {
            name: 'Primitive',
            type: 'Primitive',
            cuMod: -2,
            literacyRate: 10
          }
        }
      ]
    },
    {
      id: '102_03',
      rollRange: [36, 50],
      result: 'Nomadic',
      description: 'Wandering pastoral culture',
      effects: [
        {
          type: 'trait',
          target: 'culture', 
          value: {
            name: 'Nomadic',
            type: 'Nomadic',
            cuMod: -1,
            literacyRate: 20
          }
        }
      ]
    },
    {
      id: '102_04',
      rollRange: [51, 70],
      result: 'Barbaric',
      description: 'Warrior-based society',
      effects: [
        {
          type: 'trait',
          target: 'culture',
          value: {
            name: 'Barbaric', 
            type: 'Barbaric',
            cuMod: 0,
            literacyRate: 30
          }
        }
      ]
    },
    {
      id: '102_05',
      rollRange: [71, 90],
      result: 'Civilized',
      description: 'Advanced settled society',
      effects: [
        {
          type: 'trait',
          target: 'culture',
          value: {
            name: 'Civilized',
            type: 'Civilized',
            cuMod: 1,
            literacyRate: 60
          }
        }
      ]
    },
    {
      id: '102_06',
      rollRange: [91, 100],
      result: 'Civilized Advanced',
      description: 'Highly developed civilization',
      effects: [
        {
          type: 'trait',
          target: 'culture',
          value: {
            name: 'Civilized Advanced',
            type: 'Civilized',
            subtype: 'Dynamic',
            cuMod: 2,
            literacyRate: 80
          }
        }
      ]
    }
  ]
}

// Table 103: Social Status
export const socialStatusTable: HeritageTable = {
  id: '103',
  name: 'Social Status',
  category: 'heritage',
  diceType: 'd100',
  modifier: 'solMod',
  instructions: 'Roll d100 + SolMod to determine social status',
  entries: [
    {
      id: '103_01',
      rollRange: [1, 10],
      result: 'Destitute',
      description: 'Utterly impoverished, no resources',
      effects: [
        {
          type: 'trait',
          target: 'socialStatus',
          value: {
            level: 'Destitute',
            solMod: -3,
            survivalMod: -2,
            moneyMultiplier: 0.1,
            literacyMod: -3
          }
        }
      ]
    },
    {
      id: '103_02',
      rollRange: [11, 30],
      result: 'Poor',
      description: 'Below average means, struggling',
      effects: [
        {
          type: 'trait',
          target: 'socialStatus',
          value: {
            level: 'Poor',
            solMod: -2,
            survivalMod: -1,
            moneyMultiplier: 0.25,
            literacyMod: -2
          }
        }
      ]
    },
    {
      id: '103_03',
      rollRange: [31, 60],
      result: 'Comfortable',
      description: 'Average social standing and resources',
      effects: [
        {
          type: 'trait',
          target: 'socialStatus',
          value: {
            level: 'Comfortable',
            solMod: 0,
            survivalMod: 0,
            moneyMultiplier: 1.0,
            literacyMod: 0
          }
        }
      ]
    },
    {
      id: '103_04',
      rollRange: [61, 80],
      result: 'Well-to-Do',
      description: 'Above average wealth and status',
      effects: [
        {
          type: 'trait',
          target: 'socialStatus',
          value: {
            level: 'Well-to-Do',
            solMod: 1,
            survivalMod: 1,
            moneyMultiplier: 2.0,
            literacyMod: 1
          }
        }
      ]
    },
    {
      id: '103_05',
      rollRange: [81, 95],
      result: 'Wealthy',
      description: 'Significant wealth and influence',
      effects: [
        {
          type: 'trait',
          target: 'socialStatus',
          value: {
            level: 'Wealthy',
            solMod: 2,
            survivalMod: 2,
            moneyMultiplier: 5.0,
            literacyMod: 2
          }
        }
      ]
    },
    {
      id: '103_06',
      rollRange: [96, 99],
      result: 'Nobility',
      description: 'Noble birth with titles and lands',
      effects: [
        {
          type: 'trait',
          target: 'socialStatus',
          value: {
            level: 'Nobility',
            solMod: 3,
            survivalMod: 3,
            moneyMultiplier: 10.0,
            literacyMod: 3
          }
        }
      ]
    },
    {
      id: '103_07',
      rollRange: [100, 100],
      result: 'Extremely Wealthy',
      description: 'Vast wealth rivaling nobility',
      effects: [
        {
          type: 'trait',
          target: 'socialStatus',
          value: {
            level: 'Extremely Wealthy',
            solMod: 2,
            survivalMod: 3,
            moneyMultiplier: 15.0,
            literacyMod: 2
          }
        }
      ]
    }
  ]
}

// Table 104: Birth Circumstances
export const birthCircumstancesTable: HeritageTable = {
  id: '104',
  name: 'Birth Circumstances',
  category: 'heritage',
  diceType: 'd100',
  modifier: 'biMod',
  instructions: 'Roll d100 + BiMod to determine birth circumstances',
  entries: [
    {
      id: '104_01',
      rollRange: [1, 50],
      result: 'Legitimate Birth',
      description: 'Born to married parents in good standing',
      effects: [
        {
          type: 'trait',
          target: 'birthCircumstances',
          value: {
            legitimacy: 'Legitimate',
            biMod: 0
          }
        }
      ]
    },
    {
      id: '104_02',
      rollRange: [51, 70],
      result: 'Illegitimate Birth',
      description: 'Born outside of marriage',
      effects: [
        {
          type: 'trait',
          target: 'birthCircumstances',
          value: {
            legitimacy: 'Illegitimate',
            biMod: -1
          }
        }
      ]
    },
    {
      id: '104_03',
      rollRange: [71, 85],
      result: 'Foundling',
      description: 'Abandoned and raised by others',
      effects: [
        {
          type: 'trait',
          target: 'birthCircumstances',
          value: {
            legitimacy: 'Illegitimate',
            biMod: -2,
            unusualCircumstances: ['Foundling', 'Unknown parentage']
          }
        }
      ]
    },
    {
      id: '104_04',
      rollRange: [86, 95],
      result: 'Born During Crisis',
      description: 'Birth during war, disaster, or upheaval',
      effects: [
        {
          type: 'trait',
          target: 'birthCircumstances',
          value: {
            legitimacy: 'Legitimate',
            biMod: -1,
            unusualCircumstances: ['Crisis birth']
          }
        }
      ]
    },
    {
      id: '104_05',
      rollRange: [96, 100],
      result: 'Portents at Birth',
      description: 'Strange omens or events surrounded birth',
      effects: [
        {
          type: 'trait',
          target: 'birthCircumstances',
          value: {
            legitimacy: 'Legitimate',
            biMod: 1,
            unusualCircumstances: ['Portents', 'Destined for greatness']
          }
        }
      ],
      goto: '642 Unusual Events'
    }
  ]
}

// Export all heritage tables
export const heritageTables: Table[] = [
  raceTable,
  cultureTable,
  socialStatusTable,
  birthCircumstancesTable
]