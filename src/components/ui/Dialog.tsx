import { createContext, useContext, useState, ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface DialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | null>(null)

interface DialogProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children, ...props }: { children: ReactNode; [key: string]: any }) {
  const context = useContext(DialogContext)
  if (!context) throw new Error('DialogTrigger must be used within Dialog')
  
  return (
    <div onClick={() => context.setOpen(true)} {...props}>
      {children}
    </div>
  )
}

export function DialogContent({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: any }) {
  const context = useContext(DialogContext)
  if (!context) throw new Error('DialogContent must be used within Dialog')
  
  if (!context.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => context.setOpen(false)}
      />
      
      {/* Content */}
      <div 
        className={`relative bg-parchment rounded-lg border border-amber-300 shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto ${className || ''}`}
        {...props}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => context.setOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: any }) {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0 ${className || ''}`} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: any }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight text-amber-900 ${className || ''}`} {...props}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: any }) {
  return (
    <p className={`text-sm text-amber-700 ${className || ''}`} {...props}>
      {children}
    </p>
  )
}

export function DialogFooter({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: any }) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0 ${className || ''}`} {...props}>
      {children}
    </div>
  )
}