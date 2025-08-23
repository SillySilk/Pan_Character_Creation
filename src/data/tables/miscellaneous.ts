// Miscellaneous Events Tables (600s) for PanCasting

import type { Table } from '../../types/tables'

// Table 639: Religious Events
export const religiousEventsTable: Table = {
  id: '639',
  name: 'Religious Events',
  category: 'miscellaneous',
  diceType: 'd10',
  instructions: 'Roll d10 for religious/spiritual event details',
  entries: [
    {
      id: '639_01',
      rollRange: [1, 2],
      result: 'Vision or Dream',
      description: 'Received divine vision or prophetic dream',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Prophetic',
            description: 'Believes in divine guidance'
          }
        }
      ]
    },
    {
      id: '639_02',
      rollRange: [3, 4],
      result: 'Miraculous Healing',
      description: 'Witnessed or experienced divine healing',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Faithful Healer',
            description: 'Believes in healing power of faith'
          }
        }
      ]
    },
    {
      id: '639_03',
      rollRange: [5, 6],
      result: 'Religious Mentor',
      description: 'Found spiritual guide or mentor',
      effects: [
        {
          type: 'relationship',
          target: 'mentors',
          value: {
            name: 'Religious Mentor',
            relationship: 'Spiritual Guide'
          }
        }
      ]
    },
    {
      id: '639_04',
      rollRange: [7, 8],
      result: 'Sacred Quest',
      description: 'Undertook pilgrimage or holy mission',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Questing',
            description: 'Driven by sacred purpose'
          }
        }
      ]
    },
    {
      id: '639_05',
      rollRange: [9, 10],
      result: 'Divine Calling',
      description: 'Called to serve in religious capacity',
      effects: [
        {
          type: 'occupation',
          target: 'occupations',
          value: {
            name: 'Religious Service',
            type: 'Religious',
            skills: ['Religion', 'Diplomacy']
          }
        }
      ]
    }
  ]
}

// Table 624: Tragedy
export const tragedyTable: Table = {
  id: '624',
  name: 'Tragedy',
  category: 'miscellaneous',
  diceType: 'd10',
  instructions: 'Roll d10 for type of personal tragedy',
  entries: [
    {
      id: '624_01',
      rollRange: [1, 2],
      result: 'Death of Loved One',
      description: 'Lost someone very close',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Grief-Stricken',
            description: 'Haunted by loss'
          }
        }
      ]
    },
    {
      id: '624_02',
      rollRange: [3, 4],
      result: 'Betrayal',
      description: 'Betrayed by trusted friend or ally',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Suspicious',
            description: 'Finds it hard to trust others'
          }
        }
      ]
    },
    {
      id: '624_03',
      rollRange: [5, 6],
      result: 'Lost Everything',
      description: 'Lost home, possessions, or status',
      effects: [
        {
          type: 'modifier',
          target: 'solMod',
          value: -3
        }
      ]
    },
    {
      id: '624_04',
      rollRange: [7, 8],
      result: 'Injury or Illness',
      description: 'Suffered permanent injury or chronic illness',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Stoic',
            description: 'Endures pain without complaint'
          }
        }
      ]
    },
    {
      id: '624_05',
      rollRange: [9, 10],
      result: 'False Accusation',
      description: 'Wrongly accused of serious crime',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Bitter',
            description: 'Resentful toward authority'
          }
        }
      ]
    }
  ]
}

// Table 625: Something Wonderful
export const somethingWonderfulTable: Table = {
  id: '625',
  name: 'Something Wonderful',
  category: 'miscellaneous',
  diceType: 'd10',
  instructions: 'Roll d10 for amazing fortune or opportunity',
  entries: [
    {
      id: '625_01',
      rollRange: [1, 2],
      result: 'Unexpected Inheritance',
      description: 'Inherited wealth or property',
      effects: [
        {
          type: 'modifier',
          target: 'solMod',
          value: 3
        }
      ]
    },
    {
      id: '625_02',
      rollRange: [3, 4],
      result: 'Found True Love',
      description: 'Met perfect romantic partner',
      effects: [
        {
          type: 'relationship',
          target: 'romantic',
          value: {
            name: 'True Love',
            relationship: 'Life Partner'
          }
        }
      ]
    },
    {
      id: '625_03',
      rollRange: [5, 6],
      result: 'Discovered Talent',
      description: 'Uncovered exceptional natural ability',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Natural Talent',
            rank: 5,
            type: 'Special'
          }
        }
      ]
    },
    {
      id: '625_04',
      rollRange: [7, 8],
      result: 'Saved Important Person',
      description: 'Rescued someone of high status',
      effects: [
        {
          type: 'relationship',
          target: 'allies',
          value: {
            name: 'Grateful Noble',
            relationship: 'Powerful Ally'
          }
        }
      ]
    },
    {
      id: '625_05',
      rollRange: [9, 10],
      result: 'Divine Blessing',
      description: 'Blessed by divine or magical force',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Blessed',
            description: 'Favored by supernatural forces'
          }
        }
      ]
    }
  ]
}

// Table 627: Elven Events
export const elvenEventsTable: Table = {
  id: '627',
  name: 'Elven Events',
  category: 'miscellaneous',
  diceType: 'd10',
  instructions: 'Roll d10 for elven racial heritage event',
  entries: [
    {
      id: '627_01',
      rollRange: [1, 2],
      result: 'Elven Longevity Awakening',
      description: 'Gained awareness of extended lifespan',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Patient',
            description: 'Thinks in long-term perspectives'
          }
        }
      ]
    },
    {
      id: '627_02',
      rollRange: [3, 4],
      result: 'Forest Communion',
      description: 'Deep spiritual connection with nature',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Nature',
            rank: 3,
            type: 'Knowledge'
          }
        }
      ]
    },
    {
      id: '627_03',
      rollRange: [5, 6],
      result: 'Ancient Memory',
      description: 'Recalled ancestral memories',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'History',
            rank: 2,
            type: 'Knowledge'
          }
        }
      ]
    },
    {
      id: '627_04',
      rollRange: [7, 8],
      result: 'Artistic Inspiration',
      description: 'Inspired by elven cultural traditions',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Perform',
            rank: 3,
            type: 'Creative'
          }
        }
      ]
    },
    {
      id: '627_05',
      rollRange: [9, 10],
      result: 'Magical Sensitivity',
      description: 'Heightened awareness of magical energies',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Magically Sensitive',
            description: 'Can sense magical auras and energies'
          }
        }
      ]
    }
  ]
}

// Table 628: Dwarven Events
export const dwarvenEventsTable: Table = {
  id: '628',
  name: 'Dwarven Events',
  category: 'miscellaneous',
  diceType: 'd10',
  instructions: 'Roll d10 for dwarven racial heritage event',
  entries: [
    {
      id: '628_01',
      rollRange: [1, 2],
      result: 'Clan Honor Earned',
      description: 'Performed deed worthy of clan recognition',
      effects: [
        {
          type: 'modifier',
          target: 'cuMod',
          value: 2
        }
      ]
    },
    {
      id: '628_02',
      rollRange: [3, 4],
      result: 'Master Craftsman Training',
      description: 'Trained under renowned artisan',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Craft',
            rank: 4,
            type: 'Professional',
            specialty: 'Metalworking'
          }
        }
      ]
    },
    {
      id: '628_03',
      rollRange: [5, 6],
      result: 'Underground Navigation',
      description: 'Developed expertise in subterranean travel',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Survival',
            rank: 3,
            type: 'Practical',
            specialty: 'Underground'
          }
        }
      ]
    },
    {
      id: '628_04',
      rollRange: [7, 8],
      result: 'Ancestral Weapon',
      description: 'Inherited clan weapon of significance',
      effects: [
        {
          type: 'item',
          target: 'equipment',
          value: {
            name: 'Ancestral Weapon',
            quality: 'Masterwork',
            type: 'Weapon'
          }
        }
      ]
    },
    {
      id: '628_05',
      rollRange: [9, 10],
      result: 'Stone Speech',
      description: 'Learned to read the history in stone',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Stone Speaker',
            description: 'Can sense the age and history of worked stone'
          }
        }
      ]
    }
  ]
}

// Table 629: Halfling Events
export const halflingEventsTable: Table = {
  id: '629',
  name: 'Halfling Events',
  category: 'miscellaneous',
  diceType: 'd10',
  instructions: 'Roll d10 for halfling racial heritage event',
  entries: [
    {
      id: '629_01',
      rollRange: [1, 2],
      result: 'Community Festival',
      description: 'Organized or starred in local celebration',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Diplomacy',
            rank: 2,
            type: 'Social'
          }
        }
      ]
    },
    {
      id: '629_02',
      rollRange: [3, 4],
      result: 'Culinary Mastery',
      description: 'Achieved recognition for cooking skills',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Profession',
            rank: 4,
            type: 'Professional',
            specialty: 'Cook'
          }
        }
      ]
    },
    {
      id: '629_03',
      rollRange: [5, 6],
      result: 'Lucky Break',
      description: 'Experienced remarkable stroke of fortune',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Lucky',
            description: 'Things tend to work out favorably'
          }
        }
      ]
    },
    {
      id: '629_04',
      rollRange: [7, 8],
      result: 'Brave Adventure',
      description: 'Overcame natural timidity for heroic deed',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Brave',
            description: 'Courage when it truly matters'
          }
        }
      ]
    },
    {
      id: '629_05',
      rollRange: [9, 10],
      result: 'Hidden Talent',
      description: 'Discovered unexpected skill or ability',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Sleight of Hand',
            rank: 3,
            type: 'Physical'
          }
        }
      ]
    }
  ]
}

// Table 630: Unusual Heritage
export const unusualHeritageTable: Table = {
  id: '630',
  name: 'Unusual Heritage',
  category: 'miscellaneous',
  diceType: 'd10',
  instructions: 'Roll d10 for unusual or mixed heritage background',
  entries: [
    {
      id: '630_01',
      rollRange: [1, 2],
      result: 'Mixed Bloodline',
      description: 'Carries traits from multiple races',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Adaptable',
            description: 'Comfortable in different cultures'
          }
        }
      ]
    },
    {
      id: '630_02',
      rollRange: [3, 4],
      result: 'Ancient Bloodline',
      description: 'Descended from legendary figure',
      effects: [
        {
          type: 'modifier',
          target: 'cuMod',
          value: 1
        }
      ]
    },
    {
      id: '630_03',
      rollRange: [5, 6],
      result: 'Exotic Parentage',
      description: 'One parent from distant or unusual culture',
      effects: [
        {
          type: 'skill',
          target: 'skills',
          value: {
            name: 'Knowledge',
            rank: 2,
            type: 'Academic',
            specialty: 'Foreign Culture'
          }
        }
      ]
    },
    {
      id: '630_04',
      rollRange: [7, 8],
      result: 'Marked by Destiny',
      description: 'Born under significant celestial event',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Destiny-Marked',
            description: 'Sense of greater purpose'
          }
        }
      ]
    },
    {
      id: '630_05',
      rollRange: [9, 10],
      result: 'Mystical Connection',
      description: 'Unusual bond with magical forces',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Mystically Attuned',
            description: 'Natural affinity for magic'
          }
        }
      ]
    }
  ]
}

// Table 640: Romantic Encounters
export const romanticEncountersTable: Table = {
  id: '640',
  name: 'Romantic Encounters',
  category: 'miscellaneous',
  diceType: 'd10',
  instructions: 'Roll d10 for romantic relationship development',
  entries: [
    {
      id: '640_01',
      rollRange: [1, 2],
      result: 'First Love',
      description: 'Experienced innocent, pure romance',
      effects: [
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
      id: '640_02',
      rollRange: [3, 4],
      result: 'Heartbreak',
      description: 'Suffered devastating romantic loss',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Guarded Heart',
            description: 'Reluctant to open up emotionally'
          }
        }
      ]
    },
    {
      id: '640_03',
      rollRange: [5, 6],
      result: 'Secret Affair',
      description: 'Involved in forbidden or hidden romance',
      effects: [
        {
          type: 'relationship',
          target: 'secrets',
          value: {
            name: 'Secret Lover',
            relationship: 'Hidden Romance'
          }
        }
      ]
    },
    {
      id: '640_04',
      rollRange: [7, 8],
      result: 'Marriage Prospect',
      description: 'Found suitable long-term partner',
      effects: [
        {
          type: 'relationship',
          target: 'romantic',
          value: {
            name: 'Life Partner',
            relationship: 'Spouse/Betrothed'
          }
        }
      ]
    },
    {
      id: '640_05',
      rollRange: [9, 10],
      result: 'Unrequited Love',
      description: 'Pined for someone unattainable',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Melancholic',
            description: 'Carries sadness from lost love'
          }
        }
      ]
    }
  ]
}

// Table 642: Unusual Events
export const unusualEventsTable: Table = {
  id: '642',
  name: 'Unusual Events',
  category: 'miscellaneous',
  diceType: 'd10',
  instructions: 'Roll d10 for strange or supernatural occurrence',
  entries: [
    {
      id: '642_01',
      rollRange: [1, 2],
      result: 'Supernatural Encounter',
      description: 'Met otherworldly being or entity',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Touched by Mystery',
            description: 'Has experienced the impossible'
          }
        }
      ]
    },
    {
      id: '642_02',
      rollRange: [3, 4],
      result: 'Prophetic Dream',
      description: 'Received vision of future events',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Foresight',
            description: 'Occasionally glimpses future possibilities'
          }
        }
      ]
    },
    {
      id: '642_03',
      rollRange: [5, 6],
      result: 'Miraculous Survival',
      description: 'Survived impossible odds through fortune',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Blessed Survivor',
            description: 'Protected by unexplained fortune'
          }
        }
      ]
    },
    {
      id: '642_04',
      rollRange: [7, 8],
      result: 'Strange Artifact',
      description: 'Found mysterious object of unknown origin',
      effects: [
        {
          type: 'item',
          target: 'equipment',
          value: {
            name: 'Mysterious Artifact',
            quality: 'Unknown',
            type: 'Relic'
          }
        }
      ]
    },
    {
      id: '642_05',
      rollRange: [9, 10],
      result: 'Cursed by Fate',
      description: 'Marked by supernatural misfortune',
      effects: [
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Ill-Fated',
            description: 'Plagued by minor supernatural mishaps'
          }
        }
      ]
    }
  ]
}

// Export all miscellaneous tables
export const miscellaneousTables: Table[] = [
  religiousEventsTable,
  tragedyTable,
  somethingWonderfulTable,
  elvenEventsTable,
  dwarvenEventsTable,
  halflingEventsTable,
  unusualHeritageTable,
  romanticEncountersTable,
  unusualEventsTable
]