import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DNDIntegrationWidget } from '../DNDIntegrationWidget'
import { useCharacterStore } from '@/stores/characterStore'
import type { Character } from '@/types/character'

// Mock the character store
vi.mock('@/stores/characterStore')
const mockUseCharacterStore = vi.mocked(useCharacterStore)

// Mock the DND integration service
vi.mock('@/services/dndIntegrationService', () => ({
  dndIntegrationService: {
    suggestClasses: vi.fn().mockReturnValue([
      {
        className: 'Fighter',
        suitability: 85,
        reasons: ['Strong combat background', 'Military experience'],
        backgroundSupport: ['Soldier'],
        potential: 'High'
      },
      {
        className: 'Ranger',
        suitability: 70,
        reasons: ['Outdoor skills', 'Combat training'],
        backgroundSupport: ['Military'],
        potential: 'Medium'
      }
    ]),
    suggestBackgrounds: vi.fn().mockReturnValue([
      {
        name: 'Soldier',
        description: 'Military background',
        suitability: 90,
        skillProficiencies: ['Athletics', 'Intimidation'],
        toolProficiencies: ['Vehicles (land)'],
        languages: 0,
        equipment: ['Uniform'],
        feature: 'Military Rank'
      }
    ]),
    validateCharacter: vi.fn().mockReturnValue({
      isValid: true,
      errors: [],
      warnings: [],
      legalCharacter: true,
      rulesCompliant: true,
      suggestions: [],
      levelAppropriate: true
    })
  }
}))

// Mock character data
const mockCharacter: Character = {
  id: 'test-char-1',
  name: 'Test Fighter',
  age: 30,
  level: 5,
  race: {
    name: 'Human',
    type: 'Human',
    events: [],
    modifiers: {}
  },
  culture: {
    name: 'Civilized',
    type: 'Civilized',
    cuMod: 0,
    nativeEnvironment: ['Urban'],
    survival: 6,
    benefits: [],
    literacyRate: 85
  },
  socialStatus: {
    level: 'Comfortable',
    solMod: 0,
    survivalMod: 0,
    moneyMultiplier: 1,
    literacyMod: 0,
    benefits: []
  },
  birthCircumstances: {
    legitimacy: 'Legitimate',
    familyHead: 'Father',
    siblings: 1,
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
  youthEvents: [],
  adulthoodEvents: [],
  miscellaneousEvents: [],
  occupations: [
    {
      name: 'Soldier',
      type: 'Military',
      culture: ['Any'],
      rank: 3,
      duration: 8,
      achievements: ['Battle veteran'],
      workAttitudes: ['Disciplined'],
      benefits: ['Combat training'],
      skills: []
    }
  ],
  apprenticeships: [],
  hobbies: [],
  skills: [
    { name: 'Weapon Use', rank: 5, type: 'Combat', source: 'Military' },
    { name: 'Athletics', rank: 3, type: 'Combat', source: 'Training' }
  ],
  values: {
    mostValuedPerson: 'Squad mates',
    mostValuedThing: 'Honor',
    mostValuedAbstraction: 'Duty',
    strength: 'Strong',
    motivations: ['Protect others']
  },
  alignment: {
    primary: 'Lightside',
    attitude: 'Lawful',
    description: 'Honorable soldier',
    behaviorGuidelines: ['Follow orders', 'Protect innocents']
  },
  personalityTraits: {
    lightside: [
      { name: 'Brave', description: 'Faces danger without fear', type: 'Lightside', strength: 'Strong', source: 'Military' }
    ],
    neutral: [],
    darkside: [],
    exotic: []
  },
  npcs: [],
  companions: [],
  rivals: [],
  relationships: [],
  gifts: [],
  legacies: [],
  specialItems: [],
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
    startingGold: 100,
    bonusLanguages: [],
    traits: [],
    flaws: [],
    equipment: [],
    specialAbilities: [],
    backgroundFeatures: []
  }
}

describe('DNDIntegrationWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('No Character State', () => {
    it('should display message when no character is loaded', () => {
      mockUseCharacterStore.mockReturnValue({
        character: null
      } as any)

      render(<DNDIntegrationWidget />)

      expect(screen.getByText('Load a character to see D&D conversion options.')).toBeInTheDocument()
    })
  })

  describe('With Character Loaded', () => {
    beforeEach(() => {
      mockUseCharacterStore.mockReturnValue({
        character: mockCharacter
      } as any)
    })

    it('should render D&D integration widget with character data', async () => {
      render(<DNDIntegrationWidget />)

      expect(screen.getByText('D&D Integration')).toBeInTheDocument()
      expect(screen.getByText('Character Summary')).toBeInTheDocument()
      expect(screen.getByText('Test Fighter')).toBeInTheDocument()
      expect(screen.getByText('Human')).toBeInTheDocument()
    })

    it('should display edition selection buttons', () => {
      render(<DNDIntegrationWidget />)

      expect(screen.getByText('3.5e')).toBeInTheDocument()
      expect(screen.getByText('5e')).toBeInTheDocument()
    })

    it('should default to 5e edition', () => {
      render(<DNDIntegrationWidget />)

      const fiveEButton = screen.getByText('5e')
      expect(fiveEButton).toHaveClass('bg-amber-600', 'text-white')
    })

    it('should switch between editions when buttons are clicked', async () => {
      render(<DNDIntegrationWidget />)

      const threeFiveButton = screen.getByText('3.5e')
      const fiveEButton = screen.getByText('5e')

      // Initially 5e should be selected
      expect(fiveEButton).toHaveClass('bg-amber-600', 'text-white')
      expect(threeFiveButton).not.toHaveClass('bg-amber-600', 'text-white')

      // Click 3.5e
      fireEvent.click(threeFiveButton)

      await waitFor(() => {
        expect(threeFiveButton).toHaveClass('bg-amber-600', 'text-white')
        expect(fiveEButton).not.toHaveClass('bg-amber-600', 'text-white')
      })
    })

    it('should display character summary information', async () => {
      render(<DNDIntegrationWidget />)

      await waitFor(() => {
        expect(screen.getByText('Human')).toBeInTheDocument()
        expect(screen.getByText('Civilized')).toBeInTheDocument()
        expect(screen.getByText('30')).toBeInTheDocument() // Age
        expect(screen.getByText('2')).toBeInTheDocument() // Skills count
        expect(screen.getByText('1')).toBeInTheDocument() // Occupations count
      })
    })

    it('should display class suggestions', async () => {
      render(<DNDIntegrationWidget />)

      await waitFor(() => {
        expect(screen.getByText('Suggested Classes')).toBeInTheDocument()
        expect(screen.getByText('Fighter')).toBeInTheDocument()
        expect(screen.getByText('85% match (High)')).toBeInTheDocument()
        expect(screen.getByText('Strong combat background, Military experience')).toBeInTheDocument()
      })
    })

    it('should display background suggestions for 5e', async () => {
      render(<DNDIntegrationWidget />)

      await waitFor(() => {
        expect(screen.getByText('Suggested Backgrounds')).toBeInTheDocument()
        expect(screen.getByText('Soldier')).toBeInTheDocument()
        expect(screen.getByText('90% match')).toBeInTheDocument()
        expect(screen.getByText('Military background')).toBeInTheDocument()
      })
    })

    it('should not display background suggestions for 3.5e', async () => {
      render(<DNDIntegrationWidget />)

      // Switch to 3.5e
      const threeFiveButton = screen.getByText('3.5e')
      fireEvent.click(threeFiveButton)

      await waitFor(() => {
        expect(screen.queryByText('Suggested Backgrounds')).not.toBeInTheDocument()
      })
    })

    it('should display character validation section', async () => {
      render(<DNDIntegrationWidget />)

      await waitFor(() => {
        expect(screen.getByText('Character Validation')).toBeInTheDocument()
        expect(screen.getByText('Valid Character')).toBeInTheDocument()
        expect(screen.getByText('Rules Compliant')).toBeInTheDocument()
        expect(screen.getByText('Level Appropriate')).toBeInTheDocument()
      })
    })

    it('should display export and refresh buttons', () => {
      render(<DNDIntegrationWidget />)

      expect(screen.getByText('Export to D&D 5e')).toBeInTheDocument()
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })

    it('should update export button text when edition changes', async () => {
      render(<DNDIntegrationWidget />)

      // Initially should show 5e
      expect(screen.getByText('Export to D&D 5e')).toBeInTheDocument()

      // Switch to 3.5e
      const threeFiveButton = screen.getByText('3.5e')
      fireEvent.click(threeFiveButton)

      await waitFor(() => {
        expect(screen.getByText('Export to D&D 3.5')).toBeInTheDocument()
      })
    })

    it('should show loading state', () => {
      render(<DNDIntegrationWidget />)

      // Should show loading initially
      expect(screen.getByText('Analyzing character...')).toBeInTheDocument()
    })

    it('should call refresh when refresh button is clicked', async () => {
      const { dndIntegrationService } = await import('@/services/dndIntegrationService')
      
      render(<DNDIntegrationWidget />)

      await waitFor(() => {
        expect(screen.getByText('Refresh')).toBeInTheDocument()
      })

      const refreshButton = screen.getByText('Refresh')
      fireEvent.click(refreshButton)

      // Should call the service methods again
      expect(dndIntegrationService.suggestClasses).toHaveBeenCalledWith(mockCharacter, '5e')
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockUseCharacterStore.mockReturnValue({
        character: mockCharacter
      } as any)
    })

    it('should handle service errors gracefully', async () => {
      const { dndIntegrationService } = await import('@/services/dndIntegrationService')
      vi.mocked(dndIntegrationService.suggestClasses).mockImplementation(() => {
        throw new Error('Service error')
      })

      // Should not crash when service throws error
      expect(() => render(<DNDIntegrationWidget />)).not.toThrow()
    })

    it('should display validation errors when character is invalid', async () => {
      const { dndIntegrationService } = await import('@/services/dndIntegrationService')
      vi.mocked(dndIntegrationService.validateCharacter).mockReturnValue({
        isValid: false,
        errors: ['Character name is required', 'Invalid age'],
        warnings: ['Character seems very young'],
        legalCharacter: false,
        rulesCompliant: false,
        suggestions: ['Add more background'],
        levelAppropriate: false
      })

      render(<DNDIntegrationWidget />)

      await waitFor(() => {
        expect(screen.getByText('Invalid Character')).toBeInTheDocument()
        expect(screen.getByText('Character name is required')).toBeInTheDocument()
        expect(screen.getByText('Invalid age')).toBeInTheDocument()
        expect(screen.getByText('Character seems very young')).toBeInTheDocument()
      })
    })

    it('should handle empty class suggestions', async () => {
      const { dndIntegrationService } = await import('@/services/dndIntegrationService')
      vi.mocked(dndIntegrationService.suggestClasses).mockReturnValue([])

      render(<DNDIntegrationWidget />)

      await waitFor(() => {
        expect(screen.getByText('No class suggestions available.')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseCharacterStore.mockReturnValue({
        character: mockCharacter
      } as any)
    })

    it('should have proper button accessibility', () => {
      render(<DNDIntegrationWidget />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
        expect(button).not.toHaveAttribute('disabled') // Assuming no disabled buttons initially
      })
    })

    it('should have proper heading structure', () => {
      render(<DNDIntegrationWidget />)

      expect(screen.getByRole('heading', { name: /D&D Integration/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /Character Summary/i })).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    beforeEach(() => {
      mockUseCharacterStore.mockReturnValue({
        character: mockCharacter
      } as any)
    })

    it('should not reload suggestions unnecessarily', async () => {
      const { dndIntegrationService } = await import('@/services/dndIntegrationService')
      
      const { rerender } = render(<DNDIntegrationWidget />)
      
      await waitFor(() => {
        expect(dndIntegrationService.suggestClasses).toHaveBeenCalledTimes(1)
      })

      // Rerender with same character should not call service again
      rerender(<DNDIntegrationWidget />)
      
      // Should still be called only once (until edition changes or refresh is clicked)
      expect(dndIntegrationService.suggestClasses).toHaveBeenCalledTimes(1)
    })
  })
})