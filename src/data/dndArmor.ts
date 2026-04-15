// D&D 3.5 SRD Armor & Shield Data
// Source: SRD Basic Rules and Legal/equipment.md

export type ArmorCategory = 'Light' | 'Medium' | 'Heavy' | 'Shield' | 'None'

export interface DnDArmor {
  id: string
  name: string
  category: ArmorCategory
  costGp: number
  /** AC bonus granted */
  acBonus: number
  /** Maximum Dexterity bonus allowed (null = no limit) */
  maxDex: number | null
  /** Armor check penalty (negative number; 0 = no penalty) */
  acp: number
  /** Arcane spell failure chance as a percentage */
  arcaneSpellFailure: number
  /** Base speed for Medium/Large creatures in this armor (ft) */
  speedMedium: number
  /** Base speed for Small creatures in this armor (ft) */
  speedSmall: number
  weightLb: number
}

export const DND_ARMOR: DnDArmor[] = [
  // ── Light Armor ─────────────────────────────────────────────────────
  { id: 'padded',         name: 'Padded',         category: 'Light',  costGp: 5,    acBonus: 1, maxDex: 8,  acp: 0,   arcaneSpellFailure: 5,  speedMedium: 30, speedSmall: 20, weightLb: 10 },
  { id: 'leather',        name: 'Leather',        category: 'Light',  costGp: 10,   acBonus: 2, maxDex: 6,  acp: 0,   arcaneSpellFailure: 10, speedMedium: 30, speedSmall: 20, weightLb: 15 },
  { id: 'studded-leather',name: 'Studded leather',category: 'Light',  costGp: 25,   acBonus: 3, maxDex: 5,  acp: -1,  arcaneSpellFailure: 15, speedMedium: 30, speedSmall: 20, weightLb: 20 },
  { id: 'chain-shirt',    name: 'Chain shirt',    category: 'Light',  costGp: 100,  acBonus: 4, maxDex: 4,  acp: -2,  arcaneSpellFailure: 20, speedMedium: 30, speedSmall: 20, weightLb: 25 },
  // ── Medium Armor ────────────────────────────────────────────────────
  { id: 'hide',           name: 'Hide',           category: 'Medium', costGp: 15,   acBonus: 3, maxDex: 4,  acp: -3,  arcaneSpellFailure: 20, speedMedium: 20, speedSmall: 15, weightLb: 25 },
  { id: 'scale-mail',     name: 'Scale mail',     category: 'Medium', costGp: 50,   acBonus: 4, maxDex: 3,  acp: -4,  arcaneSpellFailure: 25, speedMedium: 20, speedSmall: 15, weightLb: 30 },
  { id: 'chainmail',      name: 'Chainmail',      category: 'Medium', costGp: 150,  acBonus: 5, maxDex: 2,  acp: -5,  arcaneSpellFailure: 30, speedMedium: 20, speedSmall: 15, weightLb: 40 },
  { id: 'breastplate',    name: 'Breastplate',    category: 'Medium', costGp: 200,  acBonus: 5, maxDex: 3,  acp: -4,  arcaneSpellFailure: 25, speedMedium: 20, speedSmall: 15, weightLb: 30 },
  // ── Heavy Armor ─────────────────────────────────────────────────────
  { id: 'splint-mail',    name: 'Splint mail',    category: 'Heavy',  costGp: 200,  acBonus: 6, maxDex: 0,  acp: -7,  arcaneSpellFailure: 40, speedMedium: 20, speedSmall: 15, weightLb: 45 },
  { id: 'banded-mail',    name: 'Banded mail',    category: 'Heavy',  costGp: 250,  acBonus: 6, maxDex: 1,  acp: -6,  arcaneSpellFailure: 35, speedMedium: 20, speedSmall: 15, weightLb: 35 },
  { id: 'half-plate',     name: 'Half-plate',     category: 'Heavy',  costGp: 600,  acBonus: 7, maxDex: 0,  acp: -7,  arcaneSpellFailure: 40, speedMedium: 20, speedSmall: 15, weightLb: 50 },
  { id: 'full-plate',     name: 'Full plate',     category: 'Heavy',  costGp: 1500, acBonus: 8, maxDex: 1,  acp: -6,  arcaneSpellFailure: 35, speedMedium: 20, speedSmall: 15, weightLb: 50 },
  // ── Shields ─────────────────────────────────────────────────────────
  { id: 'buckler',        name: 'Buckler',        category: 'Shield', costGp: 15,   acBonus: 1, maxDex: null, acp: -1, arcaneSpellFailure: 5, speedMedium: 30, speedSmall: 20, weightLb: 5 },
  { id: 'shield-light-wood',  name: 'Shield, light wooden',  category: 'Shield', costGp: 3,  acBonus: 1, maxDex: null, acp: -1, arcaneSpellFailure: 5,  speedMedium: 30, speedSmall: 20, weightLb: 5 },
  { id: 'shield-light-steel', name: 'Shield, light steel',   category: 'Shield', costGp: 9,  acBonus: 1, maxDex: null, acp: -1, arcaneSpellFailure: 5,  speedMedium: 30, speedSmall: 20, weightLb: 6 },
  { id: 'shield-heavy-wood',  name: 'Shield, heavy wooden',  category: 'Shield', costGp: 7,  acBonus: 2, maxDex: null, acp: -2, arcaneSpellFailure: 15, speedMedium: 30, speedSmall: 20, weightLb: 10 },
  { id: 'shield-heavy-steel', name: 'Shield, heavy steel',   category: 'Shield', costGp: 20, acBonus: 2, maxDex: null, acp: -2, arcaneSpellFailure: 15, speedMedium: 30, speedSmall: 20, weightLb: 15 },
  { id: 'shield-tower',   name: 'Tower shield',   category: 'Shield', costGp: 30,   acBonus: 4, maxDex: 2,  acp: -10, arcaneSpellFailure: 50, speedMedium: 30, speedSmall: 20, weightLb: 45 },
  // ── No armor ────────────────────────────────────────────────────────
  { id: 'none',           name: 'None',           category: 'None',   costGp: 0,    acBonus: 0, maxDex: null, acp: 0, arcaneSpellFailure: 0,  speedMedium: 30, speedSmall: 20, weightLb: 0 },
]

export function getArmorById(id: string): DnDArmor | undefined {
  return DND_ARMOR.find(a => a.id === id)
}

export function getArmorByCategory(category: ArmorCategory): DnDArmor[] {
  return DND_ARMOR.filter(a => a.category === category)
}

/** Effective DEX modifier after applying armor's maxDex cap */
export function cappedDexMod(dexMod: number, armor: DnDArmor): number {
  if (armor.maxDex === null) return dexMod
  return Math.min(dexMod, armor.maxDex)
}
