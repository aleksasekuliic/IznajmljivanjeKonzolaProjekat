import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const TONES = {
  success: { icon: CheckCircle2, ring: 'text-success' },
  error: { icon: AlertCircle, ring: 'text-danger' },
  info: { icon: Info, ring: 'text-accent' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, tone = 'info', timeout = 3800) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { id, message, tone }])
      if (timeout) setTimeout(() => dismiss(id), timeout)
      return id
    },
    [dismiss]
  )

  const toast = {
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error', 5000),
    info: (m) => push(m, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[360px] max-w-[calc(100vw-2.5rem)] flex-col gap-2.5">
        {toasts.map((t) => {
          const { icon: Icon, ring } = TONES[t.tone] ?? TONES.info
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line/70 bg-surface/95 px-4 py-3 shadow-pop animate-scale-in"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${ring}`} />
              <p className="flex-1 text-sm leading-snug text-ink">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="-mr-1 -mt-0.5 rounded-lg p-1 text-ink-faint transition hover:bg-surface-muted hover:text-ink"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast mora biti unutar ToastProvider-a')
  return ctx
}
