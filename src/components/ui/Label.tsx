import { forwardRef, LabelHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-amber-900',
        muted: 'text-amber-700',
        accent: 'text-amber-800 font-semibold',
        error: 'text-red-700',
        success: 'text-emerald-700'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, ...props }, ref) => (
    <label
      ref={ref}
      className={labelVariants({ variant, className })}
      {...props}
    />
  )
)
Label.displayName = 'Label'

export { Label }