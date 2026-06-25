import { Receipt, AlertCircle } from 'lucide-react'
import { useIznajmljivanja } from '../lib/hooks'
import { useAuth } from '../lib/auth.jsx'
import { PageHeader } from '../components/Layout.jsx'
import { CenterSpinner, EmptyState } from '../components/ui.jsx'
import IznajmljivanjeCard from '../components/IznajmljivanjeCard.jsx'
import { pendingError } from '../lib/api'

export default function MojaIznajmljivanjaPage() {
  const { user } = useAuth()
  const { data, isLoading, isError, error } = useIznajmljivanja({ klijentId: user?.klijentId })

  return (
    <div>
      <PageHeader title="Moja iznajmljivanja" subtitle="Pregled tvojih iznajmljivanja konzola." />

      {isLoading ? (
        <CenterSpinner label="Učitavanje…" />
      ) : isError ? (
        <EmptyState icon={AlertCircle} title="Greška pri učitavanju" description={pendingError(error)} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Još nemaš iznajmljivanja"
          description="Kada radnik kreira iznajmljivanje na tvoje ime, pojaviće se ovde."
        />
      ) : (
        <div className="flex flex-col gap-3.5">
          {data.map((i) => (
            <IznajmljivanjeCard key={i.id} iznajmljivanje={i} showKlijent={false} />
          ))}
        </div>
      )}
    </div>
  )
}
