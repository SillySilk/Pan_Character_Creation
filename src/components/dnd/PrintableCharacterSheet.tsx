// D&D 3.5 Printable / Print-Ready Character Sheet (Phase 6)
// Two-page layout: Page 1 = combat stats, skills, feats, equipment
//                  Page 2 = background, personality, contacts

import { useRef } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { DND_CORE_CLASSES } from '../../data/dndClasses'
import { DND_CORE_SKILLS } from '../../data/dndSkills'
import { DND_WEAPONS } from '../../data/dndWeapons'
import { DND_ARMOR } from '../../data/dndArmor'
import { DND_GEAR } from '../../data/dndGear'
import { getFeatById } from '../../data/dndFeats'
import { calcPrimaryBAB, abilMod } from '../../services/combatStatsService'
import type { DnDAlignmentCode } from '../../types/character'

interface PrintableCharacterSheetProps {
  onBack?: () => void
}

const ALIGNMENT_LABELS: Record<DnDAlignmentCode, string> = {
  LG: 'Lawful Good',  NG: 'Neutral Good',  CG: 'Chaotic Good',
  LN: 'Lawful Neutral', TN: 'True Neutral', CN: 'Chaotic Neutral',
  LE: 'Lawful Evil',  NE: 'Neutral Evil',  CE: 'Chaotic Evil',
}

function fmtMod(n: number): string { return n >= 0 ? `+${n}` : `${n}` }
function fmtBonus(bab: number): string {
  const attacks: number[] = [bab]
  let c = bab; while (c - 5 >= 1) { c -= 5; attacks.push(c) }
  return attacks.map(fmtMod).join('/')
}

export function PrintableCharacterSheet({ onBack }: PrintableCharacterSheetProps) {
  const { character } = useCharacterStore()
  const printRef = useRef<HTMLDivElement>(null)

  if (!character) return <p className="text-gray-400 p-4">No character loaded.</p>

  const cls = character.characterClass
    ? DND_CORE_CLASSES.find(c => c.name === character.characterClass!.name)
    : null
  const level = character.level ?? 1
  const str  = abilMod(character.strength  ?? 10)
  const dex  = abilMod(character.dexterity ?? 10)
  const con  = abilMod(character.constitution ?? 10)
  const int_ = abilMod(character.intelligence ?? 10)
  const wis  = abilMod(character.wisdom ?? 10)
  const cha  = abilMod(character.charisma ?? 10)
  const bab  = cls ? calcPrimaryBAB(cls.baseAttackBonus, level) : 0

  const cs = character.combatStats
  const equippedWeapons: any[] = (character as any).equippedWeapons ?? []
  const equippedArmor: any    = (character as any).equippedArmor
  const armorObj  = equippedArmor?.armorId  ? DND_ARMOR.find(a => a.id === equippedArmor.armorId)  : null
  const shieldObj = equippedArmor?.shieldId ? DND_ARMOR.find(a => a.id === equippedArmor.shieldId) : null
  const gearInventory: Record<string, number> = (character as any).gearInventory ?? {}
  const currency: any = (character as any).currency ?? {}
  const bonusLanguages: string[] = (character as any).bonusLanguages ?? []
  const spellNotes: Record<number, string> = (character as any).spellNotes ?? {}
  const selectedFeats = character.selectedFeats ?? []
  const fighterFeats  = character.fighterBonusFeats ?? []
  const allFeatIds = [...selectedFeats, ...fighterFeats]

  function handlePrint() {
    window.print()
  }

  // Skills
  const skillBonuses = character.dndIntegration?.skillBonuses ?? {}

  return (
    <div className="space-y-4">
      {/* Screen-only toolbar */}
      <div className="flex items-center gap-3 print:hidden">
        {onBack && (
          <button onClick={onBack}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
            ← Back
          </button>
        )}
        <button onClick={handlePrint}
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 font-medium text-sm">
          🖨 Print / Save PDF
        </button>
        <p className="text-xs text-gray-400">Use browser print → Save as PDF for best results</p>
      </div>

      {/* ═══ PRINTABLE CONTENT ═══════════════════════════════════════════ */}
      <div ref={printRef} className="print-sheet bg-white text-black font-serif text-[11px] leading-tight">

        {/* ── PAGE 1 ─────────────────────────────────────────────────────── */}
        <div className="page p-6 min-h-screen">

          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3">
            <div>
              <h1 className="text-2xl font-bold tracking-wide">{character.name || 'Unnamed Character'}</h1>
              <p className="text-xs text-gray-600">
                {cls?.name ?? '—'} {level} · {character.dndRace?.name ?? character.race?.type ?? '—'} ·{' '}
                {character.dndAlignment ? ALIGNMENT_LABELS[character.dndAlignment] : '—'}
              </p>
            </div>
            <div className="text-right text-xs">
              <div>HP: <strong>{character.hpCurrent ?? character.hpMax ?? '—'}</strong> / {character.hpMax ?? '—'}</div>
              <div>Speed: {cs?.speed ?? 30} ft.</div>
              <div>Initiative: {cs ? fmtMod(cs.initiative) : fmtMod(dex)}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">

            {/* Column 1: Ability Scores + Combat */}
            <div className="space-y-3">
              {/* Ability scores */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Ability Scores</h2>
                <table className="w-full text-xs">
                  <tbody>
                    {[
                      { label: 'STR', score: character.strength ?? 10, mod: str },
                      { label: 'DEX', score: character.dexterity ?? 10, mod: dex },
                      { label: 'CON', score: character.constitution ?? 10, mod: con },
                      { label: 'INT', score: character.intelligence ?? 10, mod: int_ },
                      { label: 'WIS', score: character.wisdom ?? 10, mod: wis },
                      { label: 'CHA', score: character.charisma ?? 10, mod: cha },
                    ].map(({ label, score, mod }) => (
                      <tr key={label}>
                        <td className="font-bold pr-2">{label}</td>
                        <td className="text-center pr-1">{score}</td>
                        <td className="text-center font-mono">{fmtMod(mod)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* Combat Stats */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Combat</h2>
                <table className="w-full text-xs">
                  <tbody>
                    <tr><td className="pr-2">BAB</td><td className="font-mono">{fmtBonus(bab)}</td></tr>
                    <tr><td className="pr-2">AC</td><td className="font-mono">{cs?.ac ?? 10 + dex}</td></tr>
                    <tr><td className="pr-2">Touch AC</td><td className="font-mono">{cs?.touchAC ?? 10 + dex}</td></tr>
                    <tr><td className="pr-2">FF AC</td><td className="font-mono">{cs?.flatFootedAC ?? 10}</td></tr>
                    <tr><td className="pr-2">Fort</td><td className="font-mono">{cs ? fmtMod(cs.fortitude) : fmtMod(con)}</td></tr>
                    <tr><td className="pr-2">Ref</td><td className="font-mono">{cs ? fmtMod(cs.reflex) : fmtMod(dex)}</td></tr>
                    <tr><td className="pr-2">Will</td><td className="font-mono">{cs ? fmtMod(cs.will) : fmtMod(wis)}</td></tr>
                    <tr><td className="pr-2">Grapple</td><td className="font-mono">{cs ? fmtMod(cs.grapple) : fmtMod(str)}</td></tr>
                  </tbody>
                </table>
              </section>

              {/* Armor */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Armor & Shield</h2>
                <div className="text-xs space-y-0.5">
                  <div>Body: {armorObj?.name ?? 'None'}{equippedArmor?.enhancementBonus > 0 ? ` +${equippedArmor.enhancementBonus}` : ''}</div>
                  <div>Shield: {shieldObj?.name ?? 'None'}{equippedArmor?.shieldEnhancement > 0 ? ` +${equippedArmor.shieldEnhancement}` : ''}</div>
                  {armorObj && <div className="text-gray-500">ACP: {armorObj.acp} · ASF: {armorObj.arcaneSpellFailure}%</div>}
                </div>
              </section>

              {/* Currency */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Currency</h2>
                <div className="text-xs grid grid-cols-2 gap-x-2">
                  <span>PP: {currency.pp ?? 0}</span>
                  <span>GP: {currency.gp ?? 0}</span>
                  <span>SP: {currency.sp ?? 0}</span>
                  <span>CP: {currency.cp ?? 0}</span>
                </div>
              </section>
            </div>

            {/* Column 2: Weapons + Feats */}
            <div className="space-y-3">
              {/* Weapons */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Weapons</h2>
                {equippedWeapons.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No weapons equipped</p>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th>Weapon</th><th>Atk</th><th>Dmg</th><th>Crit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equippedWeapons.map((eq: any, i: number) => {
                        const w = DND_WEAPONS.find(x => x.id === eq.weaponId)
                        if (!w) return null
                        const abilityMod = w.category === 'Ranged' ? dex : str
                        const mwBonus = eq.isMasterwork || eq.enhancementBonus > 0 ? 1 : 0
                        const atk = bab + abilityMod + mwBonus + eq.enhancementBonus + (eq.hasFocus ? 1 : 0)
                        let dmgMod = eq.enhancementBonus
                        if (w.category === 'Melee') {
                          dmgMod += eq.slot === 'secondary' ? Math.floor(str / 2)
                            : w.size === 'Two-Handed' ? Math.floor(str * 1.5) : str
                          if (eq.hasSpecialization) dmgMod += 2
                        }
                        return (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="pr-1">{w.name}{eq.enhancementBonus > 0 ? ` +${eq.enhancementBonus}` : eq.isMasterwork ? ' (MW)' : ''}</td>
                            <td className="font-mono pr-1">{fmtBonus(atk)}</td>
                            <td className="font-mono pr-1">{w.damageMedium}{dmgMod !== 0 ? fmtMod(dmgMod) : ''}</td>
                            <td className="text-gray-500">{w.critical}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </section>

              {/* Feats */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Feats</h2>
                {allFeatIds.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No feats selected</p>
                ) : (
                  <ul className="text-xs space-y-0.5">
                    {allFeatIds.map(id => {
                      const feat = getFeatById(id)
                      if (!feat) return null
                      return (
                        <li key={id}>
                          <span className="font-medium">{feat.name}</span>
                          {fighterFeats.includes(id) && <span className="text-gray-400 ml-1">(F)</span>}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              {/* Languages */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Languages</h2>
                <p className="text-xs">
                  {['Common', ...(character.dndRace?.automaticLanguages?.filter((l: string) => l !== 'Common') ?? []), ...bonusLanguages].join(', ')}
                </p>
              </section>

              {/* Gear summary */}
              {Object.keys(gearInventory).length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Gear</h2>
                  <ul className="text-xs columns-2 gap-2">
                    {Object.entries(gearInventory).map(([id, qty]) => {
                      const g = DND_GEAR.find(x => x.id === id)
                      if (!g || qty === 0) return null
                      return <li key={id}>{qty > 1 ? `${qty}× ` : ''}{g.name}</li>
                    })}
                  </ul>
                </section>
              )}
            </div>

            {/* Column 3: Skills */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Skills</h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pr-1">Skill</th><th className="text-center">Rnk</th><th className="text-center">Mod</th><th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {DND_CORE_SKILLS.filter(s => {
                    const b = skillBonuses[s.name]
                    return b && b.ranks > 0
                  }).map(s => {
                    const b = skillBonuses[s.name]
                    if (!b) return null
                    const abilityMods: Record<string, number> = { Strength: str, Dexterity: dex, Constitution: con, Intelligence: int_, Wisdom: wis, Charisma: cha }
                    const total = b.ranks + (abilityMods[s.keyAbility] ?? 0) + (b.synergy ?? 0) + (b.racial ?? 0)
                    return (
                      <tr key={s.name} className="border-t border-gray-50">
                        <td className="pr-1">{s.name}</td>
                        <td className="text-center">{b.ranks}</td>
                        <td className="text-center text-gray-500">{fmtMod(abilityMods[s.keyAbility] ?? 0)}</td>
                        <td className="text-right font-mono font-medium">{fmtMod(total)}</td>
                      </tr>
                    )
                  })}
                  {Object.values(skillBonuses).filter(b => b.ranks > 0).length === 0 && (
                    <tr><td className="text-gray-400 italic text-xs" colSpan={4}>No ranks assigned</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Spells section (casters only) */}
          {Object.keys(spellNotes).some(k => spellNotes[parseInt(k)]) && (
            <section className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Spells</h2>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(spellNotes).filter(([, v]) => v).map(([lvl, notes]) => (
                  <div key={lvl}>
                    <p className="text-xs font-medium text-gray-600">
                      {parseInt(lvl) === 0 ? 'Cantrips/Orisons' : `Level ${lvl}`}
                    </p>
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">{notes}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 italic mt-1">
                Spell save DC {10 + (cls?.primaryAbility === 'Intelligence' ? int_ : cls?.primaryAbility === 'Charisma' ? cha : wis)} · See PHB for spell descriptions and slots per day
              </p>
            </section>
          )}
        </div>

        {/* ── PAGE 2 (Background) ─────────────────────────────────────────── */}
        <div className="page p-6 border-t-4 border-double border-black mt-2 print:page-break-before-always">
          <h1 className="text-xl font-bold border-b-2 border-black pb-1 mb-3">
            {character.name || 'Character'} — Background & History
          </h1>

          <div className="grid grid-cols-2 gap-6">
            {/* Left: Heritage + Life Events */}
            <div className="space-y-3">
              {/* Heritage */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Heritage & Birth</h2>
                <div className="text-xs space-y-0.5">
                  <div>Race: {character.race?.name ?? '—'} ({character.race?.type ?? '—'})</div>
                  <div>Culture: {character.culture?.name ?? '—'} ({character.culture?.type ?? '—'})</div>
                  <div>Social Status: {character.socialStatus?.level ?? '—'}</div>
                  <div>Birthplace: {character.birthCircumstances?.birthplace ?? '—'}</div>
                  <div>Family: {character.family?.head ?? '—'}</div>
                </div>
              </section>

              {/* Youth Events */}
              {character.youthEvents?.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Youth Events</h2>
                  <ul className="text-xs list-disc list-inside space-y-0.5">
                    {character.youthEvents.map((e, i) => (
                      <li key={i}>{e.name}{e.description ? ` — ${e.description}` : ''}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Adulthood Events */}
              {character.adulthoodEvents?.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Adulthood Events</h2>
                  <ul className="text-xs list-disc list-inside space-y-0.5">
                    {character.adulthoodEvents.map((e, i) => (
                      <li key={i}>{e.name}{e.description ? ` — ${e.description}` : ''}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Occupations */}
              {character.occupations?.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Occupations & Training</h2>
                  <ul className="text-xs list-disc list-inside space-y-0.5">
                    {character.occupations.map((o, i) => (
                      <li key={i}>{o.name}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Right: Personality + Relationships */}
            <div className="space-y-3">
              {/* Personality */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Personality & Values</h2>
                <div className="text-xs space-y-0.5">
                  {character.values?.mostValuedPerson && <div>Values most: <em>{character.values.mostValuedPerson}</em></div>}
                  {character.values?.mostValuedThing && <div>Treasures: <em>{character.values.mostValuedThing}</em></div>}
                  {character.values?.mostValuedAbstraction && <div>Believes in: <em>{character.values.mostValuedAbstraction}</em></div>}
                  {character.alignment?.attitude && <div>Attitude: <em>{character.alignment.attitude}</em></div>}
                </div>
                {character.personalityTraits?.lightside?.length > 0 && (
                  <div className="mt-1">
                    <span className="font-medium">Traits: </span>
                    {[
                      ...character.personalityTraits.lightside,
                      ...character.personalityTraits.neutral,
                      ...character.personalityTraits.darkside,
                    ].map(t => t.name).join(', ')}
                  </div>
                )}
              </section>

              {/* NPCs / Relationships */}
              {character.npcs?.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Notable People</h2>
                  <ul className="text-xs space-y-0.5">
                    {character.npcs.slice(0, 10).map((n, i) => (
                      <li key={i}>
                        <span className="font-medium">{n.name}</span>
                        {n.role && <span className="text-gray-500"> ({n.role})</span>}
                        {n.description && <span className="text-gray-600"> — {String(n.description).slice(0, 60)}</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Special Items */}
              {character.specialItems?.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Special Items</h2>
                  <ul className="text-xs list-disc list-inside space-y-0.5">
                    {character.specialItems.map((item, i) => (
                      <li key={i}>{item.name}{item.description ? ` — ${item.description}` : ''}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Miscellaneous Events */}
              {character.miscellaneousEvents?.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 mb-1">Other Events</h2>
                  <ul className="text-xs list-disc list-inside space-y-0.5">
                    {character.miscellaneousEvents.map((e, i) => (
                      <li key={i}>{e.name}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-sheet, .print-sheet * { visibility: visible; }
          .print-sheet { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
          .page { page-break-after: always; }
        }
      `}</style>
    </div>
  )
}
