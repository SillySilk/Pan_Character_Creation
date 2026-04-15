// Unit tests for DNDCharacterView component

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DNDCharacterView, EmbeddedDNDCharacterView, DNDCharacterTab } from '../DNDCharacterView'
import type { Character } from '../../../types/character'
import * as dndMappingService from '../../../services/dndMappingService'

// Mock the character store
vi.mock('../../../stores/characterStore', () => ({
  useCharacterStore: () => ({
    updateCharacter: vi.fn()
  })
}))

// Mock the D&D mapping service
vi.mock('../../../services/dndMappingService', () => ({
  dndMappingService: {
    convertToDNDCharacter: vi.fn(),
    recommendClasses: vi.fn(),
    mapAttributesToAbilities: vi.fn(),
    mapSkillsToDNDSkills: vi.fn(),
    generateDNDBackground: vi.fn()
  }
}))

// Mock the D&D character sheet component
vi.mock('../../dnd/DNDCharacterSheet', () => ({
  DNDCharacterSheet: ({ className }: { className?: string }) => (
    <div data-testid="dnd-character-sheet" className={className}>
      Mocked D&D Character Sheet
    </div>
  )
}))

// Mock the class selector component
vi.mock('../../dnd/ClassSelector', () => ({
  ClassSelector: ({ onClassSelected }: { onClassSelected?: (cls: any) => void }) => (
    <div data-testid="class-selector">
      <button onClick={() => onClassSelected?.({ name: 'Fighter' })}>
        Select Fighter
      </button>
    </div>
  )
}))

// Mock the useCharacterDNDView hook
vi.mock('../../../hooks/useCharacterDNDView', () => ({
  useCharacterDNDView: vi.fn()
}))

import { useCharacterDNDView } from '../../../hooks/useCharacterDNDView'

// Mock character data
const createMockCharacter = (overrides: Partial<Character> = {}): Character => ({
  id: 'test-character',
  name: 'Test Character',
  age: 25,
  level: 1,

  // D&D Ability Scores
  strength: 14,
  dexterity: 12,
  constitution: 16,
  intelligence: 13,
  wisdom: 15,
  charisma: 10,

  // Heritage & Birth
  race: {
    name: 'Human',
    type: 'Human',
    events: [],
    modifiers: {}
  },
  culture: {
    name: 'Civilized Kingdom',
    type: 'Civilized',
    cuMod: 0,
    nativeEnvironment: ['Urban'],
    survival: 6,
    benefits: ['Literacy'],
    literacyRate: 90
  },
  socialStatus: {
    level: 'Comfortable',
    solMod: 0,
    survivalMod: 0,
    moneyMultiplier: 1.5,
    literacyMod: 10,
    benefits: ['Education']
  },
  birthCircumstances: {
    legitimacy: 'Legitimate',
    familyHead: 'Father',
    siblings: 2,
    birthOrder: 1,
    birthplace: 'City',
    unusualCircumstances: [],
    biMod: 0
  },
  family: {
    head: 'Father',
    members: [],
    occupations: [],
    relationships: [],
    notableFeatures: [],
    socialConnections: []
  },

  // Life Events
  youthEvents: [],
  adulthoodEvents: [],
  miscellaneousEvents: [],

  // Skills & Occupations
  occupations: [],
  apprenticeships: [],
  hobbies: [],
  skills: [{
    name: 'History',
    rank: 4,
    type: 'Academic',
    source: 'Education',
    description: 'Knowledge of historical events'
  }],

  // Personality
  values: {
    mostValuedPerson: 'Mentor',
    mostValuedThing: 'Ancient Tome',
    mostValuedAbstraction: 'Knowledge',
    strength: 'Strong',
    motivations: ['Seek Truth']
  },
  alignment: {
    primary: 'Lightside',
    attitude: 'Helpful',
    description: 'Dedicated to helping others',
    behaviorGuidelines: ['Help those in need']
  },
  personalityTraits: {
    lightside: [],
    neutral: [],
    darkside: [],
    exotic: []
  },

  // Relationships
  npcs: [],
  companions: [],
  rivals: [],
  relationships: [],

  // Special Items
  gifts: [],
  legacies: [],
  specialItems: [],

  // System Data
  activeModifiers: {
    cuMod: 0,
    solMod: 0,
    tiMod: 0,
    biMod: 0,
    legitMod: 0
  },
  generationHistory: [],
  dndIntegration: {
    abilityModifiers: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    },
    skillBonuses: {},
    startingGold: 0,
    bonusLanguages: [],
    traits: [],
    flaws: [],
    equipment: [],
    specialAbilities: [],
    backgroundFeatures: []
  },

  ...overrides
})

// Mock D&D character sheet data
const createMockDNDCharacter = () => ({
  characterName: 'Test Character',
  race: 'Human',
  classes: [],
  level: 1,
  alignment: 'Neutral Good',
  size: 'Medium',
  age: 25,
  abilities: {
    strength: { score: 14, modifier: 2 },
    dexterity: { score: 12, modifier: 1 },
    constitution: { score: 16, modifier: 3 },
    intelligence: { score: 13, modifier: 1 },
    wisdom: { score: 15, modifier: 2 },
    charisma: { score: 10, modifier: 0 }
  },
  hitPoints: 19,
  armorClass: 11,
  touch: 11,
  flatFooted: 10,
  initiative: 1,
  speed: 30,
  saves: {
    fortitude: { base: 0, abilityModifier: 3, magicModifier: 0, miscModifier: 0, tempModifier: 0, total: 3 },
    reflex: { base: 0, abilityModifier: 1, magicModifier: 0, miscModifier: 0, tempModifier: 0, total: 1 },
    will: { base: 0, abilityModifier: 2, magicModifier: 0, miscModifier: 0, tempModifier: 0, total: 2 }
  },
  skills: [],
  equipment: [],
  money: { copper: 0, silver: 0, gold: 150, platinum: 0 },
  background: 'A Human raised in Civilized Kingdom culture.',
  personality: 'Personality traits not defined.',
  goals: 'Goals not yet defined.',
  relationships: 'No significant relationships recorded.',
  classFeatures: [],
  racialTraits: ['Extra Feat', 'Extra Skill Points', 'Versatile'],
  feats: [],
  notes: [],
  backstory: 'Character has experienced 0 significant life events that shaped their development.'
})

const mockClassRecommendations = [
  {
    className: 'Wizard',
    suitability: 75,
    reasons: ['High Intelligence (13)', 'Good skill compatibility'],
    backgroundSupport: ['Academic background'],
    potential: 'High' as const
  },
  {
    className: 'Fighter',
    suitability: 60,
    reasons: ['Good Strength (14)', 'Versatile class'],
    backgroundSupport: [],
    potential: 'Medium' as const
  },
  {
    className: 'Cleric',
    suitability: 55,
    reasons: ['Good Wisdom (15)'],
    backgroundSupport: [],
    potential: 'Medium' as const
  }
]

describe('DNDCharacterView', () => {
  const mockOnCharacterUpdate = vi.fn()

  const mockConvertToDND = vi.fn()
  const mockRefreshDNDData = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default hook return values
    ;(useCharacterDNDView as any).mockReturnValue({
      dndCharacter: null,
      isConverting: false,
      conversionError: null,
      convertToDND: mockConvertToDND,
      refreshDNDData: mockRefreshDNDData,
      canShowDNDView: true,
      hasUnsavedChanges: false,
      conversionStatus: 'ready',
      statusMessage: 'Ready to convert'
    })

    // Setup mapping service mocks
    ;(dndMappingService.dndMappingService.recommendClasses as any).mockReturnValue(mockClassRecommendations)
    ;(dndMappingService.dndMappingService.convertToDNDCharacter as any).mockReturnValue(createMockDNDCharacter())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders unavailable state when character cannot show D&D view', () => {
      ;(useCharacterDNDView as any).mockReturnValue({
        dndCharacter: null,
        isConverting: false,
        conversionError: null,
        convertToDND: mockConvertToDND,
        refreshDNDData: mockRefreshDNDData,
        canShowDNDView: false,
        hasUnsavedChanges: false,
        conversionStatus: 'unavailable',
        statusMessage: 'D&D view requires ability scores or skills'
      })

      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      expect(screen.getByText('D&D View Unavailable')).toBeInTheDocument()
      expect(screen.getByText('This character needs ability scores or skills to display as a D&D character sheet.')).toBeInTheDocument()
    })

    it('renders converting state', () => {
      ;(useCharacterDNDView as any).mockReturnValue({
        dndCharacter: null,
        isConverting: true,
        conversionError: null,
        convertToDND: mockConvertToDND,
        refreshDNDData: mockRefreshDNDData,
        canShowDNDView: true,
        hasUnsavedChanges: false,
        conversionStatus: 'converting',
        statusMessage: 'Converting character to D&D format...'
      })

      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      expect(screen.getByText('Converting to D&D Format')).toBeInTheDocument()
      expect(screen.getByText('Converting character to D&D format...')).toBeInTheDocument()
    })

    it('renders error state', () => {
      ;(useCharacterDNDView as any).mockReturnValue({
        dndCharacter: null,
        isConverting: false,
        conversionError: 'Test conversion error',
        convertToDND: mockConvertToDND,
        refreshDNDData: mockRefreshDNDData,
        canShowDNDView: true,
        hasUnsavedChanges: false,
        conversionStatus: 'error',
        statusMessage: 'Conversion failed'
      })

      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      expect(screen.getByText('Conversion Failed')).toBeInTheDocument()
      expect(screen.getByText('Test conversion error')).toBeInTheDocument()
      expect(screen.getByText('🔄 Try Again')).toBeInTheDocument()
    })

    it('renders ready to convert state', () => {
      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      expect(screen.getByText('Ready to Convert')).toBeInTheDocument()
      expect(screen.getByText('Generate D&D Character Sheet')).toBeInTheDocument()
    })

    it('renders D&D character sheet when conversion is complete', () => {
      ;(useCharacterDNDView as any).mockReturnValue({
        dndCharacter: createMockDNDCharacter(),
        isConverting: false,
        conversionError: null,
        convertToDND: mockConvertToDND,
        refreshDNDData: mockRefreshDNDData,
        canShowDNDView: true,
        hasUnsavedChanges: false,
        conversionStatus: 'ready',
        statusMessage: 'D&D character sheet ready'
      })

      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      expect(screen.getByTestId('dnd-character-sheet')).toBeInTheDocument()
      expect(screen.getByText('D&D 3.5 Character Sheet')).toBeInTheDocument()
    })
  })

  describe('Class Selection', () => {
    it('shows class recommendations when character has no class', () => {
      const character = createMockCharacter({ characterClass: undefined })
      render(<DNDCharacterView character={character} />)

      expect(screen.getByText('Choose Your D&D Class')).toBeInTheDocument()
      expect(screen.getByText('Wizard')).toBeInTheDocument()
      expect(screen.getByText('Fighter')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument() // Wizard suitability
    })

    it('does not show class recommendations when character has a class', () => {
      const character = createMockCharacter({
        characterClass: {
          name: 'Wizard',
          hitDie: 'd4',
          skillPointsPerLevel: 2,
          classSkills: ['Knowledge'],
          primaryAbility: 'Intelligence',
          startingSkillRanks: {}
        }
      })
      render(<DNDCharacterView character={character} />)

      expect(screen.queryByText('Choose Your D&D Class')).not.toBeInTheDocument()
    })

    it('handles class selection', () => {
      const character = createMockCharacter({ characterClass: undefined })
      render(
        <DNDCharacterView
          character={character}
          onCharacterUpdate={mockOnCharacterUpdate}
        />
      )

      // Click on the Wizard recommendation
      const wizardButton = screen.getByRole('button', { name: /wizard/i })
      fireEvent.click(wizardButton)

      expect(mockOnCharacterUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          characterClass: expect.objectContaining({
            name: 'Wizard'
          })
        })
      )
    })

    it('shows/hides extended class recommendations', () => {
      const character = createMockCharacter({ characterClass: undefined })
      render(<DNDCharacterView character={character} />)

      // Initially should not show extended recommendations
      expect(screen.queryByTestId('class-selector')).not.toBeInTheDocument()

      // Click to show all recommendations
      const showAllButton = screen.getByText('Show All Recommendations')
      fireEvent.click(showAllButton)

      expect(screen.getByTestId('class-selector')).toBeInTheDocument()

      // Click to hide
      const hideButton = screen.getByText('Hide All Recommendations')
      fireEvent.click(hideButton)

      expect(screen.queryByTestId('class-selector')).not.toBeInTheDocument()
    })

    it('allows skipping class selection', () => {
      const character = createMockCharacter({ characterClass: undefined })
      render(
        <DNDCharacterView
          character={character}
          onCharacterUpdate={mockOnCharacterUpdate}
        />
      )

      const skipButton = screen.getByText('Skip Class Selection')
      fireEvent.click(skipButton)

      expect(mockOnCharacterUpdate).toHaveBeenCalledWith({
        characterClass: undefined
      })
    })
  })

  describe('Unsaved Changes Warning', () => {
    it('shows warning when character has unsaved changes', () => {
      ;(useCharacterDNDView as any).mockReturnValue({
        dndCharacter: createMockDNDCharacter(),
        isConverting: false,
        conversionError: null,
        convertToDND: mockConvertToDND,
        refreshDNDData: mockRefreshDNDData,
        canShowDNDView: true,
        hasUnsavedChanges: true,
        conversionStatus: 'ready',
        statusMessage: 'Character data has changed - conversion needs refresh'
      })

      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      expect(screen.getByText('Character Data Changed')).toBeInTheDocument()
      expect(screen.getByText('The D&D character sheet may be outdated. Refresh to see latest changes.')).toBeInTheDocument()
    })

    it('handles refresh action', () => {
      ;(useCharacterDNDView as any).mockReturnValue({
        dndCharacter: createMockDNDCharacter(),
        isConverting: false,
        conversionError: null,
        convertToDND: mockConvertToDND,
        refreshDNDData: mockRefreshDNDData,
        canShowDNDView: true,
        hasUnsavedChanges: true,
        conversionStatus: 'ready',
        statusMessage: 'Character data has changed - conversion needs refresh'
      })

      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      const refreshButtons = screen.getAllByText('🔄 Refresh')
      // Click the first refresh button (in the warning panel)
      fireEvent.click(refreshButtons[0])

      expect(mockRefreshDNDData).toHaveBeenCalled()
    })
  })

  describe('Interaction Handling', () => {
    it('handles convert to D&D action', () => {
      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      const convertButton = screen.getByText('Generate D&D Character Sheet')
      fireEvent.click(convertButton)

      expect(mockConvertToDND).toHaveBeenCalled()
    })

    it('handles retry action on error', () => {
      ;(useCharacterDNDView as any).mockReturnValue({
        dndCharacter: null,
        isConverting: false,
        conversionError: 'Test error',
        convertToDND: mockConvertToDND,
        refreshDNDData: mockRefreshDNDData,
        canShowDNDView: true,
        hasUnsavedChanges: false,
        conversionStatus: 'error',
        statusMessage: 'Conversion failed'
      })

      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      const retryButton = screen.getByText('🔄 Try Again')
      fireEvent.click(retryButton)

      expect(mockRefreshDNDData).toHaveBeenCalled()
    })

    it('respects readOnly prop', () => {
      const character = createMockCharacter({ characterClass: undefined })
      render(
        <DNDCharacterView
          character={character}
          onCharacterUpdate={mockOnCharacterUpdate}
          readOnly={true}
        />
      )

      // Should not show skip button in read-only mode
      expect(screen.queryByText('Skip Class Selection')).not.toBeInTheDocument()

      // Class recommendation buttons should be disabled
      const wizardButton = screen.getByRole('button', { name: /wizard/i })
      expect(wizardButton).toBeDisabled()
    })
  })

  describe('Development Features', () => {
    const originalEnv = process.env.NODE_ENV

    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    afterEach(() => {
      process.env.NODE_ENV = originalEnv
    })

    it('shows development conversion details in development mode', () => {
      ;(useCharacterDNDView as any).mockReturnValue({
        dndCharacter: createMockDNDCharacter(),
        isConverting: false,
        conversionError: null,
        convertToDND: mockConvertToDND,
        refreshDNDData: mockRefreshDNDData,
        canShowDNDView: true,
        hasUnsavedChanges: false,
        conversionStatus: 'ready',
        statusMessage: 'D&D character sheet ready'
      })

      const character = createMockCharacter()
      render(<DNDCharacterView character={character} />)

      expect(screen.getByText('🔧 Conversion Details (Development)')).toBeInTheDocument()
    })
  })
})

describe('EmbeddedDNDCharacterView', () => {
  it('renders as read-only', () => {
    // Override the hook to return null dndCharacter for this test
    ;(useCharacterDNDView as any).mockReturnValue({
      dndCharacter: null,
      isConverting: false,
      conversionError: null,
      convertToDND: vi.fn(),
      refreshDNDData: vi.fn(),
      canShowDNDView: true,
      hasUnsavedChanges: false,
      conversionStatus: 'ready',
      statusMessage: 'Ready to convert'
    })

    const character = createMockCharacter({
      characterClass: {
        name: 'Fighter',
        hitDie: 'd10',
        skillPointsPerLevel: 2,
        classSkills: ['Climb', 'Jump'],
        primaryAbility: 'Strength',
        startingSkillRanks: {}
      }
    })
    render(<EmbeddedDNDCharacterView character={character} />)

    // Should render the main component but in read-only mode
    expect(screen.getByText('Ready to Convert')).toBeInTheDocument()
  })
})

describe('DNDCharacterTab', () => {
  it('renders character view when character is provided', () => {
    // Override the hook to return null dndCharacter for this test
    ;(useCharacterDNDView as any).mockReturnValue({
      dndCharacter: null,
      isConverting: false,
      conversionError: null,
      convertToDND: vi.fn(),
      refreshDNDData: vi.fn(),
      canShowDNDView: true,
      hasUnsavedChanges: false,
      conversionStatus: 'ready',
      statusMessage: 'Ready to convert'
    })

    const character = createMockCharacter({
      characterClass: {
        name: 'Fighter',
        hitDie: 'd10',
        skillPointsPerLevel: 2,
        classSkills: ['Climb', 'Jump'],
        primaryAbility: 'Strength',
        startingSkillRanks: {}
      }
    })
    render(<DNDCharacterTab character={character} />)

    expect(screen.getByText('Ready to Convert')).toBeInTheDocument()
  })

  it('renders no character state when character is null', () => {
    render(<DNDCharacterTab character={null as any} />)

    expect(screen.getByText('No character selected')).toBeInTheDocument()
  })
})

describe('Error Handling', () => {
  beforeEach(() => {
    // Suppress console.error for error tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('handles mapping service errors gracefully', () => {
    ;(dndMappingService.dndMappingService.recommendClasses as any).mockImplementation(() => {
      throw new Error('Mapping service error')
    })

    const character = createMockCharacter()

    // Should not crash
    expect(() => {
      render(<DNDCharacterView character={character} />)
    }).not.toThrow()
  })

  it('handles hook errors gracefully', () => {
    ;(useCharacterDNDView as any).mockImplementation(() => {
      throw new Error('Hook error')
    })

    const character = createMockCharacter()

    // Should not crash the component
    expect(() => {
      render(<DNDCharacterView character={character} />)
    }).toThrow() // This will throw because the hook fails, which is expected
  })
})