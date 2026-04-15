// D&D 3.5 SRD Adventuring Gear
// Source: SRD Basic Rules and Legal/equipment.md

export type GearCategory =
  | 'Adventuring'
  | 'Tools & Kits'
  | 'Clothing'
  | 'Food & Lodging'
  | 'Transport'
  | 'Containers'
  | 'Light Sources'
  | 'Ammunition'

export interface DnDGear {
  id: string
  name: string
  category: GearCategory
  costGp: number
  weightLb: number
  description?: string
}

export const DND_GEAR: DnDGear[] = [
  // ── Adventuring ────────────────────────────────────────────────────
  { id: 'backpack',          name: 'Backpack (empty)',       category: 'Adventuring',    costGp: 2,     weightLb: 2,    description: 'Holds up to 1 cubic foot / 30 lb.' },
  { id: 'bedroll',           name: 'Bedroll',                category: 'Adventuring',    costGp: 0.1,   weightLb: 5 },
  { id: 'blanket-winter',    name: 'Blanket, winter',        category: 'Adventuring',    costGp: 0.5,   weightLb: 3 },
  { id: 'rope-hemp',         name: 'Rope, hempen (50 ft.)',  category: 'Adventuring',    costGp: 1,     weightLb: 10,   description: '+2 DC to climb in some cases' },
  { id: 'rope-silk',         name: 'Rope, silk (50 ft.)',    category: 'Adventuring',    costGp: 10,    weightLb: 5,    description: 'DC 18 Strength to break; DC 10 Climb' },
  { id: 'grappling-hook',    name: 'Grappling hook',         category: 'Adventuring',    costGp: 1,     weightLb: 4 },
  { id: 'piton',             name: 'Piton',                  category: 'Adventuring',    costGp: 0.1,   weightLb: 0.5 },
  { id: 'hammer',            name: 'Hammer',                 category: 'Tools & Kits',   costGp: 0.5,   weightLb: 2 },
  { id: 'crowbar',           name: 'Crowbar',                category: 'Tools & Kits',   costGp: 2,     weightLb: 5,    description: '+2 circumstance bonus to relevant Strength checks' },
  { id: 'caltrops',          name: 'Caltrops',               category: 'Adventuring',    costGp: 1,     weightLb: 2,    description: '2 lb. per 5-foot square covered' },
  { id: 'chain-10ft',        name: 'Chain (10 ft.)',         category: 'Adventuring',    costGp: 30,    weightLb: 2,    description: 'DC 26 Strength to break' },
  { id: 'manacles',          name: 'Manacles',               category: 'Adventuring',    costGp: 15,    weightLb: 2,    description: 'DC 30 Escape Artist; DC 26 Break' },
  { id: 'manacles-mw',       name: 'Manacles, masterwork',   category: 'Adventuring',    costGp: 50,    weightLb: 2,    description: 'DC 35 Escape Artist; DC 28 Break' },
  { id: 'mirror-small-steel',name: 'Mirror, small steel',    category: 'Adventuring',    costGp: 10,    weightLb: 0.5 },
  { id: 'pole-10ft',         name: 'Pole, 10-foot',          category: 'Adventuring',    costGp: 0.2,   weightLb: 8 },
  { id: 'spikes-iron-12',    name: 'Spikes, iron (12)',       category: 'Adventuring',    costGp: 1,     weightLb: 5 },
  // ── Tools & Kits ───────────────────────────────────────────────────
  { id: 'thieves-tools',     name: "Thieves' tools",         category: 'Tools & Kits',   costGp: 30,    weightLb: 1,    description: 'Required for Disable Device and Open Lock on complex traps/locks' },
  { id: 'thieves-tools-mw',  name: "Thieves' tools, mw",     category: 'Tools & Kits',   costGp: 100,   weightLb: 2,    description: '+2 circumstance bonus on Disable Device and Open Lock' },
  { id: 'healers-kit',       name: "Healer's kit",           category: 'Tools & Kits',   costGp: 50,    weightLb: 1,    description: '+2 circumstance bonus on Heal checks; 10 uses' },
  { id: 'disguise-kit',      name: 'Disguise kit',           category: 'Tools & Kits',   costGp: 50,    weightLb: 8,    description: '+2 circumstance bonus on Disguise checks; 10 uses' },
  { id: 'climbers-kit',      name: "Climber's kit",          category: 'Tools & Kits',   costGp: 80,    weightLb: 5,    description: '+2 circumstance bonus on Climb checks' },
  { id: 'artisan-tools',     name: "Artisan's tools",        category: 'Tools & Kits',   costGp: 5,     weightLb: 5,    description: 'Tools for a specific Craft skill' },
  { id: 'artisan-tools-mw',  name: "Artisan's tools, mw",    category: 'Tools & Kits',   costGp: 55,    weightLb: 5,    description: '+2 circumstance bonus on related Craft check' },
  { id: 'magnifying-glass',  name: 'Magnifying glass',       category: 'Tools & Kits',   costGp: 100,   weightLb: 0,    description: '+5 bonus on Appraise checks for small items' },
  { id: 'spellbook-blank',   name: 'Spellbook (blank)',       category: 'Tools & Kits',   costGp: 15,    weightLb: 3,    description: '100 pages; wizards start with one free' },
  { id: 'ink',               name: 'Ink (1 oz. vial)',        category: 'Tools & Kits',   costGp: 8,     weightLb: 0 },
  { id: 'inkpen',            name: 'Inkpen',                  category: 'Tools & Kits',   costGp: 0.1,   weightLb: 0 },
  { id: 'parchment',         name: 'Parchment (sheet)',       category: 'Tools & Kits',   costGp: 0.2,   weightLb: 0 },
  { id: 'sealing-wax',       name: 'Sealing wax',             category: 'Tools & Kits',   costGp: 1,     weightLb: 1 },
  // ── Containers ────────────────────────────────────────────────────
  { id: 'bag-holding-1',    name: 'Bag of holding (I)',      category: 'Containers',     costGp: 2500,  weightLb: 15,   description: 'Holds 250 lb. / 30 cu. ft.' },
  { id: 'pouch-belt',       name: 'Pouch, belt (empty)',     category: 'Containers',     costGp: 1,     weightLb: 0.5,  description: 'Holds 1/5 cu. ft. / 6 lb.' },
  { id: 'sack',             name: 'Sack (empty)',            category: 'Containers',     costGp: 0.1,   weightLb: 0.5,  description: 'Holds 1 cu. ft. / 30 lb.' },
  { id: 'waterskin',        name: 'Waterskin',               category: 'Containers',     costGp: 1,     weightLb: 4 },
  { id: 'vial-iron',        name: 'Vial, iron or glass',     category: 'Containers',     costGp: 1,     weightLb: 0 },
  { id: 'flask',            name: 'Flask (empty)',           category: 'Containers',     costGp: 0.03,  weightLb: 1.5 },
  { id: 'scroll-case',      name: 'Scroll case',             category: 'Containers',     costGp: 1,     weightLb: 0.5 },
  // ── Light Sources ──────────────────────────────────────────────────
  { id: 'candle',           name: 'Candle',                  category: 'Light Sources',  costGp: 0.01,  weightLb: 0,    description: '5-ft. dim light; lasts 1 hour' },
  { id: 'torch',            name: 'Torch',                   category: 'Light Sources',  costGp: 0.01,  weightLb: 1,    description: '20-ft. bright light; lasts 1 hour' },
  { id: 'lantern-bullseye', name: 'Lantern, bullseye',       category: 'Light Sources',  costGp: 12,    weightLb: 3,    description: '60-ft. cone bright light; lasts 6 hours/pint oil' },
  { id: 'lantern-hooded',   name: 'Lantern, hooded',         category: 'Light Sources',  costGp: 7,     weightLb: 2,    description: '30-ft. bright light; lasts 6 hours/pint oil' },
  { id: 'oil-flask',        name: 'Oil (1-pint flask)',       category: 'Light Sources',  costGp: 0.1,   weightLb: 1 },
  { id: 'sunrod',           name: 'Sunrod',                  category: 'Light Sources',  costGp: 2,     weightLb: 1,    description: '30-ft. bright light; lasts 6 hours (no flame)' },
  // ── Food & Lodging ─────────────────────────────────────────────────
  { id: 'rations-trail-1day',name: 'Rations, trail (1 day)', category: 'Food & Lodging', costGp: 0.5,   weightLb: 1 },
  { id: 'feed-animal-1day', name: 'Feed, animal (per day)',  category: 'Food & Lodging', costGp: 0.05,  weightLb: 10 },
  // ── Clothing ───────────────────────────────────────────────────────
  { id: 'outfit-common',    name: "Outfit, common",          category: 'Clothing',       costGp: 0.4,   weightLb: 4 },
  { id: 'outfit-traveler',  name: "Outfit, traveler's",      category: 'Clothing',       costGp: 1,     weightLb: 5 },
  { id: 'outfit-explorer',  name: "Outfit, explorer's",      category: 'Clothing',       costGp: 10,    weightLb: 8 },
  { id: 'outfit-noble',     name: "Outfit, noble's",         category: 'Clothing',       costGp: 75,    weightLb: 10 },
  { id: 'cloak-resistance', name: 'Cloak',                   category: 'Clothing',       costGp: 0.5,   weightLb: 1 },
  // ── Ammunition ────────────────────────────────────────────────────
  { id: 'arrows-20',        name: 'Arrows (20)',             category: 'Ammunition',     costGp: 1,     weightLb: 3 },
  { id: 'bolts-10',         name: 'Bolts, crossbow (10)',    category: 'Ammunition',     costGp: 1,     weightLb: 1 },
  { id: 'bullets-sling-10', name: 'Bullets, sling (10)',     category: 'Ammunition',     costGp: 0.1,   weightLb: 5 },
  // ── Transport ─────────────────────────────────────────────────────
  { id: 'horse-riding',     name: 'Horse, riding',           category: 'Transport',      costGp: 75,    weightLb: 0 },
  { id: 'horse-war',        name: 'Horse, war (heavy)',      category: 'Transport',      costGp: 400,   weightLb: 0 },
  { id: 'pony',             name: 'Pony',                    category: 'Transport',      costGp: 30,    weightLb: 0 },
  { id: 'cart',             name: 'Cart',                    category: 'Transport',      costGp: 15,    weightLb: 200 },
  { id: 'saddle-riding',    name: 'Saddle, riding',          category: 'Transport',      costGp: 10,    weightLb: 25 },
  { id: 'saddle-military',  name: 'Saddle, military',        category: 'Transport',      costGp: 20,    weightLb: 30 },
  { id: 'saddlebags',       name: 'Saddlebags',              category: 'Transport',      costGp: 4,     weightLb: 8 },
]

export function getGearById(id: string): DnDGear | undefined {
  return DND_GEAR.find(g => g.id === id)
}

export function getGearByCategory(category: GearCategory): DnDGear[] {
  return DND_GEAR.filter(g => g.category === category)
}
