// Life Details Tables (900s) - Consolidated Relationships, Items & Events

import type { Table } from '../../types/tables'

// Table 901: Important Relationships
export const importantRelationshipsTable: Table = {
  id: '901',
  name: 'Important Relationships',
  category: 'lifeDetails',
  diceType: 'd100',
  instructions: 'Roll d100 to determine an important relationship in your character\'s life',
  entries: [
    {
      id: '901_01',
      rollRange: [1, 10],
      result: 'Loyal Best Friend',
      description: 'A steadfast companion who has stood by you through thick and thin',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Best Friend',
            loyalty: 'Unwavering',
            type: 'Companion',
            skills: ['Social', 'Support']
          }
        }
      ]
    },
    {
      id: '901_02',
      rollRange: [11, 20],
      result: 'Wise Mentor',
      description: 'An experienced guide who shaped your character and abilities',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Mentor',
            loyalty: 'Strong',
            type: 'Teacher',
            skills: ['Knowledge', 'Guidance']
          }
        }
      ]
    },
    {
      id: '901_03',
      rollRange: [21, 30],
      result: 'Romantic Partner',
      description: 'Someone who holds your heart and shares your dreams',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Romantic Partner',
            loyalty: 'Deep',
            type: 'Lover',
            skills: ['Emotional Support', 'Intimacy']
          }
        }
      ]
    },
    {
      id: '901_04',
      rollRange: [31, 40],
      result: 'Family Member',
      description: 'A close family member who remains important to you',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Family Member',
            loyalty: 'Blood Bond',
            type: 'Family',
            skills: ['Support', 'History']
          }
        }
      ]
    },
    {
      id: '901_05',
      rollRange: [41, 50],
      result: 'Professional Partner',
      description: 'A trusted colleague or business partner',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Professional Partner',
            loyalty: 'Professional',
            type: 'Colleague',
            skills: ['Trade Skills', 'Networking']
          }
        }
      ]
    },
    {
      id: '901_06',
      rollRange: [51, 60],
      result: 'Dangerous Rival',
      description: 'Someone who opposes you but commands respect',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Dangerous Rival',
            loyalty: 'Antagonistic',
            type: 'Enemy',
            skills: ['Combat', 'Scheming']
          }
        }
      ]
    },
    {
      id: '901_07',
      rollRange: [61, 70],
      result: 'Influential Contact',
      description: 'Someone with power who can open doors for you',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Influential Contact',
            loyalty: 'Conditional',
            type: 'Patron',
            skills: ['Politics', 'Resources']
          }
        }
      ]
    },
    {
      id: '901_08',
      rollRange: [71, 80],
      result: 'Dependent',
      description: 'Someone who relies on you for protection or support',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Dependent',
            loyalty: 'Grateful',
            type: 'Ward',
            skills: ['Loyalty', 'Motivation']
          }
        }
      ]
    },
    {
      id: '901_09',
      rollRange: [81, 90],
      result: 'Mysterious Benefactor',
      description: 'Someone who aids you from the shadows',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Mysterious Benefactor',
            loyalty: 'Unknown',
            type: 'Patron',
            skills: ['Resources', 'Mystery']
          }
        }
      ]
    },
    {
      id: '901_10',
      rollRange: [91, 100],
      result: 'Sworn Enemy',
      description: 'Someone who has vowed to destroy you',
      effects: [
        {
          type: 'relationship',
          target: 'relationships',
          value: {
            name: 'Sworn Enemy',
            loyalty: 'Hatred',
            type: 'Nemesis',
            skills: ['Combat', 'Vengeance']
          }
        }
      ]
    }
  ]
}

// Table 902: Special Possessions
export const specialPossessionsTable: Table = {
  id: '902',
  name: 'Special Possessions',
  category: 'lifeDetails',
  diceType: 'd100',
  instructions: 'Roll d100 to determine a special possession that defines your character',
  entries: [
    {
      id: '902_01',
      rollRange: [1, 10],
      result: 'Ancestral Weapon',
      description: 'A weapon passed down through generations',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Ancestral Weapon',
            quality: 'Masterwork',
            value: 'High',
            history: 'Family Heirloom',
            type: 'Weapon'
          }
        }
      ]
    },
    {
      id: '902_02',
      rollRange: [11, 20],
      result: 'Precious Jewelry',
      description: 'A valuable piece of jewelry with personal significance',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Precious Jewelry',
            quality: 'Expensive',
            value: 'High',
            history: 'Gift from loved one',
            type: 'Jewelry'
          }
        }
      ]
    },
    {
      id: '902_03',
      rollRange: [21, 30],
      result: 'Rare Book',
      description: 'A tome containing valuable or secret knowledge',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Rare Book',
            quality: 'Unique',
            value: 'Moderate',
            history: 'Found or gifted',
            type: 'Book'
          }
        }
      ]
    },
    {
      id: '902_04',
      rollRange: [31, 40],
      result: 'Magical Trinket',
      description: 'A small item with minor magical properties',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Magical Trinket',
            quality: 'Enchanted',
            value: 'High',
            history: 'Mysterious origin',
            type: 'Magic Item'
          }
        }
      ]
    },
    {
      id: '902_05',
      rollRange: [41, 50],
      result: 'Professional Tools',
      description: 'High-quality tools of your trade',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Professional Tools',
            quality: 'Superior',
            value: 'Moderate',
            history: 'Earned through skill',
            type: 'Tools'
          }
        }
      ]
    },
    {
      id: '902_06',
      rollRange: [51, 60],
      result: 'Keepsake',
      description: 'A sentimental item from your past',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Sentimental Keepsake',
            quality: 'Personal',
            value: 'Low',
            history: 'Emotional significance',
            type: 'Memento'
          }
        }
      ]
    },
    {
      id: '902_07',
      rollRange: [61, 70],
      result: 'Rare Art',
      description: 'A valuable piece of art or craftsmanship',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Rare Artwork',
            quality: 'Artistic',
            value: 'High',
            history: 'Acquired through fortune',
            type: 'Art'
          }
        }
      ]
    },
    {
      id: '902_08',
      rollRange: [71, 80],
      result: 'Secret Map',
      description: 'A map leading to something valuable or important',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Secret Map',
            quality: 'Unique',
            value: 'Unknown',
            history: 'Discovered accidentally',
            type: 'Document'
          }
        }
      ]
    },
    {
      id: '902_09',
      rollRange: [81, 90],
      result: 'Stolen Treasure',
      description: 'Something valuable taken from others',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Stolen Treasure',
            quality: 'Valuable',
            value: 'High',
            history: 'Acquired through theft',
            type: 'Treasure'
          }
        }
      ]
    },
    {
      id: '902_10',
      rollRange: [91, 100],
      result: 'Cursed Object',
      description: 'An item with both power and peril',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Cursed Object',
            quality: 'Cursed',
            value: 'Dangerous',
            history: 'Bound by dark magic',
            type: 'Cursed Item'
          }
        }
      ]
    }
  ]
}

// Table 903: Defining Life Events
export const definingLifeEventsTable: Table = {
  id: '903',
  name: 'Defining Life Events',
  category: 'lifeDetails',
  diceType: 'd100',
  instructions: 'Roll d100 to determine a defining event that shaped your character',
  entries: [
    {
      id: '903_01',
      rollRange: [1, 10],
      result: 'Near-Death Experience',
      description: 'You barely survived a life-threatening situation',
      effects: [
        {
          type: 'modifier',
          target: 'wisdom',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Survivor',
            description: 'Values life and takes calculated risks'
          }
        }
      ]
    },
    {
      id: '903_02',
      rollRange: [11, 20],
      result: 'Great Achievement',
      description: 'You accomplished something remarkable',
      effects: [
        {
          type: 'modifier',
          target: 'charisma',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Accomplished',
            description: 'Confident from past success'
          }
        }
      ]
    },
    {
      id: '903_03',
      rollRange: [21, 30],
      result: 'Terrible Loss',
      description: 'You lost someone or something important',
      effects: [
        {
          type: 'modifier',
          target: 'wisdom',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Grieving',
            description: 'Carries the weight of loss'
          }
        }
      ]
    },
    {
      id: '903_04',
      rollRange: [31, 40],
      result: 'Moment of Heroism',
      description: 'You saved others at personal risk',
      effects: [
        {
          type: 'modifier',
          target: 'charisma',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Lightside',
            name: 'Heroic',
            description: 'Willing to sacrifice for others'
          }
        }
      ]
    },
    {
      id: '903_05',
      rollRange: [41, 50],
      result: 'Betrayal',
      description: 'Someone you trusted betrayed you',
      effects: [
        {
          type: 'modifier',
          target: 'wisdom',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Distrustful',
            description: 'Slow to trust others'
          }
        }
      ]
    },
    {
      id: '903_06',
      rollRange: [51, 60],
      result: 'Discovery',
      description: 'You uncovered something important or secret',
      effects: [
        {
          type: 'modifier',
          target: 'intelligence',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Curious',
            description: 'Driven to uncover mysteries'
          }
        }
      ]
    },
    {
      id: '903_07',
      rollRange: [61, 70],
      result: 'Moment of Weakness',
      description: 'You failed when others depended on you',
      effects: [
        {
          type: 'modifier',
          target: 'wisdom',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Neutral',
            name: 'Guilt-Ridden',
            description: 'Haunted by past failures'
          }
        }
      ]
    },
    {
      id: '903_08',
      rollRange: [71, 80],
      result: 'Transformation',
      description: 'A experience that fundamentally changed you',
      effects: [
        {
          type: 'modifier',
          target: 'constitution',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Transformed',
            description: 'Changed by extraordinary experience'
          }
        }
      ]
    },
    {
      id: '903_09',
      rollRange: [81, 90],
      result: 'Revenge Taken',
      description: 'You got back at someone who wronged you',
      effects: [
        {
          type: 'modifier',
          target: 'strength',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Darkside',
            name: 'Vengeful',
            description: 'Believes in eye for an eye'
          }
        }
      ]
    },
    {
      id: '903_10',
      rollRange: [91, 100],
      result: 'Divine Intervention',
      description: 'The gods or fate directly influenced your life',
      effects: [
        {
          type: 'modifier',
          target: 'charisma',
          value: 1
        },
        {
          type: 'trait',
          target: 'personalityTraits',
          value: {
            type: 'Exotic',
            name: 'Chosen',
            description: 'Touched by divine power'
          }
        }
      ]
    }
  ]
}

// Export all life details tables
export const lifeDetailsTables: Table[] = [
  importantRelationshipsTable,
  specialPossessionsTable,
  definingLifeEventsTable
]