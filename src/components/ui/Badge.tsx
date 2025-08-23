import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-amber-600 text-amber-50 hover:bg-amber-700',
        secondary: 'border-transparent bg-amber-100 text-amber-900 hover:bg-amber-200',
        destructive: 'border-transparent bg-red-600 text-red-50 hover:bg-red-700',
        outline: 'text-amber-900 border-amber-600',
        success: 'border-transparent bg-emerald-600 text-emerald-50 hover:bg-emerald-700',
        warning: 'border-transparent bg-orange-600 text-orange-50 hover:bg-orange-700',
        info: 'border-transparent bg-blue-600 text-blue-50 hover:bg-blue-700',
        magical: 'border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
        lightside: 'border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        darkside: 'border-transparent bg-gradient-to-r from-red-600 to-pink-600 text-white',
        neutral: 'border-transparent bg-gradient-to-r from-gray-500 to-slate-500 text-white',
        exotic: 'border-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ variant })} {...props} />
  )
}

export { Badge, badgeVariants }