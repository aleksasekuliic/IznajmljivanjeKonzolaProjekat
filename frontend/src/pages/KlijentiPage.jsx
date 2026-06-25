import { useState } from 'react'
import { Users, AlertCircle, Pencil, Wallet, Mail, Phone, MapPin } from 'lucide-react'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import { useKlijenti, useIzmeniKlijenta, useDodajKredit } from '../lib/hooks'
import { PageHeader } from '../components/Layout.jsx'
import { Card, Button, Input, Select, Field, CenterSpinner, EmptyState } from '../components/ui.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Modal from '../components/Modal.jsx'
import { useToast } from '../components/Toast.jsx'
import { pendingError } from '../lib/api'
import { dinar, inicijali } from '../lib/format'
import { MESTA } from '../lib/constants'

export default function KlijentiPage() {
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search, 300)
  const { data: klijenti, isLoading, isError, error } = useKlijenti(q)

  const [editing, setEditing] = useState(null)
  const [kredit, setKredit] = useState(null)

  return (
    <div>
      <PageHeader title="Klijenti" subtitle="Pregled i upravljanje korisnicima." />

      <div className="mb-6 max-w-md">
        <SearchInput value={search} onChange={setSearch} placeholder="Pretraži klijente…" />
      </div>

      {isLoading ? (
        <CenterSpinner label="Učitavanje klijenata…" />
      ) : isError ? (
        <EmptyState icon={AlertCircle} title="Greška pri učitavanju" description={pendingError(error)} />
      ) : klijenti.length === 0 ? (
        <EmptyState
          icon={Users}
          title={q ? 'Nema rezultata' : 'Nema klijenata'}
          description={q ? 'Pokušaj sa drugim pojmom.' : 'Klijenti se registruju kroz formu za registraciju.'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {klijenti.map((k) => (
            <KlijentCard key={k.id} klijent={k} onEdit={() => setEditing(k)} onKredit={() => setKredit(k)} />
          ))}
        </div>
      )}

      {editing && <IzmenaKlijentaModal key={editing.id} klijent={editing} onClose={() => setEditing(null)} />}
      {kredit && <KreditModal key={kredit.id} klijent={kredit} onClose={() => setKredit(null)} />}
    </div>
  )
}

function KlijentCard({ klijent, onEdit, onKredit }) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex items-start gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/12 text-sm font-semibold text-accent">
          {inicijali(klijent.ime, klijent.prezime)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-ink">
            {klijent.ime} {klijent.prezime}
          </h3>
          <p className="truncate text-[13px] text-ink-faint">@{klijent.korisnickoIme}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-ink-faint">Kredit</p>
          <p className="text-[15px] font-semibold text-ink">{dinar(klijent.kredit)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-[13px] text-ink-soft">
        <span className="inline-flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-ink-faint" />
          <span className="truncate">{klijent.email}</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-ink-faint" />
          {klijent.telefon}
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-ink-faint" />
          {klijent.mesto}
        </span>
      </div>

      <div className="flex gap-2 border-t border-line/70 pt-3">
        <Button variant="subtle" size="sm" className="flex-1" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          Izmeni
        </Button>
        <Button variant="secondary" size="sm" className="flex-1" onClick={onKredit}>
          <Wallet className="h-4 w-4" />
          Dodaj kredit
        </Button>
      </div>
    </Card>
  )
}

function IzmenaKlijentaModal({ klijent, onClose }) {
  const izmeni = useIzmeniKlijenta()
  const toast = useToast()
  const [form, setForm] = useState({
    ime: klijent.ime ?? '',
    prezime: klijent.prezime ?? '',
    telefon: klijent.telefon ?? '',
    mestoId: klijent.mestoId ?? 1,
  })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    try {
      await izmeni.mutateAsync({
        id: klijent.id,
        dto: {
          ime: form.ime.trim(),
          prezime: form.prezime.trim(),
          telefon: form.telefon.trim(),
          mestoId: Number(form.mestoId),
        },
      })
      toast.success('Klijent je izmenjen.')
      onClose()
    } catch (err) {
      toast.error(pendingError(err))
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Izmeni klijenta"
      description={`${klijent.ime} ${klijent.prezime}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={izmeni.isPending}>
            Otkaži
          </Button>
          <Button type="submit" form="klijent-form" onClick={submit} loading={izmeni.isPending}>
            Sačuvaj
          </Button>
        </>
      }
    >
      <form id="klijent-form" onSubmit={submit} className="grid grid-cols-2 gap-4">
        <Field label="Ime" required>
          <Input value={form.ime} onChange={set('ime')} required autoFocus />
        </Field>
        <Field label="Prezime" required>
          <Input value={form.prezime} onChange={set('prezime')} required />
        </Field>
        <div className="col-span-2">
          <Field label="Telefon" required>
            <Input value={form.telefon} onChange={set('telefon')} required />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Mesto">
            <Select value={form.mestoId} onChange={set('mestoId')}>
              {MESTA.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.naziv} ({m.postanskiBroj})
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </form>
    </Modal>
  )
}

function KreditModal({ klijent, onClose }) {
  const dodaj = useDodajKredit()
  const toast = useToast()
  const [iznos, setIznos] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const value = Number(iznos)
    if (!(value > 0)) {
      toast.error('Iznos mora biti pozitivan.')
      return
    }
    try {
      const res = await dodaj.mutateAsync({ id: klijent.id, iznos: value })
      toast.success(`Kredit dodat. Novo stanje: ${dinar(res.kredit)}.`)
      onClose()
    } catch (err) {
      toast.error(pendingError(err))
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Dodaj kredit"
      description={`${klijent.ime} ${klijent.prezime} · trenutno ${dinar(klijent.kredit)}`}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={dodaj.isPending}>
            Otkaži
          </Button>
          <Button type="submit" form="kredit-form" onClick={submit} loading={dodaj.isPending}>
            Dodaj
          </Button>
        </>
      }
    >
      <form id="kredit-form" onSubmit={submit}>
        <Field label="Iznos (RSD)" required>
          <Input
            type="number"
            min="1"
            step="1"
            value={iznos}
            onChange={(e) => setIznos(e.target.value)}
            placeholder="npr. 1000"
            autoFocus
            required
          />
        </Field>
        <div className="mt-3 flex gap-2">
          {[500, 1000, 2000, 5000].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setIznos(String(v))}
              className="flex-1 rounded-xl border border-line bg-surface-sunken py-2 text-[13px] font-medium text-ink-soft transition hover:border-accent hover:text-accent"
            >
              +{v}
            </button>
          ))}
        </div>
      </form>
    </Modal>
  )
}
