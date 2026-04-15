// D&D 3.5 Languages & Spells Panel (Phase 5)
// Languages: auto-filled from race + INT bonus selections
// Spells: free-text per level for spellcasters; non-casters see "not applicable" note

import { useState, useMemo } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { DND_CORE_RACES, type DnDRace } from '../../data/dndRaces'
import { DND_CORE_CLASSES } from '../../data/dndClasses'
import { abilMod } from '../../services/combatStatsService'

interface LanguagesSpellsPanelProps {
  onComplete?: () => void
}

// Standard D&D 3.5 languages a character might select as bonus languages
const BONUS_LANGUAGE_POOL = [
  'Abyssal', 'Aquan', 'Auran', 'Celestial', 'Common', 'Draconic', 'Druidic',
  'Dwarven', 'Elven', 'Giant', 'Gnome', 'Goblin', 'Gnoll', 'Halfling',
  'Ignan', 'Infernal', 'Orc', 'Sylvan', 'Terran', 'Undercommon',
]

// Spell slots per level for full casters and partial (Bard/Paladin/Ranger)
// Indexed [level-1][spellLevel-0] for convenience
// Full caster (Cleric/Druid/Wizard/Sorcerer): 9 spell levels
// Partial caster (Bard): 6 levels; Paladin/Ranger: 4 levels

function getSpellLevels(spellcasting: string | undefined, className: string): number {
  if (spellcasting === 'Full') return 9
  if (spellcasting === 'Partial') {
    if (className === 'Bard') return 6
    if (className === 'Paladin' || className === 'Ranger') return 4
    return 6
  }
  return 0
}

export function LanguagesSpellsPanel({ onComplete }: LanguagesSpellsPanelProps) {
  const { character, updateCharacter } = useCharacterStore()

  const cls = character?.characterClass
    ? DND_CORE_CLASSES.find(c => c.name === character.characterClass!.name)
    : null

  const intMod = abilMod(character?.intelligence ?? 10)
  const bonusLanguageSlots = Math.max(0, intMod)
  const spellLevels = getSpellLevels(cls?.spellcasting, cls?.name ?? '')
  const isCaster = spellLevels > 0

  // Determine automatic languages from race
  const raceData = character?.dndRace
    ? DND_CORE_RACES.find((r: DnDRace) => r.name === character.dndRace!.name)
    : null
  const autoLanguages: string[] = raceData?.automaticLanguages ?? ['Common']
  const allowedBonus: string[] = raceData?.bonusLanguages ?? BONUS_LANGUAGE_POOL

  // Local state
  const [bonusLanguages, setBonusLanguages] = useState<string[]>(
    () => character?.bonusLanguages ?? []
  )
  const [customLanguage, setCustomLanguage] = useState('')

  // Spell notes per level: Record<spellLevel, string>
  const [spellNotes, setSpellNotes] = useState<Record<number, string>>(
    () => character?.spellNotes ?? {}
  )

  const spellSaveDC = isCaster && cls
    ? (cls.primaryAbility === 'Intelligence'
        ? 10 + abilMod(character?.intelligence ?? 10)
        : cls.primaryAbility === 'Charisma'
        ? 10 + abilMod(character?.charisma ?? 10)
        : 10 + abilMod(character?.wisdom ?? 10))
    : 0

  const arcaneSpellFailure = useMemo(() => {
    const armor = character?.equippedArmor
    if (!armor?.armorId || armor.armorId === 'none') return 0
    const { DND_ARMOR } = require('../../data/dndArmor')
    const armorData = DND_ARMOR.find((a: any) => a.id === armor.armorId)
    const shieldData = armor.shieldId
      ? DND_ARMOR.find((a: any) => a.id === armor.shieldId)
      : null
    return (armorData?.arcaneSpellFailure ?? 0) + (shieldData?.arcaneSpellFailure ?? 0)
  }, [character])

  function addBonusLanguage(lang: string) {
    if (!lang || bonusLanguages.includes(lang)) return
    if (bonusLanguages.length >= bonusLanguageSlots) return
    setBonusLanguages(prev => [...prev, lang])
    setCustomLanguage('')
  }

  function removeBonusLanguage(lang: string) {
    setBonusLanguages(prev => prev.filter(l => l !== lang))
  }

  function setSpellNote(level: number, text: string) {
    setSpellNotes(prev => ({ ...prev, [level]: text }))
  }

  function handleSave() {
    updateCharacter({
      bonusLanguages,
      spellNotes,
    })
    onComplete?.()
  }

  const allLanguages = [...new Set([...autoLanguages, ...bonusLanguages])]
  const slotsLeft = bonusLanguageSlots - bonusLanguages.length
  const spellAbilityLabel = cls?.primaryAbility === 'Intelligence' ? 'INT'
    : cls?.primaryAbility === 'Charisma' ? 'CHA' : 'WIS'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-800">Languages & Spells</h2>
      </div>

      {/* ── LANGUAGES ──────────────────────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold text-gray-700 mb-3">Languages</h3>

        {/* Automatic languages */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Automatic (from race)</p>
          <div className="flex flex-wrap gap-2">
            {autoLanguages.map(lang => (
              <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Bonus languages */}
        {bonusLanguageSlots > 0 ? (
          <div>
            <p className="text-xs text-gray-500 mb-1">
              Bonus languages from INT modifier ({slotsLeft} slot{slotsLeft !== 1 ? 's' : ''} remaining)
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {bonusLanguages.map(lang => (
                <span key={lang}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                  {lang}
                  <button onClick={() => removeBonusLanguage(lang)}
                    className="text-green-500 hover:text-green-700 text-xs ml-1">✕</button>
                </span>
              ))}
              {slotsLeft === 0 && (
                <span className="px-2 py-1 text-xs text-gray-400 italic">All bonus slots filled</span>
              )}
            </div>

            {slotsLeft > 0 && (
              <div className="flex gap-2">
                <select
                  value={customLanguage}
                  onChange={e => setCustomLanguage(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="">Select a language…</option>
                  {[...(allowedBonus[0] === 'Any (except secret languages)' ? BONUS_LANGUAGE_POOL : allowedBonus)]
                    .filter(l => !autoLanguages.includes(l) && !bonusLanguages.includes(l))
                    .map(l => <option key={l} value={l}>{l}</option>)
                  }
                </select>
                <button
                  onClick={() => addBonusLanguage(customLanguage)}
                  disabled={!customLanguage}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-40"
                >Add</button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No bonus language slots (INT modifier {intMod < 0 ? intMod : `+${intMod}`})
          </p>
        )}

        {/* Summary */}
        <div className="mt-3 bg-gray-50 rounded p-2 text-sm">
          <span className="font-medium text-gray-700">Known languages: </span>
          <span className="text-gray-600">{allLanguages.join(', ')}</span>
        </div>
      </section>

      {/* ── SPELLS ─────────────────────────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold text-gray-700 mb-3">Spellcasting</h3>

        {!isCaster ? (
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center">
            <p className="text-gray-500 text-sm">
              {cls?.name ?? 'This class'} does not cast spells.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Quick stats */}
            <div className="flex gap-4 bg-purple-50 border border-purple-200 rounded p-3 text-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-800">{spellSaveDC}</div>
                <div className="text-xs text-purple-600">Base Spell DC</div>
                <div className="text-xs text-gray-400">(10 + {spellAbilityLabel} mod)</div>
              </div>
              {(cls?.spellcasting === 'Full' || cls?.name === 'Bard') && (
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-800">{arcaneSpellFailure}%</div>
                  <div className="text-xs text-purple-600">Arcane SF</div>
                  <div className="text-xs text-gray-400">from armor</div>
                </div>
              )}
              <div className="text-center flex-1">
                <div className="text-xs text-purple-700 font-medium">Ability: {cls?.primaryAbility}</div>
                <div className="text-xs text-purple-600 mt-1">{cls?.spellcasting} caster</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800">
              <strong>Spell Selection:</strong> Choose your spells from the{' '}
              <em>Player's Handbook</em> or other sourcebooks. Note your spells per
              level below. Spell slots are calculated per the PHB tables for your class and level.
            </div>

            {/* Per-level notes */}
            <div className="space-y-2">
              {Array.from({ length: spellLevels }, (_, i) => i).map(level => (
                <div key={level} className="flex items-start gap-2">
                  <span className="text-sm font-medium text-gray-600 w-16 pt-1 shrink-0">
                    {level === 0 ? 'Cantrips' : `Level ${level}`}
                  </span>
                  <textarea
                    rows={1}
                    value={spellNotes[level] ?? ''}
                    onChange={e => setSpellNote(level, e.target.value)}
                    placeholder={`List your ${level === 0 ? 'cantrips / orisons' : `${level === 1 ? '1st' : level === 2 ? '2nd' : level === 3 ? '3rd' : `${level}th`}-level`} spells here…`}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm resize-y min-h-8"
                    style={{ minHeight: '2rem' }}
                    onInput={e => {
                      const el = e.target as HTMLTextAreaElement
                      el.style.height = 'auto'
                      el.style.height = `${el.scrollHeight}px`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Save footer */}
      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium"
        >
          Save & Continue
        </button>
      </div>
    </div>
  )
}
