// D&D 3.5 Core Classes Data for PanCasting

export interface DnDClass {
  name: string
  hitDie: string
  skillPointsPerLevel: number
  classSkills: string[]
  primaryAbility: string
  description: string
  baseAttackBonus: 'Good' | 'Average' | 'Poor'
  fortitudeSave: 'Good' | 'Poor'
  reflexSave: 'Good' | 'Poor'
  willSave: 'Good' | 'Poor'
  spellcasting?: 'Full' | 'Partial' | 'None'
  classFeatures: string[]
}

export const DND_CORE_CLASSES: DnDClass[] = [
  {
    name: 'Barbarian',
    hitDie: 'd12',
    skillPointsPerLevel: 4,
    primaryAbility: 'Strength',
    description: 'A fierce warrior of primitive background who can enter a battle rage',
    baseAttackBonus: 'Good',
    fortitudeSave: 'Good',
    reflexSave: 'Poor',
    willSave: 'Poor',
    spellcasting: 'None',
    classSkills: [
      'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump',
      'Listen', 'Ride', 'Survival', 'Swim'
    ],
    classFeatures: ['Rage', 'Fast Movement', 'Uncanny Dodge', 'Trap Sense', 'Damage Reduction']
  },
  {
    name: 'Bard',
    hitDie: 'd6',
    skillPointsPerLevel: 6,
    primaryAbility: 'Charisma',
    description: 'A performer whose music works magic - a wandering minstrel and storyteller',
    baseAttackBonus: 'Average',
    fortitudeSave: 'Poor',
    reflexSave: 'Good',
    willSave: 'Good',
    spellcasting: 'Partial',
    classSkills: [
      'Appraise', 'Balance', 'Bluff', 'Climb', 'Concentration', 'Craft', 'Decipher Script',
      'Diplomacy', 'Disguise', 'Escape Artist', 'Gather Information', 'Hide', 'Jump',
      'Knowledge', 'Listen', 'Move Silently', 'Perform', 'Profession', 'Sense Motive',
      'Sleight Of Hand', 'Speak Language', 'Spellcraft', 'Swim', 'Tumble', 'Use Magic Device'
    ],
    classFeatures: ['Bardic Knowledge', 'Bardic Music', 'Countersong', 'Fascinate', 'Inspire Courage']
  },
  {
    name: 'Cleric',
    hitDie: 'd8',
    skillPointsPerLevel: 2,
    primaryAbility: 'Wisdom',
    description: 'A master of divine magic and capable warrior championing a deity',
    baseAttackBonus: 'Average',
    fortitudeSave: 'Good',
    reflexSave: 'Poor',
    willSave: 'Good',
    spellcasting: 'Full',
    classSkills: [
      'Concentration', 'Craft', 'Diplomacy', 'Heal', 'Knowledge',
      'Profession', 'Spellcraft'
    ],
    classFeatures: ['Spells', 'Aura', 'Turn or Rebuke Undead', 'Spontaneous Casting', 'Domain Powers']
  },
  {
    name: 'Druid',
    hitDie: 'd8',
    skillPointsPerLevel: 4,
    primaryAbility: 'Wisdom',
    description: 'One who draws power from nature itself or a nature deity',
    baseAttackBonus: 'Average',
    fortitudeSave: 'Good',
    reflexSave: 'Poor',
    willSave: 'Good',
    spellcasting: 'Full',
    classSkills: [
      'Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Hide',
      'Knowledge', 'Listen', 'Move Silently', 'Profession', 'Ride',
      'Spellcraft', 'Spot', 'Survival', 'Swim'
    ],
    classFeatures: ['Spells', 'Animal Companion', 'Nature Sense', 'Wild Empathy', 'Woodland Stride', 'Wild Shape']
  },
  {
    name: 'Fighter',
    hitDie: 'd10',
    skillPointsPerLevel: 2,
    primaryAbility: 'Strength',
    description: 'A master of martial combat, skilled with a variety of weapons and armor',
    baseAttackBonus: 'Good',
    fortitudeSave: 'Good',
    reflexSave: 'Poor',
    willSave: 'Poor',
    spellcasting: 'None',
    classSkills: [
      'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump', 'Ride', 'Swim'
    ],
    classFeatures: ['Bonus Feats', 'Weapon and Armor Proficiency']
  },
  {
    name: 'Monk',
    hitDie: 'd8',
    skillPointsPerLevel: 4,
    primaryAbility: 'Wisdom',
    description: 'A martial artist whose unarmed strikes hit fast and hard',
    baseAttackBonus: 'Average',
    fortitudeSave: 'Good',
    reflexSave: 'Good',
    willSave: 'Good',
    spellcasting: 'None',
    classSkills: [
      'Balance', 'Climb', 'Concentration', 'Craft', 'Diplomacy', 'Escape Artist',
      'Hide', 'Jump', 'Knowledge', 'Listen', 'Move Silently', 'Perform',
      'Profession', 'Sense Motive', 'Spot', 'Swim', 'Tumble'
    ],
    classFeatures: ['AC Bonus', 'Unarmored Speed Bonus', 'Unarmed Strike', 'Stunning Fist', 'Evasion', 'Fast Movement']
  },
  {
    name: 'Paladin',
    hitDie: 'd10',
    skillPointsPerLevel: 2,
    primaryAbility: 'Charisma',
    description: 'A champion of justice and destroyer of evil, protected and strengthened by divine powers',
    baseAttackBonus: 'Good',
    fortitudeSave: 'Good',
    reflexSave: 'Poor',
    willSave: 'Poor',
    spellcasting: 'Partial',
    classSkills: [
      'Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal',
      'Knowledge', 'Profession', 'Ride', 'Sense Motive'
    ],
    classFeatures: ['Aura of Good', 'Detect Evil', 'Smite Evil', 'Divine Grace', 'Lay on Hands', 'Divine Health', 'Special Mount']
  },
  {
    name: 'Ranger',
    hitDie: 'd8',
    skillPointsPerLevel: 6,
    primaryAbility: 'Dexterity',
    description: 'A cunning warrior of the wilderness, skilled in tracking, survival, and combat',
    baseAttackBonus: 'Good',
    fortitudeSave: 'Good',
    reflexSave: 'Good',
    willSave: 'Poor',
    spellcasting: 'Partial',
    classSkills: [
      'Climb', 'Concentration', 'Craft', 'Handle Animal', 'Heal', 'Hide',
      'Jump', 'Knowledge', 'Listen', 'Move Silently', 'Profession',
      'Ride', 'Search', 'Spot', 'Survival', 'Swim', 'Use Rope'
    ],
    classFeatures: ['Favored Enemy', 'Track', 'Wild Empathy', 'Combat Style', 'Animal Companion', 'Woodland Stride']
  },
  {
    name: 'Rogue',
    hitDie: 'd6',
    skillPointsPerLevel: 8,
    primaryAbility: 'Dexterity',
    description: 'A master of stealth and cunning, skilled in many talents',
    baseAttackBonus: 'Average',
    fortitudeSave: 'Poor',
    reflexSave: 'Good',
    willSave: 'Poor',
    spellcasting: 'None',
    classSkills: [
      'Appraise', 'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script',
      'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
      'Gather Information', 'Hide', 'Intimidate', 'Jump', 'Knowledge', 'Listen',
      'Move Silently', 'Open Lock', 'Perform', 'Profession', 'Search',
      'Sense Motive', 'Sleight Of Hand', 'Spot', 'Swim', 'Tumble', 'Use Magic Device', 'Use Rope'
    ],
    classFeatures: ['Sneak Attack', 'Trapfinding', 'Evasion', 'Trap Sense', 'Uncanny Dodge', 'Special Abilities']
  },
  {
    name: 'Sorcerer',
    hitDie: 'd4',
    skillPointsPerLevel: 2,
    primaryAbility: 'Charisma',
    description: 'A spellcaster who draws on inherent raw magic from within',
    baseAttackBonus: 'Poor',
    fortitudeSave: 'Poor',
    reflexSave: 'Poor',
    willSave: 'Good',
    spellcasting: 'Full',
    classSkills: [
      'Bluff', 'Concentration', 'Craft', 'Knowledge', 'Profession', 'Spellcraft'
    ],
    classFeatures: ['Spells', 'Summon Familiar']
  },
  {
    name: 'Wizard',
    hitDie: 'd4',
    skillPointsPerLevel: 2,
    primaryAbility: 'Intelligence',
    description: 'A master of arcane magic, learned through study and preparation',
    baseAttackBonus: 'Poor',
    fortitudeSave: 'Poor',
    reflexSave: 'Poor',
    willSave: 'Good',
    spellcasting: 'Full',
    classSkills: [
      'Concentration', 'Craft', 'Decipher Script', 'Knowledge', 'Profession', 'Spellcraft'
    ],
    classFeatures: ['Spells', 'Summon Familiar', 'Bonus Languages', 'Scribe Scroll']
  }
]

// Helper function to get class by name
export function getClassByName(className: string): DnDClass | undefined {
  return DND_CORE_CLASSES.find(cls => cls.name.toLowerCase() === className.toLowerCase())
}

// Helper function to get all class names
export function getAllClassNames(): string[] {
  return DND_CORE_CLASSES.map(cls => cls.name)
}