// Youth Events Tables (200s) with Balanced Modifiers for PanCasting
// Converted from original Central Casting system to include realistic tradeoffs

import type { YouthTable } from '../../types/tables'

// Table 209: Balanced Childhood Events (Ages 1-12)
export const balancedChildhoodEventsTable: YouthTable = {
  id: '209_balanced',
  name: 'Balanced Childhood Events',
  category: 'youth',
  diceType: 'd100',
  lifePeriod: 'childhood',
  ageRange: [1, 12],
  instructions: 'Roll d100 for childhood event with realistic tradeoffs (ages 1-12)',
  entries: [
    {
      id: '209_balanced_01',
      rollRange: [1, 5],
      result: 'Sickly Child',
      description: 'Frequent illness weakens constitution but builds empathy and caution',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'skill',
              target: 'Heal',
              value: 1,
              description: 'Understanding of illness and medicine',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Empathy',
              value: 'Strong',
              description: 'Compassionate toward suffering',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'ability',
              target: 'Constitution',
              value: -1,
              description: 'Weakened by chronic illness',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Athletics',
              value: -1,
              description: 'Limited physical activity',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Anxiety',
              value: 'Minor',
              description: 'Worries about health and danger',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Chronic illness creates medical knowledge and empathy but weakens physical capabilities and creates anxiety'
        }
      ]
    },
    
    {
      id: '209_balanced_02',
      rollRange: [6, 15],
      result: 'Family Tragedy',
      description: 'Loss of important family member forces early maturation',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'ability',
              target: 'Wisdom',
              value: 1,
              description: 'Early exposure to life\'s harsh realities',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 1,
              description: 'Understanding grief and human nature',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Resilience',
              value: 'Strong',
              description: 'Developed emotional strength through adversity',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'ability',
              target: 'Charisma',
              value: -1,
              description: 'Emotional withdrawal and trust issues',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Diplomacy',
              value: -1,
              description: 'Difficulty forming new relationships',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Melancholy',
              value: 'Minor',
              description: 'Underlying sadness affects mood',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Trauma creates wisdom and emotional strength but also builds walls and creates lasting sadness'
        }
      ]
    },
    
    {
      id: '209_balanced_03', 
      rollRange: [16, 25],
      result: 'Mentored by Elder',
      description: 'Wise elder provides intensive academic instruction',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (any)',
              value: 1,
              description: 'Intensive academic tutoring',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Research',
              value: 1,
              description: 'Library and study techniques',
              category: 'intellectual'
            },
            {
              type: 'special',
              target: 'languages',
              value: 1,
              description: 'Elder taught multiple languages',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Handle Animal',
              value: -1,
              description: 'Sheltered from nature and animals',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Survival',
              value: -1,
              description: 'Focused on books instead of practical skills',
              category: 'physical'
            },
            {
              type: 'social',
              target: 'peer_relations',
              value: -1,
              description: 'Age-inappropriate interests create social distance',
              category: 'social'
            }
          ],
          tradeoffReason: 'Intensive academic focus creates scholarly excellence but social disconnection from peers and practical inexperience'
        }
      ]
    },
    
    {
      id: '209_balanced_04',
      rollRange: [26, 35], 
      result: 'Discovered Natural Talent',
      description: 'Exceptional ability emerges but creates pressure and isolation',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'skill',
              target: 'Craft (chosen)',
              value: 1,
              description: 'Exceptional natural ability',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Confidence',
              value: 'Strong',
              description: 'Self-assured in chosen area',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Perform (chosen)',
              value: 1,
              description: 'Talent often involves presentation',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Arrogance',
              value: 'Minor',
              description: 'Believes talent makes them special',
              category: 'psychological'
            },
            {
              type: 'social',
              target: 'peer_relations',
              value: -1,
              description: 'Other children jealous or intimidated',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Performance Pressure',
              value: 'Minor',
              description: 'Constant expectations to excel',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Exceptional talent creates confidence and skill but also arrogance, social isolation, and performance pressure'
        }
      ]
    },
    
    {
      id: '209_balanced_05',
      rollRange: [36, 45],
      result: 'Devoted Childhood Friend',
      description: 'Deep friendship provides social skills but creates dependency',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 1,
              description: 'Learned cooperation and compromise',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Loyalty',
              value: 'Strong', 
              description: 'Values deep personal connections',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Sense Motive',
              value: 1,
              description: 'Understands close relationships',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Codependency',
              value: 'Minor',
              description: 'Difficulty being alone or independent',
              category: 'psychological'
            },
            {
              type: 'social',
              target: 'group_dynamics',
              value: -1,
              description: 'Struggles with larger social groups',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Abandonment Fear',
              value: 'Minor',
              description: 'Anxious when friends are distant',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Deep friendship develops social skills and loyalty but creates dependency and fear of abandonment'
        }
      ]
    },
    
    {
      id: '209_balanced_06',
      rollRange: [46, 55],
      result: 'Family Frequently Moved',
      description: 'Constant relocation builds adaptability but prevents deep roots',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'skill',
              target: 'Survival',
              value: 1,
              description: 'Experience in various environments',
              category: 'physical'
            },
            {
              type: 'trait',
              target: 'Adaptability',
              value: 'Strong',
              description: 'Comfortable with change and new situations',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Knowledge (Geography)',
              value: 1,
              description: 'Familiar with many regions',
              category: 'intellectual'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Knowledge (Local)',
              value: -1,
              description: 'No deep knowledge of any one place',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Rootlessness',
              value: 'Minor',
              description: 'Difficulty forming lasting attachments',
              category: 'social'
            },
            {
              type: 'social',
              target: 'community_ties',
              value: -1,
              description: 'Never stayed long enough for deep connections',
              category: 'social'
            }
          ],
          tradeoffReason: 'Constant movement creates adaptability and survival skills but prevents deep local knowledge and lasting relationships'
        }
      ]
    },
    
    {
      id: '209_balanced_07',
      rollRange: [56, 65],
      result: 'Unusual Animal Companion',
      description: 'Befriended exotic creature, developing special bond but social stigma',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'skill',
              target: 'Handle Animal',
              value: 1,
              description: 'Deep understanding of animal behavior',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Knowledge (Nature)',
              value: 1,
              description: 'Learned about wildlife and ecosystems',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Animal Empathy',
              value: 'Strong',
              description: 'Intuitive connection with creatures',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'social',
              target: 'normal_relations',
              value: -1,
              description: 'Others find the relationship strange',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Social Awkwardness',
              value: 'Minor',
              description: 'More comfortable with animals than people',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Etiquette',
              value: -1,
              description: 'Neglected human social conventions',
              category: 'social'
            }
          ],
          tradeoffReason: 'Special animal bond develops nature skills and empathy but creates social distance and unconventional behavior'
        }
      ]
    },
    
    {
      id: '209_balanced_08',
      rollRange: [66, 75],
      result: 'Academic Achievement',
      description: 'Excelled in studies through intense focus and dedication',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (any)',
              value: 1,
              description: 'Exceptional academic performance',
              category: 'intellectual'
            },
            {
              type: 'skill',
              target: 'Research',
              value: 1,
              description: 'Mastered study techniques',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Discipline',
              value: 'Strong',
              description: 'Developed strong work ethic',
              category: 'psychological'
            }
          ],
          negativeEffects: [
            {
              type: 'ability',
              target: 'Constitution',
              value: -1,
              description: 'Sedentary lifestyle weakened constitution',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Athletics',
              value: -1,
              description: 'No time for physical activities',
              category: 'physical'
            },
            {
              type: 'social',
              target: 'peer_relations',
              value: -1,
              description: 'Seen as bookish and antisocial',
              category: 'social'
            }
          ],
          tradeoffReason: 'Academic excellence through intense study creates intellectual prowess but physical weakness and social isolation'
        }
      ]
    },
    
    {
      id: '209_balanced_09',
      rollRange: [76, 85],
      result: 'Athletic Prodigy',
      description: 'Exceptional physical abilities but neglected intellectual development',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'ability',
              target: 'Strength',
              value: 1,
              description: 'Built muscle through constant training',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Athletics',
              value: 2,
              description: 'Exceptional physical conditioning',
              category: 'physical'
            },
            {
              type: 'skill',
              target: 'Acrobatics',
              value: 2,
              description: 'Agility and coordination mastery',
              category: 'physical'
            }
          ],
          negativeEffects: [
            {
              type: 'skill',
              target: 'Knowledge (any)',
              value: -2,
              description: 'Time spent training instead of studying',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Anti-intellectual',
              value: 'Minor',
              description: 'Dismissive of book learning',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Craft (any)',
              value: -2,
              description: 'No patience for detailed handiwork',
              category: 'intellectual'
            }
          ],
          tradeoffReason: 'Physical excellence through intense training builds strength and athletics but neglects intellectual development'
        }
      ]
    },
    
    {
      id: '209_balanced_10',
      rollRange: [86, 95],
      result: 'Social Butterfly',
      description: 'Popular child with many friends but lacks deep skills',
      effects: [
        {
          type: 'balanced',
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'skill',
              target: 'Diplomacy',
              value: 2,
              description: 'Natural people skills',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Gather Information',
              value: 2,
              description: 'Knows everyone and everything',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Charismatic',
              value: 'Strong',
              description: 'Naturally likeable and engaging',
              category: 'social'
            }
          ],
          negativeEffects: [
            {
              type: 'trait',
              target: 'Shallow',
              value: 'Minor',
              description: 'Many acquaintances, few deep relationships',
              category: 'social'
            },
            {
              type: 'skill',
              target: 'Concentration',
              value: -2,
              description: 'Distracted by social opportunities',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Approval Seeking',
              value: 'Minor',
              description: 'Needs constant validation from others',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Social popularity develops people skills but creates superficial relationships and dependency on others\' approval'
        }
      ]
    },
    
    {
      id: '209_balanced_11',
      rollRange: [96, 100],
      result: 'Extraordinary Childhood',
      description: 'Unique experience that shaped character in profound ways',
      effects: [
        {
          type: 'balanced', 
          target: 'character',
          value: 0, // Placeholder - balanced effects use positiveEffects/negativeEffects arrays
          positiveEffects: [
            {
              type: 'skill',
              target: 'Knowledge (chosen specialty)',
              value: 3,
              description: 'Unique experience provided specialized knowledge',
              category: 'intellectual'
            },
            {
              type: 'trait',
              target: 'Unique Perspective',
              value: 'Strong',
              description: 'Sees world differently than others',
              category: 'psychological'
            },
            {
              type: 'skill',
              target: 'Survival',
              value: 2,
              description: 'Learned to cope with unusual circumstances',
              category: 'physical'
            }
          ],
          negativeEffects: [
            {
              type: 'social',
              target: 'normal_relations',
              value: -3,
              description: 'Difficult to relate to ordinary experiences',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Eccentric',
              value: 'Minor',
              description: 'Behavior seems strange to others',
              category: 'social'
            },
            {
              type: 'trait',
              target: 'Haunted by Past',
              value: 'Minor',
              description: 'Extraordinary experience left lasting impact',
              category: 'psychological'
            }
          ],
          tradeoffReason: 'Extraordinary childhood provides unique knowledge and perspective but makes normal social relationships difficult'
        }
      ]
    }
  ]
}

// Export for use in main tables index
export const balancedYouthTables = {
  balancedChildhoodEventsTable
}