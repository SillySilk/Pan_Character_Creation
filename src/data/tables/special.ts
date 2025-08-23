// Special Items & Gifts Tables (800s) for PanCasting

import type { SpecialTable, Table } from '../../types/tables'

// Table 801: Gifts and Legacies
export const giftsLegaciesTable: SpecialTable = {
  id: '801',
  name: 'Gifts and Legacies',
  category: 'special',
  diceType: 'd100',
  itemType: 'gift',
  valuationRequired: true,
  instructions: 'Roll d100 to determine special gift or legacy',
  entries: [
    {
      id: '801_01',
      rollRange: [1, 15],
      result: 'Weapon Heirloom',
      description: 'Masterwork weapon passed down through generations',
      effects: [
        {
          type: 'item',
          target: 'gifts',
          value: {
            name: 'Ancestral Weapon',
            type: 'Weapon',
            quality: 'Masterwork',
            history: 'Family heirloom',
            value: 'High'
          }
        }
      ]
    },
    {
      id: '801_02',
      rollRange: [16, 25],
      result: 'Jewelry of Value',
      description: 'Precious jewelry with sentimental significance',
      effects: [
        {
          type: 'item',
          target: 'gifts',
          value: {
            name: 'Precious Jewelry',
            type: 'Jewelry',
            quality: 'Fine',
            history: 'Sentimental value',
            value: 'Moderate'
          }
        }
      ]
    },
    {
      id: '801_03',
      rollRange: [26, 35],
      result: 'Ancient Tome',
      description: 'Rare book containing valuable knowledge',
      effects: [
        {
          type: 'item',
          target: 'gifts',
          value: {
            name: 'Ancient Tome',
            type: 'Book',
            quality: 'Rare',
            history: 'Ancient knowledge',
            value: 'Very High'
          }
        }
      ]
    },
    {
      id: '801_04',
      rollRange: [36, 45],
      result: 'Magical Item',
      description: 'Item imbued with mystical properties',
      effects: [
        {
          type: 'item',
          target: 'gifts',
          value: {
            name: 'Magical Item',
            type: 'Magic',
            quality: 'Enchanted',
            history: 'Mystical origins',
            value: 'Priceless'
          }
        }
      ]
    },
    {
      id: '801_05',
      rollRange: [46, 55],
      result: 'Deed to Property',
      description: 'Ownership of land or building',
      effects: [
        {
          type: 'item',
          target: 'legacies',
          value: {
            name: 'Property Deed',
            type: 'Property',
            quality: 'Legal Document',
            history: 'Inherited property',
            value: 'Variable'
          }
        }
      ]
    },
    {
      id: '801_06',
      rollRange: [56, 65],
      result: 'Trade Monopoly',
      description: 'Exclusive rights to certain commerce',
      effects: [
        {
          type: 'item',
          target: 'legacies',
          value: {
            name: 'Trade Rights',
            type: 'Legal',
            quality: 'Monopoly',
            history: 'Commercial privilege',
            value: 'Very High'
          }
        }
      ]
    },
    {
      id: '801_07',
      rollRange: [66, 75],
      result: 'Noble Title',
      description: 'Hereditary rank and associated privileges',
      effects: [
        {
          type: 'item',
          target: 'legacies',
          value: {
            name: 'Noble Title',
            type: 'Title',
            quality: 'Hereditary',
            history: 'Family nobility',
            value: 'Priceless'
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
      id: '801_08',
      rollRange: [76, 85],
      result: 'Mysterious Artifact',
      description: 'Item of unknown origin and purpose',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Mysterious Artifact',
            type: 'Artifact',
            quality: 'Unknown',
            history: 'Mysterious origins',
            value: 'Unknown'
          }
        }
      ]
    },
    {
      id: '801_09',
      rollRange: [86, 95],
      result: 'Sacred Relic',
      description: 'Holy item blessed by divine power',
      effects: [
        {
          type: 'item',
          target: 'gifts',
          value: {
            name: 'Sacred Relic',
            type: 'Religious',
            quality: 'Blessed',
            history: 'Divine blessing',
            value: 'Priceless'
          }
        }
      ]
    },
    {
      id: '801_10',
      rollRange: [96, 100],
      result: 'Cursed Object',
      description: 'Item that brings misfortune to bearer',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Cursed Object',
            type: 'Cursed',
            quality: 'Dangerous',
            history: 'Dark curse',
            value: 'Negative'
          }
        }
      ]
    }
  ]
}

// Table 802: Unusual Objects
export const unusualObjectsTable: SpecialTable = {
  id: '802',
  name: 'Unusual Objects',
  category: 'special',
  diceType: 'd100',
  itemType: 'magical',
  valuationRequired: false,
  instructions: 'Roll d100 for unusual or anachronistic item',
  entries: [
    {
      id: '802_01',
      rollRange: [1, 10],
      result: 'Crystal of Power',
      description: 'Glowing crystal with unknown energy',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Power Crystal',
            type: 'Crystal',
            properties: ['Glowing', 'Energy Source'],
            origin: 'Unknown'
          }
        }
      ]
    },
    {
      id: '802_02',
      rollRange: [11, 20],
      result: 'Mechanical Device',
      description: 'Complex clockwork mechanism',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Clockwork Device',
            type: 'Mechanical',
            properties: ['Self-Operating', 'Precise'],
            origin: 'Advanced Technology'
          }
        }
      ]
    },
    {
      id: '802_03',
      rollRange: [21, 30],
      result: 'Shifting Metal',
      description: 'Metal that changes shape at will',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Morphic Metal',
            type: 'Material',
            properties: ['Shape-changing', 'Responsive'],
            origin: 'Alchemical'
          }
        }
      ]
    },
    {
      id: '802_04',
      rollRange: [31, 40],
      result: 'Bottled Spirit',
      description: 'Ethereal being trapped in container',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Spirit Vessel',
            type: 'Container',
            properties: ['Contains Spirit', 'Magical'],
            origin: 'Supernatural'
          }
        }
      ]
    },
    {
      id: '802_05',
      rollRange: [41, 50],
      result: 'Living Stone',
      description: 'Rock that pulses with life',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Living Stone',
            type: 'Mineral',
            properties: ['Alive', 'Pulsing'],
            origin: 'Elemental'
          }
        }
      ]
    },
    {
      id: '802_06',
      rollRange: [51, 60],
      result: 'Mirror Portal',
      description: 'Reflective surface showing other places',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Scrying Mirror',
            type: 'Mirror',
            properties: ['Scrying', 'Portal'],
            origin: 'Divination Magic'
          }
        }
      ]
    },
    {
      id: '802_07',
      rollRange: [61, 70],
      result: 'Singing Blade',
      description: 'Weapon that produces musical tones',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Singing Blade',
            type: 'Weapon',
            properties: ['Musical', 'Enchanted'],
            origin: 'Bardic Magic'
          }
        }
      ]
    },
    {
      id: '802_08',
      rollRange: [71, 80],
      result: 'Time-Locked Box',
      description: 'Container that exists partially outside time',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Temporal Container',
            type: 'Box',
            properties: ['Time-Locked', 'Preservation'],
            origin: 'Temporal Magic'
          }
        }
      ]
    },
    {
      id: '802_09',
      rollRange: [81, 90],
      result: 'Star Fragment',
      description: 'Piece of fallen star with cosmic power',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Star Fragment',
            type: 'Cosmic',
            properties: ['Starlight', 'Cosmic Power'],
            origin: 'Celestial'
          }
        }
      ]
    },
    {
      id: '802_10',
      rollRange: [91, 100],
      result: 'Impossible Object',
      description: 'Item that defies physical laws',
      effects: [
        {
          type: 'item',
          target: 'specialItems',
          value: {
            name: 'Impossible Object',
            type: 'Paradox',
            properties: ['Impossible', 'Reality-Bending'],
            origin: 'Unknown'
          }
        }
      ]
    }
  ]
}

// Export all special item tables
export const specialTables: Table[] = [
  giftsLegaciesTable,
  unusualObjectsTable
]