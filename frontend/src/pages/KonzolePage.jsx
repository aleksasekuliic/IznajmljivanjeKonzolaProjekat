import { useState } from 'react'
import { Plus, Gamepad2, AlertCircle } from 'lucide-react'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import { useKonzole, useKreirajKonzolu, useIzmeniKonzolu, useObrisiKonzolu } from '../lib/hooks'
import { PageHeader } from '../components/Layout.jsx'
import { Button, CenterSpinner, EmptyState } from '../components/ui.jsx'
import SearchInput from '../components/SearchInput.jsx'
import KonzolaCard from '../components/KonzolaCard.jsx'
import KonzolaForm from '../components/KonzolaForm.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { useToast } from '../components/Toast.jsx'
import { pendingError } from '../lib/api'

export default function KonzolePage() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search, 300)
  const { data: konzole, isLoading, isError, error } = useKonzole(q)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [brisanje, setBrisanje] = useState(null)

  const kreiraj = useKreirajKonzolu()
  const izmeni = useIzmeniKonzolu()
  const obrisi = useObrisiKonzolu()

  const otvoriNovu = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const otvoriIzmenu = (k) => {
    setEditing(k)
    setFormOpen(true)
  }

  const sacuvaj = async (dto) => {
    try {
      if (editing) {
        await izmeni.mutateAsync({ id: editing.id, dto })
        toast.success('Konzola je izmenjena.')
      } else {
        await kreiraj.mutateAsync(dto)
        toast.success('Konzola je dodata.')
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      toast.error(pendingError(err))
    }
  }

  const potvrdiBrisanje = async () => {
    try {
      await obrisi.mutateAsync(brisanje.id)
      toast.success('Konzola je obrisana.')
      setBrisanje(null)
    } catch (err) {
      toast.error(pendingError(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Konzole"
        subtitle="Inventar konzola dostupnih za iznajmljivanje."
        actions={
          <Button onClick={otvoriNovu}>
            <Plus className="h-4 w-4" />
            Nova konzola
          </Button>
        }
      />

      <div className="mb-6 max-w-md">
        <SearchInput value={search} onChange={setSearch} placeholder="Pretraži po nazivu, modelu, proizvođaču…" />
      </div>

      {isLoading ? (
        <CenterSpinner label="Učitavanje konzola…" />
      ) : isError ? (
        <EmptyState icon={AlertCircle} title="Greška pri učitavanju" description={pendingError(error)} />
      ) : konzole.length === 0 ? (
        <EmptyState
          icon={Gamepad2}
          title={q ? 'Nema rezultata' : 'Još nema konzola'}
          description={q ? 'Pokušaj sa drugim pojmom.' : 'Dodaj prvu konzolu u inventar.'}
          action={!q && <Button onClick={otvoriNovu}><Plus className="h-4 w-4" />Nova konzola</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {konzole.map((k) => (
            <KonzolaCard key={k.id} konzola={k} onEdit={otvoriIzmenu} onDelete={setBrisanje} />
          ))}
        </div>
      )}

      <KonzolaForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={sacuvaj}
        konzola={editing}
        loading={kreiraj.isPending || izmeni.isPending}
      />

      <ConfirmModal
        open={!!brisanje}
        onClose={() => setBrisanje(null)}
        onConfirm={potvrdiBrisanje}
        title="Obriši konzolu"
        message={`Da li sigurno želiš da obrišeš „${brisanje?.naziv}"? Ova akcija je nepovratna.`}
        confirmLabel="Obriši"
        tone="danger"
        loading={obrisi.isPending}
      />
    </div>
  )
}
