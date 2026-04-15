// D&D 3.5 Feat Selector
// Handles general feat slots, human bonus feat, and Fighter bonus feat slots.

import { useState, useMemo } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import {
  DND_FEATS,
  getFeatById,
  meetsFeatPrerequisites,
  type DnDFeat,
  type FeatType,
} from '../../data/dndFeats'
import { DND_CORE_CLASSES } from '../../data/dndClasses'
import {
  calcGeneralFeatCount,
  calcFighterBonusFeatCount,
  calcPrimaryBAB,
} from '../../services/combatStatsService'

// Re-export for convenience (named export used elsewhere)
export { getFeatById }

interface FeatSelectorProps {
  onComplete?: () => void
}

type SlotKind = 'general' | 'fighter'

interface FeatSlot {
  index: number
  kind: SlotKind
  featId: string | null
  label: string
}

const TYPE_COLORS: Record<FeatType, string> = {
  General:      'bg-blue-100 text-blue-700',
  Fighter:      'bg-red-100 text-red-700',
  ItemCreation: 'bg-purple-100 text-purple-700',
  Metamagic:    'bg-indigo-100 text-indigo-700',
  Special:      'bg-gray-100 text-gray-600',
}

function fmtPrereq(feat: DnDFeat): string {
  return feat.prerequisites.map(p => {
    if (p.type === 'ability') return `${p.name} ${p.value}+`
    if (p.type === 'feat')    return p.name ?? ''
    if (p.type === 'bab')     return `BAB +${p.value}`
    if (p.type === 'casterLevel') return `CL ${p.value}th`
    if (p.type === 'classLevel')  return `${p.name} level ${p.value}`
    if (p.type === 'skill')   return `${p.name} ${p.value} ranks`
    return p.description ?? ''
  }).filter(Boolean).join(', ')
}

export function FeatSelector({ onComplete }: FeatSelectorProps) {
  const { character, setSelectedFeats, setFighterBonusFeats } = useCharacterStore()

  const cls = character?.characterClass
    ? DND_CORE_CLASSES.find(c => c.name === character.characterClass!.name)
    : null
  const level        = character?.level ?? 1
  const isFighter    = cls?.name === 'Fighter'
  const isHuman      = character?.dndRace?.name === 'Human' || character?.race?.type === 'Human'

  const generalSlotCount  = calcGeneralFeatCount(level, isHuman)
  const fighterSlotCount  = isFighter ? calcFighterBonusFeatCount(level) : 0

  // Local state — arrays of feat IDs (null = empty slot)
  const [genFeats, setGenFeats]  = useState<(string | null)[]>(() => {
    const stored = character?.selectedFeats ?? []
    return Array.from({ length: generalSlotCount }, (_, i) => stored[i] ?? null)
  })
  const [ftrFeats, setFtrFeats]  = useState<(string | null)[]>(() => {
    const stored = character?.fighterBonusFeats ?? []
    return Array.from({ length: fighterSlotCount }, (_, i) => stored[i] ?? null)
  })

  // Which slot is currently being filled (null = no browser open)
  const [activeSlot, setActiveSlot] = useState<{ index: number; kind: SlotKind } | null>(null)

  // Browser filters
  const [search, setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState<FeatType | 'All'>('All')
  const [showMissingPrereqs, setShowMissingPrereqs] = useState(false)

  // All feat IDs currently selected (for prereq checking)
  const allSelectedIds = useMemo(
    () => [...genFeats, ...ftrFeats].filter(Boolean) as string[],
    [genFeats, ftrFeats],
  )

  // Build prereq stats for the current character
  const prereqStats = useMemo(() => {
    if (!character) return {}
    const bab = cls ? calcPrimaryBAB(cls.baseAttackBonus, level) : 0
    return {
      str: character.strength     ?? 10,
      dex: character.dexterity    ?? 10,
      con: character.constitution ?? 10,
      int: character.intelligence ?? 10,
      wis: character.wisdom       ?? 10,
      cha: character.charisma     ?? 10,
      bab,
      feats: allSelectedIds,
      classLevels: cls ? { [cls.name]: level } : {},
      skillRanks: Object.fromEntries(
        Object.entries(character.dndIntegration?.skillBonuses ?? {})
          .map(([k, v]) => [k, v.ranks]),
      ),
    }
  }, [character, cls, level, allSelectedIds])

  // Already-selected feat IDs that can't be taken again (non-stackable)
  const takenNonStackable = new Set(
    allSelectedIds.filter(id => {
      const f = getFeatById(id)
      return f && !f.stackable
    }),
  )

  // Feat list for browser
  const browseFeats = useMemo(() => {
    const onlyFighter = activeSlot?.kind === 'fighter'
    return DND_FEATS.filter(feat => {
      if (onlyFighter && !feat.isFighterBonus) return false
      if (typeFilter !== 'All' && feat.type !== typeFilter) return false
      if (search && !feat.name.toLowerCase().includes(search.toLowerCase())) return false
      if (!showMissingPrereqs && !meetsFeatPrerequisites(feat, prereqStats)) return false
      return true
    })
  }, [activeSlot, typeFilter, search, showMissingPrereqs, prereqStats])

  const generalSlots: FeatSlot[] = genFeats.map((id, i) => ({
    index: i,
    kind: 'general' as SlotKind,
    featId: id,
    label: `Feat ${i + 1}`,
  }))

  const fighterSlots: FeatSlot[] = ftrFeats.map((id, i) => ({
    index: i,
    kind: 'fighter' as SlotKind,
    featId: id,
    label: `Bonus ${i + 1}`,
  }))

  const allSlots = [...generalSlots, ...fighterSlots]

  const selectFeat = (feat: DnDFeat) => {
    if (!activeSlot) return
    if (activeSlot.kind === 'general') {
      const next = [...genFeats]
      next[activeSlot.index] = feat.id
      setGenFeats(next)
    } else {
      const next = [...ftrFeats]
      next[activeSlot.index] = feat.id
      setFtrFeats(next)
    }
    setActiveSlot(null)
    setSearch('')
  }

  const clearSlot = (slot: FeatSlot) => {
    if (slot.kind === 'general') {
      const next = [...genFeats]; next[slot.index] = null; setGenFeats(next)
    } else {
      const next = [...ftrFeats]; next[slot.index] = null; setFtrFeats(next)
    }
  }

  const handleSave = () => {
    setSelectedFeats(genFeats.filter(Boolean) as string[])
    setFighterBonusFeats(ftrFeats.filter(Boolean) as string[])
    onComplete?.()
  }

  const filledCount = allSlots.filter(s => s.featId).length
  const totalSlots  = allSlots.length
  const genFilled = generalSlots.filter(s => s.featId).length
  const ftrFilled = fighterSlots.filter(s => s.featId).length

  // ────────────────────────────────────────────────────────────
  // Inline browser — rendered inside the active slot row
  // ────────────────────────────────────────────────────────────
  const renderBrowser = () => (
    <div className="mt-3 pt-3 border-t border-amber-200 space-y-2.5">
      {/* Browser controls */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search feats..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-40 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          autoFocus
          onKeyDown={e => { if (e.key === 'Escape') setActiveSlot(null) }}
        />
        {activeSlot?.kind !== 'fighter' && (
          <div className="flex rounded border border-gray-300 overflow-hidden text-xs">
            {(['All', 'General', 'Metamagic', 'ItemCreation'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1.5 transition-colors ${
                  typeFilter === t ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t === 'ItemCreation' ? 'Item Creation' : t}
              </button>
            ))}
          </div>
        )}
        <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showMissingPrereqs}
            onChange={e => setShowMissingPrereqs(e.target.checked)}
            className="rounded"
          />
          Show all (incl. missing prereqs)
        </label>
      </div>

      <p className="text-xs text-gray-500">
        {browseFeats.length} feat{browseFeats.length !== 1 ? 's' : ''} available
      </p>

      {/* Compact two-line feat list */}
      <div className="max-h-96 overflow-y-auto space-y-1 pr-1 bg-white rounded border border-gray-200">
        {browseFeats.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6 italic">
            No feats match your filters. Try enabling "Show all" to see feats with unmet prerequisites.
          </p>
        ) : browseFeats.map(feat => {
          const prereqsMet = meetsFeatPrerequisites(feat, prereqStats)
          const alreadyTaken = takenNonStackable.has(feat.id)
          const prereqStr = fmtPrereq(feat)
          const isDisabled = alreadyTaken || (!prereqsMet && !showMissingPrereqs)
          const shortBenefit = feat.benefit.length > 90 ? feat.benefit.slice(0, 88) + '…' : feat.benefit

          return (
            <div
              key={feat.id}
              onClick={() => !isDisabled && selectFeat(feat)}
              className={`px-3 py-2 border-b border-gray-100 last:border-b-0 transition-all ${
                alreadyTaken
                  ? 'bg-gray-50 opacity-50 cursor-not-allowed'
                  : !prereqsMet
                  ? 'bg-red-50/20 cursor-not-allowed'
                  : 'bg-white hover:bg-amber-50 cursor-pointer'
              }`}
            >
              {/* Line 1: name + type + status */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-semibold text-sm ${!prereqsMet ? 'text-gray-500' : 'text-gray-900'}`}>
                  {feat.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[feat.type]}`}>
                  {feat.type}
                </span>
                {feat.stackable && (
                  <span className="text-[10px] text-gray-400 italic">repeatable</span>
                )}
                {alreadyTaken && (
                  <span className="text-[10px] text-gray-500 font-semibold">already selected</span>
                )}
                {!isDisabled && (
                  <span className="ml-auto text-amber-600 text-xs font-bold">Select →</span>
                )}
              </div>
              {/* Line 2: prereq check + short benefit */}
              <div className="flex items-baseline gap-2 mt-0.5 text-[11px]">
                {prereqStr && (
                  <span className={prereqsMet ? 'text-green-700 shrink-0' : 'text-red-600 shrink-0'}>
                    {prereqsMet ? '✓' : '✗'} {prereqStr}
                  </span>
                )}
                <span className="text-gray-600 truncate">{shortBenefit}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ────────────────────────────────────────────────────────────
  // Slot row
  // ────────────────────────────────────────────────────────────
  const renderSlotRow = (slot: FeatSlot) => {
    const feat = slot.featId ? getFeatById(slot.featId) : null
    const isActive = activeSlot?.index === slot.index && activeSlot?.kind === slot.kind

    // ── Empty + inactive: 40px single-line button ─────────────
    if (!feat && !isActive) {
      return (
        <button
          key={`${slot.kind}-${slot.index}`}
          type="button"
          onClick={() => setActiveSlot({ index: slot.index, kind: slot.kind })}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md border border-dashed text-sm transition-colors ${
            slot.kind === 'fighter'
              ? 'border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400'
              : 'border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-500'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="font-semibold">+</span>
            <span>Choose {slot.label}</span>
            {slot.kind === 'fighter' && (
              <span className="text-[10px] text-red-500 italic">(combat feat only)</span>
            )}
          </span>
          <span className="text-gray-400">›</span>
        </button>
      )
    }

    // ── Filled or active: full row ────────────────────────────
    return (
      <div
        key={`${slot.kind}-${slot.index}`}
        className={`rounded-lg border-2 transition-colors ${
          isActive
            ? 'border-amber-500 bg-amber-50'
            : slot.kind === 'fighter'
            ? 'border-red-200 bg-red-50/20'
            : 'border-gray-200 bg-white'
        }`}
      >
        <div className="flex items-start gap-3 p-3">
          {/* Slot label */}
          <div className="shrink-0 text-right" style={{ minWidth: '6rem' }}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {slot.label}
            </div>
            {slot.kind === 'fighter' && (
              <div className="text-[10px] text-red-500">Combat only</div>
            )}
          </div>

          {/* Feat content or active placeholder */}
          {feat ? (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{feat.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[feat.type]}`}>
                  {feat.type}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{feat.benefit}</p>
              {feat.skillBonuses && feat.skillBonuses.length > 0 && (
                <div className="flex gap-2 mt-1 flex-wrap">
                  {feat.skillBonuses.map(sb => (
                    <span key={sb.skill} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                      +{sb.bonus} {sb.skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 text-sm text-amber-700 italic">
              Browse and select a feat below…
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-1.5 shrink-0">
            {feat && (
              <button
                type="button"
                onClick={() => clearSlot(slot)}
                className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-500 hover:bg-gray-100"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveSlot(
                isActive ? null : { index: slot.index, kind: slot.kind }
              )}
              className={`text-xs px-3 py-1 rounded border font-medium transition-colors ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'border-amber-400 text-amber-700 hover:bg-amber-50'
              }`}
            >
              {isActive ? 'Close' : feat ? 'Change' : 'Browse'}
            </button>
          </div>
        </div>

        {/* Inline browser when this slot is active */}
        {isActive && <div className="px-3 pb-3">{renderBrowser()}</div>}
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Header with counts and info row */}
      <div className="bg-white rounded-lg border-2 border-amber-500 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-amber-800">Select Feats</h2>
            <p className="text-sm text-gray-600 mt-1">
              You have <strong>{generalSlotCount}</strong> general feat slot{generalSlotCount !== 1 ? 's' : ''}
              {' '}(one every 3 levels starting at level 1)
              {isHuman && <span className="text-blue-700"> · +1 Human bonus included</span>}
              {isFighter && (
                <span className="text-red-700"> · +{fighterSlotCount} Fighter bonus</span>
              )}
              .
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-3xl font-bold ${filledCount === totalSlots ? 'text-green-700' : 'text-amber-700'}`}>
              {filledCount}/{totalSlots}
            </div>
            <div className="text-xs text-gray-500">slots filled</div>
          </div>
        </div>
      </div>

      {/* General Feats section */}
      {generalSlots.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-parchment-600">
              General Feats
            </h3>
            <span className="text-xs text-gray-500">{genFilled}/{generalSlots.length} filled</span>
          </div>
          <div className="space-y-2">
            {generalSlots.map(renderSlotRow)}
          </div>
        </div>
      )}

      {/* Fighter Bonus Feats section */}
      {fighterSlots.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-red-700">
              Fighter Bonus Feats
            </h3>
            <span className="text-xs text-gray-500">{ftrFilled}/{fighterSlots.length} filled</span>
          </div>
          <div className="space-y-2">
            {fighterSlots.map(renderSlotRow)}
          </div>
        </div>
      )}

      {/* Save footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 text-sm text-gray-500">
            {filledCount === totalSlots
              ? '✓ All feat slots filled'
              : `${totalSlots - filledCount} slot${totalSlots - filledCount !== 1 ? 's' : ''} unfilled — you can fill them later`}
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            Save Feats & Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
