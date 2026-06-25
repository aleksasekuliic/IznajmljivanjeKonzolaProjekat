import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

/* ----------------------------------- Button ---------------------------------- */
const BUTTON_VARIANTS = {
  primary:
    'bg-accent text-white hover:bg-accent-hover active:bg-accent-press shadow-sm disabled:bg-accent/50',
  secondary:
    'bg-surface text-ink border border-line hover:bg-surface-muted active:bg-surface-muted disabled:text-ink-faint',
  subtle:
    'bg-surface-muted text-ink hover:bg-line/50 active:bg-line/60 disabled:text-ink-faint',
  ghost:
    'bg-transparent text-accent hover:bg-accent/10 active:bg-accent/15 disabled:text-ink-faint',
  danger:
    'bg-danger text-white hover:bg-danger/90 active:bg-danger/80 shadow-sm disabled:bg-danger/50',
  dangerGhost:
    'bg-transparent text-danger hover:bg-danger/10 active:bg-danger/15 disabled:text-ink-faint',
}

const BUTTON_SIZES = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-[15px] gap-2 rounded-2xl',
}

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cx(
        'inline-flex select-none items-center justify-center font-medium transition-all duration-150',
        'focus-visible:shadow-focus disabled:cursor-not-allowed active:scale-[0.98]',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      )}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})

/* ----------------------------------- Field ----------------------------------- */
export function Field({ label, hint, error, required, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="text-[13px] font-medium text-ink-soft">
          {label}
          {required && <span className="text-danger"> *</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className="text-[12px] text-danger">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-ink-faint">{hint}</span>
      ) : null}
    </label>
  )
}

const FIELD_BASE =
  'w-full rounded-xl border bg-surface px-3.5 text-sm text-ink placeholder:text-ink-faint ' +
  'transition focus:border-accent focus-visible:shadow-focus disabled:bg-surface-muted disabled:text-ink-faint'

export const Input = forwardRef(function Input({ className, invalid, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={cx(FIELD_BASE, 'h-11', invalid ? 'border-danger' : 'border-line', className)}
      {...rest}
    />
  )
})

export const Select = forwardRef(function Select({ className, invalid, children, ...rest }, ref) {
  return (
    <select
      ref={ref}
      className={cx(
        FIELD_BASE,
        'h-11 appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-9',
        invalid ? 'border-danger' : 'border-line',
        className
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2386868b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
      }}
      {...rest}
    >
      {children}
    </select>
  )
})

/* ----------------------------------- Card ------------------------------------ */
export function Card({ className, children, ...rest }) {
  return (
    <div
      className={cx('rounded-2xl border border-line/70 bg-surface shadow-card', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ----------------------------------- Badge ----------------------------------- */
const BADGE_TONES = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/12 text-warning',
  danger: 'bg-danger/10 text-danger',
  muted: 'bg-ink/8 text-ink-soft',
  neutral: 'bg-accent/10 text-accent',
}

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium',
        BADGE_TONES[tone] ?? BADGE_TONES.neutral,
        className
      )}
    >
      {children}
    </span>
  )
}

/* ---------------------------------- Spinner ---------------------------------- */
export function Spinner({ className }) {
  return <Loader2 className={cx('h-5 w-5 animate-spin text-ink-faint', className)} />
}

export function CenterSpinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-faint">
      <Spinner className="h-7 w-7" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  )
}

/* --------------------------------- EmptyState -------------------------------- */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface-sunken px-6 py-16 text-center">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-ink-faint">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

export { cx }
