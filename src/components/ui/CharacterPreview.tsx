import { User, Crown, Briefcase, Heart, Sword, Gift, BookOpen, Shield, Globe, Package, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'
import { Separator } from './Separator'
import type { Character, DnDAlignmentCode } from '../../types/character'
import { getFeatById } from '../../data/dndFeats'

export interface CharacterPreviewProps {
  character: Partial<Character>
  compact?: boolean
  showEmptyFields?: boolean
}

const ALIGNMENT_LABEL: Record<DnDAlignmentCode, string> = {
  LG: 'Lawful Good',
  NG: 'Neutral Good',
  CG: 'Chaotic Good',
  LN: 'Lawful Neutral',
  TN: 'True Neutral',
  CN: 'Chaotic Neutral',
  LE: 'Lawful Evil',
  NE: 'Neutral Evil',
  CE: 'Chaotic Evil',
}

function abilMod(score: number | undefined): number {
  if (score == null) return 0
  return Math.floor((score - 10) / 2)
}

function fmtMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`
}

export function CharacterPreview({
  character,
  compact = false,
  showEmptyFields = false,
}: CharacterPreviewProps) {
  const getPersonalityTraitBadges = () => {
    if (!character.personalityTraits) return []

    type TraitWithCategory = { name: string; category: 'lightside' | 'neutral' | 'darkside' | 'exotic' }
    const traits: TraitWithCategory[] = []

    character.personalityTraits.lightside?.forEach(trait =>
      traits.push({ ...trait, category: 'lightside' as const })
    )
    character.personalityTraits.neutral?.forEach(trait =>
      traits.push({ ...trait, category: 'neutral' as const })
    )
    character.personalityTraits.darkside?.forEach(trait =>
      traits.push({ ...trait, category: 'darkside' as const })
    )
    character.personalityTraits.exotic?.forEach(trait =>
      traits.push({ ...trait, category: 'exotic' as const })
    )

    return traits.slice(0, compact ? 3 : 6)
  }

  const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode, hasData: boolean) => {
    if (!hasData && !showEmptyFields) return null

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {icon}
          <h4 className="font-medium text-amber-900 text-sm">{title}</h4>
        </div>
        {hasData ? content : (
          <p className="text-xs text-amber-500 italic">Not yet determined</p>
        )}
      </div>
    )
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  const raceName = character.dndRace?.name ?? character.race?.name
  const raceKind = character.dndRace?.size ?? character.race?.type

  const alignmentLabel = character.dndAlignment
    ? ALIGNMENT_LABEL[character.dndAlignment]
    : character.alignment
    ? `${character.alignment.primary} - ${character.alignment.attitude}`
    : null

  const cls = character.characterClass
  const level = character.level ?? 1

  const abilities: Array<[string, number | undefined]> = [
    ['STR', character.strength],
    ['DEX', character.dexterity],
    ['CON', character.constitution],
    ['INT', character.intelligence],
    ['WIS', character.wisdom],
    ['CHA', character.charisma],
  ]
  const hasAbilityScores = abilities.some(([, v]) => v != null)

  const cs = character.combatStats
  const hasCombat = !!cs || character.hpMax != null

  // Feats
  const selectedFeats = character.selectedFeats ?? []
  const fighterBonusFeats = character.fighterBonusFeats ?? []
  const allFeatIds = [...selectedFeats, ...fighterBonusFeats]

  // Languages (merge automatic + user-picked bonus)
  const autoLangs = character.dndRace?.automaticLanguages ?? []
  const bonusLangs = character.bonusLanguages ?? []
  const allLanguages = [...new Set([...autoLangs, ...bonusLangs])]

  // Equipment teaser
  const equippedWeapons = character.equippedWeapons
  const equippedArmor = character.equippedArmor
  const currency = character.currency
  const weaponsCount = equippedWeapons?.length ?? 0
  const hasArmor = !!(equippedArmor?.armorId && equippedArmor.armorId !== 'none')
  const totalGp = currency
    ? (currency.pp ?? 0) * 10 + (currency.gp ?? 0) + (currency.sp ?? 0) / 10 + (currency.cp ?? 0) / 100
    : 0
  const hasEquipment = weaponsCount > 0 || hasArmor || totalGp > 0

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-amber-600 shrink-0" />
          <span className="truncate">{character.name || 'Unnamed Character'}</span>
        </CardTitle>
        {(cls || character.dndAlignment || alignmentLabel || raceName) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {raceName && (
              <Badge variant="lightside" className="text-[10px]">{raceName}</Badge>
            )}
            {cls && (
              <Badge variant="info" className="text-[10px]">
                {cls.name} {level}
              </Badge>
            )}
            {alignmentLabel && (
              <Badge variant="magical" className="text-[10px]">{alignmentLabel}</Badge>
            )}
            {character.age != null && (
              <Badge variant="outline" className="text-[10px]">Age {character.age}</Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* ── Combat stats ─────────────────────────────────────────────── */}
        {(hasCombat || hasAbilityScores) && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-amber-600" />
              <h4 className="font-medium text-amber-900 text-sm">Combat</h4>
            </div>

            {hasCombat && (
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="rounded bg-parchment-100 p-1.5">
                  <div className="text-[9px] uppercase text-amber-700 tracking-wide">AC</div>
                  <div className="font-bold text-sm text-amber-900">{cs?.ac ?? '—'}</div>
                </div>
                <div className="rounded bg-parchment-100 p-1.5">
                  <div className="text-[9px] uppercase text-amber-700 tracking-wide">HP</div>
                  <div className="font-bold text-sm text-amber-900">{character.hpMax ?? character.hpCurrent ?? '—'}</div>
                </div>
                <div className="rounded bg-parchment-100 p-1.5">
                  <div className="text-[9px] uppercase text-amber-700 tracking-wide">Init</div>
                  <div className="font-bold text-sm text-amber-900">
                    {cs?.initiative != null ? fmtMod(cs.initiative) : '—'}
                  </div>
                </div>
              </div>
            )}

            {hasCombat && cs && (
              <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                <div className="rounded bg-amber-50 px-1 py-0.5">
                  <span className="text-amber-700">BAB </span>
                  <span className="font-semibold">{fmtMod(cs.bab?.[0] ?? 0)}</span>
                </div>
                <div className="rounded bg-amber-50 px-1 py-0.5">
                  <span className="text-amber-700">Fort </span>
                  <span className="font-semibold">{fmtMod(cs.fortitude)}</span>
                </div>
                <div className="rounded bg-amber-50 px-1 py-0.5">
                  <span className="text-amber-700">Ref </span>
                  <span className="font-semibold">{fmtMod(cs.reflex)}</span>
                </div>
                <div className="rounded bg-amber-50 px-1 py-0.5">
                  <span className="text-amber-700">Will </span>
                  <span className="font-semibold">{fmtMod(cs.will)}</span>
                </div>
              </div>
            )}

            {hasAbilityScores && (
              <div className="grid grid-cols-6 gap-1 text-center">
                {abilities.map(([label, score]) => (
                  <div key={label} className="rounded bg-parchment-100 p-1">
                    <div className="text-[9px] uppercase text-amber-700">{label}</div>
                    <div className="font-bold text-xs text-amber-900">{score ?? '—'}</div>
                    <div className="text-[9px] text-amber-600">{score != null ? fmtMod(abilMod(score)) : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(hasCombat || hasAbilityScores) && !compact && <Separator />}

        {/* ── Heritage ───────────────────────────────────────────────── */}
        {renderSection(
          'Heritage',
          <Crown className="h-4 w-4 text-amber-600" />,
          <div className="space-y-1">
            {raceName && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="lightside">{raceName}</Badge>
                {raceKind && <span className="text-xs text-amber-700">({raceKind})</span>}
              </div>
            )}
            {character.culture && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="info">{character.culture.name}</Badge>
                <span className="text-xs text-amber-700">({character.culture.type})</span>
              </div>
            )}
            {character.socialStatus && (
              <Badge variant="warning">{character.socialStatus.level}</Badge>
            )}
          </div>,
          !!(raceName || character.culture || character.socialStatus)
        )}

        {!compact && <Separator />}

        {/* ── Appearance ─────────────────────────────────────────────── */}
        {renderSection(
          'Appearance',
          <Eye className="h-4 w-4 text-amber-600" />,
          <div className="space-y-0.5 text-xs text-amber-800">
            {(character.appearance?.height || character.appearance?.weight) && (
              <div>
                {character.appearance.height && <span>{character.appearance.height}</span>}
                {character.appearance.height && character.appearance.weight && <span> · </span>}
                {character.appearance.weight && <span>{character.appearance.weight}</span>}
              </div>
            )}
            {(character.appearance?.hair || character.appearance?.eyes || character.appearance?.skin) && (
              <div className="flex flex-wrap gap-1">
                {character.appearance.hair && (
                  <Badge variant="outline" className="text-[10px]">Hair: {character.appearance.hair}</Badge>
                )}
                {character.appearance.eyes && (
                  <Badge variant="outline" className="text-[10px]">Eyes: {character.appearance.eyes}</Badge>
                )}
                {character.appearance.skin && (
                  <Badge variant="outline" className="text-[10px]">Skin: {character.appearance.skin}</Badge>
                )}
              </div>
            )}
            {character.appearance?.description && !compact && (
              <p className="italic text-amber-700 mt-1 line-clamp-3">{character.appearance.description}</p>
            )}
          </div>,
          !!(
            character.appearance?.height ||
            character.appearance?.weight ||
            character.appearance?.hair ||
            character.appearance?.eyes ||
            character.appearance?.skin ||
            character.appearance?.description
          )
        )}

        {!compact && <Separator />}

        {/* ── Occupations ────────────────────────────────────────────── */}
        {renderSection(
          'Occupations',
          <Briefcase className="h-4 w-4 text-amber-600" />,
          <div className="flex flex-wrap gap-1">
            {character.occupations?.slice(0, compact ? 2 : 4).map((occupation, index) => (
              <Badge key={index} variant="secondary" className="text-[10px]">
                {occupation.name} (Rank {occupation.rank})
              </Badge>
            ))}
            {(character.occupations?.length || 0) > (compact ? 2 : 4) && (
              <Badge variant="outline" className="text-[10px]">
                +{(character.occupations?.length || 0) - (compact ? 2 : 4)} more
              </Badge>
            )}
          </div>,
          !!(character.occupations && character.occupations.length > 0)
        )}

        {!compact && <Separator />}

        {/* ── Personality ────────────────────────────────────────────── */}
        {renderSection(
          'Personality',
          <Heart className="h-4 w-4 text-amber-600" />,
          <div className="flex flex-wrap gap-1">
            {getPersonalityTraitBadges().map((trait, index) => (
              <Badge key={index} variant={trait.category} className="text-[10px]">
                {trait.name}
              </Badge>
            ))}
          </div>,
          getPersonalityTraitBadges().length > 0
        )}

        {!compact && <Separator />}

        {/* ── Skills (top-ranked) ────────────────────────────────────── */}
        {renderSection(
          'Skills',
          <BookOpen className="h-4 w-4 text-amber-600" />,
          <div className="space-y-0.5">
            {character.skills?.slice(0, compact ? 3 : 6).map((skill, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-amber-900 truncate">{skill.name}</span>
                <Badge variant="outline" className="text-[10px] shrink-0 ml-1">
                  Rank {skill.rank}
                </Badge>
              </div>
            ))}
            {(character.skills?.length || 0) > (compact ? 3 : 6) && (
              <div className="text-xs text-amber-600">
                +{(character.skills?.length || 0) - (compact ? 3 : 6)} more
              </div>
            )}
          </div>,
          !!(character.skills && character.skills.length > 0)
        )}

        {!compact && allFeatIds.length > 0 && <Separator />}

        {/* ── Feats ──────────────────────────────────────────────────── */}
        {renderSection(
          'Feats',
          <Sword className="h-4 w-4 text-amber-600" />,
          <div className="flex flex-wrap gap-1">
            {allFeatIds.slice(0, compact ? 4 : 10).map((id, index) => {
              const feat = getFeatById(id)
              if (!feat) return null
              return (
                <Badge key={`${id}-${index}`} variant="secondary" className="text-[10px]">
                  {feat.name}
                </Badge>
              )
            })}
            {allFeatIds.length > (compact ? 4 : 10) && (
              <Badge variant="outline" className="text-[10px]">
                +{allFeatIds.length - (compact ? 4 : 10)} more
              </Badge>
            )}
          </div>,
          allFeatIds.length > 0
        )}

        {!compact && allLanguages.length > 0 && <Separator />}

        {/* ── Languages ──────────────────────────────────────────────── */}
        {renderSection(
          'Languages',
          <Globe className="h-4 w-4 text-amber-600" />,
          <div className="flex flex-wrap gap-1">
            {allLanguages.map((lang, index) => (
              <Badge key={`${lang}-${index}`} variant="outline" className="text-[10px]">
                {lang}
              </Badge>
            ))}
          </div>,
          allLanguages.length > 0
        )}

        {!compact && hasEquipment && <Separator />}

        {/* ── Equipment teaser ───────────────────────────────────────── */}
        {hasEquipment && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-amber-600" />
              <h4 className="font-medium text-amber-900 text-sm">Equipment</h4>
            </div>
            <div className="text-xs text-amber-700">
              {weaponsCount > 0 && <span>{weaponsCount} weapon{weaponsCount !== 1 ? 's' : ''}</span>}
              {weaponsCount > 0 && (hasArmor || totalGp > 0) && <span> · </span>}
              {hasArmor && <span>armored</span>}
              {hasArmor && totalGp > 0 && <span> · </span>}
              {totalGp > 0 && <span>{Math.floor(totalGp)} gp</span>}
            </div>
          </div>
        )}

        {!compact && <Separator />}

        {/* ── Special Items ──────────────────────────────────────────── */}
        {renderSection(
          'Special Items',
          <Gift className="h-4 w-4 text-amber-600" />,
          <div className="flex flex-wrap gap-1">
            {character.gifts?.map((gift, index) => (
              <Badge key={`gift-${index}`} variant="magical" className="text-[10px]">
                {gift.name}
              </Badge>
            ))}
            {character.legacies?.map((legacy, index) => (
              <Badge key={`legacy-${index}`} variant="exotic" className="text-[10px]">
                {legacy.name}
              </Badge>
            ))}
            {character.specialItems?.map((item, index) => (
              <Badge key={`special-${index}`} variant="warning" className="text-[10px]">
                {item.name}
              </Badge>
            ))}
          </div>,
          !!(
            (character.gifts && character.gifts.length > 0) ||
            (character.legacies && character.legacies.length > 0) ||
            (character.specialItems && character.specialItems.length > 0)
          )
        )}

        {/* ── Relationships ──────────────────────────────────────────── */}
        {!compact && renderSection(
          'Relationships',
          <User className="h-4 w-4 text-amber-600" />,
          <div className="text-xs text-amber-700">
            {character.npcs?.length || 0} NPCs · {character.companions?.length || 0} Companions · {character.rivals?.length || 0} Rivals
          </div>,
          !!(
            (character.npcs && character.npcs.length > 0) ||
            (character.companions && character.companions.length > 0) ||
            (character.rivals && character.rivals.length > 0)
          )
        )}

        {/* ── Generation Progress ────────────────────────────────────── */}
        {character.generationHistory && character.generationHistory.length > 0 && (
          <div className="pt-2 border-t border-amber-200">
            <div className="text-[10px] text-amber-600">
              Generation Progress: {character.generationHistory.length} steps completed
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
