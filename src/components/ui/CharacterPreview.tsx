import { User, Crown, Briefcase, Heart, Sword, Gift } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'
import { Separator } from './Separator'
import type { Character } from '../../types/character'

export interface CharacterPreviewProps {
  character: Partial<Character>
  compact?: boolean
  showEmptyFields?: boolean
}

export function CharacterPreview({ 
  character, 
  compact = false, 
  showEmptyFields = false 
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
          <h4 className="font-medium text-amber-900">{title}</h4>
        </div>
        {hasData ? content : (
          <p className="text-sm text-amber-500 italic">Not yet determined</p>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-amber-600" />
          <span>{character.name || 'Unnamed Character'}</span>
          {character.age && (
            <Badge variant="outline">Age {character.age}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Information */}
        {renderSection(
          'Heritage',
          <Crown className="h-4 w-4 text-amber-600" />,
          <div className="space-y-1">
            {character.race && (
              <div className="flex items-center space-x-2">
                <Badge variant="lightside">{character.race.name}</Badge>
                <span className="text-sm text-amber-700">({character.race.type})</span>
              </div>
            )}
            {character.culture && (
              <div className="flex items-center space-x-2">
                <Badge variant="info">{character.culture.name}</Badge>
                <span className="text-sm text-amber-700">({character.culture.type})</span>
              </div>
            )}
            {character.socialStatus && (
              <Badge variant="warning">{character.socialStatus.level}</Badge>
            )}
          </div>,
          !!(character.race || character.culture || character.socialStatus)
        )}

        {!compact && <Separator />}

        {/* Occupations */}
        {renderSection(
          'Occupations',
          <Briefcase className="h-4 w-4 text-amber-600" />,
          <div className="flex flex-wrap gap-1">
            {character.occupations?.slice(0, compact ? 2 : 4).map((occupation, index) => (
              <Badge key={index} variant="secondary">
                {occupation.name} (Rank {occupation.rank})
              </Badge>
            ))}
            {(character.occupations?.length || 0) > (compact ? 2 : 4) && (
              <Badge variant="outline">
                +{(character.occupations?.length || 0) - (compact ? 2 : 4)} more
              </Badge>
            )}
          </div>,
          !!(character.occupations && character.occupations.length > 0)
        )}

        {!compact && <Separator />}

        {/* Personality Traits */}
        {renderSection(
          'Personality',
          <Heart className="h-4 w-4 text-amber-600" />,
          <div className="space-y-2">
            {character.alignment && (
              <div>
                <Badge variant="magical">{character.alignment.primary} - {character.alignment.attitude}</Badge>
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {getPersonalityTraitBadges().map((trait, index) => (
                <Badge key={index} variant={trait.category}>
                  {trait.name}
                </Badge>
              ))}
            </div>
          </div>,
          !!(character.alignment || getPersonalityTraitBadges().length > 0)
        )}

        {!compact && <Separator />}

        {/* Skills */}
        {renderSection(
          'Skills',
          <Sword className="h-4 w-4 text-amber-600" />,
          <div className="space-y-1">
            {character.skills?.slice(0, compact ? 3 : 6).map((skill, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-amber-900">{skill.name}</span>
                <Badge variant="outline" className="text-xs">
                  Rank {skill.rank}
                </Badge>
              </div>
            ))}
            {(character.skills?.length || 0) > (compact ? 3 : 6) && (
              <div className="text-sm text-amber-600">
                +{(character.skills?.length || 0) - (compact ? 3 : 6)} more skills
              </div>
            )}
          </div>,
          !!(character.skills && character.skills.length > 0)
        )}

        {!compact && <Separator />}

        {/* Special Items */}
        {renderSection(
          'Special Items',
          <Gift className="h-4 w-4 text-amber-600" />,
          <div className="space-y-1">
            {character.gifts?.map((gift, index) => (
              <Badge key={index} variant="magical" className="mr-1 mb-1">
                {gift.name}
              </Badge>
            ))}
            {character.legacies?.map((legacy, index) => (
              <Badge key={index} variant="exotic" className="mr-1 mb-1">
                {legacy.name} (Legacy)
              </Badge>
            ))}
            {character.specialItems?.map((item, index) => (
              <Badge key={index} variant="warning" className="mr-1 mb-1">
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

        {/* Relationships */}
        {!compact && renderSection(
          'Relationships',
          <User className="h-4 w-4 text-amber-600" />,
          <div className="space-y-1">
            <div className="text-sm text-amber-700">
              {character.npcs?.length || 0} NPCs, {character.companions?.length || 0} Companions, {character.rivals?.length || 0} Rivals
            </div>
          </div>,
          !!(
            (character.npcs && character.npcs.length > 0) ||
            (character.companions && character.companions.length > 0) ||
            (character.rivals && character.rivals.length > 0)
          )
        )}

        {/* Generation Progress */}
        {character.generationHistory && character.generationHistory.length > 0 && (
          <div className="pt-2 border-t border-amber-200">
            <div className="text-xs text-amber-600">
              Generation Progress: {character.generationHistory.length} steps completed
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}