// Adulthood Events Table (400s) with Balanced Modifiers for PanCasting
// Converted from original Central Casting system to include realistic tradeoffs
// Major adult life events that shape mature personality and capabilities

import type { AdulthoodTable } from '../../types/tables'

// Table 419: Balanced Adulthood Events (Ages 18+)
export const balancedAdulthoodEventsTable: AdulthoodTable = {
  id: '419_balanced',
  name: 'Balanced Adulthood Events',
  category: 'adulthood',
  diceType: '2d20',
  modifier: 'solMod',
  minimumAge: 18,
  eventFrequency: 'age_dependent',
  instructions: 'Roll 2d20 + SolMod for adult life events with realistic tradeoffs',
  entries: [
    // Challenging Events (Low Rolls 2-15) - Hardship teaches hard lessons
    {
      id: '419_balanced_01',
      rollRange: [2, 5],
      result: 'Major Tragedy',
      description: 'Devastating personal loss that forever changed your perspective',
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
              description: 'Profound understanding of loss and mortality',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 2,
              description: 'Deep insight into others\' pain and motivations',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Empathy',
              value: 'Profound',
              description: 'Exceptional understanding of human suffering',
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
              target: 'Haunted',
              value: 'Deep',
              description: 'Carries emotional scars from tragedy',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Devastating tragedy creates profound wisdom and empathy but leaves lasting emotional wounds'
        }
      ]
    },
    {
      id: '419_balanced_02',
      rollRange: [6, 10],
      result: 'Financial Ruin',
      description: 'Lost wealth through disaster, betrayal, or poor judgment',
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
              description: 'Learned to live with very little',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Streetwise',
              value: 1,
              description: 'Understanding of harsh realities',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Resourceful',
              value: 'Strong',
              description: 'Makes do with whatever is available',
              category: 'practical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Bitter about past betrayals or failures',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Trust Issues',
              value: 'Moderate',
              description: 'Cautious about financial matters and partners',
              category: 'social'
            }
          ],
          tradeoffReason: 'Financial ruin teaches survival skills and resourcefulness but creates trust issues'
        }
      ]
    },
    {
      id: '419_balanced_03',
      rollRange: [11, 15],
      result: 'Career Change',
      description: 'Dramatic shift to entirely new profession due to necessity or opportunity',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'skill',
              target: 'Craft (new)',
              value: 2,
              description: 'Developed new professional expertise',
              category: 'practical'
            },
            {
              type: 'trait',
              target: 'Adaptable',
              value: 'Strong',
              description: 'Comfortable with major life changes',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Craft (original)',
              value: -1,
              description: 'Skills in original profession have atrophied',
              category: 'practical'
            },
            {
              type: 'trait',
              target: 'Jack of All Trades',
              value: 'Minor',
              description: 'Competent but not masterful in either field',
              category: 'practical'
            }
          ],
          tradeoffReason: 'Career change brings new skills and adaptability but reduces mastery in original profession'
        }
      ]
    },

    // Mixed Events (Mid Rolls 16-30) - Varied life experiences
    {
      id: '419_balanced_04',
      rollRange: [16, 20],
      result: 'Made Enemy',
      description: 'Acquired dangerous rival through conflict or competition',
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
              description: 'Learned to project strength in conflicts',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Spot',
              value: 2,
              description: 'Constantly vigilant for threats',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Street Smart',
              value: 'Strong',
              description: 'Wise to dangers and deception',
              category: 'practical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Reputation for making enemies',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Active Enemy',
              value: 'Dangerous',
              description: 'Someone actively works against you',
              category: 'social'
            }
          ],
          tradeoffReason: 'Having enemies teaches vigilance and intimidation but damages social reputation'
        }
      ]
    },
    {
      id: '419_balanced_05',
      rollRange: [21, 25],
      result: 'Travel Experience',
      description: 'Extended journey to distant lands and foreign cultures',
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
              description: 'Broadened perspective from diverse experiences',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Knowledge (Geography)',
              value: 2,
              description: 'Firsthand knowledge of distant places',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Survival',
              value: 1,
              description: 'Navigated unfamiliar terrains',
              category: 'physical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Knowledge (Local)',
              value: -1,
              description: 'Out of touch with local developments',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Wanderlust',
              value: 'Strong',
              description: 'Difficulty settling in one place',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Extensive travel provides worldly wisdom but creates restlessness and local disconnect'
        }
      ]
    },
    {
      id: '419_balanced_06',
      rollRange: [26, 30],
      result: 'Romantic Entanglement',
      description: 'Significant romantic relationship with profound impact on life',
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
              description: 'Growth through intimate emotional connection',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 1,
              description: 'Better understanding of emotional nuances',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Emotional Depth',
              value: 'Enhanced',
              description: 'Richer emotional life and expression',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Romantic Complications',
              value: 'Ongoing',
              description: 'Complex relationship dynamics affect decisions',
              category: 'social'
            }
          ],
          tradeoffReason: 'Deep romantic connection enhances emotional intelligence but creates ongoing complications'
        }
      ]
    },

    // Positive Events (High Rolls 31-40) - Great opportunities and achievements
    {
      id: '419_balanced_07',
      rollRange: [31, 35],
      result: 'Something Wonderful',
      description: 'Amazing opportunity or great fortune that opened new possibilities',
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
              description: 'Confidence from success and recognition',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Knowledge (any specialty)',
              value: 3,
              description: 'Exceptional opportunity for specialized learning',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 2,
              description: 'Connections from wonderful opportunity',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Lucky',
              value: 'Notable',
              description: 'Reputation for good fortune',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Survival',
              value: -2,
              description: 'Good fortune reduces self-reliance',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'High Expectations',
              value: 'Burden',
              description: 'Others expect continued success',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Wonderful opportunities create expertise and connections but reduce self-reliance'
        }
      ]
    },
    {
      id: '419_balanced_08',
      rollRange: [36, 40],
      result: 'Peaceful Period',
      description: 'Years of stability and contentment without major upheavals',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0,
          positiveEffects: [
            {
              type: 'ability',
              target: 'Constitution',
              value: 1,
              description: 'Health and vitality from stress-free living',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Craft (any)',
              value: 2,
              description: 'Time to perfect chosen skills',
              category: 'practical'
            },
            {
              type: 'trait',
              target: 'Content',
              value: 'Peaceful',
              description: 'Satisfaction with simple pleasures',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Intimidate',
              value: -1,
              description: 'Lacks edge from comfortable living',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Spot',
              value: -1,
              description: 'Less vigilant due to peaceful environment',
              category: 'physical'
            }
          ],
          tradeoffReason: 'Peaceful periods build health and skill mastery but reduce edge and vigilance'
        }
      ]
    }
  ]
}

export default balancedAdulthoodEventsTable