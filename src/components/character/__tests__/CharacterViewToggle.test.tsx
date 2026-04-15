// Unit tests for CharacterViewToggle component

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  CharacterViewToggle,
  CharacterViewToggleWithStatus,
  CompactCharacterViewToggle,
  useCharacterViewState
} from '../CharacterViewToggle'
import type { Character } from '../../../types/character'

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

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('CharacterViewToggle', () => {
  const mockOnViewChange = vi.fn()
  const mockCharacter = createMockCharacter()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('renders both view buttons when character has ability scores', () => {
      render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      expect(screen.getByText('Narrative')).toBeInTheDocument()
      expect(screen.getByText('D&D 3.5')).toBeInTheDocument()
    })

    it('does not render when character cannot show D&D view', () => {
      const characterWithoutAbilities = createMockCharacter({
        strength: undefined,
        dexterity: undefined,
        constitution: undefined,
        intelligence: undefined,
        wisdom: undefined,
        charisma: undefined,
        skills: []
      })

      const { container } = render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={characterWithoutAbilities}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('shows D&D view if character has skills but no ability scores', () => {
      const characterWithSkills = createMockCharacter({
        strength: undefined,
        dexterity: undefined,
        constitution: undefined,
        intelligence: undefined,
        wisdom: undefined,
        charisma: undefined,
        skills: [{
          name: 'Swordsmanship',
          rank: 3,
          type: 'Combat',
          source: 'Training',
          description: 'Skill with swords'
        }]
      })

      render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={characterWithSkills}
        />
      )

      expect(screen.getByText('D&D 3.5')).toBeInTheDocument()
    })

    it('calls onViewChange when narrative button is clicked', () => {
      render(
        <CharacterViewToggle
          currentView="dnd"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      fireEvent.click(screen.getByText('Narrative'))

      expect(mockOnViewChange).toHaveBeenCalledWith('narrative')
    })

    it('calls onViewChange when D&D button is clicked', () => {
      render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      fireEvent.click(screen.getByText('D&D 3.5'))

      expect(mockOnViewChange).toHaveBeenCalledWith('dnd')
    })

    it('highlights the current view correctly', () => {
      const { rerender } = render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      const narrativeButton = screen.getByLabelText('Switch to narrative character view')
      const dndButton = screen.getByLabelText('Switch to D&D 3.5 character sheet view')

      // Narrative should be active
      expect(narrativeButton).toHaveAttribute('aria-pressed', 'true')
      expect(dndButton).toHaveAttribute('aria-pressed', 'false')

      // Switch to D&D view
      rerender(
        <CharacterViewToggle
          currentView="dnd"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      // D&D should be active
      expect(narrativeButton).toHaveAttribute('aria-pressed', 'false')
      expect(dndButton).toHaveAttribute('aria-pressed', 'true')
    })

    it('shows view descriptions', () => {
      render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      expect(screen.getByText('Story-focused character view')).toBeInTheDocument()
    })

    it('shows new feature badge on D&D button when not in D&D view', () => {
      render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('hides new feature badge when in D&D view', () => {
      render(
        <CharacterViewToggle
          currentView="dnd"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      expect(screen.queryByText('New')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      expect(screen.getByLabelText('Switch to narrative character view')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to D&D 3.5 character sheet view')).toBeInTheDocument()
    })

    it('has proper aria-pressed attributes', () => {
      render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
        />
      )

      const narrativeButton = screen.getByLabelText('Switch to narrative character view')
      const dndButton = screen.getByLabelText('Switch to D&D 3.5 character sheet view')

      expect(narrativeButton).toHaveAttribute('aria-pressed', 'true')
      expect(dndButton).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('showDNDAvailable prop', () => {
    it('hides component when showDNDAvailable is false', () => {
      const { container } = render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
          showDNDAvailable={false}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('shows component when showDNDAvailable is true (default)', () => {
      render(
        <CharacterViewToggle
          currentView="narrative"
          onViewChange={mockOnViewChange}
          character={mockCharacter}
          showDNDAvailable={true}
        />
      )

      expect(screen.getByText('Narrative')).toBeInTheDocument()
    })
  })
})

describe('CharacterViewToggleWithStatus', () => {
  const mockOnViewChange = vi.fn()
  const mockCharacter = createMockCharacter()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows converting status', () => {
    render(
      <CharacterViewToggleWithStatus
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={mockCharacter}
        conversionStatus="converting"
      />
    )

    expect(screen.getByText('Converting to D&D format...')).toBeInTheDocument()
    const spinnerIcon = screen.getByText('Converting to D&D format...').previousElementSibling
    expect(spinnerIcon).toHaveClass('animate-spin')
  })

  it('shows error status with message', () => {
    render(
      <CharacterViewToggleWithStatus
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={mockCharacter}
        conversionStatus="error"
        conversionMessage="Invalid character data"
      />
    )

    expect(screen.getByText('Invalid character data')).toBeInTheDocument()
  })

  it('shows default error message when no custom message provided', () => {
    render(
      <CharacterViewToggleWithStatus
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={mockCharacter}
        conversionStatus="error"
      />
    )

    expect(screen.getByText('Conversion failed')).toBeInTheDocument()
  })

  it('does not show status when ready', () => {
    render(
      <CharacterViewToggleWithStatus
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={mockCharacter}
        conversionStatus="ready"
      />
    )

    expect(screen.queryByText('Converting to D&D format...')).not.toBeInTheDocument()
    expect(screen.queryByText('Conversion failed')).not.toBeInTheDocument()
  })
})

describe('CompactCharacterViewToggle', () => {
  const mockOnViewChange = vi.fn()
  const mockCharacter = createMockCharacter()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders compact buttons without labels by default', () => {
    render(
      <CompactCharacterViewToggle
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={mockCharacter}
      />
    )

    expect(screen.queryByText('Story')).not.toBeInTheDocument()
    expect(screen.queryByText('D&D')).not.toBeInTheDocument()

    // Should still have emojis and accessibility labels
    expect(screen.getByTitle('Narrative character view')).toBeInTheDocument()
    expect(screen.getByTitle('D&D 3.5 character sheet')).toBeInTheDocument()
  })

  it('shows labels when showLabels is true', () => {
    render(
      <CompactCharacterViewToggle
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={mockCharacter}
        showLabels={true}
      />
    )

    expect(screen.getByText('Story')).toBeInTheDocument()
    expect(screen.getByText('D&D')).toBeInTheDocument()
  })

  it('shows notification dot when not in D&D view', () => {
    const { container } = render(
      <CompactCharacterViewToggle
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={mockCharacter}
      />
    )

    // Check for the red notification dot
    const notificationDot = container.querySelector('.bg-red-500')
    expect(notificationDot).toBeInTheDocument()
  })

  it('hides notification dot when in D&D view', () => {
    const { container } = render(
      <CompactCharacterViewToggle
        currentView="dnd"
        onViewChange={mockOnViewChange}
        character={mockCharacter}
      />
    )

    // Check that notification dot is not present
    const notificationDot = container.querySelector('.bg-red-500')
    expect(notificationDot).not.toBeInTheDocument()
  })

  it('calls onViewChange when buttons are clicked', () => {
    render(
      <CompactCharacterViewToggle
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={mockCharacter}
      />
    )

    fireEvent.click(screen.getByTitle('D&D 3.5 character sheet'))
    expect(mockOnViewChange).toHaveBeenCalledWith('dnd')

    fireEvent.click(screen.getByTitle('Narrative character view'))
    expect(mockOnViewChange).toHaveBeenCalledWith('narrative')
  })
})

describe('useCharacterViewState hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('loads view state from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dnd')

    const TestComponent = () => {
      const { currentView } = useCharacterViewState('test-character')
      return <div data-testid="current-view">{currentView}</div>
    }

    render(<TestComponent />)

    expect(screen.getByTestId('current-view')).toHaveTextContent('dnd')
    expect(localStorageMock.getItem).toHaveBeenCalledWith('character-view-test-character')
  })

  it('defaults to narrative view when no saved state', () => {
    localStorageMock.getItem.mockReturnValue(null)

    const TestComponent = () => {
      const { currentView } = useCharacterViewState('test-character')
      return <div data-testid="current-view">{currentView}</div>
    }

    render(<TestComponent />)

    expect(screen.getByTestId('current-view')).toHaveTextContent('narrative')
  })

  it('saves view state to localStorage when changed', () => {
    const TestComponent = () => {
      const { currentView, handleViewChange } = useCharacterViewState('test-character')
      return (
        <div>
          <div data-testid="current-view">{currentView}</div>
          <button onClick={() => handleViewChange('dnd')}>Switch to D&D</button>
        </div>
      )
    }

    render(<TestComponent />)

    fireEvent.click(screen.getByText('Switch to D&D'))

    expect(localStorageMock.setItem).toHaveBeenCalledWith('character-view-test-character', 'dnd')
    expect(screen.getByTestId('current-view')).toHaveTextContent('dnd')
  })
})

describe('Edge Cases', () => {
  const mockOnViewChange = vi.fn()

  it('handles null character gracefully', () => {
    const { container } = render(
      <CharacterViewToggle
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={null as any}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('handles character with partial ability scores but no skills', () => {
    const partialCharacter = createMockCharacter({
      strength: 14,
      dexterity: 12,
      constitution: undefined,
      intelligence: undefined,
      wisdom: undefined,
      charisma: undefined,
      skills: [] // No skills to compensate for missing ability scores
    })

    const { container } = render(
      <CharacterViewToggle
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={partialCharacter}
      />
    )

    // Should not show D&D view with partial ability scores and no skills
    expect(container.firstChild).toBeNull()
  })

  it('handles empty skills array correctly', () => {
    const characterWithEmptySkills = createMockCharacter({
      strength: undefined,
      dexterity: undefined,
      constitution: undefined,
      intelligence: undefined,
      wisdom: undefined,
      charisma: undefined,
      skills: []
    })

    const { container } = render(
      <CharacterViewToggle
        currentView="narrative"
        onViewChange={mockOnViewChange}
        character={characterWithEmptySkills}
      />
    )

    expect(container.firstChild).toBeNull()
  })
})