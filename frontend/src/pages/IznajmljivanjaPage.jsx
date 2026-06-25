import { useState } from 'react'
import { Plus, ClipboardList, AlertCircle } from 'lucide-react'
import { useIznajmljivanja, usePromeniStatus, useDodajKredit } from '../lib/hooks'
import { PageHeader } from '../components/Layout.jsx'
import { Button, CenterSpinner, EmptyState, cx } from '../components/ui.jsx'
import IznajmljivanjeCard from '../components/IznajmljivanjeCard.jsx'
import NovoIznajmljivanjeModal from '../components/NovoIznajmljivanjeModal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { useToast } from '../components/Toast.jsx'
import { pendingError } from '../lib/api'
import { dinar } from '../lib/format'
import { STATUS_LIST, statusIndex, statusMeta } from '../lib/constants'

const FILTERI = [{ key: '', label: 'Sve' }, ...STATUS_LIST.map((s) => ({ key: s, label: statusMeta(s).label }))]

export default function IznajmljivanjaPage() {
  const toast = useToast()
  const [filter, setFilter] = useState('')
  const statusParam = filter ? statusIndex(filter) : undefined
  const { data, isLoading, isError, error } = useIznajmljivanja({ status: statusParam })

  const [novo, setNovo] = useState(false)
  const promeni = usePromeniStatus()
  const dodajKredit = useDodajKredit()
  const [akcija, setAkcija] = useState(null) // { i, status }

  const potvrdiAkciju = async () => {
    const { i, status } = akcija
    try {
      await promeni.mutateAsync({ id: i.id, status: statusIndex(status) })

      // Naplata: pri završetku iznajmljivanja skidamo ukupan iznos sa kredita klijenta.
      if (status === 'Zavrseno' && i.ukupanIznos > 0) {
        await dodajKredit.mutateAsync({ id: i.klijentId, iznos: -i.ukupanIznos })
        toast.success(`Iznajmljivanje #${i.id} završeno. Naplaćeno ${dinar(i.ukupanIznos)} sa kredita.`)
      } else {
        toast.success(`Iznajmljivanje #${i.id} — ${statusMeta(status).label.toLowerCase()}.`)
      }
      setAkcija(null)
    } catch (err) {
      toast.error(pendingError(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Iznajmljivanja"
        subtitle="Kreiraj i prati iznajmljivanja konzola."
        actions={
          <Button onClick={() => setNovo(true)}>
            <Plus className="h-4 w-4" />
            Novo iznajmljivanje
          </Button>
        }
      />

      {/* Filter po statusu */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERI.map((f) => (
          <button
            key={f.key || 'all'}
            onClick={() => setFilter(f.key)}
            className={cx(
              'rounded-full px-4 py-1.5 text-[13px] font-medium transition',
              filter === f.key
                ? 'bg-ink text-white'
                : 'bg-surface text-ink-soft border border-line hover:bg-surface-muted'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <CenterSpinner label="Učitavanje iznajmljivanja…" />
      ) : isError ? (
        <EmptyState icon={AlertCircle} title="Greška pri učitavanju" description={pendingError(error)} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={filter ? 'Nema iznajmljivanja u ovom statusu' : 'Još nema iznajmljivanja'}
          description={filter ? 'Promeni filter ili kreiraj novo.' : 'Kreiraj prvo iznajmljivanje.'}
          action={
            <Button onClick={() => setNovo(true)}>
              <Plus className="h-4 w-4" />
              Novo iznajmljivanje
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3.5">
          {data.map((i) => (
            <IznajmljivanjeCard
              key={i.id}
              iznajmljivanje={i}
              onZavrsi={(it) => setAkcija({ i: it, status: 'Zavrseno' })}
              onOtkazi={(it) => setAkcija({ i: it, status: 'Otkazano' })}
            />
          ))}
        </div>
      )}

      <NovoIznajmljivanjeModal open={novo} onClose={() => setNovo(false)} />

      <ConfirmModal
        open={!!akcija}
        onClose={() => setAkcija(null)}
        onConfirm={potvrdiAkciju}
        title={akcija?.status === 'Otkazano' ? 'Otkaži iznajmljivanje' : 'Završi iznajmljivanje'}
        message={
          akcija?.status === 'Otkazano'
            ? `Otkazati iznajmljivanje #${akcija?.i.id}? Oprema se vraća u status „Dostupno", kredit se ne naplaćuje.`
            : `Završiti iznajmljivanje #${akcija?.i.id}? Klijentu se naplaćuje ${dinar(akcija?.i.ukupanIznos)} sa kredita, a oprema se vraća u „Dostupno".`
        }
        confirmLabel={akcija?.status === 'Otkazano' ? 'Otkaži iznajmljivanje' : 'Završi i naplati'}
        tone={akcija?.status === 'Otkazano' ? 'danger' : 'primary'}
        loading={promeni.isPending || dodajKredit.isPending}
      />
    </div>
  )
}
