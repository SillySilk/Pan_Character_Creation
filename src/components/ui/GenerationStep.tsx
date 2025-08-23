import { CheckCircle, Circle, Play, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import { Progress } from './Progress'

export interface StepData {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'skipped'
  category: string
  estimatedDuration?: number
  requirements?: string[]
}

export interface GenerationStepProps {
  step: StepData
  stepNumber: number
  totalSteps: number
  onStart?: () => void
  onComplete?: () => void
  isActive?: boolean
  showProgress?: boolean
}

export function GenerationStep({
  step,
  stepNumber,
  totalSteps,
  onStart,
  onComplete,
  isActive = false,
  showProgress = true
}: GenerationStepProps) {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case 'in-progress':
        return <Play className="h-5 w-5 text-amber-600 animate-pulse" />
      case 'skipped':
        return <Circle className="h-5 w-5 text-gray-400" />
      default:
        return <Circle className="h-5 w-5 text-amber-300" />
    }
  }

  const getStatusBadge = () => {
    const variants = {
      'pending': 'outline' as const,
      'in-progress': 'warning' as const,
      'completed': 'success' as const,
      'skipped': 'secondary' as const
    }
    
    return (
      <Badge variant={variants[step.status]}>
        {step.status.replace('-', ' ')}
      </Badge>
    )
  }

  const getCategoryBadge = () => {
    const categoryColors = {
      'Heritage': 'lightside' as const,
      'Youth': 'success' as const,
      'Occupations': 'warning' as const,
      'Adulthood': 'info' as const,
      'Personality': 'magical' as const,
      'Miscellaneous': 'neutral' as const,
      'Contacts': 'darkside' as const,
      'Special': 'exotic' as const
    }
    
    return (
      <Badge variant={categoryColors[step.category as keyof typeof categoryColors] || 'default'}>
        {step.category}
      </Badge>
    )
  }

  const progressPercentage = showProgress 
    ? (stepNumber / totalSteps) * 100 
    : step.status === 'completed' ? 100 : 0

  return (
    <Card className={`w-full transition-all duration-200 ${
      isActive ? 'ring-2 ring-amber-600 shadow-lg' : ''
    } ${step.status === 'completed' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg">
                Step {stepNumber}: {step.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {getCategoryBadge()}
                {getStatusBadge()}
              </div>
            </div>
          </div>
          
          {/* Estimated Duration */}
          {step.estimatedDuration && (
            <div className="flex items-center text-sm text-amber-600">
              <Clock className="h-4 w-4 mr-1" />
              ~{step.estimatedDuration}min
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {showProgress && (
          <Progress 
            value={progressPercentage} 
            variant={step.status === 'completed' ? 'success' : 'default'}
          />
        )}
        
        {/* Description */}
        <p className="text-sm text-amber-700">
          {step.description}
        </p>
        
        {/* Requirements */}
        {step.requirements && step.requirements.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-amber-900">Requirements:</div>
            <ul className="text-xs text-amber-700 space-y-1">
              {step.requirements.map((req, index) => (
                <li key={index} className="flex items-center">
                  <Circle className="h-2 w-2 mr-2 fill-current" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Action Buttons */}
        {step.status === 'pending' && isActive && (
          <div className="flex space-x-2">
            <Button variant="default" onClick={onStart}>
              <Play className="h-4 w-4 mr-2" />
              Start Step
            </Button>
          </div>
        )}
        
        {step.status === 'in-progress' && isActive && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onComplete}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}