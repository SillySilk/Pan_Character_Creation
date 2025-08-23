// Settings and preferences store for PanCasting

import { create } from 'zustand'
import { subscribeWithSelector, persist } from 'zustand/middleware'
import type { GenerationMode } from './generationStore'
import { APP_CONFIG, THEME } from '@/utils/constants'

/**
 * Theme configuration
 */
export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  fontFamily: 'default' | 'serif' | 'sans-serif'
  fontSize: 'small' | 'medium' | 'large'
  contrast: 'normal' | 'high'
  animations: boolean
}

/**
 * Accessibility settings
 */
export interface AccessibilitySettings {
  screenReader: boolean
  reducedMotion: boolean
  highContrast: boolean
  largeText: boolean
  focusVisible: boolean
  keyboardNavigation: boolean
  announceChanges: boolean
}

/**
 * Generation preferences
 */
export interface GenerationSettings {
  defaultMode: GenerationMode
  autoSave: boolean
  showTutorials: boolean
  confirmSkips: boolean
  showDiceRolls: boolean
  animateRolls: boolean
  autoAdvance: boolean
  saveHistory: boolean
  maxHistoryItems: number
}

/**
 * UI preferences
 */
export interface UISettings {
  sidebarCollapsed: boolean
  showTooltips: boolean
  compactMode: boolean
  showProgressBar: boolean
  tableView: 'card' | 'list' | 'grid'
  characterSheetLayout: 'full' | 'compact' | 'minimal'
  showAdvancedOptions: boolean
  confirmActions: boolean
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  enabled: boolean
  sound: boolean
  desktop: boolean
  errors: boolean
  warnings: boolean
  successes: boolean
  gameReminders: boolean
  volume: number
}

/**
 * Export settings
 */
export interface ExportSettings {
  defaultFormat: 'json' | 'pdf' | 'text'
  includeHistory: boolean
  includeNotes: boolean
  compressImages: boolean
  customTemplate: string | null
}

/**
 * Privacy settings
 */
export interface PrivacySettings {
  analytics: boolean
  crashReporting: boolean
  dataCollection: boolean
  shareUsageStats: boolean
  rememberSession: boolean
  clearOnExit: boolean
}

/**
 * Language and localization
 */
export interface LocalizationSettings {
  language: string
  region: string
  dateFormat: 'US' | 'EU' | 'ISO'
  timeFormat: '12h' | '24h'
  numberFormat: 'US' | 'EU' | 'metric'
  currency: string
}

/**
 * Complete settings interface
 */
export interface AppSettings {
  theme: ThemeSettings
  accessibility: AccessibilitySettings
  generation: GenerationSettings
  ui: UISettings
  notifications: NotificationSettings
  export: ExportSettings
  privacy: PrivacySettings
  localization: LocalizationSettings
  
  // Metadata
  version: string
  lastUpdated: Date
  firstRun: boolean
  tutorialCompleted: boolean
}

/**
 * Settings store interface
 */
interface SettingsStore {
  // Settings state
  settings: AppSettings
  isLoading: boolean
  error: string | null
  
  // Theme management
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void
  setPrimaryColor: (color: string) => void
  setFontFamily: (family: 'default' | 'serif' | 'sans-serif') => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  setContrast: (contrast: 'normal' | 'high') => void
  toggleAnimations: () => void
  resetTheme: () => void
  
  // Accessibility
  setScreenReader: (enabled: boolean) => void
  setReducedMotion: (enabled: boolean) => void
  setHighContrast: (enabled: boolean) => void
  setLargeText: (enabled: boolean) => void
  setFocusVisible: (enabled: boolean) => void
  setKeyboardNavigation: (enabled: boolean) => void
  setAnnounceChanges: (enabled: boolean) => void
  resetAccessibility: () => void
  
  // Generation preferences
  setDefaultGenerationMode: (mode: GenerationMode) => void
  setAutoSave: (enabled: boolean) => void
  setShowTutorials: (enabled: boolean) => void
  setConfirmSkips: (enabled: boolean) => void
  setShowDiceRolls: (enabled: boolean) => void
  setAnimateRolls: (enabled: boolean) => void
  setAutoAdvance: (enabled: boolean) => void
  setSaveHistory: (enabled: boolean) => void
  setMaxHistoryItems: (count: number) => void
  resetGeneration: () => void
  
  // UI preferences
  setSidebarCollapsed: (collapsed: boolean) => void
  setShowTooltips: (enabled: boolean) => void
  setCompactMode: (enabled: boolean) => void
  setShowProgressBar: (enabled: boolean) => void
  setTableView: (view: 'card' | 'list' | 'grid') => void
  setCharacterSheetLayout: (layout: 'full' | 'compact' | 'minimal') => void
  setShowAdvancedOptions: (enabled: boolean) => void
  setConfirmActions: (enabled: boolean) => void
  resetUI: () => void
  
  // Notifications
  setNotificationsEnabled: (enabled: boolean) => void
  setNotificationSound: (enabled: boolean) => void
  setDesktopNotifications: (enabled: boolean) => void
  setErrorNotifications: (enabled: boolean) => void
  setWarningNotifications: (enabled: boolean) => void
  setSuccessNotifications: (enabled: boolean) => void
  setGameReminders: (enabled: boolean) => void
  setNotificationVolume: (volume: number) => void
  resetNotifications: () => void
  
  // Export settings
  setDefaultExportFormat: (format: 'json' | 'pdf' | 'text') => void
  setIncludeHistory: (enabled: boolean) => void
  setIncludeNotes: (enabled: boolean) => void
  setCompressImages: (enabled: boolean) => void
  setCustomTemplate: (template: string | null) => void
  resetExport: () => void
  
  // Privacy settings
  setAnalytics: (enabled: boolean) => void
  setCrashReporting: (enabled: boolean) => void
  setDataCollection: (enabled: boolean) => void
  setShareUsageStats: (enabled: boolean) => void
  setRememberSession: (enabled: boolean) => void
  setClearOnExit: (enabled: boolean) => void
  resetPrivacy: () => void
  
  // Localization
  setLanguage: (language: string) => void
  setRegion: (region: string) => void
  setDateFormat: (format: 'US' | 'EU' | 'ISO') => void
  setTimeFormat: (format: '12h' | '24h') => void
  setNumberFormat: (format: 'US' | 'EU' | 'metric') => void
  setCurrency: (currency: string) => void
  resetLocalization: () => void
  
  // Bulk operations
  updateSettings: (updates: Partial<AppSettings>) => void
  resetAllSettings: () => void
  exportSettings: () => string
  importSettings: (data: string) => boolean
  
  // Computed properties
  getCurrentTheme: () => ThemeSettings
  getAccessibilityStatus: () => { enabled: boolean; count: number }
  getNotificationStatus: () => { enabled: boolean; types: string[] }
  
  // Utilities
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  markTutorialCompleted: () => void
  resetFirstRun: () => void
  
  // Migration and versioning
  migrateSettings: (oldVersion: string, newVersion: string) => void
  getSettingsVersion: () => string
}

/**
 * Default settings configuration
 */
const createDefaultSettings = (): AppSettings => ({
  theme: {
    mode: 'auto',
    primaryColor: THEME.colors.primary,
    fontFamily: 'default',
    fontSize: 'medium',
    contrast: 'normal',
    animations: true
  },
  
  accessibility: {
    screenReader: false,
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    focusVisible: true,
    keyboardNavigation: true,
    announceChanges: false
  },
  
  generation: {
    defaultMode: 'guided',
    autoSave: true,
    showTutorials: true,
    confirmSkips: true,
    showDiceRolls: true,
    animateRolls: true,
    autoAdvance: false,
    saveHistory: true,
    maxHistoryItems: 50
  },
  
  ui: {
    sidebarCollapsed: false,
    showTooltips: true,
    compactMode: false,
    showProgressBar: true,
    tableView: 'card',
    characterSheetLayout: 'full',
    showAdvancedOptions: false,
    confirmActions: true
  },
  
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
    errors: true,
    warnings: true,
    successes: false,
    gameReminders: true,
    volume: 50
  },
  
  export: {
    defaultFormat: 'json',
    includeHistory: false,
    includeNotes: true,
    compressImages: true,
    customTemplate: null
  },
  
  privacy: {
    analytics: false,
    crashReporting: true,
    dataCollection: false,
    shareUsageStats: false,
    rememberSession: true,
    clearOnExit: false
  },
  
  localization: {
    language: 'en',
    region: 'US',
    dateFormat: 'US',
    timeFormat: '12h',
    numberFormat: 'US',
    currency: 'USD'
  },
  
  // Metadata
  version: APP_CONFIG.version,
  lastUpdated: new Date(),
  firstRun: true,
  tutorialCompleted: false
})

/**
 * Settings store implementation with persistence
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      // Initial state
      settings: createDefaultSettings(),
      isLoading: false,
      error: null,

      // Theme management
      setThemeMode: (mode) => {
        set(state => ({
          settings: {
            ...state.settings,
            theme: { ...state.settings.theme, mode },
            lastUpdated: new Date()
          }
        }))
      },

      setPrimaryColor: (primaryColor) => {
        set(state => ({
          settings: {
            ...state.settings,
            theme: { ...state.settings.theme, primaryColor },
            lastUpdated: new Date()
          }
        }))
      },

      setFontFamily: (fontFamily) => {
        set(state => ({
          settings: {
            ...state.settings,
            theme: { ...state.settings.theme, fontFamily },
            lastUpdated: new Date()
          }
        }))
      },

      setFontSize: (fontSize) => {
        set(state => ({
          settings: {
            ...state.settings,
            theme: { ...state.settings.theme, fontSize },
            lastUpdated: new Date()
          }
        }))
      },

      setContrast: (contrast) => {
        set(state => ({
          settings: {
            ...state.settings,
            theme: { ...state.settings.theme, contrast },
            lastUpdated: new Date()
          }
        }))
      },

      toggleAnimations: () => {
        set(state => ({
          settings: {
            ...state.settings,
            theme: { 
              ...state.settings.theme, 
              animations: !state.settings.theme.animations 
            },
            lastUpdated: new Date()
          }
        }))
      },

      resetTheme: () => {
        const defaultSettings = createDefaultSettings()
        set(state => ({
          settings: {
            ...state.settings,
            theme: defaultSettings.theme,
            lastUpdated: new Date()
          }
        }))
      },

      // Accessibility
      setScreenReader: (screenReader) => {
        set(state => ({
          settings: {
            ...state.settings,
            accessibility: { ...state.settings.accessibility, screenReader },
            lastUpdated: new Date()
          }
        }))
      },

      setReducedMotion: (reducedMotion) => {
        set(state => ({
          settings: {
            ...state.settings,
            accessibility: { ...state.settings.accessibility, reducedMotion },
            lastUpdated: new Date()
          }
        }))
      },

      setHighContrast: (highContrast) => {
        set(state => ({
          settings: {
            ...state.settings,
            accessibility: { ...state.settings.accessibility, highContrast },
            lastUpdated: new Date()
          }
        }))
      },

      setLargeText: (largeText) => {
        set(state => ({
          settings: {
            ...state.settings,
            accessibility: { ...state.settings.accessibility, largeText },
            lastUpdated: new Date()
          }
        }))
      },

      setFocusVisible: (focusVisible) => {
        set(state => ({
          settings: {
            ...state.settings,
            accessibility: { ...state.settings.accessibility, focusVisible },
            lastUpdated: new Date()
          }
        }))
      },

      setKeyboardNavigation: (keyboardNavigation) => {
        set(state => ({
          settings: {
            ...state.settings,
            accessibility: { ...state.settings.accessibility, keyboardNavigation },
            lastUpdated: new Date()
          }
        }))
      },

      setAnnounceChanges: (announceChanges) => {
        set(state => ({
          settings: {
            ...state.settings,
            accessibility: { ...state.settings.accessibility, announceChanges },
            lastUpdated: new Date()
          }
        }))
      },

      resetAccessibility: () => {
        const defaultSettings = createDefaultSettings()
        set(state => ({
          settings: {
            ...state.settings,
            accessibility: defaultSettings.accessibility,
            lastUpdated: new Date()
          }
        }))
      },

      // Generation preferences
      setDefaultGenerationMode: (defaultMode) => {
        set(state => ({
          settings: {
            ...state.settings,
            generation: { ...state.settings.generation, defaultMode },
            lastUpdated: new Date()
          }
        }))
      },

      setAutoSave: (autoSave) => {
        set(state => ({
          settings: {
            ...state.settings,
            generation: { ...state.settings.generation, autoSave },
            lastUpdated: new Date()
          }
        }))
      },

      setShowTutorials: (showTutorials) => {
        set(state => ({
          settings: {
            ...state.settings,
            generation: { ...state.settings.generation, showTutorials },
            lastUpdated: new Date()
          }
        }))
      },

      setConfirmSkips: (confirmSkips) => {
        set(state => ({
          settings: {
            ...state.settings,
            generation: { ...state.settings.generation, confirmSkips },
            lastUpdated: new Date()
          }
        }))
      },

      setShowDiceRolls: (showDiceRolls) => {
        set(state => ({
          settings: {
            ...state.settings,
            generation: { ...state.settings.generation, showDiceRolls },
            lastUpdated: new Date()
          }
        }))
      },

      setAnimateRolls: (animateRolls) => {
        set(state => ({
          settings: {
            ...state.settings,
            generation: { ...state.settings.generation, animateRolls },
            lastUpdated: new Date()
          }
        }))
      },

      setAutoAdvance: (autoAdvance) => {
        set(state => ({
          settings: {
            ...state.settings,
            generation: { ...state.settings.generation, autoAdvance },
            lastUpdated: new Date()
          }
        }))
      },

      setSaveHistory: (saveHistory) => {
        set(state => ({
          settings: {
            ...state.settings,
            generation: { ...state.settings.generation, saveHistory },
            lastUpdated: new Date()
          }
        }))
      },

      setMaxHistoryItems: (maxHistoryItems) => {
        set(state => ({
          settings: {
            ...state.settings,
            generation: { ...state.settings.generation, maxHistoryItems },
            lastUpdated: new Date()
          }
        }))
      },

      resetGeneration: () => {
        const defaultSettings = createDefaultSettings()
        set(state => ({
          settings: {
            ...state.settings,
            generation: defaultSettings.generation,
            lastUpdated: new Date()
          }
        }))
      },

      // UI preferences
      setSidebarCollapsed: (sidebarCollapsed) => {
        set(state => ({
          settings: {
            ...state.settings,
            ui: { ...state.settings.ui, sidebarCollapsed },
            lastUpdated: new Date()
          }
        }))
      },

      setShowTooltips: (showTooltips) => {
        set(state => ({
          settings: {
            ...state.settings,
            ui: { ...state.settings.ui, showTooltips },
            lastUpdated: new Date()
          }
        }))
      },

      setCompactMode: (compactMode) => {
        set(state => ({
          settings: {
            ...state.settings,
            ui: { ...state.settings.ui, compactMode },
            lastUpdated: new Date()
          }
        }))
      },

      setShowProgressBar: (showProgressBar) => {
        set(state => ({
          settings: {
            ...state.settings,
            ui: { ...state.settings.ui, showProgressBar },
            lastUpdated: new Date()
          }
        }))
      },

      setTableView: (tableView) => {
        set(state => ({
          settings: {
            ...state.settings,
            ui: { ...state.settings.ui, tableView },
            lastUpdated: new Date()
          }
        }))
      },

      setCharacterSheetLayout: (characterSheetLayout) => {
        set(state => ({
          settings: {
            ...state.settings,
            ui: { ...state.settings.ui, characterSheetLayout },
            lastUpdated: new Date()
          }
        }))
      },

      setShowAdvancedOptions: (showAdvancedOptions) => {
        set(state => ({
          settings: {
            ...state.settings,
            ui: { ...state.settings.ui, showAdvancedOptions },
            lastUpdated: new Date()
          }
        }))
      },

      setConfirmActions: (confirmActions) => {
        set(state => ({
          settings: {
            ...state.settings,
            ui: { ...state.settings.ui, confirmActions },
            lastUpdated: new Date()
          }
        }))
      },

      resetUI: () => {
        const defaultSettings = createDefaultSettings()
        set(state => ({
          settings: {
            ...state.settings,
            ui: defaultSettings.ui,
            lastUpdated: new Date()
          }
        }))
      },

      // Notifications
      setNotificationsEnabled: (enabled) => {
        set(state => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, enabled },
            lastUpdated: new Date()
          }
        }))
      },

      setNotificationSound: (sound) => {
        set(state => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, sound },
            lastUpdated: new Date()
          }
        }))
      },

      setDesktopNotifications: (desktop) => {
        set(state => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, desktop },
            lastUpdated: new Date()
          }
        }))
      },

      setErrorNotifications: (errors) => {
        set(state => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, errors },
            lastUpdated: new Date()
          }
        }))
      },

      setWarningNotifications: (warnings) => {
        set(state => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, warnings },
            lastUpdated: new Date()
          }
        }))
      },

      setSuccessNotifications: (successes) => {
        set(state => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, successes },
            lastUpdated: new Date()
          }
        }))
      },

      setGameReminders: (gameReminders) => {
        set(state => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, gameReminders },
            lastUpdated: new Date()
          }
        }))
      },

      setNotificationVolume: (volume) => {
        set(state => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, volume },
            lastUpdated: new Date()
          }
        }))
      },

      resetNotifications: () => {
        const defaultSettings = createDefaultSettings()
        set(state => ({
          settings: {
            ...state.settings,
            notifications: defaultSettings.notifications,
            lastUpdated: new Date()
          }
        }))
      },

      // Export settings
      setDefaultExportFormat: (defaultFormat) => {
        set(state => ({
          settings: {
            ...state.settings,
            export: { ...state.settings.export, defaultFormat },
            lastUpdated: new Date()
          }
        }))
      },

      setIncludeHistory: (includeHistory) => {
        set(state => ({
          settings: {
            ...state.settings,
            export: { ...state.settings.export, includeHistory },
            lastUpdated: new Date()
          }
        }))
      },

      setIncludeNotes: (includeNotes) => {
        set(state => ({
          settings: {
            ...state.settings,
            export: { ...state.settings.export, includeNotes },
            lastUpdated: new Date()
          }
        }))
      },

      setCompressImages: (compressImages) => {
        set(state => ({
          settings: {
            ...state.settings,
            export: { ...state.settings.export, compressImages },
            lastUpdated: new Date()
          }
        }))
      },

      setCustomTemplate: (customTemplate) => {
        set(state => ({
          settings: {
            ...state.settings,
            export: { ...state.settings.export, customTemplate },
            lastUpdated: new Date()
          }
        }))
      },

      resetExport: () => {
        const defaultSettings = createDefaultSettings()
        set(state => ({
          settings: {
            ...state.settings,
            export: defaultSettings.export,
            lastUpdated: new Date()
          }
        }))
      },

      // Privacy settings
      setAnalytics: (analytics) => {
        set(state => ({
          settings: {
            ...state.settings,
            privacy: { ...state.settings.privacy, analytics },
            lastUpdated: new Date()
          }
        }))
      },

      setCrashReporting: (crashReporting) => {
        set(state => ({
          settings: {
            ...state.settings,
            privacy: { ...state.settings.privacy, crashReporting },
            lastUpdated: new Date()
          }
        }))
      },

      setDataCollection: (dataCollection) => {
        set(state => ({
          settings: {
            ...state.settings,
            privacy: { ...state.settings.privacy, dataCollection },
            lastUpdated: new Date()
          }
        }))
      },

      setShareUsageStats: (shareUsageStats) => {
        set(state => ({
          settings: {
            ...state.settings,
            privacy: { ...state.settings.privacy, shareUsageStats },
            lastUpdated: new Date()
          }
        }))
      },

      setRememberSession: (rememberSession) => {
        set(state => ({
          settings: {
            ...state.settings,
            privacy: { ...state.settings.privacy, rememberSession },
            lastUpdated: new Date()
          }
        }))
      },

      setClearOnExit: (clearOnExit) => {
        set(state => ({
          settings: {
            ...state.settings,
            privacy: { ...state.settings.privacy, clearOnExit },
            lastUpdated: new Date()
          }
        }))
      },

      resetPrivacy: () => {
        const defaultSettings = createDefaultSettings()
        set(state => ({
          settings: {
            ...state.settings,
            privacy: defaultSettings.privacy,
            lastUpdated: new Date()
          }
        }))
      },

      // Localization
      setLanguage: (language) => {
        set(state => ({
          settings: {
            ...state.settings,
            localization: { ...state.settings.localization, language },
            lastUpdated: new Date()
          }
        }))
      },

      setRegion: (region) => {
        set(state => ({
          settings: {
            ...state.settings,
            localization: { ...state.settings.localization, region },
            lastUpdated: new Date()
          }
        }))
      },

      setDateFormat: (dateFormat) => {
        set(state => ({
          settings: {
            ...state.settings,
            localization: { ...state.settings.localization, dateFormat },
            lastUpdated: new Date()
          }
        }))
      },

      setTimeFormat: (timeFormat) => {
        set(state => ({
          settings: {
            ...state.settings,
            localization: { ...state.settings.localization, timeFormat },
            lastUpdated: new Date()
          }
        }))
      },

      setNumberFormat: (numberFormat) => {
        set(state => ({
          settings: {
            ...state.settings,
            localization: { ...state.settings.localization, numberFormat },
            lastUpdated: new Date()
          }
        }))
      },

      setCurrency: (currency) => {
        set(state => ({
          settings: {
            ...state.settings,
            localization: { ...state.settings.localization, currency },
            lastUpdated: new Date()
          }
        }))
      },

      resetLocalization: () => {
        const defaultSettings = createDefaultSettings()
        set(state => ({
          settings: {
            ...state.settings,
            localization: defaultSettings.localization,
            lastUpdated: new Date()
          }
        }))
      },

      // Bulk operations
      updateSettings: (updates) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...updates,
            lastUpdated: new Date()
          }
        }))
      },

      resetAllSettings: () => {
        set({
          settings: createDefaultSettings(),
          error: null
        })
      },

      exportSettings: () => {
        const { settings } = get()
        return JSON.stringify(settings, null, 2)
      },

      importSettings: (data) => {
        try {
          const importedSettings = JSON.parse(data)
          set({ settings: { ...importedSettings, lastUpdated: new Date() }, error: null })
          return true
        } catch (error) {
          set({ error: 'Failed to import settings: Invalid JSON format' })
          return false
        }
      },

      // Computed properties
      getCurrentTheme: () => {
        const { settings } = get()
        return settings.theme
      },

      getAccessibilityStatus: () => {
        const { settings } = get()
        const accessibility = settings.accessibility
        const enabled = Object.values(accessibility).some(value => value === true)
        const count = Object.values(accessibility).filter(value => value === true).length
        return { enabled, count }
      },

      getNotificationStatus: () => {
        const { settings } = get()
        const notifications = settings.notifications
        const enabled = notifications.enabled
        const types: string[] = []
        
        if (notifications.errors) types.push('errors')
        if (notifications.warnings) types.push('warnings')
        if (notifications.successes) types.push('successes')
        if (notifications.gameReminders) types.push('reminders')
        
        return { enabled, types }
      },

      // Utilities
      setLoading: (isLoading) => {
        set({ isLoading })
      },

      setError: (error) => {
        set({ error })
      },

      markTutorialCompleted: () => {
        set(state => ({
          settings: {
            ...state.settings,
            tutorialCompleted: true,
            lastUpdated: new Date()
          }
        }))
      },

      resetFirstRun: () => {
        set(state => ({
          settings: {
            ...state.settings,
            firstRun: false,
            lastUpdated: new Date()
          }
        }))
      },

      // Migration and versioning
      migrateSettings: (oldVersion, newVersion) => {
        // Handle settings migration between versions
        console.log(`Migrating settings from ${oldVersion} to ${newVersion}`)
        
        set(state => ({
          settings: {
            ...state.settings,
            version: newVersion,
            lastUpdated: new Date()
          }
        }))
      },

      getSettingsVersion: () => {
        const { settings } = get()
        return settings.version
      }
    })),
    {
      name: APP_CONFIG.storageKeys.settings,
      partialize: (state) => ({ settings: state.settings })
    }
  )
)