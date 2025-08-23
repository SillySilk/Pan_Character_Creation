// Generation wizard state management store for PanCasting

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { TableCategory } from '@/types/tables'

/**
 * Generation wizard step definition
 */
export interface WizardStep {
  id: string
  title: string
  description: string
  category: TableCategory
  required: boolean
  completed: boolean
  skipped: boolean
  order: number
  tables: string[]
  dependencies?: string[] // Steps that must be completed first
}

/**
 * Generation mode types
 */
export type GenerationMode = 'guided' | 'manual' | 'random'

/**
 * Generation state snapshot for undo/redo
 */
export interface GenerationSnapshot {
  id: string
  timestamp: Date
  currentStepIndex: number
  completedSteps: string[]
  skippedSteps: string[]
  characterState: any // Will hold character state snapshot
  description: string
}

/**
 * Navigation context for table jumping
 */
export interface NavigationContext {
  currentTable?: string
  previousTable?: string
  breadcrumbs: string[]
  canGoBack: boolean
  availableJumps: string[]
}

/**
 * Generation progress tracking
 */
export interface GenerationProgress {
  totalSteps: number
  completedSteps: number
  skippedSteps: number
  currentStepIndex: number
  percentComplete: number
  estimatedTimeRemaining?: number | null
}

/**
 * Generation store interface
 */
interface GenerationStore {
  // Core state
  mode: GenerationMode
  isActive: boolean
  isPaused: boolean
  characterId: string | null
  currentStep: WizardStep | null  // Computed property
  
  // Steps and progress
  steps: WizardStep[]
  currentStepIndex: number
  completedSteps: string[]
  skippedSteps: string[]
  
  // Navigation
  navigationContext: NavigationContext
  
  // History and undo/redo
  snapshots: GenerationSnapshot[]
  currentSnapshotIndex: number
  maxSnapshots: number
  
  // Session management
  sessionId: string | null
  startTime: Date | null
  endTime: Date | null
  
  // Wizard control
  startGeneration: (characterId: string, mode?: GenerationMode) => void
  pauseGeneration: () => void
  resumeGeneration: () => void
  endGeneration: () => void
  resetGeneration: () => void
  
  // Step management
  initializeSteps: () => void
  getCurrentStep: () => WizardStep | null
  getStepById: (stepId: string) => WizardStep | null
  getStepByIndex: (index: number) => WizardStep | null
  nextStep: () => boolean
  previousStep: () => boolean
  jumpToStep: (stepIndex: number) => boolean
  jumpToStepById: (stepId: string) => boolean
  
  // Step completion
  completeCurrentStep: () => void
  completeStep: (stepId: string) => void
  skipCurrentStep: () => void
  skipStep: (stepId: string) => void
  uncompleteStep: (stepId: string) => void
  
  // Progress tracking
  getProgress: () => GenerationProgress
  canProceedToNextStep: () => boolean
  getDependentSteps: (stepId: string) => WizardStep[]
  getAvailableSteps: () => WizardStep[]
  
  // Navigation management
  navigateToTable: (tableId: string) => void
  goBackToPreviousTable: () => void
  updateBreadcrumbs: (tableId: string) => void
  clearNavigation: () => void
  
  // History and undo/redo
  createSnapshot: (description: string, characterState?: any) => void
  addToHistory: (description: string, characterState?: any) => void  // Alias for createSnapshot
  undo: () => boolean
  redo: () => boolean
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
  getSnapshotHistory: () => GenerationSnapshot[]
  
  // Validation
  validateStepCompletion: (stepId: string) => { isValid: boolean; errors: string[] }
  validateGeneration: () => { isValid: boolean; errors: string[]; warnings: string[] }
  
  // Utilities
  setGenerationMode: (mode: GenerationMode) => void
  getEstimatedTimeRemaining: () => number | null
  getGenerationSummary: () => string
  exportGenerationData: () => any
  importGenerationData: (data: any) => boolean
  
  // Session persistence
  saveSession: () => void
  loadSession: (sessionId: string) => boolean
  clearSession: () => void
}

/**
 * Default wizard steps configuration
 */
const createDefaultSteps = (): WizardStep[] => [
  {
    id: 'heritage',
    title: 'Heritage & Birth',
    description: 'Determine race, culture, social status, and birth circumstances',
    category: 'heritage',
    required: true,
    completed: false,
    skipped: false,
    order: 1,
    tables: ['101a', '101b', '101c', '102', '103', '104', '105', '106', '107']
  },
  {
    id: 'youth',
    title: 'Youth Events',
    description: 'Generate childhood and adolescence events',
    category: 'youth', 
    required: true,
    completed: false,
    skipped: false,
    order: 2,
    tables: ['208'],
    dependencies: ['heritage']
  },
  {
    id: 'occupations',
    title: 'Occupations & Skills',
    description: 'Determine apprenticeships, occupations, and skill development',
    category: 'occupations',
    required: true,
    completed: false,
    skipped: false,
    order: 3,
    tables: ['309', '310', '311', '312', '313', '316a', '316b', '316c'],
    dependencies: ['heritage']
  },
  {
    id: 'adulthood',
    title: 'Adulthood Events',
    description: 'Generate significant adult life events',
    category: 'adulthood',
    required: true,
    completed: false,
    skipped: false,
    order: 4,
    tables: ['419'],
    dependencies: ['youth', 'occupations']
  },
  {
    id: 'personality',
    title: 'Personality & Values',
    description: 'Determine values, alignment, and personality traits',
    category: 'personality',
    required: true,
    completed: false,
    skipped: false,
    order: 5,
    tables: ['520', '521', '522', '523'],
    dependencies: ['adulthood']
  },
  {
    id: 'miscellaneous',
    title: 'Miscellaneous Events',
    description: 'Add unusual events, tragedies, and special experiences',
    category: 'miscellaneous',
    required: false,
    completed: false,
    skipped: false,
    order: 6,
    tables: ['642', '624', '625', '639', '640', '641', '643', '631', '632', '637', '638']
  },
  {
    id: 'contacts',
    title: 'Contacts & Relationships',
    description: 'Generate NPCs, companions, and relationships',
    category: 'contacts',
    required: false,
    completed: false,
    skipped: false,
    order: 7,
    tables: ['745', '753', 'rivals', 'family']
  },
  {
    id: 'special',
    title: 'Special Items & Gifts',
    description: 'Add special items, gifts, and legacies',
    category: 'special',
    required: false,
    completed: false,
    skipped: false,
    order: 8,
    tables: ['858', 'property', 'magical']
  }
]

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generation store implementation
 */
export const useGenerationStore = create<GenerationStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    mode: 'guided',
    isActive: false,
    isPaused: false,
    characterId: null,
    
    steps: createDefaultSteps(),
    currentStepIndex: 0,
    completedSteps: [],
    skippedSteps: [],
    
    navigationContext: {
      breadcrumbs: [],
      canGoBack: false,
      availableJumps: []
    },
    
    snapshots: [],
    currentSnapshotIndex: -1,
    maxSnapshots: 50,
    
    sessionId: null,
    startTime: null,
    endTime: null,

    // Wizard control
    startGeneration: (characterId, mode = 'guided') => {
      const sessionId = generateSessionId()
      const startTime = new Date()
      
      set({
        mode,
        isActive: true,
        isPaused: false,
        characterId,
        sessionId,
        startTime,
        endTime: null,
        currentStepIndex: 0,
        completedSteps: [],
        skippedSteps: [],
        snapshots: [],
        currentSnapshotIndex: -1,
        steps: createDefaultSteps(),
        navigationContext: {
          breadcrumbs: [],
          canGoBack: false,
          availableJumps: []
        }
      })
      
      // Create initial snapshot
      get().createSnapshot('Generation started')
    },

    pauseGeneration: () => {
      set({ isPaused: true })
      get().createSnapshot('Generation paused')
    },

    resumeGeneration: () => {
      set({ isPaused: false })
      get().createSnapshot('Generation resumed')
    },

    endGeneration: () => {
      set({
        isActive: false,
        isPaused: false,
        endTime: new Date()
      })
      get().createSnapshot('Generation completed')
      get().saveSession()
    },

    resetGeneration: () => {
      set({
        mode: 'guided',
        isActive: false,
        isPaused: false,
        characterId: null,
        currentStepIndex: 0,
        completedSteps: [],
        skippedSteps: [],
        steps: createDefaultSteps(),
        snapshots: [],
        currentSnapshotIndex: -1,
        sessionId: null,
        startTime: null,
        endTime: null,
        navigationContext: {
          breadcrumbs: [],
          canGoBack: false,
          availableJumps: []
        }
      })
    },

    // Step management
    initializeSteps: () => {
      set({ steps: createDefaultSteps() })
    },

    getCurrentStep: () => {
      const { steps, currentStepIndex } = get()
      return steps[currentStepIndex] || null
    },

    getStepById: (stepId) => {
      const { steps } = get()
      return steps.find(step => step.id === stepId) || null
    },

    getStepByIndex: (index) => {
      const { steps } = get()
      return steps[index] || null
    },

    nextStep: () => {
      const { currentStepIndex, steps } = get()
      
      if (currentStepIndex < steps.length - 1) {
        const newIndex = currentStepIndex + 1
        set({ currentStepIndex: newIndex })
        get().createSnapshot(`Moved to step: ${steps[newIndex].title}`)
        return true
      }
      
      return false
    },

    previousStep: () => {
      const { currentStepIndex, steps } = get()
      
      if (currentStepIndex > 0) {
        const newIndex = currentStepIndex - 1
        set({ currentStepIndex: newIndex })
        get().createSnapshot(`Moved back to step: ${steps[newIndex].title}`)
        return true
      }
      
      return false
    },

    jumpToStep: (stepIndex) => {
      const { steps } = get()
      
      if (stepIndex >= 0 && stepIndex < steps.length) {
        set({ currentStepIndex: stepIndex })
        get().createSnapshot(`Jumped to step: ${steps[stepIndex].title}`)
        return true
      }
      
      return false
    },

    jumpToStepById: (stepId) => {
      const { steps } = get()
      const stepIndex = steps.findIndex(step => step.id === stepId)
      
      if (stepIndex >= 0) {
        return get().jumpToStep(stepIndex)
      }
      
      return false
    },

    // Step completion
    completeCurrentStep: () => {
      const { currentStepIndex, steps, completedSteps } = get()
      const currentStep = steps[currentStepIndex]
      
      if (currentStep && !completedSteps.includes(currentStep.id)) {
        const updatedSteps = steps.map((step, index) =>
          index === currentStepIndex ? { ...step, completed: true } : step
        )
        
        set({
          steps: updatedSteps,
          completedSteps: [...completedSteps, currentStep.id]
        })
        
        get().createSnapshot(`Completed step: ${currentStep.title}`)
      }
    },

    completeStep: (stepId) => {
      const { steps, completedSteps } = get()
      
      if (!completedSteps.includes(stepId)) {
        const updatedSteps = steps.map(step =>
          step.id === stepId ? { ...step, completed: true } : step
        )
        
        const step = steps.find(s => s.id === stepId)
        
        set({
          steps: updatedSteps,
          completedSteps: [...completedSteps, stepId]
        })
        
        get().createSnapshot(`Completed step: ${step?.title || stepId}`)
      }
    },

    skipCurrentStep: () => {
      const { currentStepIndex, steps, skippedSteps } = get()
      const currentStep = steps[currentStepIndex]
      
      if (currentStep && !currentStep.required && !skippedSteps.includes(currentStep.id)) {
        const updatedSteps = steps.map((step, index) =>
          index === currentStepIndex ? { ...step, skipped: true } : step
        )
        
        set({
          steps: updatedSteps,
          skippedSteps: [...skippedSteps, currentStep.id]
        })
        
        get().createSnapshot(`Skipped step: ${currentStep.title}`)
      }
    },

    skipStep: (stepId) => {
      const { steps, skippedSteps } = get()
      const step = steps.find(s => s.id === stepId)
      
      if (step && !step.required && !skippedSteps.includes(stepId)) {
        const updatedSteps = steps.map(s =>
          s.id === stepId ? { ...s, skipped: true } : s
        )
        
        set({
          steps: updatedSteps,
          skippedSteps: [...skippedSteps, stepId]
        })
        
        get().createSnapshot(`Skipped step: ${step.title}`)
      }
    },

    uncompleteStep: (stepId) => {
      const { steps, completedSteps, skippedSteps } = get()
      
      const updatedSteps = steps.map(step =>
        step.id === stepId ? { ...step, completed: false, skipped: false } : step
      )
      
      const step = steps.find(s => s.id === stepId)
      
      set({
        steps: updatedSteps,
        completedSteps: completedSteps.filter(id => id !== stepId),
        skippedSteps: skippedSteps.filter(id => id !== stepId)
      })
      
      get().createSnapshot(`Uncompleted step: ${step?.title || stepId}`)
    },

    // Progress tracking
    getProgress: () => {
      const { steps, completedSteps, skippedSteps, currentStepIndex } = get()
      const totalSteps = steps.length
      const completed = completedSteps.length
      const skipped = skippedSteps.length
      const percentComplete = totalSteps > 0 ? (completed / totalSteps) * 100 : 0
      
      return {
        totalSteps,
        completedSteps: completed,
        skippedSteps: skipped,
        currentStepIndex,
        percentComplete,
        estimatedTimeRemaining: get().getEstimatedTimeRemaining()
      }
    },

    canProceedToNextStep: () => {
      const { currentStepIndex, steps } = get()
      const currentStep = steps[currentStepIndex]
      
      if (!currentStep) return false
      
      // Check if current step is completed or skipped
      if (!currentStep.completed && !currentStep.skipped) {
        return !currentStep.required // Can skip if not required
      }
      
      // Check dependencies for next step
      const nextStep = steps[currentStepIndex + 1]
      if (nextStep && nextStep.dependencies) {
        const { completedSteps } = get()
        return nextStep.dependencies.every(dep => completedSteps.includes(dep))
      }
      
      return true
    },

    getDependentSteps: (stepId) => {
      const { steps } = get()
      return steps.filter(step => 
        step.dependencies && step.dependencies.includes(stepId)
      )
    },

    getAvailableSteps: () => {
      const { steps, completedSteps } = get()
      return steps.filter(step => {
        if (!step.dependencies) return true
        return step.dependencies.every(dep => completedSteps.includes(dep))
      })
    },

    // Navigation management
    navigateToTable: (tableId) => {
      const { navigationContext } = get()
      
      set({
        navigationContext: {
          ...navigationContext,
          previousTable: navigationContext.currentTable,
          currentTable: tableId,
          canGoBack: true
        }
      })
      
      get().updateBreadcrumbs(tableId)
    },

    goBackToPreviousTable: () => {
      const { navigationContext } = get()
      
      if (navigationContext.previousTable) {
        set({
          navigationContext: {
            ...navigationContext,
            currentTable: navigationContext.previousTable,
            previousTable: undefined,
            canGoBack: false
          }
        })
      }
    },

    updateBreadcrumbs: (tableId) => {
      const { navigationContext } = get()
      const breadcrumbs = [...navigationContext.breadcrumbs]
      
      // Add new table to breadcrumbs if not already the last one
      if (breadcrumbs[breadcrumbs.length - 1] !== tableId) {
        breadcrumbs.push(tableId)
        
        // Limit breadcrumbs to last 10 tables
        if (breadcrumbs.length > 10) {
          breadcrumbs.shift()
        }
      }
      
      set({
        navigationContext: {
          ...navigationContext,
          breadcrumbs
        }
      })
    },

    clearNavigation: () => {
      set({
        navigationContext: {
          breadcrumbs: [],
          canGoBack: false,
          availableJumps: []
        }
      })
    },

    // History and undo/redo
    createSnapshot: (description, characterState) => {
      const { snapshots, currentSnapshotIndex, maxSnapshots, currentStepIndex, completedSteps, skippedSteps } = get()
      
      const snapshot: GenerationSnapshot = {
        id: `snapshot_${Date.now()}`,
        timestamp: new Date(),
        currentStepIndex,
        completedSteps: [...completedSteps],
        skippedSteps: [...skippedSteps],
        characterState: characterState || null,
        description
      }
      
      // Remove any snapshots after current index (for redo functionality)
      const newSnapshots = snapshots.slice(0, currentSnapshotIndex + 1)
      newSnapshots.push(snapshot)
      
      // Limit to max snapshots
      if (newSnapshots.length > maxSnapshots) {
        newSnapshots.shift()
      }
      
      set({
        snapshots: newSnapshots,
        currentSnapshotIndex: newSnapshots.length - 1
      })
    },

    undo: () => {
      const { snapshots, currentSnapshotIndex } = get()
      
      if (currentSnapshotIndex > 0) {
        const newIndex = currentSnapshotIndex - 1
        const snapshot = snapshots[newIndex]
        
        if (snapshot) {
          set({
            currentSnapshotIndex: newIndex,
            currentStepIndex: snapshot.currentStepIndex,
            completedSteps: [...snapshot.completedSteps],
            skippedSteps: [...snapshot.skippedSteps]
          })
          
          return true
        }
      }
      
      return false
    },

    redo: () => {
      const { snapshots, currentSnapshotIndex } = get()
      
      if (currentSnapshotIndex < snapshots.length - 1) {
        const newIndex = currentSnapshotIndex + 1
        const snapshot = snapshots[newIndex]
        
        if (snapshot) {
          set({
            currentSnapshotIndex: newIndex,
            currentStepIndex: snapshot.currentStepIndex,
            completedSteps: [...snapshot.completedSteps],
            skippedSteps: [...snapshot.skippedSteps]
          })
          
          return true
        }
      }
      
      return false
    },

    canUndo: () => {
      const { currentSnapshotIndex } = get()
      return currentSnapshotIndex > 0
    },

    canRedo: () => {
      const { snapshots, currentSnapshotIndex } = get()
      return currentSnapshotIndex < snapshots.length - 1
    },

    clearHistory: () => {
      set({
        snapshots: [],
        currentSnapshotIndex: -1
      })
    },

    getSnapshotHistory: () => {
      const { snapshots } = get()
      return [...snapshots]
    },

    // Validation
    validateStepCompletion: (stepId) => {
      const { steps, completedSteps } = get()
      const step = steps.find(s => s.id === stepId)
      const errors: string[] = []
      
      if (!step) {
        errors.push(`Step ${stepId} not found`)
        return { isValid: false, errors }
      }
      
      if (step.required && !completedSteps.includes(stepId)) {
        errors.push(`Required step ${step.title} is not completed`)
      }
      
      // Check dependencies
      if (step.dependencies) {
        for (const dep of step.dependencies) {
          if (!completedSteps.includes(dep)) {
            const depStep = steps.find(s => s.id === dep)
            errors.push(`Dependency ${depStep?.title || dep} is not completed`)
          }
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors
      }
    },

    validateGeneration: () => {
      const { steps, completedSteps } = get()
      const errors: string[] = []
      const warnings: string[] = []
      
      // Check all required steps are completed
      const requiredSteps = steps.filter(step => step.required)
      for (const step of requiredSteps) {
        if (!completedSteps.includes(step.id)) {
          errors.push(`Required step ${step.title} is not completed`)
        }
      }
      
      // Check for recommended but optional steps
      const optionalSteps = steps.filter(step => !step.required && !completedSteps.includes(step.id))
      if (optionalSteps.length > 0) {
        warnings.push(`${optionalSteps.length} optional steps were skipped`)
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings
      }
    },

    // Utilities
    setGenerationMode: (mode) => {
      set({ mode })
      get().createSnapshot(`Changed mode to ${mode}`)
    },

    getEstimatedTimeRemaining: () => {
      const { startTime, completedSteps, steps } = get()
      
      if (!startTime || completedSteps.length === 0) return null
      
      const elapsed = Date.now() - startTime.getTime()
      const avgTimePerStep = elapsed / completedSteps.length
      const remainingSteps = steps.length - completedSteps.length
      
      return Math.round(avgTimePerStep * remainingSteps / 1000 / 60) // in minutes
    },

    getGenerationSummary: () => {
      const { mode, skippedSteps, startTime, endTime } = get()
      const progress = get().getProgress()
      
      const parts = [
        `Generation mode: ${mode}`,
        `Progress: ${progress.completedSteps}/${progress.totalSteps} steps completed`,
        `${progress.percentComplete.toFixed(1)}% complete`
      ]
      
      if (skippedSteps.length > 0) {
        parts.push(`${skippedSteps.length} steps skipped`)
      }
      
      if (startTime) {
        const duration = endTime ? endTime.getTime() - startTime.getTime() : Date.now() - startTime.getTime()
        const minutes = Math.round(duration / 1000 / 60)
        parts.push(`Duration: ${minutes} minutes`)
      }
      
      return parts.join(' • ')
    },

    exportGenerationData: () => {
      const state = get()
      return {
        mode: state.mode,
        steps: state.steps,
        completedSteps: state.completedSteps,
        skippedSteps: state.skippedSteps,
        currentStepIndex: state.currentStepIndex,
        snapshots: state.snapshots,
        sessionId: state.sessionId,
        startTime: state.startTime,
        endTime: state.endTime
      }
    },

    importGenerationData: (data) => {
      try {
        set({
          mode: data.mode || 'guided',
          steps: data.steps || createDefaultSteps(),
          completedSteps: data.completedSteps || [],
          skippedSteps: data.skippedSteps || [],
          currentStepIndex: data.currentStepIndex || 0,
          snapshots: data.snapshots || [],
          sessionId: data.sessionId || null,
          startTime: data.startTime ? new Date(data.startTime) : null,
          endTime: data.endTime ? new Date(data.endTime) : null
        })
        return true
      } catch (error) {
        return false
      }
    },

    // Session persistence
    saveSession: () => {
      const { sessionId } = get()
      if (!sessionId) return
      
      try {
        const data = get().exportGenerationData()
        localStorage.setItem(`generation_${sessionId}`, JSON.stringify(data))
      } catch (error) {
        console.error('Failed to save generation session:', error)
      }
    },

    loadSession: (sessionId) => {
      try {
        const data = localStorage.getItem(`generation_${sessionId}`)
        if (data) {
          return get().importGenerationData(JSON.parse(data))
        }
        return false
      } catch (error) {
        console.error('Failed to load generation session:', error)
        return false
      }
    },

    clearSession: () => {
      const { sessionId } = get()
      if (sessionId) {
        try {
          localStorage.removeItem(`generation_${sessionId}`)
        } catch (error) {
          console.error('Failed to clear generation session:', error)
        }
      }
    }
  }))
)