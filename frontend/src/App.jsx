import { useState } from 'react'
import { useAuth } from './lib/auth.jsx'
import AuthPage from './pages/AuthPage.jsx'
import AppShell from './components/Layout.jsx'
import KonzolePage from './pages/KonzolePage.jsx'
import KlijentiPage from './pages/KlijentiPage.jsx'
import IznajmljivanjaPage from './pages/IznajmljivanjaPage.jsx'
import KatalogPage from './pages/KatalogPage.jsx'
import MojaIznajmljivanjaPage from './pages/MojaIznajmljivanjaPage.jsx'
import { Gamepad2, Users, ClipboardList, LayoutGrid, Receipt } from 'lucide-react'

const RADNIK_NAV = [
  { key: 'konzole', label: 'Konzole', icon: Gamepad2, render: () => <KonzolePage /> },
  { key: 'klijenti', label: 'Klijenti', icon: Users, render: () => <KlijentiPage /> },
  {
    key: 'iznajmljivanja',
    label: 'Iznajmljivanja',
    icon: ClipboardList,
    render: () => <IznajmljivanjaPage />,
  },
]

const KLIJENT_NAV = [
  { key: 'katalog', label: 'Katalog', icon: LayoutGrid, render: () => <KatalogPage /> },
  {
    key: 'moja',
    label: 'Moja iznajmljivanja',
    icon: Receipt,
    render: () => <MojaIznajmljivanjaPage />,
  },
]

export default function App() {
  const { isAuthenticated, isRadnik } = useAuth()
  const nav = isRadnik ? RADNIK_NAV : KLIJENT_NAV
  const [active, setActive] = useState(nav[0].key)

  if (!isAuthenticated) return <AuthPage />

  const current = nav.find((n) => n.key === active) ?? nav[0]

  return (
    <AppShell nav={nav} active={current.key} onNavigate={setActive}>
      {current.render()}
    </AppShell>
  )
}
