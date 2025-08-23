// D&D 3.5 Skills Configuration for PanCasting Character Generator

export interface DnDSkill {
  name: string
  ability: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'
  trainedOnly: boolean
  armorCheckPenalty: boolean
  description: string
  category: 'physical' | 'knowledge' | 'social' | 'survival' | 'technical' | 'craft'
}

export const DND35_SKILLS: DnDSkill[] = [
  // D&D 3.5 Skills - Only non-trained skills (alphabetical order)
  {
    name: 'Appraise',
    ability: 'intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Estimate the value of items',
    category: 'knowledge'
  },
  {
    name: 'Balance',
    ability: 'dexterity',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Maintain footing on narrow or unstable surfaces',
    category: 'physical'
  },
  {
    name: 'Bluff',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Lie convincingly and misdirect',
    category: 'social'
  },
  {
    name: 'Climb',
    ability: 'strength',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Scale walls, cliffs, and other vertical surfaces',
    category: 'physical'
  },
  {
    name: 'Concentration',
    ability: 'constitution',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Maintain focus when casting spells or using abilities',
    category: 'technical'
  },
  {
    name: 'Control Shape',
    ability: 'wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Maintain humanoid form for lycanthropes and shapechangers',
    category: 'technical'
  },
  {
    name: 'Craft (Alchemy)',
    ability: 'intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Create alchemical items and substances',
    category: 'craft'
  },
  {
    name: 'Craft (Armorsmithing)',
    ability: 'intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Create and repair armor',
    category: 'craft'
  },
  {
    name: 'Craft (Weaponsmithing)',
    ability: 'intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Create and repair weapons',
    category: 'craft'
  },
  {
    name: 'Craft (Other)',
    ability: 'intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Create items (specify type: pottery, jewelry, etc.)',
    category: 'craft'
  },
  {
    name: 'Diplomacy',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Negotiate and influence through charm',
    category: 'social'
  },
  {
    name: 'Disguise',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Change your appearance',
    category: 'social'
  },
  {
    name: 'Escape Artist',
    ability: 'dexterity',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Slip bonds, squeeze through tight spaces',
    category: 'physical'
  },
  {
    name: 'Forgery',
    ability: 'intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Create false documents and detect forgeries',
    category: 'technical'
  },
  {
    name: 'Gather Information',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Pick up rumors and general information',
    category: 'social'
  },
  {
    name: 'Heal',
    ability: 'wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Treat wounds and diseases',
    category: 'survival'
  },
  {
    name: 'Hide',
    ability: 'dexterity',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Avoid detection by staying out of sight',
    category: 'physical'
  },
  {
    name: 'Iaijutsu Focus',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Strike with devastating precision in the first moment of combat',
    category: 'physical'
  },
  {
    name: 'Intimidate',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Frighten opponents or gain information through threats',
    category: 'social'
  },
  {
    name: 'Jump',
    ability: 'strength',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Leap across gaps or reach high places',
    category: 'physical'
  },
  {
    name: 'Listen',
    ability: 'wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Hear approaching enemies, overhear conversations',
    category: 'survival'
  },
  {
    name: 'Move Silently',
    ability: 'dexterity',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Move without making noise',
    category: 'physical'
  },
  {
    name: 'Perform (Act)',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Act and impersonate for entertainment',
    category: 'social'
  },
  {
    name: 'Perform (Comedy)',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Entertain with humor and comedy',
    category: 'social'
  },
  {
    name: 'Perform (Dance)',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Entertain with dance and movement',
    category: 'social'
  },
  {
    name: 'Perform (Oratory)',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Entertain with speeches and storytelling',
    category: 'social'
  },
  {
    name: 'Perform (Sing)',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Entertain with vocal performance',
    category: 'social'
  },
  {
    name: 'Perform (String Instruments)',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Play stringed musical instruments',
    category: 'social'
  },
  {
    name: 'Perform (Wind Instruments)',
    ability: 'charisma',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Play wind musical instruments',
    category: 'social'
  },
  {
    name: 'Ride',
    ability: 'dexterity',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Control a mount in combat or difficult situations',
    category: 'physical'
  },
  {
    name: 'Search',
    ability: 'intelligence',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Find hidden objects, secret doors, and traps',
    category: 'technical'
  },
  {
    name: 'Sense Motive',
    ability: 'wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Detect lies and determine intentions',
    category: 'social'
  },
  {
    name: 'Spot',
    ability: 'wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Notice things with your eyes',
    category: 'survival'
  },
  {
    name: 'Survival',
    ability: 'wisdom',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Navigate wilderness, track, and find food/shelter',
    category: 'survival'
  },
  {
    name: 'Swim',
    ability: 'strength',
    trainedOnly: false,
    armorCheckPenalty: true,
    description: 'Move through water effectively',
    category: 'physical'
  },
  {
    name: 'Use Rope',
    ability: 'dexterity',
    trainedOnly: false,
    armorCheckPenalty: false,
    description: 'Tie knots, splice rope, and bind prisoners',
    category: 'technical'
  }
]

// Helper function to get skills by ability
export function getSkillsByAbility(ability: DnDSkill['ability']): DnDSkill[] {
  return DND35_SKILLS.filter(skill => skill.ability === ability)
}

// Helper function to get skills by category
export function getSkillsByCategory(category: DnDSkill['category']): DnDSkill[] {
  return DND35_SKILLS.filter(skill => skill.category === category)
}

// Helper function to calculate skill modifier
export function calculateSkillModifier(
  skillName: string,
  abilityScores: Record<string, number>,
  skillRanks: Record<string, number> = {},
  miscModifiers: Record<string, number> = {}
): number {
  const skill = DND35_SKILLS.find(s => s.name === skillName)
  if (!skill) return 0

  const abilityScore = abilityScores[skill.ability] || 10
  const abilityModifier = Math.floor((abilityScore - 10) / 2)
  const ranks = skillRanks[skillName] || 0
  const miscMod = miscModifiers[skillName] || 0

  return abilityModifier + ranks + miscMod
}

// Helper to format skill display with modifiers
export function formatSkillWithModifier(
  skillName: string,
  abilityScores: Record<string, number>,
  skillRanks: Record<string, number> = {},
  miscModifiers: Record<string, number> = {}
): string {
  const totalModifier = calculateSkillModifier(skillName, abilityScores, skillRanks, miscModifiers)
  return `${skillName}: ${totalModifier >= 0 ? '+' : ''}${totalModifier}`
}