import { forwardRef, HTMLAttributes } from 'react'

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      className={`shrink-0 bg-amber-300 ${
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
      } ${className || ''}`}
      {...props}
    />
  )
)
Separator.displayName = 'Separator'

export { Separator }