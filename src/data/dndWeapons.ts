// D&D 3.5 SRD Weapon Data
// Source: SRD Basic Rules and Legal/equipment.md

export type WeaponProficiency = 'Simple' | 'Martial' | 'Exotic'
export type WeaponSize = 'Light' | 'One-Handed' | 'Two-Handed'
export type WeaponCategory = 'Melee' | 'Ranged'
export type DamageType = 'Bludgeoning' | 'Piercing' | 'Slashing' | 'B&P' | 'P&S' | 'B&S'

export interface DnDWeapon {
  id: string
  name: string
  proficiency: WeaponProficiency
  size: WeaponSize
  category: WeaponCategory
  costGp: number
  /** Damage die string for Medium size, e.g. "1d8" */
  damageMedium: string
  /** Damage die string for Small size */
  damageSmall: string
  /** Critical threat range and multiplier, e.g. "19-20/x2" or "x3" */
  critical: string
  /** Range increment in feet; 0 = melee only */
  rangeIncrement: number
  weightLb: number
  damageType: DamageType
  special?: string[]
  /** True if this is a double weapon */
  isDouble?: boolean
  /** True if this is a reach weapon */
  isReach?: boolean
  /** True if this is a thrown weapon */
  isThrown?: boolean
}

// ─── Simple Weapons ──────────────────────────────────────────────────────────

const SIMPLE_WEAPONS: DnDWeapon[] = [
  // Light
  { id: 'gauntlet',         name: 'Gauntlet',              proficiency: 'Simple', size: 'Light',       category: 'Melee',  costGp: 2,   damageMedium: '1d3', damageSmall: '1d2', critical: 'x2',       rangeIncrement: 0,   weightLb: 1,   damageType: 'Bludgeoning' },
  { id: 'dagger',           name: 'Dagger',                proficiency: 'Simple', size: 'Light',       category: 'Melee',  costGp: 2,   damageMedium: '1d4', damageSmall: '1d3', critical: '19-20/x2', rangeIncrement: 10,  weightLb: 1,   damageType: 'P&S', isThrown: true },
  { id: 'dagger-punching',  name: 'Dagger, punching',      proficiency: 'Simple', size: 'Light',       category: 'Melee',  costGp: 2,   damageMedium: '1d4', damageSmall: '1d3', critical: 'x3',       rangeIncrement: 0,   weightLb: 1,   damageType: 'Piercing' },
  { id: 'gauntlet-spiked',  name: 'Gauntlet, spiked',      proficiency: 'Simple', size: 'Light',       category: 'Melee',  costGp: 5,   damageMedium: '1d4', damageSmall: '1d3', critical: 'x2',       rangeIncrement: 0,   weightLb: 1,   damageType: 'Piercing' },
  { id: 'mace-light',       name: 'Mace, light',           proficiency: 'Simple', size: 'Light',       category: 'Melee',  costGp: 5,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 0,   weightLb: 4,   damageType: 'Bludgeoning' },
  { id: 'sickle',           name: 'Sickle',                proficiency: 'Simple', size: 'Light',       category: 'Melee',  costGp: 6,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 0,   weightLb: 2,   damageType: 'Slashing' },
  // One-Handed
  { id: 'club',             name: 'Club',                  proficiency: 'Simple', size: 'One-Handed',  category: 'Melee',  costGp: 0,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 10,  weightLb: 3,   damageType: 'Bludgeoning', isThrown: true },
  { id: 'mace-heavy',       name: 'Mace, heavy',           proficiency: 'Simple', size: 'One-Handed',  category: 'Melee',  costGp: 12,  damageMedium: '1d8', damageSmall: '1d6', critical: 'x2',       rangeIncrement: 0,   weightLb: 8,   damageType: 'Bludgeoning' },
  { id: 'morningstar',      name: 'Morningstar',           proficiency: 'Simple', size: 'One-Handed',  category: 'Melee',  costGp: 8,   damageMedium: '1d8', damageSmall: '1d6', critical: 'x2',       rangeIncrement: 0,   weightLb: 6,   damageType: 'B&P' },
  { id: 'shortspear',       name: 'Shortspear',            proficiency: 'Simple', size: 'One-Handed',  category: 'Melee',  costGp: 1,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 20,  weightLb: 3,   damageType: 'Piercing', isThrown: true },
  // Two-Handed
  { id: 'longspear',        name: 'Longspear',             proficiency: 'Simple', size: 'Two-Handed',  category: 'Melee',  costGp: 5,   damageMedium: '1d8', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 0,   weightLb: 9,   damageType: 'Piercing', isReach: true },
  { id: 'quarterstaff',     name: 'Quarterstaff',          proficiency: 'Simple', size: 'Two-Handed',  category: 'Melee',  costGp: 0,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 0,   weightLb: 4,   damageType: 'Bludgeoning', isDouble: true },
  { id: 'spear',            name: 'Spear',                 proficiency: 'Simple', size: 'Two-Handed',  category: 'Melee',  costGp: 2,   damageMedium: '1d8', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 20,  weightLb: 6,   damageType: 'Piercing', isThrown: true },
  // Ranged
  { id: 'crossbow-heavy',   name: 'Crossbow, heavy',       proficiency: 'Simple', size: 'Two-Handed',  category: 'Ranged', costGp: 50,  damageMedium: '1d10', damageSmall: '1d8', critical: '19-20/x2', rangeIncrement: 120, weightLb: 8,   damageType: 'Piercing' },
  { id: 'crossbow-light',   name: 'Crossbow, light',       proficiency: 'Simple', size: 'One-Handed',  category: 'Ranged', costGp: 35,  damageMedium: '1d8',  damageSmall: '1d6', critical: '19-20/x2', rangeIncrement: 80,  weightLb: 4,   damageType: 'Piercing' },
  { id: 'dart',             name: 'Dart',                  proficiency: 'Simple', size: 'Light',       category: 'Ranged', costGp: 0.5, damageMedium: '1d4',  damageSmall: '1d3', critical: 'x2',       rangeIncrement: 20,  weightLb: 0.5, damageType: 'Piercing', isThrown: true },
  { id: 'javelin',          name: 'Javelin',               proficiency: 'Simple', size: 'One-Handed',  category: 'Ranged', costGp: 1,   damageMedium: '1d6',  damageSmall: '1d4', critical: 'x2',       rangeIncrement: 30,  weightLb: 2,   damageType: 'Piercing', isThrown: true },
  { id: 'sling',            name: 'Sling',                 proficiency: 'Simple', size: 'Light',       category: 'Ranged', costGp: 0,   damageMedium: '1d4',  damageSmall: '1d3', critical: 'x2',       rangeIncrement: 50,  weightLb: 0,   damageType: 'Bludgeoning' },
]

// ─── Martial Weapons ─────────────────────────────────────────────────────────

const MARTIAL_WEAPONS: DnDWeapon[] = [
  // Light
  { id: 'axe-throwing',    name: 'Axe, throwing',         proficiency: 'Martial', size: 'Light',      category: 'Melee',  costGp: 8,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 10,  weightLb: 2,   damageType: 'Slashing', isThrown: true },
  { id: 'hammer-light',    name: 'Hammer, light',         proficiency: 'Martial', size: 'Light',      category: 'Melee',  costGp: 1,   damageMedium: '1d4', damageSmall: '1d3', critical: 'x2',       rangeIncrement: 20,  weightLb: 2,   damageType: 'Bludgeoning', isThrown: true },
  { id: 'handaxe',         name: 'Handaxe',               proficiency: 'Martial', size: 'Light',      category: 'Melee',  costGp: 6,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x3',       rangeIncrement: 0,   weightLb: 3,   damageType: 'Slashing' },
  { id: 'kukri',           name: 'Kukri',                 proficiency: 'Martial', size: 'Light',      category: 'Melee',  costGp: 8,   damageMedium: '1d4', damageSmall: '1d3', critical: '18-20/x2', rangeIncrement: 0,   weightLb: 2,   damageType: 'Slashing' },
  { id: 'pick-light',      name: 'Pick, light',           proficiency: 'Martial', size: 'Light',      category: 'Melee',  costGp: 4,   damageMedium: '1d4', damageSmall: '1d3', critical: 'x4',       rangeIncrement: 0,   weightLb: 3,   damageType: 'Piercing' },
  { id: 'sap',             name: 'Sap',                   proficiency: 'Martial', size: 'Light',      category: 'Melee',  costGp: 1,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 0,   weightLb: 2,   damageType: 'Bludgeoning', special: ['nonlethal'] },
  { id: 'sword-short',     name: 'Sword, short',          proficiency: 'Martial', size: 'Light',      category: 'Melee',  costGp: 10,  damageMedium: '1d6', damageSmall: '1d4', critical: '19-20/x2', rangeIncrement: 0,   weightLb: 2,   damageType: 'Piercing' },
  // One-Handed
  { id: 'battleaxe',       name: 'Battleaxe',             proficiency: 'Martial', size: 'One-Handed', category: 'Melee',  costGp: 10,  damageMedium: '1d8', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 0,   weightLb: 6,   damageType: 'Slashing' },
  { id: 'flail',           name: 'Flail',                 proficiency: 'Martial', size: 'One-Handed', category: 'Melee',  costGp: 8,   damageMedium: '1d8', damageSmall: '1d6', critical: 'x2',       rangeIncrement: 0,   weightLb: 5,   damageType: 'Bludgeoning', special: ['disarm', 'trip'] },
  { id: 'sword-long',      name: 'Longsword',             proficiency: 'Martial', size: 'One-Handed', category: 'Melee',  costGp: 15,  damageMedium: '1d8', damageSmall: '1d6', critical: '19-20/x2', rangeIncrement: 0,   weightLb: 4,   damageType: 'Slashing' },
  { id: 'pick-heavy',      name: 'Pick, heavy',           proficiency: 'Martial', size: 'One-Handed', category: 'Melee',  costGp: 8,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x4',       rangeIncrement: 0,   weightLb: 6,   damageType: 'Piercing' },
  { id: 'rapier',          name: 'Rapier',                proficiency: 'Martial', size: 'One-Handed', category: 'Melee',  costGp: 20,  damageMedium: '1d6', damageSmall: '1d4', critical: '18-20/x2', rangeIncrement: 0,   weightLb: 2,   damageType: 'Piercing' },
  { id: 'scimitar',        name: 'Scimitar',              proficiency: 'Martial', size: 'One-Handed', category: 'Melee',  costGp: 15,  damageMedium: '1d6', damageSmall: '1d4', critical: '18-20/x2', rangeIncrement: 0,   weightLb: 4,   damageType: 'Slashing' },
  { id: 'trident',         name: 'Trident',               proficiency: 'Martial', size: 'One-Handed', category: 'Melee',  costGp: 15,  damageMedium: '1d8', damageSmall: '1d6', critical: 'x2',       rangeIncrement: 10,  weightLb: 4,   damageType: 'Piercing', isThrown: true },
  { id: 'warhammer',       name: 'Warhammer',             proficiency: 'Martial', size: 'One-Handed', category: 'Melee',  costGp: 12,  damageMedium: '1d8', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 0,   weightLb: 5,   damageType: 'Bludgeoning' },
  // Two-Handed
  { id: 'falchion',        name: 'Falchion',              proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 75,  damageMedium: '2d4', damageSmall: '1d6', critical: '18-20/x2', rangeIncrement: 0,   weightLb: 8,   damageType: 'Slashing' },
  { id: 'glaive',          name: 'Glaive',                proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 8,   damageMedium: '1d10', damageSmall: '1d8', critical: 'x3',       rangeIncrement: 0,   weightLb: 10,  damageType: 'Slashing', isReach: true },
  { id: 'greataxe',        name: 'Greataxe',              proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 20,  damageMedium: '1d12', damageSmall: '1d10', critical: 'x3',      rangeIncrement: 0,   weightLb: 12,  damageType: 'Slashing' },
  { id: 'greatclub',       name: 'Greatclub',             proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 5,   damageMedium: '1d10', damageSmall: '1d8', critical: 'x2',       rangeIncrement: 0,   weightLb: 8,   damageType: 'Bludgeoning' },
  { id: 'flail-heavy',     name: 'Flail, heavy',          proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 15,  damageMedium: '1d10', damageSmall: '1d8', critical: '19-20/x2', rangeIncrement: 0,   weightLb: 10,  damageType: 'Bludgeoning', special: ['disarm', 'trip'] },
  { id: 'greatsword',      name: 'Greatsword',            proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 50,  damageMedium: '2d6', damageSmall: '1d10', critical: '19-20/x2', rangeIncrement: 0,   weightLb: 8,   damageType: 'Slashing' },
  { id: 'guisarme',        name: 'Guisarme',              proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 9,   damageMedium: '2d4', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 0,   weightLb: 12,  damageType: 'Slashing', isReach: true },
  { id: 'halberd',         name: 'Halberd',               proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 10,  damageMedium: '1d10', damageSmall: '1d8', critical: 'x3',       rangeIncrement: 0,   weightLb: 12,  damageType: 'P&S', special: ['trip'] },
  { id: 'lance',           name: 'Lance',                 proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 10,  damageMedium: '1d8', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 0,   weightLb: 10,  damageType: 'Piercing', isReach: true, special: ['mounted-double-damage'] },
  { id: 'ranseur',         name: 'Ranseur',               proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 10,  damageMedium: '2d4', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 0,   weightLb: 12,  damageType: 'Piercing', isReach: true, special: ['disarm'] },
  { id: 'scythe',          name: 'Scythe',                proficiency: 'Martial', size: 'Two-Handed', category: 'Melee',  costGp: 18,  damageMedium: '2d4', damageSmall: '1d6', critical: 'x4',       rangeIncrement: 0,   weightLb: 10,  damageType: 'P&S', special: ['trip'] },
  // Ranged
  { id: 'longbow',         name: 'Longbow',               proficiency: 'Martial', size: 'Two-Handed', category: 'Ranged', costGp: 75,  damageMedium: '1d8', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 100, weightLb: 3,   damageType: 'Piercing' },
  { id: 'longbow-comp',    name: 'Longbow, composite',    proficiency: 'Martial', size: 'Two-Handed', category: 'Ranged', costGp: 100, damageMedium: '1d8', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 110, weightLb: 3,   damageType: 'Piercing', special: ['str-bonus-damage'] },
  { id: 'shortbow',        name: 'Shortbow',              proficiency: 'Martial', size: 'Two-Handed', category: 'Ranged', costGp: 30,  damageMedium: '1d6', damageSmall: '1d4', critical: 'x3',       rangeIncrement: 60,  weightLb: 2,   damageType: 'Piercing' },
  { id: 'shortbow-comp',   name: 'Shortbow, composite',   proficiency: 'Martial', size: 'Two-Handed', category: 'Ranged', costGp: 75,  damageMedium: '1d6', damageSmall: '1d4', critical: 'x3',       rangeIncrement: 70,  weightLb: 2,   damageType: 'Piercing', special: ['str-bonus-damage'] },
]

// ─── Exotic Weapons ───────────────────────────────────────────────────────────

const EXOTIC_WEAPONS: DnDWeapon[] = [
  { id: 'kama',            name: 'Kama',                  proficiency: 'Exotic', size: 'Light',       category: 'Melee',  costGp: 2,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 0,   weightLb: 2,   damageType: 'Slashing', special: ['monk'] },
  { id: 'nunchaku',        name: 'Nunchaku',              proficiency: 'Exotic', size: 'Light',       category: 'Melee',  costGp: 2,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 0,   weightLb: 2,   damageType: 'Bludgeoning', special: ['disarm', 'monk'] },
  { id: 'sai',             name: 'Sai',                   proficiency: 'Exotic', size: 'Light',       category: 'Melee',  costGp: 1,   damageMedium: '1d4', damageSmall: '1d3', critical: 'x2',       rangeIncrement: 10,  weightLb: 1,   damageType: 'Bludgeoning', special: ['disarm', 'monk'], isThrown: true },
  { id: 'siangham',        name: 'Siangham',              proficiency: 'Exotic', size: 'Light',       category: 'Melee',  costGp: 3,   damageMedium: '1d6', damageSmall: '1d4', critical: 'x2',       rangeIncrement: 0,   weightLb: 1,   damageType: 'Piercing', special: ['monk'] },
  { id: 'sword-bastard',   name: 'Sword, bastard',        proficiency: 'Exotic', size: 'One-Handed',  category: 'Melee',  costGp: 35,  damageMedium: '1d10', damageSmall: '1d8', critical: '19-20/x2', rangeIncrement: 0,   weightLb: 6,   damageType: 'Slashing' },
  { id: 'waraxe-dwarven',  name: 'Waraxe, dwarven',       proficiency: 'Exotic', size: 'One-Handed',  category: 'Melee',  costGp: 30,  damageMedium: '1d10', damageSmall: '1d8', critical: 'x3',       rangeIncrement: 0,   weightLb: 8,   damageType: 'Slashing' },
  { id: 'whip',            name: 'Whip',                  proficiency: 'Exotic', size: 'One-Handed',  category: 'Melee',  costGp: 1,   damageMedium: '1d3', damageSmall: '1d2', critical: 'x2',       rangeIncrement: 0,   weightLb: 2,   damageType: 'Slashing', isReach: true, special: ['nonlethal', 'no-damage-vs-armor'] },
  { id: 'axe-orc-double',  name: 'Axe, orc double',       proficiency: 'Exotic', size: 'Two-Handed',  category: 'Melee',  costGp: 60,  damageMedium: '1d8', damageSmall: '1d6', critical: 'x3',       rangeIncrement: 0,   weightLb: 15,  damageType: 'Slashing', isDouble: true },
  { id: 'chain-spiked',    name: 'Chain, spiked',         proficiency: 'Exotic', size: 'Two-Handed',  category: 'Melee',  costGp: 25,  damageMedium: '2d4', damageSmall: '1d6', critical: 'x2',       rangeIncrement: 0,   weightLb: 10,  damageType: 'Piercing', isReach: true, special: ['disarm', 'trip'] },
]

// ─── Combined List & Helpers ──────────────────────────────────────────────────

export const DND_WEAPONS: DnDWeapon[] = [
  ...SIMPLE_WEAPONS,
  ...MARTIAL_WEAPONS,
  ...EXOTIC_WEAPONS,
]

export function getWeaponById(id: string): DnDWeapon | undefined {
  return DND_WEAPONS.find(w => w.id === id)
}

export function getWeaponsByProficiency(proficiency: WeaponProficiency): DnDWeapon[] {
  return DND_WEAPONS.filter(w => w.proficiency === proficiency)
}

/** Weapons a class is proficient with.
 *  Returns the proficiency tiers they can use (Simple only, Simple+Martial, etc.)
 */
export function getClassWeaponProficiencies(className: string): WeaponProficiency[] {
  const martial = ['Barbarian', 'Fighter', 'Paladin', 'Ranger']
  const simpleOnly = ['Wizard', 'Sorcerer']
  if (martial.includes(className)) return ['Simple', 'Martial']
  if (simpleOnly.includes(className)) return ['Simple']
  // Bard, Cleric, Druid, Monk, Rogue — Simple + some Martial (handled by class description)
  return ['Simple']
}

/** Parse a critical string like "19-20/x2" or "x3" into { min, mult } */
export function parseCritical(critical: string): { min: number; mult: number } {
  const rangeMatch = critical.match(/(\d+)-20\/x(\d+)/)
  if (rangeMatch) return { min: parseInt(rangeMatch[1]), mult: parseInt(rangeMatch[2]) }
  const multMatch = critical.match(/x(\d+)/)
  if (multMatch) return { min: 20, mult: parseInt(multMatch[1]) }
  return { min: 20, mult: 2 }
}
