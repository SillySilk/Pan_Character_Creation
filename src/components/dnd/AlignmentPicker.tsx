// D&D 3.5 Alignment Picker — 9-cell grid
// Class alignment restrictions verified against C:\AI\D&D\02-classes.md

import type { DnDAlignmentCode } from '@/types/character'

interface AlignmentDef {
  code: DnDAlignmentCode
  label: string
  short: string
  description: string
}

const ALIGNMENTS: AlignmentDef[] = [
  { code: 'LG', label: 'Lawful Good',     short: 'LG', description: 'Honorable, compassionate, upholds justice' },
  { code: 'NG', label: 'Neutral Good',    short: 'NG', description: 'Does good without bias toward law or chaos' },
  { code: 'CG', label: 'Chaotic Good',    short: 'CG', description: 'Acts as conscience dictates, dislikes rules' },
  { code: 'LN', label: 'Lawful Neutral',  short: 'LN', description: 'Acts in accordance with law without moral judgment' },
  { code: 'TN', label: 'True Neutral',    short: 'N',  description: 'Avoids taking moral or ethical stands' },
  { code: 'CN', label: 'Chaotic Neutral', short: 'CN', description: 'Follows whims, avoids conformity and expectations' },
  { code: 'LE', label: 'Lawful Evil',     short: 'LE', description: 'Uses law and order as tools for self-interest' },
  { code: 'NE', label: 'Neutral Evil',    short: 'NE', description: 'Does whatever they can get away with' },
  { code: 'CE', label: 'Chaotic Evil',    short: 'CE', description: 'Acts with violence and malice, hates order' },
]

/** Class alignment restrictions from SRD */
const CLASS_RESTRICTIONS: Record<string, (code: DnDAlignmentCode) => boolean> = {
  Paladin: (c) => c === 'LG',
  Monk:    (c) => c === 'LG' || c === 'LN' || c === 'LE', // must be lawful
  Bard:    (c) => c !== 'LG' && c !== 'LN' && c !== 'LE', // must not be lawful
  Druid:   (c) => c === 'LN' || c === 'TN' || c === 'CN' || c === 'NG' || c === 'NE', // must have neutral
  Barbarian: (c) => c !== 'LG' && c !== 'LN' && c !== 'LE', // must not be lawful
}

function isAllowedForClass(code: DnDAlignmentCode, className?: string): boolean {
  if (!className) return true
  const check = CLASS_RESTRICTIONS[className]
  return check ? check(code) : true
}

interface AlignmentPickerProps {
  value?: DnDAlignmentCode
  onChange: (alignment: DnDAlignmentCode) => void
  className?: string
  /** Highlight restrictions for this class */
  forClass?: string
}

export function AlignmentPicker({ value, onChange, className = '', forClass }: AlignmentPickerProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-2">
        {ALIGNMENTS.map((al) => {
          const allowed = isAllowedForClass(al.code, forClass)
          const selected = value === al.code
          return (
            <button
              key={al.code}
              type="button"
              disabled={!allowed}
              onClick={() => allowed && onChange(al.code)}
              title={allowed ? al.description : `Not allowed for ${forClass}`}
              className={[
                'relative flex flex-col items-center justify-center p-3 rounded-lg border-2 text-center transition-all',
                selected
                  ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400'
                  : allowed
                  ? 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/40 cursor-pointer'
                  : 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed',
              ].join(' ')}
            >
              <span className={`text-lg font-bold ${selected ? 'text-amber-700' : allowed ? 'text-gray-800' : 'text-gray-400'}`}>
                {al.short}
              </span>
              <span className={`text-xs mt-0.5 leading-tight ${selected ? 'text-amber-600' : 'text-gray-500'}`}>
                {al.label}
              </span>
              {!allowed && (
                <span className="absolute top-1 right-1 text-red-400 text-xs font-bold">✕</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Axis labels */}
      <div className="mt-2 flex justify-between text-xs text-gray-400 px-1">
        <span>Lawful</span>
        <span>Neutral</span>
        <span>Chaotic</span>
      </div>

      {/* Selected description */}
      {value && (
        <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
          <strong>{ALIGNMENTS.find(a => a.code === value)?.label}:</strong>{' '}
          {ALIGNMENTS.find(a => a.code === value)?.description}
        </p>
      )}

      {/* Class restriction notice */}
      {forClass && CLASS_RESTRICTIONS[forClass] && (
        <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          {forClass} alignment restrictions are highlighted. Grayed cells are not permitted.
        </p>
      )}
    </div>
  )
}

export type { DnDAlignmentCode }
