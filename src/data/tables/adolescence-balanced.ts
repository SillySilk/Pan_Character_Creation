// Adolescence Events Table (220s) with Balanced Modifiers for PanCasting
// Converted from original Central Casting system to include realistic tradeoffs
// Ages 13-18: Critical personality development and early life choices

import type { YouthTable } from '../../types/tables'

// Table 220: Balanced Adolescence Events (Ages 13-18)
export const balancedAdolescenceEventsTable: YouthTable = {
  id: '220_balanced',
  name: 'Balanced Adolescence Events',
  category: 'youth',
  diceType: 'd100',
  lifePeriod: 'adolescence',
  ageRange: [13, 18],
  instructions: 'Roll d100 for adolescence event with realistic tradeoffs (ages 13-18)',
  entries: [
    {
      id: '220_balanced_01',
      rollRange: [1, 5],
      result: 'Rebellious Phase',
      description: 'Defied authority but learned independence and self-reliance',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // TypeScript compatibility
          positiveEffects: [
            {
              type: 'ability',
              target: 'Charisma',
              value: 1,
              description: 'Developed strong sense of self',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Intimidate',
              value: 1,
              description: 'Learned to stand up to authority',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Struggles with respectful authority relationships',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Authority Issues',
              value: 'Minor',
              description: 'Distrusts traditional hierarchy',
              category: 'social'
            }
          ],
          tradeoffReason: 'Rebellion builds personal strength and independence but creates difficulty with authority figures'
        }
      ]
    },
    {
      id: '220_balanced_02',
      rollRange: [6, 15],
      result: 'First Love',
      description: 'Experienced first romantic relationship with all its joys and heartbreak',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'ability',
              target: 'Wisdom',
              value: 1,
              description: 'Gained emotional maturity',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 1,
              description: 'Better understanding of others\' feelings',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Romantic Vulnerability',
              value: 'Minor',
              description: 'Can be distracted by romantic interests',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'First love teaches emotional wisdom but creates romantic vulnerability'
        }
      ]
    },
    {
      id: '220_balanced_03',
      rollRange: [16, 25],
      result: 'Early Apprenticeship',
      description: 'Started professional training early, gaining skills but missing broader education',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Craft (any)',
              value: 1,
              description: 'Professional training advantage',
              category: 'practical'
            },
            {
              type: 'trait',
              target: 'Work Ethic',
              value: 'Strong',
              description: 'Disciplined approach to tasks',
              category: 'practical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Knowledge (any)',
              value: -1,
              description: 'Limited general education',
              category: 'intellectual'
            }
          ],
          tradeoffReason: 'Early specialization provides professional skills but limits broader knowledge'
        }
      ]
    },
    {
      id: '220_balanced_04',
      rollRange: [26, 35],
      result: 'Coming of Age Ceremony',
      description: 'Honored cultural traditions, gaining community respect but traditional mindset',
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
              description: 'Respected member of community',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Cultural Pride',
              value: 'Strong',
              description: 'Deep connection to heritage',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Traditionalist',
              value: 'Minor',
              description: 'Resistant to new ideas and change',
              category: 'intellectual'
            }
          ],
          tradeoffReason: 'Cultural honor provides social standing but creates resistance to change'
        }
      ]
    },
    {
      id: '220_balanced_05',
      rollRange: [36, 45],
      result: 'Adventure Call',
      description: 'Felt the wanderlust, developing courage but restless nature',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Survival',
              value: 1,
              description: 'Prepared for life beyond civilization',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Brave',
              value: 'Strong',
              description: 'Courage in face of danger',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Restless',
              value: 'Minor',
              description: 'Difficulty with routine and settling down',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Adventurous spirit builds courage and survival skills but creates restlessness'
        }
      ]
    },
    {
      id: '220_balanced_06',
      rollRange: [46, 55],
      result: 'Rivalry Develops',
      description: 'Intense competition with peer built determination but created animosity',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'ability',
              target: 'Strength',
              value: 1,
              description: 'Competition drove physical improvement',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Competitive',
              value: 'Strong',
              description: 'Driven to excel and win',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Difficulty working with competitors',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Rival Enemy',
              value: 'Active',
              description: 'Someone actively opposes you',
              category: 'social'
            }
          ],
          tradeoffReason: 'Rivalry drives personal excellence but creates lasting enmities'
        }
      ]
    },
    {
      id: '220_balanced_07',
      rollRange: [56, 65],
      result: 'Family Responsibility',
      description: 'Took on adult duties early, gaining maturity but losing carefree youth',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'ability',
              target: 'Wisdom',
              value: 1,
              description: 'Matured beyond years',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Handle Animal',
              value: 1,
              description: 'Practical family skills',
              category: 'practical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Perform',
              value: -1,
              description: 'Little time for creative pursuits',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Serious',
              value: 'Minor',
              description: 'Difficulty with lighthearted fun',
              category: 'social'
            }
          ],
          tradeoffReason: 'Early responsibility builds wisdom and practical skills but limits creative expression'
        }
      ]
    },
    {
      id: '220_balanced_08',
      rollRange: [66, 75],
      result: 'Spiritual Awakening',
      description: 'Found deep religious calling, gaining faith but potential dogmatic thinking',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (Religion)',
              value: 1,
              description: 'Deep understanding of faith',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Devout',
              value: 'Strong',
              description: 'Unshakeable faith provides strength',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Inflexible Beliefs',
              value: 'Minor',
              description: 'Difficulty accepting other viewpoints',
              category: 'intellectual'
            }
          ],
          tradeoffReason: 'Spiritual devotion provides inner strength but can limit intellectual flexibility'
        }
      ]
    },
    // Uncommon Events (76-90) - Higher modifiers allowed
    {
      id: '220_balanced_09',
      rollRange: [76, 85],
      result: 'Scholarly Recognition',
      description: 'Academic achievements brought significant recognition and opportunities',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'ability',
              target: 'Intelligence',
              value: 1,
              description: 'Exceptional mental development',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Research',
              value: 2,
              description: 'Advanced research methodology',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Knowledge (any)',
              value: 2,
              description: 'Specialized academic knowledge',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Athletics',
              value: -2,
              description: 'Sedentary academic lifestyle',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Streetwise',
              value: -1,
              description: 'Limited understanding of common life',
              category: 'social'
            }
          ],
          tradeoffReason: 'Exceptional academic achievement creates intellectual excellence but practical naivety'
        }
      ]
    },
    {
      id: '220_balanced_10',
      rollRange: [86, 90],
      result: 'Heroic Moment',
      description: 'Performed brave deed that saved others, gaining renown but attracting attention',
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
              description: 'Inspiring presence from heroic reputation',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Intimidate',
              value: 2,
              description: 'Heroic reputation commands respect',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Local Hero',
              value: 'Recognized',
              description: 'Known and respected in community',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Hide',
              value: -2,
              description: 'Too well known to blend in',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'High Expectations',
              value: 'Burden',
              description: 'Others expect heroic behavior',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Heroic reputation provides social advantages but eliminates anonymity and creates pressure'
        }
      ]
    },
    // Rare Events (91-100) - Highest modifiers allowed
    {
      id: '220_balanced_11',
      rollRange: [91, 95],
      result: 'Tragic Loss',
      description: 'Suffered devastating personal loss, gaining deep wisdom but emotional scars',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'ability',
              target: 'Wisdom',
              value: 1,
              description: 'Profound understanding of loss and life',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 3,
              description: 'Deep insight into others\' pain',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Empathy',
              value: 'Profound',
              description: 'Exceptional understanding of suffering',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Perform',
              value: -2,
              description: 'Difficulty with lighthearted expression',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Melancholy',
              value: 'Deep',
              description: 'Carries weight of loss',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Profound loss creates exceptional wisdom and empathy but lasting emotional burden'
        }
      ]
    },
    {
      id: '220_balanced_12',
      rollRange: [96, 100],
      result: 'Mysterious Encounter',
      description: 'Met someone or something extraordinary, gaining unique insights but strange reputation',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'ability',
              target: 'Wisdom',
              value: 1,
              description: 'Exposure to mysterious truths',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Knowledge (Arcana)',
              value: 3,
              description: 'Understanding of mysterious forces',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Spellcraft',
              value: 2,
              description: 'Insight into magical workings',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -2,
              description: 'Others find you unsettling',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Strange Reputation',
              value: 'Marked',
              description: 'People sense something different about you',
              category: 'social'
            }
          ],
          tradeoffReason: 'Mysterious encounter grants exceptional arcane knowledge but marks you as different and unsettling'
        }
      ]
    }
  ]
}

export default balancedAdolescenceEventsTable