// Youth Events Tables (200s) for PanCasting

import type { YouthTable, Table } from '../../types/tables'

// Table 208: Youth Events
export const youthEventsTable: YouthTable = {
  id: '208',
  name: 'Youth Events',
  category: 'youth',
  diceType: '1d3',
  lifePeriod: 'both',
  eventCount: '1d3',
  instructions: 'Roll 1d3 for childhood events, 1d3 for adolescence events',
  entries: [
    {
      id: '208_childhood',
      rollRange: [1, 1],
      result: 'Childhood Event',
      description: 'Roll on childhood events table',
      goto: '209 Childhood Events'
    },
    {
      id: '208_adolescence',
      rollRange: [2, 2], 
      result: 'Adolescence Event',
      description: 'Roll on adolescence events table',
      goto: '220 Adolescence Events'
    },
    {
      id: '208_both',
      rollRange: [3, 3],
      result: 'Both Periods',
      description: 'Events in both childhood and adolescence',
      goto: '209 Childhood Events'
    }
  ]
}

// Table 209: Childhood Events
export const childhoodEventsTable: YouthTable = {
  id: '209',
  name: 'Childhood Events',
  category: 'youth',
  diceType: 'd100',
  lifePeriod: 'childhood',
  ageRange: [1, 12],
  instructions: 'Roll d100 for childhood event (ages 1-12)',
  entries: [
    {
      id: '209_01',
      rollRange: [1, 5],
      result: 'Sickly Child',
      description: 'Frequent illness weakens constitution',
      effects: [
        {
          type: 'modifier',
          target: 'constitution',
          value: -1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Cautious',
            description: 'Careful about health and safety'
          }
        }
      ]
    },
    {
      id: '209_02',
      rollRange: [6, 15],
      result: 'Family Tragedy',
      description: 'Death or loss of important family member',
      effects: [
        {
          type: 'event',
          target: 'youthEvents',
          value: {
            name: 'Family Tragedy',
            description: 'Lost important family member',
            age: '1d12'
          }
        }
      ],
      goto: '624 Tragedy'
    },
    {
      id: '209_03',
      rollRange: [16, 25],
      result: 'Mentored by Elder',
      description: 'Wise elder takes interest in education',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Lore',
            rank: 2,
            type: 'Academic'
          }
        },
        {
          type: 'relationship',
          target: 'npcs',
          value: {
            name: 'Elder Mentor',
            type: 'Mentor',
            relationship: 'Mentor'
          }
        }
      ]
    },
    {
      id: '209_04',
      rollRange: [26, 35],
      result: 'Discovered Talent',
      description: 'Natural ability emerges early',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Natural Talent',
            rank: 3,
            type: 'Special'
          }
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Confident',
            description: 'Self-assured in abilities'
          }
        }
      ]
    },
    {
      id: '209_05',
      rollRange: [36, 45],
      result: 'Childhood Friend',
      description: 'Made lifelong friendship',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Childhood Friend',
            type: 'Friend',
            loyalty: 'Strong'
          }
        }
      ]
    },
    {
      id: '209_06',
      rollRange: [46, 55],
      result: 'Family Moved',
      description: 'Family relocated to new area',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Adaptable',
            description: 'Comfortable with change'
          }
        }
      ]
    },
    {
      id: '209_07',
      rollRange: [56, 65],
      result: 'Unusual Pet',
      description: 'Befriended exotic or magical creature',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Unusual Pet',
            type: 'Animal Companion',
            loyalty: 'Devoted'
          }
        }
      ]
    },
    {
      id: '209_08',
      rollRange: [66, 75],
      result: 'Academic Achievement',
      description: 'Excelled in studies and learning',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Academics',
            rank: 2,
            type: 'Academic'
          }
        },
        {
          type: 'modifier',
          target: 'intelligence',
          value: 1
        }
      ]
    },
    {
      id: '209_09',
      rollRange: [76, 85],
      result: 'Athletic Prowess',
      description: 'Showed exceptional physical abilities',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Athletics',
            rank: 2,
            type: 'Physical'
          }
        },
        {
          type: 'modifier',
          target: 'strength',
          value: 1
        }
      ]
    },
    {
      id: '209_10',
      rollRange: [86, 95],
      result: 'Wonderful Event',
      description: 'Something amazing happened',
      goto: '625 Something Wonderful'
    },
    {
      id: '209_11',
      rollRange: [96, 100],
      result: 'Mysterious Event',
      description: 'Strange and unexplained occurrence',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Supernatural Sensitivity',
            description: 'Attuned to mystical forces'
          }
        }
      ],
      goto: '642 Unusual Events'
    }
  ]
}

// Table 220: Adolescence Events  
export const adolescenceEventsTable: YouthTable = {
  id: '220',
  name: 'Adolescence Events',
  category: 'youth',
  diceType: 'd100',
  lifePeriod: 'adolescence',
  ageRange: [13, 18],
  instructions: 'Roll d100 for adolescence event (ages 13-18)',
  entries: [
    {
      id: '220_01',
      rollRange: [1, 5],
      result: 'Rebellious Phase',
      description: 'Defied authority and social norms',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Rebellious',
            description: 'Questions authority'
          }
        }
      ]
    },
    {
      id: '220_02',
      rollRange: [6, 15],
      result: 'First Love',
      description: 'Experienced first romantic relationship',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'First Love',
            type: 'Romantic',
            status: 'Past'
          }
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Romantic',
            description: 'Believes in true love'
          }
        }
      ]
    },
    {
      id: '220_03',
      rollRange: [16, 25],
      result: 'Apprenticeship Offer',
      description: 'Offered training in a trade or profession',
      effects: [
        {
          type: 'occupation',
          target: 'apprenticeships',
          value: {
            name: 'Apprenticeship',
            duration: 5,
            rank: 1
          }
        }
      ],
      goto: '309 Apprenticeships'
    },
    {
      id: '220_04',
      rollRange: [26, 35],
      result: 'Coming of Age Ceremony',
      description: 'Participated in cultural ritual of adulthood',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Honored Traditions',
            description: 'Respects cultural customs'
          }
        }
      ]
    },
    {
      id: '220_05',
      rollRange: [36, 45],
      result: 'Adventure Call',
      description: 'Felt the pull of adventure and exploration',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Adventurous',
            description: 'Seeks new experiences'
          }
        }
      ]
    },
    {
      id: '220_06',
      rollRange: [46, 55],
      result: 'Rivalry Develops',
      description: 'Made an enemy or rival',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Adolescent Rival',
            conflictType: 'Personal Competition'
          }
        }
      ]
    },
    {
      id: '220_07',
      rollRange: [56, 65],
      result: 'Family Responsibility',
      description: 'Took on adult duties early',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Responsible',
            description: 'Takes duties seriously'
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
      id: '220_08',
      rollRange: [66, 75],
      result: 'Spiritual Awakening',
      description: 'Found deep religious or philosophical calling',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Devout',
            description: 'Strong religious faith'
          }
        }
      ],
      goto: '639 Religious Experience'
    },
    {
      id: '220_09',
      rollRange: [76, 85],
      result: 'Scholarly Recognition',
      description: 'Academic achievements brought recognition',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Research',
            rank: 2,
            type: 'Academic'
          }
        }
      ]
    },
    {
      id: '220_10',
      rollRange: [86, 90],
      result: 'Heroic Moment',
      description: 'Performed brave deed that saved others',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Heroic',
            description: 'Willing to sacrifice for others'
          }
        }
      ],
      goto: '625 Something Wonderful'
    },
    {
      id: '220_11',
      rollRange: [91, 95],
      result: 'Tragic Loss',
      description: 'Suffered significant personal loss',
      goto: '624 Tragedy'
    },
    {
      id: '220_12',
      rollRange: [96, 100],
      result: 'Mysterious Encounter',
      description: 'Met someone or something extraordinary',
      goto: '642 Unusual Events'
    }
  ]
}

// Export all youth tables
export const youthTables: Table[] = [
  youthEventsTable,
  childhoodEventsTable,
  adolescenceEventsTable
]