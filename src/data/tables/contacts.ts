// Contacts & Relationships Tables (700s) for PanCasting

import type { ContactTable, Table } from '../../types/tables'

// Table 753: NPCs and Companions
export const npcCompanionsTable: ContactTable = {
  id: '753',
  name: 'NPCs and Companions',
  category: 'contacts',
  diceType: 'd100',
  relationshipType: 'companion',
  generateStats: true,
  instructions: 'Roll d100 to generate NPC companion',
  entries: [
    {
      id: '753_01',
      rollRange: [1, 15],
      result: 'Warrior Companion',
      description: 'Skilled fighter loyal to the character',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Warrior Companion',
            type: 'Fighter',
            loyalty: 'Strong',
            skills: ['Combat', 'Tactics'],
            relationship: 'Battle Brother/Sister'
          }
        }
      ]
    },
    {
      id: '753_02',
      rollRange: [16, 25],
      result: 'Scholar Ally',
      description: 'Learned individual with vast knowledge',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Scholar Ally',
            type: 'Academic',
            loyalty: 'Average',
            skills: ['Research', 'Languages', 'History'],
            relationship: 'Intellectual Partner'
          }
        }
      ]
    },
    {
      id: '753_03',
      rollRange: [26, 35],
      result: 'Rogue Contact',
      description: 'Skilled in stealth and criminal activities',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Rogue Contact',
            type: 'Criminal',
            loyalty: 'Conditional',
            skills: ['Stealth', 'Lockpicking', 'Information'],
            relationship: 'Professional Associate'
          }
        }
      ]
    },
    {
      id: '753_04',
      rollRange: [36, 45],
      result: 'Healer Friend',
      description: 'Medical practitioner and caregiver',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Healer Friend',
            type: 'Professional',
            loyalty: 'Strong',
            skills: ['Healing', 'Herbalism', 'Diagnosis'],
            relationship: 'Trusted Caregiver'
          }
        }
      ]
    },
    {
      id: '753_05',
      rollRange: [46, 55],
      result: 'Merchant Ally',
      description: 'Trader with valuable connections',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Merchant Ally',
            type: 'Professional',
            loyalty: 'Conditional',
            skills: ['Appraise', 'Negotiation', 'Contacts'],
            relationship: 'Business Partner'
          }
        }
      ]
    },
    {
      id: '753_06',
      rollRange: [56, 65],
      result: 'Noble Patron',
      description: 'Aristocrat who provides support',
      effects: [
        {
          type: 'relationship',
          target: 'npcs',
          value: {
            name: 'Noble Patron',
            type: 'Noble',
            loyalty: 'Average',
            influence: 'High',
            relationship: 'Patron/Client'
          }
        }
      ]
    },
    {
      id: '753_07',
      rollRange: [66, 75],
      result: 'Religious Guide',
      description: 'Spiritual advisor and mentor',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Religious Guide',
            type: 'Religious',
            loyalty: 'Strong',
            skills: ['Religion', 'Counseling', 'Rituals'],
            relationship: 'Spiritual Mentor'
          }
        }
      ]
    },
    {
      id: '753_08',
      rollRange: [76, 85],
      result: 'Artisan Master',
      description: 'Skilled craftsperson and teacher',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Artisan Master',
            type: 'Craftsperson',
            loyalty: 'Average',
            skills: ['Master Craft', 'Teaching', 'Quality Control'],
            relationship: 'Master/Apprentice'
          }
        }
      ]
    },
    {
      id: '753_09',
      rollRange: [86, 95],
      result: 'Animal Companion',
      description: 'Loyal beast or magical creature',
      effects: [
        {
          type: 'relationship',
          target: 'companions',
          value: {
            name: 'Animal Companion',
            type: 'Animal',
            loyalty: 'Absolute',
            skills: ['Natural Abilities'],
            relationship: 'Bonded Companion'
          }
        }
      ]
    },
    {
      id: '753_10',
      rollRange: [96, 100],
      result: 'Mysterious Benefactor',
      description: 'Unknown figure who aids from shadows',
      effects: [
        {
          type: 'relationship',
          target: 'npcs',
          value: {
            name: 'Mysterious Benefactor',
            type: 'Unknown',
            loyalty: 'Unknown',
            influence: 'High',
            relationship: 'Secret Guardian'
          }
        }
      ]
    }
  ]
}

// Table 754: Rivals and Enemies
export const rivalsEnemiesTable: ContactTable = {
  id: '754',
  name: 'Rivals and Enemies',
  category: 'contacts',
  diceType: 'd100',
  relationshipType: 'rival',
  generateStats: false,
  instructions: 'Roll d100 to determine type of rival or enemy',
  entries: [
    {
      id: '754_01',
      rollRange: [1, 15],
      result: 'Childhood Rival',
      description: 'Someone from youth who still competes',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Childhood Rival',
            conflictType: 'Personal Competition',
            intensity: 'Moderate',
            history: 'Known since youth'
          }
        }
      ]
    },
    {
      id: '754_02',
      rollRange: [16, 25],
      result: 'Professional Competitor',
      description: 'Rival in same occupation or field',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Professional Competitor',
            conflictType: 'Career Rivalry',
            intensity: 'Strong',
            history: 'Competing for same goals'
          }
        }
      ]
    },
    {
      id: '754_03',
      rollRange: [26, 35],
      result: 'Romantic Rival',
      description: 'Competitor for someone\'s affections',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Romantic Rival',
            conflictType: 'Love Triangle',
            intensity: 'Strong',
            history: 'Competing for same person'
          }
        }
      ]
    },
    {
      id: '754_04',
      rollRange: [36, 45],
      result: 'Ideological Opponent',
      description: 'Someone with opposing beliefs',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Ideological Opponent',
            conflictType: 'Philosophical Disagreement',
            intensity: 'Moderate',
            history: 'Fundamental disagreement'
          }
        }
      ]
    },
    {
      id: '754_05',
      rollRange: [46, 55],
      result: 'Former Friend',
      description: 'Friendship destroyed by betrayal or misunderstanding',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Former Friend',
            conflictType: 'Betrayal',
            intensity: 'Strong',
            history: 'Friendship turned sour'
          }
        }
      ]
    },
    {
      id: '754_06',
      rollRange: [56, 65],
      result: 'Criminal Enemy',
      description: 'Outlaw or criminal organization antagonist',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Criminal Enemy',
            conflictType: 'Criminal Vendetta',
            intensity: 'Dangerous',
            history: 'Criminal conflict'
          }
        }
      ]
    },
    {
      id: '754_07',
      rollRange: [66, 75],
      result: 'Political Opponent',
      description: 'Rival in political or social sphere',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Political Opponent',
            conflictType: 'Political Rivalry',
            intensity: 'Moderate',
            history: 'Political disagreement'
          }
        }
      ]
    },
    {
      id: '754_08',
      rollRange: [76, 85],
      result: 'Family Enemy',
      description: 'Feud involving family honor or inheritance',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Family Enemy',
            conflictType: 'Family Feud',
            intensity: 'Strong',
            history: 'Generational conflict'
          }
        }
      ]
    },
    {
      id: '754_09',
      rollRange: [86, 95],
      result: 'Supernatural Foe',
      description: 'Enemy with magical or otherworldly power',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Supernatural Foe',
            conflictType: 'Mystical Enmity',
            intensity: 'Dangerous',
            history: 'Supernatural conflict'
          }
        }
      ]
    },
    {
      id: '754_10',
      rollRange: [96, 100],
      result: 'Nemesis',
      description: 'Archenemey dedicated to character\'s destruction',
      effects: [
        {
          type: 'relationship',
          target: 'rivals',
          value: {
            name: 'Nemesis',
            conflictType: 'Mortal Enmity',
            intensity: 'Obsessive',
            history: 'Dedicated to destruction'
          }
        }
      ]
    }
  ]
}

// Table 755: Family Relations
export const familyRelationsTable: ContactTable = {
  id: '755',
  name: 'Family Relations',
  category: 'contacts',
  diceType: 'd100',
  relationshipType: 'family',
  generateStats: false,
  instructions: 'Roll d100 to determine family member details',
  entries: [
    {
      id: '755_01',
      rollRange: [1, 20],
      result: 'Close-Knit Family',
      description: 'Strong family bonds and mutual support',
      effects: [
        {
          type: 'trait',
          target: 'family',
          value: {
            cohesion: 'Strong',
            support: 'High',
            reputation: 'Good'
          }
        }
      ]
    },
    {
      id: '755_02',
      rollRange: [21, 40],
      result: 'Distant Relations',
      description: 'Family scattered or disconnected',
      effects: [
        {
          type: 'trait',
          target: 'family',
          value: {
            cohesion: 'Weak',
            support: 'Low',
            reputation: 'Neutral'
          }
        }
      ]
    },
    {
      id: '755_03',
      rollRange: [41, 60],
      result: 'Family Scandal',
      description: 'Dark secret or shameful incident',
      effects: [
        {
          type: 'trait',
          target: 'family',
          value: {
            cohesion: 'Strained',
            support: 'Conditional',
            reputation: 'Tarnished'
          }
        }
      ]
    },
    {
      id: '755_04',
      rollRange: [61, 80],
      result: 'Influential Family',
      description: 'Family has political or social power',
      effects: [
        {
          type: 'trait',
          target: 'family',
          value: {
            cohesion: 'Strong',
            support: 'High',
            influence: 'Significant',
            reputation: 'Prominent'
          }
        }
      ]
    },
    {
      id: '755_05',
      rollRange: [81, 100],
      result: 'Tragic Family History',
      description: 'Family marked by loss or curse',
      effects: [
        {
          type: 'trait',
          target: 'family',
          value: {
            cohesion: 'Fragmented',
            support: 'Limited',
            reputation: 'Tragic'
          }
        }
      ]
    }
  ]
}

// Export all contact tables
export const contactTables: Table[] = [
  npcCompanionsTable,
  rivalsEnemiesTable,
  familyRelationsTable
]