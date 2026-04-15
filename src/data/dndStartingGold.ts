// D&D 3.5 SRD Starting Gold by Class
// Source: SRD character class entries (Player's Handbook Table 7-1)

export interface StartingGoldEntry {
  className: string
  /** Dice formula, e.g. "4d4" or "5d4" */
  dice: string
  /** Multiplier (typically 10 for gp, or 1 for sp) */
  multiplier: number
  /** Average gold (useful for display) */
  averageGp: number
  /** Unit: "gp" or "sp" */
  unit: 'gp' | 'sp'
}

export const STARTING_GOLD: StartingGoldEntry[] = [
  { className: 'Barbarian', dice: '4d4', multiplier: 10, averageGp: 100, unit: 'gp' },
  { className: 'Bard',      dice: '4d4', multiplier: 10, averageGp: 100, unit: 'gp' },
  { className: 'Cleric',    dice: '5d4', multiplier: 10, averageGp: 125, unit: 'gp' },
  { className: 'Druid',     dice: '2d4', multiplier: 10, averageGp: 50,  unit: 'gp' },
  { className: 'Fighter',   dice: '5d4', multiplier: 10, averageGp: 125, unit: 'gp' },
  { className: 'Monk',      dice: '5d4', multiplier: 1,  averageGp: 12,  unit: 'sp' },
  { className: 'Paladin',   dice: '6d4', multiplier: 10, averageGp: 150, unit: 'gp' },
  { className: 'Ranger',    dice: '5d4', multiplier: 10, averageGp: 125, unit: 'gp' },
  { className: 'Rogue',     dice: '5d4', multiplier: 10, averageGp: 125, unit: 'gp' },
  { className: 'Sorcerer',  dice: '3d4', multiplier: 10, averageGp: 75,  unit: 'gp' },
  { className: 'Wizard',    dice: '3d4', multiplier: 10, averageGp: 75,  unit: 'gp' },
]

export interface Currency {
  pp: number  // Platinum pieces (1 pp = 10 gp)
  gp: number  // Gold pieces
  sp: number  // Silver pieces (10 sp = 1 gp)
  cp: number  // Copper pieces (100 cp = 1 gp)
}

export const EMPTY_CURRENCY: Currency = { pp: 0, gp: 0, sp: 0, cp: 0 }

/** Convert everything to gold piece equivalents */
export function totalGpValue(currency: Currency): number {
  return currency.pp * 10 + currency.gp + currency.sp / 10 + currency.cp / 100
}

export function getStartingGoldForClass(className: string): StartingGoldEntry | undefined {
  return STARTING_GOLD.find(e => e.className === className)
}

/** Roll starting gold and return as a Currency object */
export function rollStartingGold(className: string): Currency {
  const entry = getStartingGoldForClass(className)
  if (!entry) return EMPTY_CURRENCY

  // Parse "XdY" and roll
  const [count, sides] = entry.dice.split('d').map(Number)
  let total = 0
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1
  }
  total *= entry.multiplier

  if (entry.unit === 'sp') {
    return { pp: 0, gp: 0, sp: total, cp: 0 }
  }
  return { pp: 0, gp: total, sp: 0, cp: 0 }
}

// ─── Purse math (cp-based) ────────────────────────────────────────────
// All prices get normalized to copper pieces so fractional gp (0.1 gp = 10 cp)
// spend and refund cleanly without float drift.

export function currencyToCp(c: Currency): number {
  return (c.pp || 0) * 1000 + (c.gp || 0) * 100 + (c.sp || 0) * 10 + (c.cp || 0)
}

export function gpToCp(gp: number): number {
  return Math.round(gp * 100)
}

export function cpToCurrency(totalCp: number): Currency {
  if (totalCp <= 0) return { pp: 0, gp: 0, sp: 0, cp: 0 }
  const pp = Math.floor(totalCp / 1000); totalCp -= pp * 1000
  const gp = Math.floor(totalCp / 100);  totalCp -= gp * 100
  const sp = Math.floor(totalCp / 10);   totalCp -= sp * 10
  return { pp, gp, sp, cp: totalCp }
}

export function canAfford(purse: Currency, costGp: number): boolean {
  return currencyToCp(purse) >= gpToCp(costGp)
}

export function spend(purse: Currency, costGp: number): Currency {
  const remaining = currencyToCp(purse) - gpToCp(costGp)
  return cpToCurrency(Math.max(0, remaining))
}

export function refund(purse: Currency, costGp: number): Currency {
  return cpToCurrency(currencyToCp(purse) + gpToCp(costGp))
}

/** Format a gp cost for display: "25 gp", "5 sp", "2 cp" */
export function formatCost(gp: number): string {
  const cp = gpToCp(gp)
  if (cp >= 100) {
    const value = cp / 100
    return `${value % 1 === 0 ? value : value.toFixed(1)} gp`
  }
  if (cp >= 10) return `${cp / 10} sp`
  return `${cp} cp`
}
