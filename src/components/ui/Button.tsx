import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-amber-600 text-amber-50 hover:bg-amber-700 shadow-md border border-amber-700',
        destructive: 'bg-red-600 text-red-50 hover:bg-red-700 shadow-md border border-red-700',
        outline: 'border border-amber-600 text-amber-900 hover:bg-amber-50 hover:text-amber-900',
        secondary: 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300',
        ghost: 'text-amber-900 hover:bg-amber-100 hover:text-amber-900',
        link: 'underline-offset-4 hover:underline text-amber-700 hover:text-amber-800',
        magical: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg border border-purple-700',
        dice: 'bg-emerald-600 text-emerald-50 hover:bg-emerald-700 shadow-md border border-emerald-700'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }