import { useState, useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const typeStyles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white'
  }

  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg ${typeStyles[type]} animate-in slide-in-from-top-2`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{typeIcons[type]}</span>
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Toast hook for easy usage
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type: ToastProps['type']
    duration?: number
  }>>([])

  const showToast = (message: string, type: ToastProps['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )

  return {
    showToast,
    ToastContainer,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    warning: (message: string) => showToast(message, 'warning'),
    info: (message: string) => showToast(message, 'info')
  }
}