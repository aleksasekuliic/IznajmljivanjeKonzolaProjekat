import { useState } from 'react'
import { Gamepad2, AlertCircle, Info } from 'lucide-react'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import { useKonzole } from '../lib/hooks'
import { PageHeader } from '../components/Layout.jsx'
import { CenterSpinner, EmptyState } from '../components/ui.jsx'
import SearchInput from '../components/SearchInput.jsx'
import KonzolaCard from '../components/KonzolaCard.jsx'
import { pendingError } from '../lib/api'

export default function KatalogPage() {
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search, 300)
  const { data: konzole, isLoading, isError, error } = useKonzole(q)

  return (
    <div>
      <PageHeader title="Katalog konzola" subtitle="Pregledaj konzole dostupne za iznajmljivanje." />

      <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3 text-[13px] text-ink-soft">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p>
          Za iznajmljivanje se obrati radniku na šalteru — on kreira iznajmljivanje na tvoje ime.
          Svoja iznajmljivanja možeš pratiti u sekciji <strong className="text-ink">„Moja iznajmljivanja"</strong>.
        </p>
      </div>

      <div className="mb-6 max-w-md">
        <SearchInput value={search} onChange={setSearch} placeholder="Pretraži konzole…" />
      </div>

      {isLoading ? (
        <CenterSpinner label="Učitavanje kataloga…" />
      ) : isError ? (
        <EmptyState icon={AlertCircle} title="Greška pri učitavanju" description={pendingError(error)} />
      ) : konzole.length === 0 ? (
        <EmptyState icon={Gamepad2} title="Nema konzola" description="Trenutno nema konzola u katalogu." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {konzole.map((k) => (
            <KonzolaCard key={k.id} konzola={k} />
          ))}
        </div>
      )}
    </div>
  )
}
