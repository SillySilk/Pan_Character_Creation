// Progress Tracking Component for PanCasting Generation Wizard

import React from 'react'
import { Character } from '../../types/character'

interface ProgressTrackerProps {
  character?: Character
  currentStep: string
  completedSteps: Set<string>
  totalSteps: number
  className?: string
}

interface StepRequirement {
  id: string
  name: string
  check: (character: Character) => boolean
  description: string
}

export function ProgressTracker({
  character,
  currentStep,
  completedSteps,
  totalSteps,
  className = ''
}: ProgressTrackerProps) {
  
  // Define requirements for character completion
  const requirements: StepRequirement[] = [
    {
      id: 'heritage',
      name: 'Heritage',
      check: (char) => !!(char.race?.name && char.culture?.name),
      description: 'Race and cultural background determined'
    },
    {
      id: 'youth',
      name: 'Youth Events',
      check: (char) => !!(char.youthEvents && char.youthEvents.length > 0),
      description: 'Childhood and adolescent experiences'
    },
    {
      id: 'occupations',
      name: 'Training',
      check: (char) => !!(char.occupations && char.occupations.length > 0),
      description: 'Professional training and skills'
    },
    {
      id: 'adulthood',
      name: 'Adult Life',
      check: (char) => !!(char.adulthoodEvents && char.adulthoodEvents.length > 0),
      description: 'Major adult life experiences'
    },
    {
      id: 'personality',
      name: 'Personality',
      check: (char) => !!(char.personalityTraits && char.personalityTraits.length >= 3),
      description: 'Core personality traits defined'
    },
    {
      id: 'attributes',
      name: 'Attributes',
      check: (char) => !!(char.attributes && Object.keys(char.attributes).length >= 6),
      description: 'Core attributes assigned'
    }
  ]

  const getCompletionPercentage = () => {
    return Math.round((completedSteps.size / totalSteps) * 100)
  }

  const getCharacterCompleteness = () => {
    if (!character) return 0
    
    const completedReqs = requirements.filter(req => req.check(character))
    return Math.round((completedReqs.length / requirements.length) * 100)
  }

  const getOverallProgress = () => {
    const wizardProgress = getCompletionPercentage()
    const characterProgress = getCharacterCompleteness()
    return Math.round((wizardProgress + characterProgress) / 2)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'green'
    if (percentage >= 60) return 'blue'
    if (percentage >= 40) return 'yellow'
    return 'red'
  }

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: 'bg-green-500',
        text: 'text-green-800',
        border: 'border-green-500',
        light: 'bg-green-100'
      },
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-800',
        border: 'border-blue-500',
        light: 'bg-blue-100'
      },
      yellow: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-800',
        border: 'border-yellow-500',
        light: 'bg-yellow-100'
      },
      red: {
        bg: 'bg-red-500',
        text: 'text-red-800',
        border: 'border-red-500',
        light: 'bg-red-100'
      }
    }
    return colors[color as keyof typeof colors] || colors.red
  }

  const overallProgress = getOverallProgress()
  const progressColor = getProgressColor(overallProgress)
  const colorClasses = getColorClasses(progressColor)

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Generation Progress</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${colorClasses.light} ${colorClasses.text}`}>
          {overallProgress}%
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{overallProgress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${colorClasses.bg}`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Wizard Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Wizard Steps</span>
          <span>{completedSteps.size} of {totalSteps} complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-amber-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Character Requirements */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800 text-sm">Character Requirements</h4>
        {requirements.map(requirement => {
          const isComplete = character ? requirement.check(character) : false
          
          return (
            <div key={requirement.id} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isComplete ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {isComplete && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm ${
                  isComplete ? 'text-green-800' : 'text-gray-700'
                }`}>
                  {requirement.name}
                </div>
                <div className="text-xs text-gray-500">
                  {requirement.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Character Stats */}
      {character && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-800 text-sm mb-3">Character Statistics</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="font-bold text-blue-600">
                {character.personalityTraits?.length || 0}
              </div>
              <div className="text-gray-600 text-xs">Traits</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">
                {character.skills ? Object.keys(character.skills).length : 0}
              </div>
              <div className="text-gray-600 text-xs">Skills</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-600">
                {character.occupations?.length || 0}
              </div>
              <div className="text-gray-600 text-xs">Occupations</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-600">
                {character.generationHistory?.length || 0}
              </div>
              <div className="text-gray-600 text-xs">Events</div>
            </div>
          </div>
        </div>
      )}

      {/* Generation Tips */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-medium text-blue-800 text-sm mb-2">Tips</h5>
        <ul className="text-blue-700 text-xs space-y-1">
          <li>• Complete each step to unlock the next</li>
          <li>• Click step names to navigate backward</li>
          <li>• Character details update in real-time</li>
          <li>• All progress is automatically saved</li>
        </ul>
      </div>
    </div>
  )
}

// Mini Progress Component
interface MiniProgressProps {
  completedSteps: number
  totalSteps: number
  className?: string
}

export function MiniProgress({ completedSteps, totalSteps, className = '' }: MiniProgressProps) {
  const percentage = Math.round((completedSteps / totalSteps) * 100)
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 min-w-max">
        {completedSteps}/{totalSteps}
      </span>
    </div>
  )
}

// Circular Progress Component
interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgress({ 
  percentage, 
  size = 48, 
  strokeWidth = 4, 
  className = '' 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  const getColor = (perc: number) => {
    if (perc >= 80) return '#10b981' // green-500
    if (perc >= 60) return '#3b82f6'  // blue-500
    if (perc >= 40) return '#f59e0b'  // yellow-500
    return '#ef4444'                   // red-500
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">
          {percentage}%
        </span>
      </div>
    </div>
  )
}