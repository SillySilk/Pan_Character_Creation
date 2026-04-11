// D&D 3.5 Core Skills Data for PanCasting

export interface DnDSkill {
  name: string
  keyAbility: 'Strength' | 'Dexterity' | 'Constitution' | 'Intelligence' | 'Wisdom' | 'Charisma'
  trainedOnly: boolean
  armorCheckPenalty: boolean
  description: string
  useUntrained?: string
}

export const DND_CORE_SKILLS: DnDSkill[] = [
  {
    name: 'Appraise',
    keyAbility: 'Intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Estimate the value of an object',
    useUntrained: 'Common items only'
  },
  {
    name: 'Balance',
    keyAbility: 'Dexterity',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Stay upright in treacherous conditions'
  },
  {
    name: 'Bluff',
    keyAbility: 'Charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Convince others that what you are saying is true'
  },
  {
    name: 'Climb',
    keyAbility: 'Strength',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Scale walls and cliffs, or slip down them slowly to avoid damage'
  },
  {
    name: 'Concentration',
    keyAbility: 'Constitution',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Maintain focus to cast spells or use abilities despite distractions'
  },
  {
    name: 'Craft',
    keyAbility: 'Intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Make items of the appropriate type',
    useUntrained: 'Simple items only'
  },
  {
    name: 'Decipher Script',
    keyAbility: 'Intelligence',
    trainedOnly: true,
    armorCheckPenalty: false,
    description: 'Understand archaic, foreign, or coded writing'
  },
  {
    name: 'Diplomacy',
    keyAbility: 'Charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Win others over to your way of thinking'
  },
  {
    name: 'Disable Device',
    keyAbility: 'Intelligence',
    trainedOnly: true,
    armorCheckPenalty: false,
    description: 'Disarm traps and open locks'
  },
  {
    name: 'Disguise',
    keyAbility: 'Charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Change your appearance'
  },
  {
    name: 'Escape Artist',
    keyAbility: 'Dexterity',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Slip bonds and escape grapples'
  },
  {
    name: 'Forgery',
    keyAbility: 'Intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Create false documents and detect forged ones'
  },
  {
    name: 'Gather Information',
    keyAbility: 'Charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Pick up news, rumors, and gossip'
  },
  {
    name: 'Handle Animal',
    keyAbility: 'Charisma',
    trainedOnly: true,
    armorCheckPenalty: false,
    description: 'Control and train animals'
  },
  {
    name: 'Heal',
    keyAbility: 'Wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Restore hit points and treat conditions',
    useUntrained: 'First aid and basic care only'
  },
  {
    name: 'Hide',
    keyAbility: 'Dexterity',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Conceal yourself from enemies'
  },
  {
    name: 'Intimidate',
    keyAbility: 'Charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Force others to act friendly toward you with threats'
  },
  {
    name: 'Jump',
    keyAbility: 'Strength',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Leap over pits, across chasms, or up to higher ground'
  },
  {
    name: 'Knowledge',
    keyAbility: 'Intelligence',
    trainedOnly: true,
    armorCheckPenalty: false,
    description: 'Remember useful information about a topic'
  },
  {
    name: 'Listen',
    keyAbility: 'Wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Hear approaching enemies, stealthy characters, and whispered conversations'
  },
  {
    name: 'Move Silently',
    keyAbility: 'Dexterity',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Sneak past enemies without making noise'
  },
  {
    name: 'Open Lock',
    keyAbility: 'Dexterity',
    trainedOnly: true,
    armorCheckPenalty: false,
    description: 'Open locks without the proper key'
  },
  {
    name: 'Perform',
    keyAbility: 'Charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Entertain others with music, dance, or other performance'
  },
  {
    name: 'Profession',
    keyAbility: 'Wisdom',
    trainedOnly: true,
    armorCheckPenalty: false,
    description: 'Make a living at a particular profession'
  },
  {
    name: 'Ride',
    keyAbility: 'Dexterity',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Control a mount in combat or difficult situations'
  },
  {
    name: 'Search',
    keyAbility: 'Intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Find hidden doors, traps, and other details'
  },
  {
    name: 'Sense Motive',
    keyAbility: 'Wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Tell when someone is lying or determine their intentions'
  },
  {
    name: 'Sleight Of Hand',
    keyAbility: 'Dexterity',
    trainedOnly: true,
    armorCheckPenalty: true,
    description: 'Pick pockets and perform feats of manual dexterity'
  },
  {
    name: 'Speak Language',
    keyAbility: 'Intelligence',
    trainedOnly: true,
    armorCheckPenalty: false,
    description: 'Speak and understand additional languages'
  },
  {
    name: 'Spellcraft',
    keyAbility: 'Intelligence',
    trainedOnly: true,
    armorCheckPenalty: false,
    description: 'Identify spells and magic effects'
  },
  {
    name: 'Spot',
    keyAbility: 'Wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Notice details and concealed creatures'
  },
  {
    name: 'Survival',
    keyAbility: 'Wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Survive in the wild and track creatures'
  },
  {
    name: 'Swim',
    keyAbility: 'Strength',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Move through water and avoid drowning'
  },
  {
    name: 'Tumble',
    keyAbility: 'Dexterity',
    trainedOnly: true,
    armorCheckPenalty: true,
    description: 'Roll, flip, and dive to avoid attacks and falls'
  },
  {
    name: 'Use Magic Device',
    keyAbility: 'Charisma',
    trainedOnly: true,
    armorCheckPenalty: false,
    description: 'Activate magic items that you could not otherwise use'
  },
  {
    name: 'Use Rope',
    keyAbility: 'Dexterity',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Tie knots, secure grappling hooks, and bind prisoners'
  }
]

// Helper functions
export function getSkillByName(skillName: string): DnDSkill | undefined {
  return DND_CORE_SKILLS.find(skill => skill.name.toLowerCase() === skillName.toLowerCase())
}

export function getAllSkillNames(): string[] {
  return DND_CORE_SKILLS.map(skill => skill.name)
}

export function getSkillsByAbility(ability: string): DnDSkill[] {
  return DND_CORE_SKILLS.filter(skill => skill.keyAbility === ability)
}

export function getTrainedOnlySkills(): DnDSkill[] {
  return DND_CORE_SKILLS.filter(skill => skill.trainedOnly)
}

// Calculate ability modifier
export function getAbilityModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2)
}

// Calculate total skill bonus
export interface SkillCalculation {
  ranks: number
  abilityModifier: number
  miscModifiers: number
  total: number
  isClassSkill: boolean
  isTrainedOnly: boolean
  canUseUntrained: boolean
}

export function calculateSkillBonus(
  skill: DnDSkill,
  ranks: number,
  abilityScore: number,
  isClassSkill: boolean,
  miscModifiers: number = 0
): SkillCalculation {
  const abilityModifier = getAbilityModifier(abilityScore)
  const canUseUntrained = !skill.trainedOnly || ranks > 0
  const total = ranks + abilityModifier + miscModifiers
  
  return {
    ranks,
    abilityModifier,
    miscModifiers,
    total,
    isClassSkill,
    isTrainedOnly: skill.trainedOnly,
    canUseUntrained
  }
}