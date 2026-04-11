// Occupations & Skills Tables (300s) with Balanced Modifiers for PanCasting
// Converted from original Central Casting system to include realistic career tradeoffs

import type { OccupationTable } from '../../types/tables'

// Table 309: Balanced Apprenticeships
export const balancedApprenticeshipsTable: OccupationTable = {
  id: '309_balanced',
  name: 'Balanced Apprenticeships',
  category: 'occupations',
  diceType: 'd100',
  occupationType: 'craft',
  instructions: 'Roll d100 to determine apprenticeship with realistic career tradeoffs',
  entries: [
    {
      id: '309_balanced_01',
      rollRange: [1, 12],
      result: 'Blacksmith Apprentice',
      description: 'Intensive metalworking training builds strength but limits intellectual development',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'ability',
              target: 'Strength',
              value: 1,
              description: 'Heavy hammer work builds muscle',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Craft (Weaponsmithing)',
              value: 5,
              description: 'Master-level weapon crafting',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Craft (Armorsmithing)',
              value: 4,
              description: 'Extensive metalwork experience',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Appraise (Metals)',
              value: 3,
              description: 'Understanding of metal quality and value',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'ability',
              target: 'Dexterity',
              value: -1,
              description: 'Heavy work stiffens joints',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Knowledge (any non-craft)',
              value: -3,
              description: 'No time for formal education',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -2,
              description: 'Rough manners and soot-stained appearance',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Crude Speech',
              value: 'Minor',
              description: 'Coarse language from workshop environment',
              category: 'social'
            }
          ],
          tradeoffReason: 'Intensive physical craft training creates exceptional skill and strength but limits education and social refinement'
        }
      ]
    },

    {
      id: '309_balanced_02',
      rollRange: [13, 24],
      result: 'Scholar\'s Assistant',
      description: 'Academic apprenticeship builds knowledge but weakens practical skills',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'ability',
              target: 'Intelligence',
              value: 1,
              description: 'Constant study sharpens mind',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Knowledge (any two)',
              value: 4,
              description: 'Specialized academic training',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Research',
              value: 5,
              description: 'Master library and documentation skills',
              category: 'intellectual'
            },
            {
              type: 'special',
              target: 'languages',
              value: 3,
              description: 'Learned ancient and foreign languages',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'ability',
              target: 'Constitution',
              value: -1,
              description: 'Sedentary lifestyle weakens constitution',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Athletics',
              value: -4,
              description: 'No physical activity during apprenticeship',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Survival',
              value: -3,
              description: 'No practical outdoor experience',
              category: 'physical'
            },
            {
              type: 'social',
              target: 'common_people',
              value: -2,
              description: 'Difficulty relating to non-academics',
              category: 'social'
            }
          ],
          tradeoffReason: 'Academic specialization creates intellectual excellence but physical weakness and social disconnect from common folk'
        }
      ]
    },

    {
      id: '309_balanced_03',
      rollRange: [25, 36],
      result: 'Merchant\'s Apprentice',
      description: 'Trade experience builds social skills but creates materialistic focus',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 4,
              description: 'Customer service and negotiation',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Appraise',
              value: 5,
              description: 'Expert evaluation of goods and materials',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 3,
              description: 'Reading customers and detecting deception',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Knowledge (Geography)',
              value: 2,
              description: 'Trade routes and market knowledge',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Materialistic',
              value: 'Minor',
              description: 'Judges worth primarily in monetary terms',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Craft (any)',
              value: -2,
              description: 'Focused on selling rather than making',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Manipulative',
              value: 'Minor',
              description: 'Learned to bend truth for profit',
              category: 'psychological'
            },
            {
              type: 'social',
              target: 'honor_based_cultures',
              value: -1,
              description: 'Seen as untrustworthy by warrior cultures',
              category: 'social'
            }
          ],
          tradeoffReason: 'Merchant training develops excellent social and evaluation skills but creates materialistic worldview and reputation issues'
        }
      ]
    },

    {
      id: '309_balanced_04',
      rollRange: [37, 48],
      result: 'Temple Acolyte',
      description: 'Religious training provides wisdom and spiritual power but creates narrow worldview',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'ability',
              target: 'Wisdom',
              value: 1,
              description: 'Meditation and spiritual practice',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Knowledge (Religion)',
              value: 5,
              description: 'Extensive theological training',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Heal',
              value: 4,
              description: 'Caring for sick and injured',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 2,
              description: 'Counseling and mediation skills',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Dogmatic',
              value: 'Minor',
              description: 'Rigid adherence to religious doctrine',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Knowledge (Arcana)',
              value: -3,
              description: 'Forbidden from studying magic',
              category: 'intellectual'
            },
            {
              type: 'social',
              target: 'secular_authority',
              value: -1,
              description: 'Tension between religious and civil law',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Intolerance',
              value: 'Minor',
              description: 'Judgmental toward different beliefs',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Religious training provides spiritual wisdom and healing skills but creates dogmatic thinking and intolerance'
        }
      ]
    },

    {
      id: '309_balanced_05',
      rollRange: [49, 60],
      result: 'Soldier\'s Training',
      description: 'Military discipline builds combat skills but creates violent solutions mindset',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'skill',
              target: 'Combat (any weapon)',
              value: 5,
              description: 'Intensive weapons training',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Athletics',
              value: 3,
              description: 'Physical conditioning and drill',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Discipline',
              value: 'Strong',
              description: 'Military structure and obedience',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Intimidate',
              value: 4,
              description: 'Commanding presence and authority',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Violence as Solution',
              value: 'Minor',
              description: 'Defaults to force when problems arise',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -3,
              description: 'Trained for conflict, not negotiation',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Authoritarian',
              value: 'Minor',
              description: 'Expects hierarchy and chain of command',
              category: 'psychological'
            },
            {
              type: 'social',
              target: 'peaceful_situations',
              value: -2,
              description: 'Uncomfortable without clear conflict',
              category: 'social'
            }
          ],
          tradeoffReason: 'Military training creates combat excellence and discipline but instills violent solutions and difficulty with peaceful resolution'
        }
      ]
    },

    {
      id: '309_balanced_06',
      rollRange: [61, 72],
      result: 'Street Thief Training',
      description: 'Criminal apprenticeship builds survival skills but creates legal and trust issues',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'skill',
              target: 'Stealth',
              value: 5,
              description: 'Master of moving unseen',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Sleight of Hand',
              value: 4,
              description: 'Pickpocketing and lockpicking expertise',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Survival (Urban)',
              value: 4,
              description: 'Living on the streets and scrounging',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Gather Information',
              value: 3,
              description: 'Street networks and underground contacts',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'social',
              target: 'law_enforcement',
              value: -4,
              description: 'Known criminal with arrest record',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Untrustworthy Reputation',
              value: 'Minor',
              description: 'People assume criminal intent',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Knowledge (any formal)',
              value: -3,
              description: 'No access to legitimate education',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Paranoid',
              value: 'Minor',
              description: 'Assumes others are trying to cheat them',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Criminal training provides excellent survival and stealth skills but creates legal problems and trust issues'
        }
      ]
    },

    {
      id: '309_balanced_07',
      rollRange: [73, 84],
      result: 'Noble Page Training',
      description: 'Court service teaches etiquette and politics but creates class elitism',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'skill',
              target: 'Etiquette',
              value: 5,
              description: 'Master of court manners and protocol',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Knowledge (Nobility)',
              value: 4,
              description: 'Understanding of political hierarchies',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 3,
              description: 'Formal negotiation and persuasion',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Perform (Dance)',
              value: 2,
              description: 'Courtly entertainment skills',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Class Prejudice',
              value: 'Minor',
              description: 'Looks down on common people',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Survival',
              value: -4,
              description: 'Helpless outside civilized settings',
              category: 'physical'
            },
            {
              type: 'social',
              target: 'common_folk',
              value: -3,
              description: 'Cannot relate to everyday struggles',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Dependent on Luxury',
              value: 'Minor',
              description: 'Cannot function without servants and comfort',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Noble court training provides excellent social graces but creates class elitism and practical helplessness'
        }
      ]
    },

    {
      id: '309_balanced_08',
      rollRange: [85, 96],
      result: 'Wilderness Guide Training',
      description: 'Nature skills and survival expertise but isolation from civilization',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'skill',
              target: 'Survival',
              value: 6,
              description: 'Expert wilderness navigation and living',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Knowledge (Nature)',
              value: 4,
              description: 'Understanding of plants, animals, weather',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Track',
              value: 4,
              description: 'Following trails and reading signs',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Handle Animal',
              value: 3,
              description: 'Working with pack animals and mounts',
              category: 'physical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Etiquette',
              value: -3,
              description: 'Unfamiliar with civilized manners',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Knowledge (Local)',
              value: -2,
              description: 'Out of touch with town news and politics',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Social Awkwardness',
              value: 'Minor',
              description: 'More comfortable with animals than people',
              category: 'social'
            },
            {
              type: 'social',
              target: 'urban_environments',
              value: -2,
              description: 'Uncomfortable and suspicious in cities',
              category: 'social'
            }
          ],
          tradeoffReason: 'Wilderness expertise provides exceptional survival skills but creates social isolation and urban discomfort'
        }
      ]
    },

    {
      id: '309_balanced_09',
      rollRange: [97, 100],
      result: 'Exotic Specialist Training',
      description: 'Unique skill specialization provides rare abilities but social stigma',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          positiveEffects: [
            {
              type: 'skill',
              target: 'Exotic Skill (chosen)',
              value: 6,
              description: 'Unmatched expertise in rare field',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Unique Knowledge',
              value: 'Strong',
              description: 'Possesses information few others have',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Research (specialty)',
              value: 3,
              description: 'Deep investigation in chosen field',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'social',
              target: 'general_society',
              value: -3,
              description: 'Seen as strange or unsettling',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Obsessive',
              value: 'Minor',
              description: 'Consumed by specialized interest',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Common Skills',
              value: -2,
              description: 'Neglected normal practical abilities',
              category: 'intellectual'
            }
          ],
          tradeoffReason: 'Exotic specialization provides unique valuable skills but creates social isolation and obsessive behavior'
        }
      ]
    }
  ]
}

// Export for use in main tables index
export const balancedOccupationTables = {
  balancedApprenticeshipsTable
}