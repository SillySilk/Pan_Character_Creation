// D&D 3.5 Equipment Panel
// Tabs: Weapons | Armor | Gear | Purse
// Flow: (1) Roll starting gold (2) Buy items, purse deducts (3) Sell back during creation

import { useState, useMemo } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { DND_WEAPONS, type DnDWeapon } from '../../data/dndWeapons'
import { DND_ARMOR, cappedDexMod } from '../../data/dndArmor'
import { DND_GEAR, type GearCategory } from '../../data/dndGear'
import {
  STARTING_GOLD,
  rollStartingGold,
  totalGpValue,
  canAfford,
  spend,
  refund,
  formatCost,
  type Currency,
} from '../../data/dndStartingGold'
import { calcPrimaryBAB, abilMod } from '../../services/combatStatsService'
import { DND_CORE_CLASSES } from '../../data/dndClasses'

interface EquipmentPanelProps {
  onComplete?: () => void
}

type Tab = 'weapons' | 'armor' | 'gear' | 'purse'

// ─── Equipped weapon with optional enhancements ───────────────────────────────
export interface EquippedWeapon {
  weaponId: string
  slot: 'primary' | 'secondary' | 'ranged'
  enhancementBonus: number  // +0 to +5 magic
  isMasterwork: boolean
  hasFocus: boolean         // Weapon Focus feat applied
  hasSpecialization: boolean // Weapon Specialization feat
  notes: string
}

// ─── Equipped armor ───────────────────────────────────────────────────────────
export interface EquippedArmor {
  armorId: string
  shieldId: string
  enhancementBonus: number
  shieldEnhancement: number
  naturalArmorBonus: number
  deflectionBonus: number
  miscACBonus: number
}

const DEFAULT_ARMOR: EquippedArmor = {
  armorId: 'none',
  shieldId: '',
  enhancementBonus: 0,
  shieldEnhancement: 0,
  naturalArmorBonus: 0,
  deflectionBonus: 0,
  miscACBonus: 0,
}

const MW_WEAPON_COST = 300
const GEAR_CATEGORIES: GearCategory[] = [
  'Adventuring', 'Tools & Kits', 'Containers', 'Light Sources',
  'Food & Lodging', 'Clothing', 'Ammunition', 'Transport',
]

export function EquipmentPanel({ onComplete }: EquipmentPanelProps) {
  const { character, updateCharacter } = useCharacterStore()
  const [tab, setTab] = useState<Tab>('weapons')

  // ── Weapon state ───────────────────────────────────────────────────
  const [equippedWeapons, setEquippedWeapons] = useState<EquippedWeapon[]>(
    () => (character?.equippedWeapons as EquippedWeapon[] | undefined) ?? []
  )
  const [weaponSearch, setWeaponSearch] = useState('')
  const [weaponProfFilter, setWeaponProfFilter] = useState<'All' | 'Simple' | 'Martial' | 'Exotic'>('All')

  // ── Armor state ────────────────────────────────────────────────────
  const [equippedArmor, setEquippedArmor] = useState<EquippedArmor>(
    () => (character?.equippedArmor as EquippedArmor | undefined) ?? DEFAULT_ARMOR
  )

  // ── Gear state ─────────────────────────────────────────────────────
  const [gearInventory, setGearInventory] = useState<Record<string, number>>(
    () => character?.gearInventory ?? {}
  )
  const [gearSearch, setGearSearch] = useState('')
  const [gearCatFilter, setGearCatFilter] = useState<GearCategory | 'All'>('All')

  // ── Currency state ─────────────────────────────────────────────────
  const [currency, setCurrency] = useState<Currency>(
    () => ({
      pp: character?.currency?.pp ?? 0,
      gp: character?.currency?.gp ?? 0,
      sp: character?.currency?.sp ?? 0,
      cp: character?.currency?.cp ?? 0,
    })
  )
  const [rolledGp, setRolledGp] = useState<number>(
    () => character?.rolledStartingGp ?? 0
  )

  const hasRolled = rolledGp > 0
  const currentGpValue = totalGpValue(currency)
  const spentGp = Math.max(0, rolledGp - currentGpValue)

  // ── Character data ─────────────────────────────────────────────────
  const cls = character?.characterClass
    ? DND_CORE_CLASSES.find(c => c.name === character.characterClass!.name)
    : null
  const level = character?.level ?? 1
  const str = abilMod(character?.strength ?? 10)
  const dex = abilMod(character?.dexterity ?? 10)
  const bab = cls ? calcPrimaryBAB(cls.baseAttackBonus, level) : 0
  const startingEntry = character?.characterClass
    ? STARTING_GOLD.find(e => e.className === character.characterClass!.name)
    : null

  // Effective attack bonus for a weapon
  function weaponAttackBonus(w: DnDWeapon, eq: EquippedWeapon): number {
    const abilityMod = w.category === 'Ranged' ? dex : str
    const mwBonus = eq.isMasterwork || eq.enhancementBonus > 0 ? 1 : 0
    const focusBonus = eq.hasFocus ? 1 : 0
    return bab + abilityMod + mwBonus + eq.enhancementBonus + focusBonus
  }

  // Damage modifier for a weapon
  function weaponDamageMod(w: DnDWeapon, eq: EquippedWeapon): number {
    let mod = eq.enhancementBonus
    if (w.category === 'Melee') {
      if (eq.slot === 'secondary') {
        mod += Math.floor(str / 2)
      } else if (w.size === 'Two-Handed') {
        mod += Math.floor(str * 1.5)
      } else {
        mod += str
      }
      if (eq.hasSpecialization) mod += 2
    }
    return mod
  }

  function fmtBonus(n: number): string {
    return n >= 0 ? `+${n}` : `${n}`
  }

  function fmtAttackArray(base: number): string {
    const attacks: number[] = [base]
    let cur = base
    while (cur - 5 >= 1) { cur -= 5; attacks.push(cur) }
    return attacks.map(a => fmtBonus(a)).join('/')
  }

  // ── AC calculation preview ─────────────────────────────────────────
  const armorObj = DND_ARMOR.find(a => a.id === equippedArmor.armorId)
  const shieldObj = DND_ARMOR.find(a => a.id === equippedArmor.shieldId)
  const effectiveDex = armorObj ? cappedDexMod(dex, armorObj) : dex
  const totalAC = 10
    + (armorObj?.acBonus ?? 0) + equippedArmor.enhancementBonus
    + (shieldObj?.acBonus ?? 0) + equippedArmor.shieldEnhancement
    + effectiveDex
    + equippedArmor.naturalArmorBonus
    + equippedArmor.deflectionBonus
    + equippedArmor.miscACBonus
  const touchAC = 10 + effectiveDex + equippedArmor.deflectionBonus + equippedArmor.miscACBonus
  const flatFootedAC = totalAC - effectiveDex

  // ── Weapon browser ─────────────────────────────────────────────────
  const filteredWeapons = useMemo(() => {
    return DND_WEAPONS.filter(w => {
      if (weaponProfFilter !== 'All' && w.proficiency !== weaponProfFilter) return false
      if (weaponSearch && !w.name.toLowerCase().includes(weaponSearch.toLowerCase())) return false
      return true
    })
  }, [weaponSearch, weaponProfFilter])

  // ── Purse operations ───────────────────────────────────────────────
  function buy(costGp: number): boolean {
    if (!canAfford(currency, costGp)) return false
    setCurrency(prev => spend(prev, costGp))
    return true
  }

  function sellBack(costGp: number) {
    setCurrency(prev => refund(prev, costGp))
  }

  // ── Weapon buy/sell ────────────────────────────────────────────────
  function buyWeapon(weapon: DnDWeapon, masterwork: boolean) {
    const cost = weapon.costGp + (masterwork ? MW_WEAPON_COST : 0)
    if (!buy(cost)) return
    const newEntry: EquippedWeapon = {
      weaponId: weapon.id,
      slot: weapon.category === 'Ranged' ? 'ranged' : equippedWeapons.length === 0 ? 'primary' : 'secondary',
      enhancementBonus: 0,
      isMasterwork: masterwork,
      hasFocus: false,
      hasSpecialization: false,
      notes: '',
    }
    setEquippedWeapons(prev => [...prev, newEntry])
  }

  function sellWeapon(index: number) {
    const eq = equippedWeapons[index]
    const w = DND_WEAPONS.find(x => x.id === eq.weaponId)
    if (w) {
      const refundAmount = w.costGp + (eq.isMasterwork ? MW_WEAPON_COST : 0)
      sellBack(refundAmount)
    }
    setEquippedWeapons(prev => prev.filter((_, i) => i !== index))
  }

  function updateWeapon(index: number, patch: Partial<EquippedWeapon>) {
    // Toggling masterwork costs/refunds 300 gp
    if ('isMasterwork' in patch && patch.isMasterwork !== equippedWeapons[index].isMasterwork) {
      if (patch.isMasterwork) {
        if (!buy(MW_WEAPON_COST)) return
      } else {
        sellBack(MW_WEAPON_COST)
      }
    }
    setEquippedWeapons(prev => prev.map((w, i) => i === index ? { ...w, ...patch } : w))
  }

  // ── Armor buy/swap ─────────────────────────────────────────────────
  function selectArmor(armorId: string) {
    const prevId = equippedArmor.armorId
    if (prevId === armorId) return
    // Refund previous armor
    const prevArmor = DND_ARMOR.find(a => a.id === prevId)
    if (prevArmor && prevArmor.id !== 'none') sellBack(prevArmor.costGp)
    // Charge new armor
    const newArmor = DND_ARMOR.find(a => a.id === armorId)
    if (newArmor && newArmor.id !== 'none') {
      if (!canAfford(currency, newArmor.costGp - (prevArmor && prevArmor.id !== 'none' ? 0 : 0))) {
        // Rollback refund if we can't afford the swap
        if (prevArmor && prevArmor.id !== 'none') {
          // refund already applied — re-spend it
          setCurrency(prev => spend(prev, prevArmor.costGp))
        }
        return
      }
      setCurrency(prev => spend(prev, newArmor.costGp))
    }
    setEquippedArmor(prev => ({ ...prev, armorId, enhancementBonus: 0 }))
  }

  function selectShield(shieldId: string) {
    const prevId = equippedArmor.shieldId
    if (prevId === shieldId) return
    const prevShield = prevId ? DND_ARMOR.find(a => a.id === prevId) : null
    if (prevShield) sellBack(prevShield.costGp)
    if (shieldId) {
      const newShield = DND_ARMOR.find(a => a.id === shieldId)
      if (newShield) {
        if (!canAfford(currency, newShield.costGp)) {
          // Rollback the refund
          if (prevShield) setCurrency(prev => spend(prev, prevShield.costGp))
          return
        }
        setCurrency(prev => spend(prev, newShield.costGp))
      }
    }
    setEquippedArmor(prev => ({ ...prev, shieldId, shieldEnhancement: 0 }))
  }

  // ── Gear browser ───────────────────────────────────────────────────
  const filteredGear = useMemo(() => {
    return DND_GEAR.filter(g => {
      if (gearCatFilter !== 'All' && g.category !== gearCatFilter) return false
      if (gearSearch && !g.name.toLowerCase().includes(gearSearch.toLowerCase())) return false
      return true
    })
  }, [gearSearch, gearCatFilter])

  function buyGear(id: string, costGp: number) {
    if (!buy(costGp)) return
    setGearInventory(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  function sellGear(id: string, costGp: number) {
    const qty = gearInventory[id] ?? 0
    if (qty <= 0) return
    sellBack(costGp)
    setGearInventory(prev => {
      const next = { ...prev }
      if (qty - 1 <= 0) delete next[id]
      else next[id] = qty - 1
      return next
    })
  }

  // ── Starting gold roll ─────────────────────────────────────────────
  function handleRollGold() {
    if (!character?.characterClass) return
    if (hasRolled && spentGp > 0) {
      const ok = window.confirm(
        'Rerolling will reset your purse and refund all purchased items. Continue?'
      )
      if (!ok) return
      // Clear equipment so budget matches purse
      setEquippedWeapons([])
      setEquippedArmor(DEFAULT_ARMOR)
      setGearInventory({})
    }
    const rolled = rollStartingGold(character.characterClass.name)
    setCurrency(rolled)
    setRolledGp(totalGpValue(rolled))
  }

  // ── Save / continue ────────────────────────────────────────────────
  function handleSave() {
    updateCharacter({
      equippedWeapons,
      equippedArmor,
      gearInventory,
      currency,
      rolledStartingGp: rolledGp,
    })
    onComplete?.()
  }

  const PROF_COLORS = {
    Simple:  'bg-gray-100 text-gray-700',
    Martial: 'bg-blue-100 text-blue-700',
    Exotic:  'bg-purple-100 text-purple-700',
  }

  const purseGpLabel = `${currentGpValue.toFixed(currentGpValue % 1 === 0 ? 0 : 1)} gp`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-800">Equipment</h2>
        <span className="text-sm text-gray-500">Level {level} {cls?.name ?? 'Adventurer'}</span>
      </div>

      {/* ── Starting-gold banner ───────────────────────────────────── */}
      {!hasRolled ? (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-amber-900">Roll Starting Gold</h3>
              {startingEntry ? (
                <p className="text-sm text-amber-700 mt-1">
                  {character?.characterClass?.name} starting wealth:{' '}
                  <strong>{startingEntry.dice} × {startingEntry.multiplier} {startingEntry.unit}</strong>
                  {' '}(average {startingEntry.averageGp} gp)
                </p>
              ) : (
                <p className="text-sm text-amber-700 mt-1">Select a class on the Identity tab first.</p>
              )}
            </div>
            <button
              onClick={handleRollGold}
              disabled={!startingEntry}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🎲 Roll Gold
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-6 items-center">
              <div>
                <div className="text-xs text-amber-700 uppercase tracking-wide">Purse</div>
                <div className="text-2xl font-bold text-amber-900">{purseGpLabel}</div>
              </div>
              <div className="text-xs text-amber-700 space-y-0.5">
                <div>Rolled: <strong>{rolledGp.toFixed(0)} gp</strong></div>
                <div>Spent: <strong>{spentGp.toFixed(currentGpValue % 1 === 0 ? 0 : 1)} gp</strong></div>
              </div>
              {/* Budget bar */}
              <div className="flex-1 min-w-32">
                <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 transition-all"
                    style={{ width: `${Math.min(100, (spentGp / Math.max(1, rolledGp)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleRollGold}
              className="px-3 py-1.5 text-xs border border-amber-400 text-amber-700 rounded hover:bg-amber-100"
            >
              Reroll
            </button>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        {(['weapons', 'armor', 'gear', 'purse'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── WEAPONS TAB ────────────────────────────────────────────── */}
      {tab === 'weapons' && (
        <div className="space-y-4">
          {/* Equipped weapons attack table */}
          {equippedWeapons.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Equipped Weapons</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded">
                  <thead className="bg-amber-50">
                    <tr className="text-left text-xs text-gray-600">
                      <th className="px-2 py-1">Weapon</th>
                      <th className="px-2 py-1">Attack</th>
                      <th className="px-2 py-1">Damage</th>
                      <th className="px-2 py-1">Crit</th>
                      <th className="px-2 py-1">Range</th>
                      <th className="px-2 py-1">Type</th>
                      <th className="px-2 py-1">Enh</th>
                      <th className="px-2 py-1">MW</th>
                      <th className="px-2 py-1">Focus</th>
                      <th className="px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {equippedWeapons.map((eq, i) => {
                      const w = DND_WEAPONS.find(x => x.id === eq.weaponId)
                      if (!w) return null
                      const atk = weaponAttackBonus(w, eq)
                      const dmgMod = weaponDamageMod(w, eq)
                      const dmgStr = dmgMod !== 0 ? `${w.damageMedium} ${fmtBonus(dmgMod)}` : w.damageMedium
                      return (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-2 py-1 font-medium">{w.name}</td>
                          <td className="px-2 py-1 font-mono text-blue-700">{fmtAttackArray(atk)}</td>
                          <td className="px-2 py-1 font-mono">{dmgStr}</td>
                          <td className="px-2 py-1 text-xs text-gray-600">{w.critical}</td>
                          <td className="px-2 py-1 text-xs">{w.rangeIncrement > 0 ? `${w.rangeIncrement} ft.` : '—'}</td>
                          <td className="px-2 py-1 text-xs text-gray-600">{w.damageType}</td>
                          <td className="px-2 py-1">
                            <input
                              type="number" min={0} max={5}
                              value={eq.enhancementBonus}
                              onChange={e => updateWeapon(i, { enhancementBonus: parseInt(e.target.value) || 0 })}
                              className="w-10 text-center border border-gray-200 rounded text-xs"
                            />
                          </td>
                          <td className="px-2 py-1 text-center">
                            <input type="checkbox" checked={eq.isMasterwork}
                              onChange={e => updateWeapon(i, { isMasterwork: e.target.checked })}
                              title="Masterwork (+300 gp)"
                            />
                          </td>
                          <td className="px-2 py-1 text-center">
                            <input type="checkbox" checked={eq.hasFocus}
                              onChange={e => updateWeapon(i, { hasFocus: e.target.checked })} />
                          </td>
                          <td className="px-2 py-1">
                            <button onClick={() => sellWeapon(i)}
                              className="text-red-500 hover:text-red-700 text-xs"
                              title="Sell back (full refund during creation)"
                            >Sell ✕</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                BAB {fmtBonus(bab)} | STR {fmtBonus(str)} | DEX {fmtBonus(dex)}
              </p>
            </div>
          )}

          {/* Weapon browser */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Buy Weapon</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Search weapons..."
                value={weaponSearch}
                onChange={e => setWeaponSearch(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              {(['All', 'Simple', 'Martial', 'Exotic'] as const).map(p => (
                <button key={p}
                  onClick={() => setWeaponProfFilter(p)}
                  className={`px-2 py-1 text-xs rounded border ${
                    weaponProfFilter === p ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-gray-200 text-gray-600'
                  }`}
                >{p}</button>
              ))}
            </div>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded divide-y divide-gray-100">
              {filteredWeapons.map(w => {
                const affordable = canAfford(currency, w.costGp)
                const mwAffordable = canAfford(currency, w.costGp + MW_WEAPON_COST)
                return (
                  <div key={w.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-sm">
                    <span className={`text-xs px-1 rounded ${PROF_COLORS[w.proficiency]}`}>{w.proficiency[0]}</span>
                    <span className="flex-1 font-medium">{w.name}</span>
                    <span className="text-xs text-gray-500">{w.damageMedium}</span>
                    <span className="text-xs text-gray-400 w-16 text-right">{formatCost(w.costGp)}</span>
                    <button
                      onClick={() => buyWeapon(w, false)}
                      disabled={!affordable || !hasRolled}
                      className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >Buy</button>
                    <button
                      onClick={() => buyWeapon(w, true)}
                      disabled={!mwAffordable || !hasRolled}
                      className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      title={`Masterwork: ${formatCost(w.costGp + MW_WEAPON_COST)}`}
                    >+MW</button>
                  </div>
                )
              })}
              {filteredWeapons.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">No weapons found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ARMOR TAB ───────────────────────────────────────────────── */}
      {tab === 'armor' && (
        <div className="space-y-4">
          {/* AC Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 flex gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-800">{totalAC}</div>
              <div className="text-xs text-blue-600">AC</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-700">{touchAC}</div>
              <div className="text-xs text-blue-600">Touch</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-700">{flatFootedAC}</div>
              <div className="text-xs text-blue-600">Flat-Footed</div>
            </div>
            <div className="text-xs text-blue-600 text-left ml-2 self-center">
              <div>DEX {fmtBonus(effectiveDex)} {armorObj && dex !== effectiveDex ? `(capped from ${fmtBonus(dex)})` : ''}</div>
              <div>Armor {fmtBonus((armorObj?.acBonus ?? 0) + equippedArmor.enhancementBonus)}</div>
              <div>Shield {fmtBonus((shieldObj?.acBonus ?? 0) + equippedArmor.shieldEnhancement)}</div>
            </div>
          </div>

          {/* Body armor select */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Body Armor</label>
            <div className="grid gap-1 max-h-52 overflow-y-auto">
              {DND_ARMOR.filter(a => a.category !== 'Shield').map(a => {
                const selected = equippedArmor.armorId === a.id
                // For budget check: user can always switch to "none"; otherwise must afford the delta
                const prevArmor = DND_ARMOR.find(x => x.id === equippedArmor.armorId)
                const prevCost = prevArmor && prevArmor.id !== 'none' ? prevArmor.costGp : 0
                const delta = a.id === 'none' ? 0 : Math.max(0, a.costGp - prevCost)
                const affordable = selected || canAfford(currency, delta)
                return (
                  <button
                    key={a.id}
                    onClick={() => selectArmor(a.id)}
                    disabled={!hasRolled && a.id !== 'none'}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm text-left ${
                      selected
                        ? 'bg-blue-100 border-blue-400'
                        : affordable
                          ? 'border-gray-200 hover:bg-gray-50'
                          : 'border-gray-200 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className={`text-xs px-1 rounded ${
                      a.category === 'Light' ? 'bg-green-100 text-green-700' :
                      a.category === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      a.category === 'Heavy' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>{a.category}</span>
                    <span className="flex-1 font-medium">{a.name}</span>
                    <span className="text-xs text-gray-500">+{a.acBonus} AC</span>
                    <span className="text-xs text-gray-400">Max DEX +{a.maxDex ?? '∞'}</span>
                    <span className="text-xs text-gray-400">ACP {a.acp}</span>
                    <span className="text-xs text-gray-500 w-14 text-right">{a.id === 'none' ? '—' : formatCost(a.costGp)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Shield select */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Shield</label>
            <div className="grid gap-1">
              <button
                onClick={() => selectShield('')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm text-left ${
                  !equippedArmor.shieldId ? 'bg-blue-100 border-blue-400' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-400">None</span>
              </button>
              {DND_ARMOR.filter(a => a.category === 'Shield').map(a => {
                const selected = equippedArmor.shieldId === a.id
                const prevShield = equippedArmor.shieldId ? DND_ARMOR.find(x => x.id === equippedArmor.shieldId) : null
                const delta = Math.max(0, a.costGp - (prevShield?.costGp ?? 0))
                const affordable = selected || canAfford(currency, delta)
                return (
                  <button
                    key={a.id}
                    onClick={() => selectShield(a.id)}
                    disabled={!hasRolled}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm text-left ${
                      selected
                        ? 'bg-blue-100 border-blue-400'
                        : affordable
                          ? 'border-gray-200 hover:bg-gray-50'
                          : 'border-gray-200 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="flex-1 font-medium">{a.name}</span>
                    <span className="text-xs text-gray-500">+{a.acBonus} AC</span>
                    <span className="text-xs text-gray-400">ACP {a.acp}</span>
                    <span className="text-xs text-gray-500 w-14 text-right">{formatCost(a.costGp)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bonus adjustments */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Armor enhancement', key: 'enhancementBonus' as const },
              { label: 'Shield enhancement', key: 'shieldEnhancement' as const },
              { label: 'Natural armor',      key: 'naturalArmorBonus' as const },
              { label: 'Deflection',         key: 'deflectionBonus' as const },
              { label: 'Misc AC',            key: 'miscACBonus' as const },
            ].map(({ label, key }) => (
              <label key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 flex-1">{label}</span>
                <input
                  type="number" min={0} max={20}
                  value={equippedArmor[key]}
                  onChange={e => setEquippedArmor(prev => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                  className="w-14 text-center border border-gray-300 rounded px-1 py-0.5 text-xs"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── GEAR TAB ────────────────────────────────────────────────── */}
      {tab === 'gear' && (
        <div className="space-y-3">
          {/* Inventory summary */}
          {Object.keys(gearInventory).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Inventory</h3>
              <div className="space-y-0.5 max-h-32 overflow-y-auto">
                {Object.entries(gearInventory).map(([id, qty]) => {
                  const g = DND_GEAR.find(x => x.id === id)
                  if (!g || qty === 0) return null
                  return (
                    <div key={id} className="flex items-center gap-2 text-sm px-2 py-0.5 bg-gray-50 rounded">
                      <span className="flex-1">{g.name}</span>
                      <span className="text-xs text-gray-500">{qty} × {g.weightLb} lb. = {(qty * g.weightLb).toFixed(1)} lb.</span>
                      <button onClick={() => sellGear(id, g.costGp)}
                        className="text-red-400 hover:text-red-600 text-xs" title="Sell one">✕</button>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Total weight: {Object.entries(gearInventory).reduce((sum, [id, qty]) => {
                  const g = DND_GEAR.find(x => x.id === id)
                  return sum + (g ? g.weightLb * qty : 0)
                }, 0).toFixed(1)} lb.
              </p>
            </div>
          )}

          {/* Gear browser */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search gear..."
              value={gearSearch}
              onChange={e => setGearSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setGearCatFilter('All')}
              className={`px-2 py-0.5 text-xs rounded border ${gearCatFilter === 'All' ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-gray-200 text-gray-600'}`}
            >All</button>
            {GEAR_CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => setGearCatFilter(cat)}
                className={`px-2 py-0.5 text-xs rounded border ${gearCatFilter === cat ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-gray-200 text-gray-600'}`}
              >{cat}</button>
            ))}
          </div>
          <div className="max-h-72 overflow-y-auto border border-gray-200 rounded divide-y divide-gray-100">
            {filteredGear.map(g => {
              const qty = gearInventory[g.id] ?? 0
              const affordable = canAfford(currency, g.costGp)
              return (
                <div key={g.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{g.name}</span>
                    {g.description && <span className="text-xs text-gray-400 ml-2">{g.description}</span>}
                  </div>
                  <span className="text-xs text-gray-500">{g.weightLb} lb.</span>
                  <span className="text-xs text-gray-500 w-16 text-right">{formatCost(g.costGp)}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => sellGear(g.id, g.costGp)}
                      disabled={qty <= 0}
                      className="w-5 h-5 text-xs rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30">−</button>
                    <span className="w-6 text-center text-xs">{qty}</span>
                    <button onClick={() => buyGear(g.id, g.costGp)}
                      disabled={!affordable || !hasRolled}
                      className="w-5 h-5 text-xs rounded bg-amber-100 hover:bg-amber-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      title={affordable ? 'Buy one' : 'Insufficient funds'}
                    >+</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── PURSE TAB ───────────────────────────────────────────────── */}
      {tab === 'purse' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
            <div className="text-2xl font-bold text-amber-800">{currentGpValue.toFixed(2)} gp</div>
            <div className="text-xs text-amber-600">Total value</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {([
              { key: 'pp' as const, label: 'Platinum (pp)', color: 'bg-blue-50 border-blue-200',     textColor: 'text-blue-700' },
              { key: 'gp' as const, label: 'Gold (gp)',     color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-700' },
              { key: 'sp' as const, label: 'Silver (sp)',   color: 'bg-gray-50 border-gray-200',     textColor: 'text-gray-700' },
              { key: 'cp' as const, label: 'Copper (cp)',   color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700' },
            ]).map(({ key, label, color, textColor }) => (
              <div key={key} className={`${color} border rounded p-3`}>
                <label className={`text-sm font-medium ${textColor} block mb-1`}>{label}</label>
                <input
                  type="number" min={0}
                  value={currency[key]}
                  onChange={e => setCurrency(prev => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                  className="w-full text-center border border-gray-300 rounded px-2 py-1"
                />
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
            1 pp = 10 gp · 1 gp = 10 sp · 1 sp = 10 cp · Manual edits are allowed but bypass the purchase budget.
          </div>
        </div>
      )}

      {/* Save footer */}
      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium"
        >
          Save Equipment & Continue
        </button>
      </div>
    </div>
  )
}
