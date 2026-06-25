import { useState } from 'react'
import { Gamepad2, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../lib/auth.jsx'
import { Badge, cx } from './ui.jsx'
import { inicijali } from '../lib/format'

function NavList({ nav, active, onNavigate, onPick }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const Icon = item.icon
        const isActive = item.key === active
        return (
          <button
            key={item.key}
            onClick={() => {
              onNavigate(item.key)
              onPick?.()
            }}
            className={cx(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-accent/10 text-accent'
                : 'text-ink-soft hover:bg-surface-muted hover:text-ink'
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

function UserCard() {
  const { user, isRadnik, logout } = useAuth()
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line/70 bg-surface-sunken p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-sm font-semibold text-accent">
        {inicijali(user?.name?.split('@')[0] ?? user?.name, '')}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{user?.name ?? 'Korisnik'}</p>
        <Badge tone={isRadnik ? 'neutral' : 'muted'} className="mt-0.5">
          {isRadnik ? 'Radnik' : 'Klijent'}
        </Badge>
      </div>
      <button
        onClick={logout}
        title="Odjava"
        className="rounded-xl p-2 text-ink-faint transition hover:bg-surface-muted hover:text-danger"
      >
        <LogOut className="h-[18px] w-[18px]" />
      </button>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink text-white">
        <Gamepad2 className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <p className="text-[15px] font-semibold tracking-tight text-ink">Konzola</p>
        <p className="text-[11px] text-ink-faint">Iznajmljivanje</p>
      </div>
    </div>
  )
}

export default function AppShell({ nav, active, onNavigate, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeLabel = nav.find((n) => n.key === active)?.label ?? ''

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-line/70 bg-surface px-4 py-5 lg:flex">
        <Brand />
        <div className="flex-1">
          <NavList nav={nav} active={active} onNavigate={onNavigate} />
        </div>
        <UserCard />
      </aside>

      {/* Mobile top bar */}
      <header className="glass sticky top-0 z-30 flex items-center justify-between border-b border-line/60 px-4 py-3 lg:hidden">
        <Brand />
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl p-2 text-ink-soft hover:bg-surface-muted"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col gap-6 bg-surface px-4 py-5 shadow-pop animate-scale-in">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 text-ink-faint hover:bg-surface-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1">
              <NavList
                nav={nav}
                active={active}
                onNavigate={onNavigate}
                onPick={() => setMobileOpen(false)}
              />
            </div>
            <UserCard />
          </div>
        </div>
      )}

      {/* Glavni sadržaj */}
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}

/* Zaglavlje stranice — koristi se na vrhu svake sekcije */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  )
}
