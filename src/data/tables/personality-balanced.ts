// Personality & Values Tables (500s) with Balanced Modifiers for PanCasting
// Converted from original Central Casting system to include realistic tradeoffs
// Core personality traits and values that provide both strengths and weaknesses

import type { PersonalityTable } from '../../types/tables'

// Table 501: Balanced Core Values
export const balancedCoreValuesTable: PersonalityTable = {
  id: '501_balanced',
  name: 'Balanced Core Values',
  category: 'personality',
  diceType: 'd100',
  traitCategory: 'values',
  instructions: 'Roll d100 to determine core values with realistic tradeoffs',
  entries: [
    {
      id: '501_balanced_01',
      rollRange: [1, 10],
      result: 'Family Above All',
      description: 'Values family bonds and loyalty above personal advancement',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 1,
              description: 'Strong interpersonal bonds',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Loyal',
              value: 'Strong',
              description: 'Unwavering commitment to loved ones',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Protective',
              value: 'Strong',
              description: 'Fierce defender of family',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Gather Information',
              value: -1,
              description: 'Reluctant to betray family secrets',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Career Limitations',
              value: 'Minor',
              description: 'Family needs limit professional advancement',
              category: 'practical'
            }
          ],
          tradeoffReason: 'Strong family bonds provide social support but create obligations that limit personal freedom'
        }
      ]
    },
    {
      id: '501_balanced_02',
      rollRange: [11, 20],
      result: 'Love & Romance',
      description: 'Seeks meaningful romantic connection and emotional fulfillment',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'ability',
              target: 'Charisma',
              value: 1,
              description: 'Magnetic romantic presence',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 1,
              description: 'Attuned to emotional nuances',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Passionate',
              value: 'Strong',
              description: 'Deep emotional connections',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Concentration',
              value: -1,
              description: 'Distracted by romantic thoughts',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Romantic Vulnerability',
              value: 'Moderate',
              description: 'Decisions influenced by heart over head',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Romantic nature enhances charisma and empathy but creates emotional distractions'
        }
      ]
    },
    {
      id: '501_balanced_03',
      rollRange: [21, 30],
      result: 'Honor & Duty',
      description: 'Lives by strict code of honor and moral principles',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Intimidate',
              value: 1,
              description: 'Moral authority commands respect',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 1,
              description: 'Trustworthy reputation',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Code of Honor',
              value: 'Strict',
              description: 'Unwavering moral principles',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Bluff',
              value: -2,
              description: 'Cannot lie or deceive',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Inflexible Morality',
              value: 'Minor',
              description: 'Difficulty with moral gray areas',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Strong moral code provides trustworthiness and respect but limits tactical flexibility'
        }
      ]
    },
    {
      id: '501_balanced_04',
      rollRange: [31, 40],
      result: 'Knowledge & Truth',
      description: 'Pursues wisdom, understanding, and factual accuracy above all',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (any)',
              value: 2,
              description: 'Dedicated pursuit of learning',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Research',
              value: 1,
              description: 'Methodical information gathering',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Scholarly',
              value: 'Strong',
              description: 'Respected for intellectual integrity',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Perform',
              value: -1,
              description: 'Values substance over style',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Blunt Honesty',
              value: 'Minor',
              description: 'Speaks uncomfortable truths',
              category: 'social'
            }
          ],
          tradeoffReason: 'Devotion to truth builds intellectual reputation but creates social friction'
        }
      ]
    },
    {
      id: '501_balanced_05',
      rollRange: [41, 50],
      result: 'Freedom & Independence',
      description: 'Values personal autonomy and refuses to be controlled by others',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Escape Artist',
              value: 1,
              description: 'Refuses to be trapped or contained',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Survival',
              value: 1,
              description: 'Self-reliant in all situations',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Independent',
              value: 'Strong',
              description: 'Makes own decisions and path',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Resistance to authority and cooperation',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Authority Issues',
              value: 'Moderate',
              description: 'Difficulty following orders or rules',
              category: 'social'
            }
          ],
          tradeoffReason: 'Independence builds self-reliance and escape skills but hinders cooperation'
        }
      ]
    },
    {
      id: '501_balanced_06',
      rollRange: [51, 60],
      result: 'Justice & Fairness',
      description: 'Fights for what is right and protects the innocent',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 1,
              description: 'Keen sense of right and wrong',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Gather Information',
              value: 1,
              description: 'Network of grateful allies',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Champion of Justice',
              value: 'Strong',
              description: 'Respected defender of the innocent',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Hide',
              value: -1,
              description: 'Too well known as do-gooder',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Compulsive Helper',
              value: 'Minor',
              description: 'Cannot ignore injustice even when dangerous',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Dedication to justice builds reputation and allies but draws unwanted attention'
        }
      ]
    },
    {
      id: '501_balanced_07',
      rollRange: [61, 70],
      result: 'Wealth & Power',
      description: 'Seeks material success, influence, and social advancement',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Appraise',
              value: 1,
              description: 'Eye for valuable opportunities',
              category: 'practical'
            },
            {
              type: 'skill',
              target: 'Intimidate',
              value: 1,
              description: 'Commanding presence from success',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Ambitious',
              value: 'Strong',
              description: 'Driven to achieve material success',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Sense Motive',
              value: -1,
              description: 'Views relationships as transactions',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Materialistic',
              value: 'Minor',
              description: 'Judges worth by wealth and status',
              category: 'social'
            }
          ],
          tradeoffReason: 'Material ambition builds practical skills and authority but creates shallow relationships'
        }
      ]
    },
    {
      id: '501_balanced_08',
      rollRange: [71, 80],
      result: 'Faith & Spirituality',
      description: 'Devoted to divine purpose and spiritual growth',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (Religion)',
              value: 2,
              description: 'Deep understanding of divine mysteries',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 1,
              description: 'Moral authority and compassion',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Divine Blessing',
              value: 'Minor',
              description: 'Feels protected by higher power',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Knowledge (Arcana)',
              value: -1,
              description: 'Suspicious of non-divine magic',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Inflexible Faith',
              value: 'Minor',
              description: 'Difficulty accepting contradictory evidence',
              category: 'intellectual'
            }
          ],
          tradeoffReason: 'Strong faith provides spiritual strength and moral authority but limits intellectual flexibility'
        }
      ]
    },
    {
      id: '501_balanced_09',
      rollRange: [81, 90],
      result: 'Revenge & Justice',
      description: 'Obsessed with righting past wrongs and seeking vengeance',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Intimidate',
              value: 2,
              description: 'Fearsome reputation for retribution',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Gather Information',
              value: 1,
              description: 'Relentless pursuit of enemies',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Implacable',
              value: 'Strong',
              description: 'Never gives up on vengeance',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -2,
              description: 'Reputation for holding grudges',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Obsessive',
              value: 'Moderate',
              description: 'Consumed by need for revenge',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Obsession with vengeance creates intimidating presence but destroys social relationships'
        }
      ]
    },
    {
      id: '501_balanced_10',
      rollRange: [91, 100],
      result: 'Survival Above All',
      description: 'Self-preservation is paramount, will do anything to survive',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Survival',
              value: 2,
              description: 'Expert at staying alive in any situation',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Spot',
              value: 1,
              description: 'Constantly alert for threats',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Pragmatic Survivor',
              value: 'Strong',
              description: 'Will compromise any principle to live',
              category: 'practical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Reputation for cowardice and betrayal',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Cowardly',
              value: 'Moderate',
              description: 'Avoids danger even at others\' expense',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Survival instinct provides practical skills and alertness but destroys honor and trust'
        }
      ]
    }
  ]
}

// Table 502: Balanced Personality Traits
export const balancedPersonalityTraitsTable: PersonalityTable = {
  id: '502_balanced',
  name: 'Balanced Personality Traits',
  category: 'personality',
  diceType: 'd100',
  traitCategory: 'traits',
  strengthRating: true,
  instructions: 'Roll d100 to determine personality trait with realistic tradeoffs',
  entries: [
    // Lightside Traits (1-25)
    {
      id: '502_balanced_01',
      rollRange: [1, 5],
      result: 'Honest [L]',
      description: 'Always speaks the truth, even when it hurts',
      personalityTrait: 'L',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 1,
              description: 'Trusted for honesty and integrity',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Trustworthy',
              value: 'Strong',
              description: 'Word is absolutely reliable',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Bluff',
              value: -2,
              description: 'Cannot lie convincingly',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Tactless',
              value: 'Minor',
              description: 'Sometimes hurtfully direct',
              category: 'social'
            }
          ],
          tradeoffReason: 'Complete honesty builds trust but eliminates deception abilities'
        }
      ]
    },
    {
      id: '502_balanced_02',
      rollRange: [6, 10],
      result: 'Brave [L]',
      description: 'Faces danger with courage and determination',
      personalityTrait: 'L',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Intimidate',
              value: 1,
              description: 'Fearless presence inspires and intimidates',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Courageous',
              value: 'Strong',
              description: 'Rarely affected by fear',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Spot',
              value: -1,
              description: 'May rush into danger without proper caution',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Reckless',
              value: 'Minor',
              description: 'Sometimes ignores reasonable risks',
              category: 'practical'
            }
          ],
          tradeoffReason: 'Courage provides inspiring presence but can lead to reckless decisions'
        }
      ]
    },
    {
      id: '502_balanced_03',
      rollRange: [11, 15],
      result: 'Compassionate [L]',
      description: 'Shows mercy and kindness to all beings',
      personalityTrait: 'L',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Heal',
              value: 1,
              description: 'Gentle touch and caring nature',
              category: 'practical'
            },
            {
              type: 'skill',
              target: 'Handle Animal',
              value: 1,
              description: 'Animals sense kindness',
              category: 'practical'
            },
            {
              type: 'trait',
              target: 'Beloved',
              value: 'Minor',
              description: 'Widely liked for kindness',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Intimidate',
              value: -2,
              description: 'Too gentle to threaten effectively',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Soft-hearted',
              value: 'Minor',
              description: 'Difficulty making hard decisions',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Compassion creates healing abilities and social warmth but reduces intimidation'
        }
      ]
    },
    {
      id: '502_balanced_04',
      rollRange: [16, 20],
      result: 'Generous [L]',
      description: 'Freely shares resources and helps others',
      personalityTrait: 'L',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Gather Information',
              value: 1,
              description: 'Network of grateful recipients',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Well-Connected',
              value: 'Minor',
              description: 'Many people owe favors',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Appraise',
              value: -1,
              description: 'Gives away valuable items too easily',
              category: 'practical'
            },
            {
              type: 'trait',
              target: 'Easy Mark',
              value: 'Minor',
              description: 'Targeted by beggars and con artists',
              category: 'social'
            }
          ],
          tradeoffReason: 'Generosity builds social networks but makes one vulnerable to exploitation'
        }
      ]
    },
    {
      id: '502_balanced_05',
      rollRange: [21, 25],
      result: 'Loyal [L]',
      description: 'Steadfast commitment to friends and principles',
      personalityTrait: 'L',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 1,
              description: 'Understands friends deeply',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Unshakeable Loyalty',
              value: 'Strong',
              description: 'Will never betray true friends',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Gather Information',
              value: -1,
              description: 'Won\'t spy on or betray allies',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Blind Loyalty',
              value: 'Minor',
              description: 'May support friends despite their flaws',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Loyalty builds deep relationships but can blind one to friends\' faults'
        }
      ]
    },

    // Neutral Traits (26-75)
    {
      id: '502_balanced_06',
      rollRange: [26, 35],
      result: 'Pragmatic [N]',
      description: 'Practical and realistic approach to all situations',
      personalityTrait: 'N',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Appraise',
              value: 1,
              description: 'Realistic assessment of value and risk',
              category: 'practical'
            },
            {
              type: 'skill',
              target: 'Craft (any)',
              value: 1,
              description: 'Efficient and practical methods',
              category: 'practical'
            },
            {
              type: 'trait',
              target: 'Level-headed',
              value: 'Strong',
              description: 'Makes rational decisions',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Perform',
              value: -1,
              description: 'Lacks inspiration and creativity',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Uninspiring',
              value: 'Minor',
              description: 'Doesn\'t motivate others emotionally',
              category: 'social'
            }
          ],
          tradeoffReason: 'Practical thinking provides efficiency but lacks inspirational qualities'
        }
      ]
    },
    {
      id: '502_balanced_07',
      rollRange: [36, 45],
      result: 'Cautious [N]',
      description: 'Careful and methodical, avoids unnecessary risks',
      personalityTrait: 'N',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Spot',
              value: 1,
              description: 'Always scanning for danger',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Search',
              value: 1,
              description: 'Thorough and methodical examination',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Prepared',
              value: 'Strong',
              description: 'Rarely caught off-guard',
              category: 'practical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Perform',
              value: -1,
              description: 'Too careful for spontaneous performance',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Overly Cautious',
              value: 'Minor',
              description: 'May miss opportunities due to excessive care',
              category: 'practical'
            }
          ],
          tradeoffReason: 'Caution provides safety and preparation but reduces spontaneity and opportunity'
        }
      ]
    },
    {
      id: '502_balanced_08',
      rollRange: [46, 60],
      result: 'Ambitious [N]',
      description: 'Driven to achieve personal goals and advancement',
      personalityTrait: 'N',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Gather Information',
              value: 1,
              description: 'Networks to find opportunities',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Profession (any)',
              value: 1,
              description: 'Focused on career advancement',
              category: 'practical'
            },
            {
              type: 'trait',
              target: 'Driven',
              value: 'Strong',
              description: 'Relentless pursuit of goals',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Sense Motive',
              value: -1,
              description: 'May miss social cues in pursuit of goals',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Competitive',
              value: 'Minor',
              description: 'Sees others as rivals rather than allies',
              category: 'social'
            }
          ],
          tradeoffReason: 'Ambition drives achievement and networking but can damage relationships'
        }
      ]
    },
    {
      id: '502_balanced_09',
      rollRange: [61, 75],
      result: 'Curious [N]',
      description: 'Insatiable desire to learn and explore new things',
      personalityTrait: 'N',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Research',
              value: 1,
              description: 'Love of investigation and discovery',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Knowledge (any)',
              value: 1,
              description: 'Collects information on many topics',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Quick Learner',
              value: 'Strong',
              description: 'Adapts quickly to new situations',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Concentration',
              value: -1,
              description: 'Easily distracted by interesting things',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Nosy',
              value: 'Minor',
              description: 'May pry into dangerous secrets',
              category: 'social'
            }
          ],
          tradeoffReason: 'Curiosity builds knowledge and adaptability but creates dangerous distractions'
        }
      ]
    },

    // Darkside Traits (76-95)
    {
      id: '502_balanced_10',
      rollRange: [76, 80],
      result: 'Selfish [D]',
      description: 'Puts own needs and desires above others consistently',
      personalityTrait: 'D',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Appraise',
              value: 1,
              description: 'Expert at evaluating personal benefit',
              category: 'practical'
            },
            {
              type: 'skill',
              target: 'Survival',
              value: 1,
              description: 'Self-preservation instincts',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Self-Reliant',
              value: 'Strong',
              description: 'Doesn\'t depend on others',
              category: 'practical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -2,
              description: 'Reputation for putting self first',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Friendless',
              value: 'Moderate',
              description: 'Difficulty maintaining relationships',
              category: 'social'
            }
          ],
          tradeoffReason: 'Selfishness builds practical skills and independence but destroys social relationships'
        }
      ]
    },
    {
      id: '502_balanced_11',
      rollRange: [81, 85],
      result: 'Cruel [D]',
      description: 'Takes pleasure in others\' pain and suffering',
      personalityTrait: 'D',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Intimidate',
              value: 2,
              description: 'Reputation for cruelty inspires fear',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Gather Information',
              value: 1,
              description: 'People talk when threatened',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Feared',
              value: 'Strong',
              description: 'Reputation precedes character',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -2,
              description: 'Known for cruelty and lack of mercy',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Handle Animal',
              value: -1,
              description: 'Animals sense malevolent nature',
              category: 'practical'
            },
            {
              type: 'trait',
              target: 'Sadistic',
              value: 'Moderate',
              description: 'Enjoys causing suffering',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Cruelty provides intimidation and fear but destroys empathy and positive relationships'
        }
      ]
    },
    {
      id: '502_balanced_12',
      rollRange: [86, 90],
      result: 'Dishonest [D]',
      description: 'Lies and deceives regularly, even when unnecessary',
      personalityTrait: 'D',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Bluff',
              value: 2,
              description: 'Master of deception and misdirection',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Sleight of Hand',
              value: 1,
              description: 'Comfortable with minor theft and trickery',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Silver Tongue',
              value: 'Strong',
              description: 'Can talk way out of trouble',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -2,
              description: 'Reputation for dishonesty precedes you',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Untrustworthy',
              value: 'Moderate',
              description: 'Even allies doubt your word',
              category: 'social'
            }
          ],
          tradeoffReason: 'Dishonesty builds deception skills but destroys trustworthiness and reputation'
        }
      ]
    },
    {
      id: '502_balanced_13',
      rollRange: [91, 95],
      result: 'Envious [D]',
      description: 'Consumed by jealousy of others\' success and possessions',
      personalityTrait: 'D',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Appraise',
              value: 1,
              description: 'Keen eye for others\' valuables',
              category: 'practical'
            },
            {
              type: 'skill',
              target: 'Gather Information',
              value: 1,
              description: 'Studies rivals obsessively',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Driven to Excel',
              value: 'Minor',
              description: 'Jealousy motivates improvement',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Bitter about others\' success',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Jealous',
              value: 'Moderate',
              description: 'Cannot enjoy own success due to envy',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Envy provides motivation and observation skills but creates bitterness and social friction'
        }
      ]
    },

    // Exotic Traits (96-100)
    {
      id: '502_balanced_14',
      rollRange: [96, 100],
      result: 'Exotic Trait',
      description: 'Unusual psychological or supernatural characteristic',
      personalityTrait: 'E',
      effects: [
        {
          type: 'goto',
          target: 'table',
          value: '503_balanced'
        }
      ]
    }
  ]
}

// Table 503: Balanced Exotic Traits
export const balancedExoticTraitsTable: PersonalityTable = {
  id: '503_balanced',
  name: 'Balanced Exotic Traits',
  category: 'personality',
  diceType: 'd100',
  traitCategory: 'exotic',
  strengthRating: true,
  instructions: 'Roll d100 to determine exotic trait with realistic tradeoffs',
  entries: [
    {
      id: '503_balanced_01',
      rollRange: [1, 10],
      result: 'Telepathic Sensitivity',
      description: 'Can sense others\' emotions and surface thoughts',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 3,
              description: 'Direct access to emotional states',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Gather Information',
              value: 1,
              description: 'Can read people\'s true feelings',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Empathic',
              value: 'Supernatural',
              description: 'Feels others\' emotions directly',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Concentration',
              value: -2,
              description: 'Constantly bombarded by others\' thoughts',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Psychic Overload',
              value: 'Moderate',
              description: 'Overwhelmed in crowds',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Telepathic sensitivity provides incredible social insight but causes mental overload'
        }
      ]
    },
    {
      id: '503_balanced_02',
      rollRange: [11, 20],
      result: 'Prophetic Dreams',
      description: 'Receives visions of possible futures in dreams',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (Future Events)',
              value: 2,
              description: 'Glimpses of what may come to pass',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Spot',
              value: 1,
              description: 'Recognition of familiar dream scenarios',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Oracle',
              value: 'Minor',
              description: 'Occasionally predicts future events',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Disturbed Sleep',
              value: 'Moderate',
              description: 'Vivid nightmares disrupt rest',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Cryptic',
              value: 'Minor',
              description: 'Speaks in confusing prophetic language',
              category: 'social'
            }
          ],
          tradeoffReason: 'Prophetic visions provide foresight but disrupt sleep and clarity'
        }
      ]
    },
    {
      id: '503_balanced_03',
      rollRange: [21, 30],
      result: 'Perfect Memory',
      description: 'Never forgets anything once experienced',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (all)',
              value: 2,
              description: 'Perfect recall of all information',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Research',
              value: 1,
              description: 'Can cross-reference all known facts',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Living Library',
              value: 'Strong',
              description: 'Repository of perfect information',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Remembers every slight and mistake',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Haunted by Memories',
              value: 'Moderate',
              description: 'Cannot forget trauma or pain',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Perfect memory provides incredible knowledge but makes forgetting trauma impossible'
        }
      ]
    },
    {
      id: '503_balanced_04',
      rollRange: [31, 40],
      result: 'Supernatural Luck',
      description: 'Blessed with uncanny good fortune',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'trait',
              target: 'Lucky',
              value: 'Supernatural',
              description: 'Incredible streaks of good fortune',
              category: 'practical'
            },
            {
              type: 'skill',
              target: 'Escape Artist',
              value: 1,
              description: 'Always finds a way out',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Charmed Life',
              value: 'Strong',
              description: 'Survives impossible situations',
              category: 'practical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Survival',
              value: -1,
              description: 'Relies on luck over preparation',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Complacent',
              value: 'Minor',
              description: 'Expects fortune to solve problems',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Supernatural luck provides amazing fortune but reduces self-reliance'
        }
      ]
    },
    {
      id: '503_balanced_05',
      rollRange: [41, 50],
      result: 'Death Sense',
      description: 'Can sense when someone is near death',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Heal',
              value: 2,
              description: 'Knows exactly when healing is critical',
              category: 'practical'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 1,
              description: 'Can sense mortal fear and desperation',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Death Reader',
              value: 'Strong',
              description: 'Can predict natural death',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -2,
              description: 'People find death sense disturbing',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Morbid',
              value: 'Moderate',
              description: 'Constantly aware of mortality',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Death sense provides healing insight but creates morbid reputation'
        }
      ]
    },
    {
      id: '503_balanced_06',
      rollRange: [51, 60],
      result: 'Animal Communication',
      description: 'Can understand and communicate with animals',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Handle Animal',
              value: 3,
              description: 'Direct communication with animals',
              category: 'practical'
            },
            {
              type: 'skill',
              target: 'Survival',
              value: 1,
              description: 'Animals warn of danger',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Beast Friend',
              value: 'Strong',
              description: 'Animals naturally trust character',
              category: 'practical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Prefers animal company to people',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Eccentric',
              value: 'Minor',
              description: 'People think you\'re strange',
              category: 'social'
            }
          ],
          tradeoffReason: 'Animal communication provides natural allies but reduces human social skills'
        }
      ]
    },
    {
      id: '503_balanced_07',
      rollRange: [61, 70],
      result: 'Aura Reading',
      description: 'Can see the spiritual essence of people and places',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 2,
              description: 'Can see moral alignment and intentions',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Knowledge (Religion)',
              value: 1,
              description: 'Understands spiritual forces',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Soul Sight',
              value: 'Strong',
              description: 'Sees through deception to true nature',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Bluff',
              value: -1,
              description: 'Your own aura reveals truth',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Overwhelming Visions',
              value: 'Minor',
              description: 'Sometimes distracted by spiritual sights',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Aura reading provides spiritual insight but makes deception difficult'
        }
      ]
    },
    {
      id: '503_balanced_08',
      rollRange: [71, 80],
      result: 'Magical Magnetism',
      description: 'Supernatural forces are drawn to the character',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (Arcana)',
              value: 2,
              description: 'Constant exposure to magical forces',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Spellcraft',
              value: 1,
              description: 'Intuitive understanding of magic',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Arcane Beacon',
              value: 'Strong',
              description: 'Magical events happen around you',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Hide',
              value: -2,
              description: 'Magical aura makes concealment difficult',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Chaos Magnet',
              value: 'Moderate',
              description: 'Attracts dangerous magical attention',
              category: 'practical'
            }
          ],
          tradeoffReason: 'Magical magnetism provides arcane knowledge but attracts dangerous supernatural attention'
        }
      ]
    },
    {
      id: '503_balanced_09',
      rollRange: [81, 90],
      result: 'Temporal Displacement',
      description: 'Occasionally experiences events out of sequence',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (Time)',
              value: 2,
              description: 'Unique understanding of temporal mechanics',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Initiative',
              value: 1,
              description: 'Sometimes acts before events occur',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Temporal Insight',
              value: 'Strong',
              description: 'Occasionally knows things before they happen',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Confusing conversation patterns',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Chronologically Confused',
              value: 'Moderate',
              description: 'Sometimes acts on information from wrong timeline',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Temporal displacement provides prescient knowledge but creates confusion and social difficulties'
        }
      ]
    },
    {
      id: '503_balanced_10',
      rollRange: [91, 100],
      result: 'Dual Consciousness',
      description: 'Shares mental space with another personality',
      personalityTrait: 'E',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (any)',
              value: 2,
              description: 'Access to second personality\'s knowledge',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 1,
              description: 'Internal advisor provides different perspective',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Internal Counsel',
              value: 'Strong',
              description: 'Always has someone to discuss decisions with',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Concentration',
              value: -2,
              description: 'Internal arguments disrupt focus',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Multiple Personality',
              value: 'Moderate',
              description: 'Sometimes other personality takes control',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Dual consciousness provides additional knowledge and perspective but creates internal conflict'
        }
      ]
    }
  ]
}

// Export all balanced personality tables
export const balancedPersonalityTables = [
  balancedCoreValuesTable,
  balancedPersonalityTraitsTable,
  balancedExoticTraitsTable
]

export default balancedPersonalityTables