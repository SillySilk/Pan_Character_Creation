// D&D 3.5 Core Race Data — sourced from System Reference Document (SRD)

export interface RacialTrait {
  name: string
  description: string
  mechanical?: string
}

export interface DnDRace {
  id: string
  name: string
  size: 'Small' | 'Medium'
  speed: number // feet per round
  abilityModifiers: {
    strength?: number
    dexterity?: number
    constitution?: number
    intelligence?: number
    wisdom?: number
    charisma?: number
  }
  favoredClass: string
  automaticLanguages: string[]
  bonusLanguages: string[]
  racialTraits: RacialTrait[]
  skillBonuses: { skill: string; bonus: number }[]
  savingThrowBonuses: { type: string; bonus: number; condition?: string }[]
  bonusFeatAtFirst?: boolean
  bonusSkillPointsAtFirst?: number
  bonusSkillPointsPerLevel?: number
  description: string
  flavorText: string
  // Maps this race to names used in Central Casting table 101a
  centralCastingNames: string[]
}

export const BACKGROUND_DECIDED_ID = 'background-decided'

export const DND_CORE_RACES: DnDRace[] = [
  {
    id: 'human',
    name: 'Human',
    size: 'Medium',
    speed: 30,
    abilityModifiers: {},
    favoredClass: 'Any',
    automaticLanguages: ['Common'],
    bonusLanguages: ['Any (except secret languages)'],
    bonusFeatAtFirst: true,
    bonusSkillPointsAtFirst: 4,
    bonusSkillPointsPerLevel: 1,
    racialTraits: [
      {
        name: 'Bonus Feat',
        description: 'Gain one bonus feat at 1st level.',
        mechanical: '+1 feat at 1st level'
      },
      {
        name: 'Skilled',
        description: '4 extra skill points at 1st level, 1 extra per level thereafter.',
        mechanical: '+4 skill points at 1st level, +1/level'
      }
    ],
    skillBonuses: [],
    savingThrowBonuses: [],
    description: 'Humans are the most adaptable and ambitious of the common races.',
    flavorText: 'Versatile and ambitious, humans excel in any class and adapt to any situation.',
    centralCastingNames: ['Human']
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    size: 'Medium',
    speed: 20,
    abilityModifiers: { constitution: 2, charisma: -2 },
    favoredClass: 'Fighter',
    automaticLanguages: ['Common', 'Dwarven'],
    bonusLanguages: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon'],
    racialTraits: [
      {
        name: 'Darkvision',
        description: 'Can see 60 ft. in the dark (black and white only).',
        mechanical: 'Darkvision 60 ft.'
      },
      {
        name: 'Stonecunning',
        description: '+2 racial bonus on Search checks related to unusual stonework. Automatically notices unusual stonework within 10 ft.',
        mechanical: '+2 Search (stonework)'
      },
      {
        name: 'Weapon Familiarity',
        description: 'Dwarven waraxes and dwarven urgroshes are treated as martial weapons.',
      },
      {
        name: 'Stability',
        description: '+4 bonus on ability checks to resist being bull rushed or tripped when standing on the ground.',
        mechanical: '+4 vs bull rush/trip'
      },
      {
        name: 'Orc/Goblinoid Fighter',
        description: '+1 racial bonus on attack rolls against orcs and goblinoids.',
        mechanical: '+1 attack vs orcs/goblinoids'
      },
      {
        name: 'Giant Dodger',
        description: '+4 dodge bonus to Armor Class against monsters of the giant type.',
        mechanical: '+4 dodge AC vs giants'
      }
    ],
    skillBonuses: [
      { skill: 'Appraise (stone/metal)', bonus: 2 },
      { skill: 'Craft (stone/metal)', bonus: 2 }
    ],
    savingThrowBonuses: [
      { type: 'Poison', bonus: 2 },
      { type: 'Spells and spell-like effects', bonus: 2 }
    ],
    description: 'Dwarves are known for their skill in warfare, stonework, and craftsmanship.',
    flavorText: 'Hardy and resilient, dwarves are masters of stone, metal, and combat.',
    centralCastingNames: ['Dwarf']
  },
  {
    id: 'elf',
    name: 'Elf',
    size: 'Medium',
    speed: 30,
    abilityModifiers: { dexterity: 2, constitution: -2 },
    favoredClass: 'Wizard',
    automaticLanguages: ['Common', 'Elven'],
    bonusLanguages: ['Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan'],
    racialTraits: [
      {
        name: 'Immunity to Sleep',
        description: 'Immune to magic sleep effects.',
        mechanical: 'Immune to sleep spells'
      },
      {
        name: 'Enchantment Resistance',
        description: '+2 racial saving throw bonus against enchantment spells or effects.',
        mechanical: '+2 saves vs enchantment'
      },
      {
        name: 'Low-Light Vision',
        description: 'Can see twice as far as a human in starlight, moonlight, torchlight, and similar dim conditions.'
      },
      {
        name: 'Martial Weapon Proficiency',
        description: 'Proficient with longsword, rapier, longbow (composite), and shortbow (composite) as bonus feats.',
        mechanical: 'Bonus: longsword, rapier, longbow, shortbow'
      },
      {
        name: 'Secret Door Sense',
        description: 'Entitled to a Search check when passing within 5 ft. of a secret or concealed door.',
        mechanical: 'Passive Search near secret doors'
      }
    ],
    skillBonuses: [
      { skill: 'Listen', bonus: 2 },
      { skill: 'Search', bonus: 2 },
      { skill: 'Spot', bonus: 2 }
    ],
    savingThrowBonuses: [
      { type: 'Enchantment', bonus: 2 }
    ],
    description: 'Elves are known for their grace, perceptiveness, and longevity.',
    flavorText: 'Graceful and perceptive, elves are natural masters of magic and archery.',
    centralCastingNames: ['Elf', 'High Elf', 'Wood Elf', 'Gray Elf', 'Wild Elf', 'Aquatic Elf']
  },
  {
    id: 'gnome',
    name: 'Gnome',
    size: 'Small',
    speed: 20,
    abilityModifiers: { constitution: 2, strength: -2 },
    favoredClass: 'Bard',
    automaticLanguages: ['Common', 'Gnome'],
    bonusLanguages: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc'],
    racialTraits: [
      {
        name: 'Small Size',
        description: '+1 size bonus to AC and attack rolls, +4 size bonus on Hide checks. Smaller carrying capacity.',
        mechanical: '+1 AC, +1 attack, +4 Hide'
      },
      {
        name: 'Low-Light Vision',
        description: 'Can see twice as far as a human in dim conditions.'
      },
      {
        name: 'Illusion Resistance',
        description: '+2 racial saving throw bonus against illusions.',
        mechanical: '+2 saves vs illusions'
      },
      {
        name: 'Illusion Potency',
        description: '+1 to the DC of all saving throws against illusion spells cast by the gnome.',
        mechanical: '+1 illusion spell DC'
      },
      {
        name: 'Goblinoid Fighter',
        description: '+1 racial bonus on attack rolls against kobolds and goblinoids.',
        mechanical: '+1 attack vs kobolds/goblinoids'
      },
      {
        name: 'Giant Dodger',
        description: '+4 dodge bonus to AC against monsters of the giant type.',
        mechanical: '+4 dodge AC vs giants'
      },
      {
        name: 'Speak with Animals',
        description: '1/day — speak with animals (burrowing mammals only, 1 minute duration).'
      },
      {
        name: 'Gnome Spell-Like Abilities',
        description: '1/day: dancing lights, ghost sound, prestidigitation (requires Cha 10+). Caster level 1st.',
        mechanical: '1/day: dancing lights, ghost sound, prestidigitation'
      }
    ],
    skillBonuses: [
      { skill: 'Listen', bonus: 2 },
      { skill: 'Craft (alchemy)', bonus: 2 }
    ],
    savingThrowBonuses: [
      { type: 'Illusions', bonus: 2 }
    ],
    description: 'Gnomes are curious, inventive, and fond of illusion magic.',
    flavorText: 'Inventive and cheerful, gnomes blend practical magic with skilled craftsmanship.',
    centralCastingNames: ['Gnome']
  },
  {
    id: 'half-elf',
    name: 'Half-Elf',
    size: 'Medium',
    speed: 30,
    abilityModifiers: {},
    favoredClass: 'Any',
    automaticLanguages: ['Common', 'Elven'],
    bonusLanguages: ['Any (except secret languages)'],
    racialTraits: [
      {
        name: 'Immunity to Sleep',
        description: 'Immune to sleep spells and similar magical effects.',
        mechanical: 'Immune to sleep spells'
      },
      {
        name: 'Enchantment Resistance',
        description: '+2 racial bonus on saving throws against enchantment spells or effects.',
        mechanical: '+2 saves vs enchantment'
      },
      {
        name: 'Low-Light Vision',
        description: 'Can see twice as far as humans in dim light.'
      },
      {
        name: 'Elven Blood',
        description: 'Counts as an elf for all effects related to race.'
      },
      {
        name: 'Diplomatic Nature',
        description: '+2 racial bonus on Diplomacy and Gather Information checks.',
        mechanical: '+2 Diplomacy, +2 Gather Information'
      }
    ],
    skillBonuses: [
      { skill: 'Listen', bonus: 1 },
      { skill: 'Search', bonus: 1 },
      { skill: 'Spot', bonus: 1 },
      { skill: 'Diplomacy', bonus: 2 },
      { skill: 'Gather Information', bonus: 2 }
    ],
    savingThrowBonuses: [
      { type: 'Enchantment', bonus: 2 }
    ],
    description: 'Half-elves combine human ambition with elven perception and grace.',
    flavorText: 'Natural diplomats, half-elves bridge two worlds and excel in many paths.',
    centralCastingNames: ['Half-Elf', 'Crossbreed']
  },
  {
    id: 'half-orc',
    name: 'Half-Orc',
    size: 'Medium',
    speed: 30,
    abilityModifiers: { strength: 2, intelligence: -2, charisma: -2 },
    favoredClass: 'Barbarian',
    automaticLanguages: ['Common', 'Orc'],
    bonusLanguages: ['Draconic', 'Giant', 'Gnoll', 'Goblin', 'Abyssal'],
    racialTraits: [
      {
        name: 'Darkvision',
        description: 'Can see 60 ft. in the dark (black and white only).',
        mechanical: 'Darkvision 60 ft.'
      },
      {
        name: 'Orc Blood',
        description: 'Counts as an orc for all effects related to race.'
      },
      {
        name: 'Minimum Intelligence',
        description: 'Starting Intelligence is always at least 3, even after the racial penalty.'
      }
    ],
    skillBonuses: [],
    savingThrowBonuses: [],
    description: 'Half-orcs are fierce warriors who combine human adaptability with orcish strength.',
    flavorText: 'Powerful and intimidating, half-orcs channel raw strength into devastating combat.',
    centralCastingNames: ['Half-Orc', 'Crossbreed']
  },
  {
    id: 'halfling',
    name: 'Halfling',
    size: 'Small',
    speed: 20,
    abilityModifiers: { dexterity: 2, strength: -2 },
    favoredClass: 'Rogue',
    automaticLanguages: ['Common', 'Halfling'],
    bonusLanguages: ['Dwarven', 'Elven', 'Gnome', 'Goblin', 'Orc'],
    racialTraits: [
      {
        name: 'Small Size',
        description: '+1 size bonus to AC and attack rolls, +4 size bonus on Hide checks. Smaller carrying capacity.',
        mechanical: '+1 AC, +1 attack, +4 Hide'
      },
      {
        name: 'Lucky',
        description: '+1 racial bonus on all saving throws.',
        mechanical: '+1 all saves'
      },
      {
        name: 'Fearless',
        description: '+2 morale bonus on saving throws against fear. Stacks with the +1 general save bonus.',
        mechanical: '+2 saves vs fear'
      },
      {
        name: 'Thrown Weapon Accuracy',
        description: '+1 racial bonus on attack rolls with thrown weapons and slings.',
        mechanical: '+1 attack (thrown/sling)'
      }
    ],
    skillBonuses: [
      { skill: 'Climb', bonus: 2 },
      { skill: 'Jump', bonus: 2 },
      { skill: 'Move Silently', bonus: 2 },
      { skill: 'Listen', bonus: 2 }
    ],
    savingThrowBonuses: [
      { type: 'All', bonus: 1 },
      { type: 'Fear', bonus: 2 }
    ],
    description: 'Halflings are nimble, lucky, and surprisingly capable for their size.',
    flavorText: 'Quick and stealthy, halflings make natural rogues, scouts, and opportunists.',
    centralCastingNames: ['Halfling']
  }
]

export function getRaceById(id: string): DnDRace | undefined {
  return DND_CORE_RACES.find(r => r.id === id)
}

export function getRaceByName(name: string): DnDRace | undefined {
  const lower = name.toLowerCase()
  return DND_CORE_RACES.find(r =>
    r.name.toLowerCase() === lower ||
    r.centralCastingNames.some(n => n.toLowerCase() === lower)
  )
}

/** Returns a short display string like "+2 CON, -2 CHA" or "No ability modifiers" */
export function getAbilityModifierSummary(modifiers: DnDRace['abilityModifiers']): string {
  const labelMap: Record<string, string> = {
    strength: 'STR', dexterity: 'DEX', constitution: 'CON',
    intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA'
  }
  const parts = Object.entries(modifiers)
    .filter(([, v]) => v !== undefined && v !== 0)
    .map(([k, v]) => `${v! > 0 ? '+' : ''}${v} ${labelMap[k]}`)
  return parts.length ? parts.join(', ') : 'No ability modifiers'
}
