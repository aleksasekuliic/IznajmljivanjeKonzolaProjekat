import { Search, X } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Pretraži…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-9 text-sm text-ink placeholder:text-ink-faint transition focus:border-accent focus-visible:shadow-focus"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-faint transition hover:bg-surface-muted hover:text-ink"
          aria-label="Očisti"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
