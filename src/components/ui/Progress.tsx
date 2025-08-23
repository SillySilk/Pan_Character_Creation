import { forwardRef, HTMLAttributes } from 'react'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const variantClasses = {
      default: 'bg-amber-600',
      success: 'bg-emerald-600',
      warning: 'bg-orange-600',
      error: 'bg-red-600'
    }

    return (
      <div
        ref={ref}
        className={`relative h-4 w-full overflow-hidden rounded-full bg-amber-100 border border-amber-200 ${className || ''}`}
        {...props}
      >
        <div
          className={`h-full w-full flex-1 transition-all duration-300 ease-in-out ${variantClasses[variant]}`}
          style={{ 
            transform: `translateX(-${100 - percentage}%)`,
            background: variant === 'default' 
              ? 'linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #d97706 100%)'
              : undefined
          }}
        />
        {/* Optional percentage text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-amber-900">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress }