// Occupations & Skills Tables (300s) for PanCasting

import type { OccupationTable, Table } from '../../types/tables'

// Table 309: Apprenticeships
export const apprenticeshipsTable: OccupationTable = {
  id: '309',
  name: 'Apprenticeships',
  category: 'occupations',
  diceType: 'd100',
  occupationType: 'craft',
  instructions: 'Roll d100 to determine apprenticeship type',
  entries: [
    {
      id: '309_01',
      rollRange: [1, 10],
      result: 'Blacksmith',
      description: 'Apprenticed to metalworker and weapon smith',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Blacksmith',
            type: 'Craft',
            duration: 5,
            rank: 2
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Smithing',
            rank: 3,
            type: 'Craft'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Metalworking',
            rank: 2,
            type: 'Craft'
          }
        }
      ]
    },
    {
      id: '309_02',
      rollRange: [11, 20],
      result: 'Carpenter',
      description: 'Learned woodworking and construction',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Carpenter',
            type: 'Craft',
            duration: 4,
            rank: 2
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Carpentry',
            rank: 3,
            type: 'Craft'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Construction',
            rank: 2,
            type: 'Craft'
          }
        }
      ]
    },
    {
      id: '309_03',
      rollRange: [21, 30],
      result: 'Merchant',
      description: 'Trained in trade and commerce',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Merchant',
            type: 'Professional',
            duration: 3,
            rank: 1
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Appraise',
            rank: 2,
            type: 'Professional'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Negotiation',
            rank: 2,
            type: 'Social'
          }
        }
      ]
    },
    {
      id: '309_04',
      rollRange: [31, 40],
      result: 'Scholar',
      description: 'Studied under learned master',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Scholar',
            type: 'Academic',
            duration: 6,
            rank: 1
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Research',
            rank: 3,
            type: 'Academic'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Languages',
            rank: 2,
            type: 'Academic'
          }
        }
      ]
    },
    {
      id: '309_05',
      rollRange: [41, 50],
      result: 'Healer',
      description: 'Trained in medical arts',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Healer',
            type: 'Professional',
            duration: 5,
            rank: 2
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Healing',
            rank: 3,
            type: 'Professional'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Herbalism',
            rank: 2,
            type: 'Professional'
          }
        }
      ]
    },
    {
      id: '309_06',
      rollRange: [51, 60],
      result: 'Soldier',
      description: 'Military training and discipline',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Soldier',
            type: 'Military',
            duration: 4,
            rank: 1
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Weapon Training',
            rank: 2,
            type: 'Combat'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Tactics',
            rank: 1,
            type: 'Military'
          }
        }
      ]
    },
    {
      id: '309_07',
      rollRange: [61, 70],
      result: 'Farmer',
      description: 'Agricultural knowledge and skills',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Farmer',
            type: 'Craft',
            duration: 3,
            rank: 1
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Agriculture',
            rank: 2,
            type: 'Survival'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Animal Handling',
            rank: 2,
            type: 'Survival'
          }
        }
      ]
    },
    {
      id: '309_08',
      rollRange: [71, 80],
      result: 'Entertainer',
      description: 'Performance and artistic training',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Entertainer',
            type: 'Professional',
            duration: 3,
            rank: 1
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Performance',
            rank: 3,
            type: 'Social'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Music',
            rank: 2,
            type: 'Social'
          }
        }
      ]
    },
    {
      id: '309_09',
      rollRange: [81, 90],
      result: 'Priest',
      description: 'Religious training and duties',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Priest',
            type: 'Religious',
            duration: 6,
            rank: 1
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Religion',
            rank: 3,
            type: 'Academic'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Leadership',
            rank: 1,
            type: 'Social'
          }
        }
      ]
    },
    {
      id: '309_10',
      rollRange: [91, 100],
      result: 'Unusual Occupation',
      description: 'Rare or specialized training',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Unusual Occupation',
            type: 'Special',
            duration: 4,
            rank: 2
          }
        }
      ],
      goto: '315 Unusual Occupations'
    }
  ]
}

// Table 310: Civilized Occupations
export const civilizedOccupationsTable: OccupationTable = {
  id: '310',
  name: 'Civilized Occupations',
  category: 'occupations',
  diceType: 'd100',
  occupationType: 'professional',
  cultureRestrictions: ['Civilized'],
  instructions: 'Roll d100 for civilized occupation (Civilized cultures only)',
  entries: [
    {
      id: '310_01',
      rollRange: [1, 5],
      result: 'Noble',
      description: 'Born to or achieved noble status',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Noble',
            type: 'Professional',
            rank: 3,
            socialStatus: 'Nobility'
          }
        },
        {
          type: 'modifier',
          target: 'solMod',
          value: 2
        }
      ]
    },
    {
      id: '310_02',
      rollRange: [6, 15],
      result: 'Magistrate',
      description: 'Legal authority and administrator',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Magistrate',
            type: 'Professional',
            rank: 2
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Law',
            rank: 3,
            type: 'Academic'
          }
        }
      ]
    },
    {
      id: '310_03',
      rollRange: [16, 25],
      result: 'Guild Master',
      description: 'Leader of trade organization',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Guild Master',
            type: 'Professional',
            rank: 3
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Leadership',
            rank: 3,
            type: 'Social'
          }
        }
      ]
    },
    {
      id: '310_04',
      rollRange: [26, 35],
      result: 'Banker',
      description: 'Financial services and money lending',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Banker',
            type: 'Professional',
            rank: 2
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Mathematics',
            rank: 3,
            type: 'Academic'
          }
        }
      ]
    },
    {
      id: '310_05',
      rollRange: [36, 45],
      result: 'Architect',
      description: 'Designer of buildings and structures',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Architect',
            type: 'Professional',
            rank: 2
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Engineering',
            rank: 3,
            type: 'Academic'
          }
        }
      ]
    },
    {
      id: '310_06',
      rollRange: [46, 55],
      result: 'Physician',
      description: 'Advanced medical practitioner',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Physician',
            type: 'Professional',
            rank: 3
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Medicine',
            rank: 4,
            type: 'Professional'
          }
        }
      ]
    },
    {
      id: '310_07',
      rollRange: [56, 65],
      result: 'Scholar',
      description: 'Academic researcher and teacher',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Scholar',
            type: 'Academic',
            rank: 2
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Research',
            rank: 4,
            type: 'Academic'
          }
        }
      ]
    },
    {
      id: '310_08',
      rollRange: [66, 75],
      result: 'Diplomat',
      description: 'International relations and negotiation',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Diplomat',
            type: 'Professional',
            rank: 2
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Diplomacy',
            rank: 3,
            type: 'Social'
          }
        }
      ]
    },
    {
      id: '310_09',
      rollRange: [76, 85],
      result: 'Master Craftsman',
      description: 'Highly skilled artisan',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Master Craftsman',
            type: 'Craft',
            rank: 4
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Master Craft',
            rank: 5,
            type: 'Craft'
          }
        }
      ]
    },
    {
      id: '310_10',
      rollRange: [86, 95],
      result: 'Naval Officer',
      description: 'Ship commander and naval strategist',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Naval Officer',
            type: 'Military',
            rank: 3
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Navigation',
            rank: 3,
            type: 'Professional'
          }
        }
      ]
    },
    {
      id: '310_11',
      rollRange: [96, 100],
      result: 'Court Wizard',
      description: 'Royal advisor with mystical knowledge',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Court Wizard',
            type: 'Special',
            rank: 3
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Arcane Lore',
            rank: 4,
            type: 'Unusual'
          }
        }
      ]
    }
  ]
}

// Table 314: Hobbies and Interests
export const hobbiesTable: OccupationTable = {
  id: '314',
  name: 'Hobbies and Interests',
  category: 'occupations',
  diceType: 'd100',
  occupationType: 'special',
  instructions: 'Roll d100 to determine hobby or interest',
  entries: [
    {
      id: '314_01',
      rollRange: [1, 10],
      result: 'Collecting',
      description: 'Gathers specific items or artifacts',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Collecting',
            interest: 'Devoted',
            incomeSpent: '10-25%'
          }
        }
      ]
    },
    {
      id: '314_02',
      rollRange: [11, 20],
      result: 'Gaming',
      description: 'Strategy games, gambling, contests',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Gaming',
            interest: 'Sporadic',
            incomeSpent: '5-15%'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Games of Chance',
            rank: 2,
            type: 'Social'
          }
        }
      ]
    },
    {
      id: '314_03',
      rollRange: [21, 30],
      result: 'Music',
      description: 'Playing instruments or singing',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Music',
            interest: 'Devoted',
            incomeSpent: '15-30%'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Musical Instrument',
            rank: 3,
            type: 'Social'
          }
        }
      ]
    },
    {
      id: '314_04',
      rollRange: [31, 40],
      result: 'Athletics',
      description: 'Physical sports and competitions',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Athletics',
            interest: 'Devoted',
            incomeSpent: '10-20%'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Athletic Sport',
            rank: 3,
            type: 'Physical'
          }
        }
      ]
    },
    {
      id: '314_05',
      rollRange: [41, 50],
      result: 'Reading',
      description: 'Books, scrolls, and written knowledge',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Reading',
            interest: 'Consuming Passion',
            incomeSpent: '20-40%'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'General Knowledge',
            rank: 2,
            type: 'Academic'
          }
        }
      ]
    },
    {
      id: '314_06',
      rollRange: [51, 60],
      result: 'Crafting',
      description: 'Creating items as artistic expression',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Crafting',
            interest: 'Devoted',
            incomeSpent: '15-25%'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Artistic Craft',
            rank: 2,
            type: 'Craft'
          }
        }
      ]
    },
    {
      id: '314_07',
      rollRange: [61, 70],
      result: 'Hunting',
      description: 'Tracking and hunting animals',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Hunting',
            interest: 'Sporadic',
            incomeSpent: '5-15%'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Tracking',
            rank: 2,
            type: 'Survival'
          }
        }
      ]
    },
    {
      id: '314_08',
      rollRange: [71, 80],
      result: 'Socializing',
      description: 'Parties, gatherings, social events',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Socializing',
            interest: 'Devoted',
            incomeSpent: '20-35%'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Etiquette',
            rank: 2,
            type: 'Social'
          }
        }
      ]
    },
    {
      id: '314_09',
      rollRange: [81, 90],
      result: 'Exploring',
      description: 'Travel and discovery of new places',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Exploring',
            interest: 'Consuming Passion',
            incomeSpent: '25-50%'
          }
        },
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Survival',
            rank: 2,
            type: 'Survival'
          }
        }
      ]
    },
    {
      id: '314_10',
      rollRange: [91, 100],
      result: 'Unusual Interest',
      description: 'Rare or unique passion',
      effects: [
        {
          type: 'trait',
          target: 'hobbies',
          value: {
            name: 'Unusual Interest',
            interest: 'Consuming Passion',
            incomeSpent: '30-60%'
          }
        }
      ],
      goto: '315 Unusual Occupations'
    }
  ]
}

// Export all occupation tables
export const occupationTables: Table[] = [
  apprenticeshipsTable,
  civilizedOccupationsTable,
  hobbiesTable
]