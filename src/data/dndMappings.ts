// D&D Mapping Data for PanCasting Integration

import type { DDSkillMapping, DDRacialTraitMapping } from '@/types/dnd'
import type { DD5eSkillMapping, DD5eRacialTraitMapping } from '@/types/dnd5e'

// D&D 3.5 Skill Mappings
export const dd35SkillMappings: DDSkillMapping[] = [
  {
    pancasting: 'Diplomacy',
    dnd35: 'Diplomacy',
    keyAbility: 'charisma',
    description: 'Negotiate and persuade others',
    synergies: ['Bluff', 'Sense Motive']
  },
  {
    pancasting: 'Bluff',
    dnd35: 'Bluff',
    keyAbility: 'charisma',
    description: 'Deceive others with words or actions',
    synergies: ['Diplomacy', 'Sleight of Hand']
  },
  {
    pancasting: 'Sense Motive',
    dnd35: 'Sense Motive',
    keyAbility: 'wisdom',
    description: 'Detect deception and understand motives',
    synergies: ['Diplomacy']
  },
  {
    pancasting: 'Knowledge',
    dnd35: 'Knowledge',
    keyAbility: 'intelligence',
    description: 'Academic and learned information'
  },
  {
    pancasting: 'Craft',
    dnd35: 'Craft',
    keyAbility: 'intelligence',
    description: 'Create items and practice trades'
  },
  {
    pancasting: 'Profession',
    dnd35: 'Profession',
    keyAbility: 'wisdom',
    description: 'Earn money through skilled work'
  },
  {
    pancasting: 'Weapon Use',
    dnd35: 'Handle Weapon',
    keyAbility: 'strength',
    description: 'Proficiency with weapons and combat'
  },
  {
    pancasting: 'Intimidation',
    dnd35: 'Intimidate',
    keyAbility: 'charisma',
    description: 'Frighten opponents into compliance'
  },
  {
    pancasting: 'Stealth',
    dnd35: 'Hide',
    keyAbility: 'dexterity',
    description: 'Move unseen and unheard'
  },
  {
    pancasting: 'Athletics',
    dnd35: 'Climb',
    keyAbility: 'strength',
    description: 'Physical prowess and endurance'
  }
]

// D&D 5e Skill Mappings
export const dd5eSkillMappings: DD5eSkillMapping[] = [
  {
    pancasting: 'Diplomacy',
    dnd5e: 'Persuasion',
    abilityScore: 'charisma',
    description: 'Influence others through tact and social graces'
  },
  {
    pancasting: 'Bluff',
    dnd5e: 'Deception',
    abilityScore: 'charisma',
    description: 'Hide the truth through misdirection and lies'
  },
  {
    pancasting: 'Sense Motive',
    dnd5e: 'Insight',
    abilityScore: 'wisdom',
    description: 'Determine true intentions and read people'
  },
  {
    pancasting: 'Knowledge',
    dnd5e: 'History',
    abilityScore: 'intelligence',
    description: 'Recall lore about historical events and people'
  },
  {
    pancasting: 'Academic Knowledge',
    dnd5e: 'Arcana',
    abilityScore: 'intelligence',
    description: 'Knowledge of magic, planes, and magical theory'
  },
  {
    pancasting: 'Nature Lore',
    dnd5e: 'Nature',
    abilityScore: 'intelligence',
    description: 'Knowledge of natural world and creatures'
  },
  {
    pancasting: 'Religious Knowledge',
    dnd5e: 'Religion',
    abilityScore: 'intelligence',
    description: 'Knowledge of deities, rites, and divine magic'
  },
  {
    pancasting: 'Craft',
    dnd5e: 'Athletics',
    abilityScore: 'strength',
    description: 'Physical skill and craftsmanship'
  },
  {
    pancasting: 'Weapon Use',
    dnd5e: 'Athletics',
    abilityScore: 'strength',
    description: 'Combat training and weapon proficiency'
  },
  {
    pancasting: 'Intimidation',
    dnd5e: 'Intimidation',
    abilityScore: 'charisma',
    description: 'Influence through threats and hostile actions'
  },
  {
    pancasting: 'Stealth',
    dnd5e: 'Stealth',
    abilityScore: 'dexterity',
    description: 'Conceal yourself and move silently'
  },
  {
    pancasting: 'Performance',
    dnd5e: 'Performance',
    abilityScore: 'charisma',
    description: 'Entertain through music, dance, or acting'
  },
  {
    pancasting: 'Survival',
    dnd5e: 'Survival',
    abilityScore: 'wisdom',
    description: 'Navigate wilderness and track creatures'
  },
  {
    pancasting: 'Animal Handling',
    dnd5e: 'Animal Handling',
    abilityScore: 'wisdom',
    description: 'Calm domestic animals and ride mounts'
  },
  {
    pancasting: 'Medicine',
    dnd5e: 'Medicine',
    abilityScore: 'wisdom',
    description: 'Stabilize dying companions and treat wounds'
  }
]

// D&D 3.5 Racial Trait Mappings
export const dd35RacialTraits: DDRacialTraitMapping[] = [
  {
    race: 'Human',
    traits: [
      {
        name: 'Extra Feat',
        description: 'Humans receive one bonus feat at 1st level',
        gameEffect: '+1 feat at character creation',
        type: 'Special'
      },
      {
        name: 'Extra Skill Points',
        description: 'Humans get 4 extra skill points at 1st level and 1 extra at each additional level',
        gameEffect: '+4 skill points at 1st level, +1 per level thereafter',
        type: 'Skill'
      }
    ]
  },
  {
    race: 'Elf',
    traits: [
      {
        name: 'Low-Light Vision',
        description: 'Elves can see twice as far as humans in starlight, moonlight, torchlight, and similar conditions',
        gameEffect: 'See in dim light as if bright light',
        type: 'Special'
      },
      {
        name: 'Weapon Proficiency',
        description: 'Proficient with longsword, rapier, longbow, and shortbow',
        gameEffect: 'Automatic weapon proficiencies',
        type: 'Combat'
      },
      {
        name: 'Keen Senses',
        description: '+2 racial bonus on Listen, Search, and Spot checks',
        gameEffect: '+2 to Listen, Search, and Spot',
        type: 'Skill'
      },
      {
        name: 'Immunity to Sleep',
        description: 'Immune to sleep spells and effects',
        gameEffect: 'Cannot be magically forced to sleep',
        type: 'Special'
      }
    ]
  },
  {
    race: 'Dwarf',
    traits: [
      {
        name: 'Darkvision',
        description: 'Can see in the dark up to 60 feet',
        gameEffect: 'Darkvision 60 ft',
        type: 'Special'
      },
      {
        name: 'Weapon Familiarity',
        description: 'Treat dwarven waraxes and urgroshs as martial weapons',
        gameEffect: 'Weapon proficiency with dwarven weapons',
        type: 'Combat'
      },
      {
        name: 'Stonecunning',
        description: '+2 bonus on Search checks for unusual stonework',
        gameEffect: '+2 to Search checks for stone features',
        type: 'Skill'
      },
      {
        name: 'Stability',
        description: '+4 bonus on checks against bull rush and trip attacks',
        gameEffect: '+4 vs bull rush and trip',
        type: 'Combat'
      }
    ]
  },
  {
    race: 'Halfling',
    traits: [
      {
        name: 'Small Size',
        description: '+1 size bonus to AC and attack rolls, +4 Hide checks',
        gameEffect: '+1 AC, +1 attack, +4 Hide',
        type: 'Combat'
      },
      {
        name: 'Lucky',
        description: '+1 racial bonus on all saving throws',
        gameEffect: '+1 to all saves',
        type: 'Special'
      },
      {
        name: 'Fearless',
        description: '+2 morale bonus on saving throws against fear',
        gameEffect: '+2 vs fear effects',
        type: 'Special'
      },
      {
        name: 'Sure-footed',
        description: '+2 racial bonus on Climb and Jump checks',
        gameEffect: '+2 to Climb and Jump',
        type: 'Skill'
      }
    ]
  }
]

// D&D 5e Racial Trait Mappings
export const dd5eRacialTraits: DD5eRacialTraitMapping[] = [
  {
    race: 'Human',
    traits: [
      {
        name: 'Extra Skill',
        description: 'Gain proficiency in one skill of your choice',
        type: 'Skill Proficiency'
      },
      {
        name: 'Extra Language',
        description: 'Learn one additional language',
        type: 'Language'
      },
      {
        name: 'Versatile',
        description: 'Gain +1 to all ability scores',
        type: 'Ability'
      }
    ],
    abilityScoreIncrease: {
      strength: 1,
      dexterity: 1,
      constitution: 1,
      intelligence: 1,
      wisdom: 1,
      charisma: 1
    },
    size: 'Medium',
    speed: 30,
    languages: ['Common', 'One extra language']
  },
  {
    race: 'Elf',
    traits: [
      {
        name: 'Darkvision',
        description: 'See in dim light within 60 feet as if bright light',
        type: 'Sense'
      },
      {
        name: 'Keen Senses',
        description: 'Proficiency with Perception skill',
        type: 'Skill Proficiency'
      },
      {
        name: 'Fey Ancestry',
        description: 'Advantage on saves against being charmed, immune to magical sleep',
        type: 'Resistance'
      },
      {
        name: 'Trance',
        description: 'Meditate for 4 hours instead of sleeping for 8',
        type: 'Special'
      }
    ],
    abilityScoreIncrease: { dexterity: 2 },
    size: 'Medium',
    speed: 30,
    languages: ['Common', 'Elvish']
  },
  {
    race: 'Dwarf',
    traits: [
      {
        name: 'Darkvision',
        description: 'See in dim light within 60 feet as if bright light',
        type: 'Sense'
      },
      {
        name: 'Dwarven Resilience',
        description: 'Advantage on saves against poison and resistance to poison damage',
        type: 'Resistance'
      },
      {
        name: 'Stonecunning',
        description: 'Add proficiency bonus to History checks related to stonework',
        type: 'Special'
      },
      {
        name: 'Dwarven Combat Training',
        description: 'Proficiency with battleaxe, handaxe, light hammer, and warhammer',
        type: 'Special'
      }
    ],
    abilityScoreIncrease: { constitution: 2 },
    size: 'Medium',
    speed: 25,
    languages: ['Common', 'Dwarvish']
  },
  {
    race: 'Halfling',
    traits: [
      {
        name: 'Lucky',
        description: 'Reroll natural 1s on d20 rolls',
        type: 'Special'
      },
      {
        name: 'Brave',
        description: 'Advantage on saving throws against being frightened',
        type: 'Resistance'
      },
      {
        name: 'Halfling Nimbleness',
        description: 'Move through space of Medium or larger creatures',
        type: 'Special'
      }
    ],
    abilityScoreIncrease: { dexterity: 2 },
    size: 'Small',
    speed: 25,
    languages: ['Common', 'Halfling']
  }
]

// Occupation to Class Mappings
export const occupationToClassMappings = {
  '3.5': {
    'Military': ['Fighter', 'Ranger', 'Paladin'],
    'Academic': ['Wizard', 'Cleric', 'Bard'],
    'Criminal': ['Rogue', 'Ranger'],
    'Religious': ['Cleric', 'Paladin', 'Druid'],
    'Craft': ['Fighter', 'Ranger', 'Artificer'],
    'Professional': ['Bard', 'Rogue', 'Expert'],
    'Special': ['Sorcerer', 'Warlock', 'Any']
  },
  '5e': {
    'Military': ['Fighter', 'Ranger', 'Paladin', 'Barbarian'],
    'Academic': ['Wizard', 'Cleric', 'Bard', 'Artificer'],
    'Criminal': ['Rogue', 'Warlock', 'Ranger'],
    'Religious': ['Cleric', 'Paladin', 'Druid'],
    'Craft': ['Fighter', 'Ranger', 'Artificer'],
    'Professional': ['Bard', 'Rogue'],
    'Special': ['Sorcerer', 'Warlock', 'Any']
  }
}

// Background Mappings (5e)
export const occupationToBackgroundMappings = {
  'Military': ['Soldier', 'Folk Hero'],
  'Academic': ['Sage', 'Hermit'],
  'Criminal': ['Criminal', 'Charlatan'],
  'Religious': ['Acolyte', 'Hermit'],
  'Craft': ['Guild Artisan', 'Folk Hero'],
  'Professional': ['Guild Artisan', 'Noble', 'Entertainer'],
  'Special': ['Folk Hero', 'Outlander']
}

// Personality Trait Mappings (for 5e)
export const personalityToTraitMappings = {
  lightside: {
    'Honest': ['I always speak the truth, even when it might hurt.'],
    'Brave': ['I face danger head-on, protecting those who cannot protect themselves.'],
    'Compassionate': ['I cannot bear to see others suffer.'],
    'Loyal': ['I would die for my friends and family.'],
    'Just': ['I always try to do what is right, regardless of personal cost.']
  },
  neutral: {
    'Pragmatic': ['I look for practical solutions to every problem.'],
    'Curious': ['I want to learn everything I can about the world.'],
    'Cautious': ['I think through every decision carefully.'],
    'Adaptable': ['I go with the flow and adapt to changing situations.']
  },
  darkside: {
    'Greedy': ['I hoard wealth and resources for myself.'],
    'Cruel': ['I enjoy watching others suffer.'],
    'Deceitful': ['I lie as easily as I breathe.'],
    'Cowardly': ['I run from danger whenever possible.'],
    'Vengeful': ['I never forget a slight, no matter how small.']
  }
}

// Experience Point Tables
export const experiencePointTables = {
  '5e': [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 
    48000, 64000, 85000, 100000, 120000, 140000, 
    165000, 195000, 225000, 265000, 305000, 355000
  ]
}

// Proficiency Bonus by Level
export const proficiencyBonusByLevel = [
  2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6
]

// Default Starting Equipment by Background (5e)
export const startingEquipmentByBackground = {
  'Acolyte': ['Holy symbol', 'Prayer book', 'Incense', "Priest's robes"],
  'Criminal': ['Crowbar', 'Dark common clothes', 'Belt pouch'],
  'Folk Hero': ["Smith's tools", 'Shovel', 'Artisan clothes'],
  'Noble': ['Signet ring', 'Scroll of pedigree', 'Fine clothes'],
  'Sage': ['Ink and quill', 'Small knife', 'Letter from colleague'],
  'Soldier': ['Insignia of rank', 'Trophy from battle', 'Deck of cards']
}