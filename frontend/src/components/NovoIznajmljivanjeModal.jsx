import { useState, useMemo } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, Search, Gamepad2, Check, Wallet, AlertCircle } from 'lucide-react'
import Modal from './Modal.jsx'
import { Button, Select, Field, Spinner, cx } from './ui.jsx'
import { useKonzole, useKlijenti, useKreirajIznajmljivanje } from '../lib/hooks'
import { useAuth } from '../lib/auth.jsx'
import { useToast } from '../components/Toast.jsx'
import { pendingError } from '../lib/api'
import { dinar } from '../lib/format'
import { jeDostupna, tipKonzoleNaziv } from '../lib/constants'

export default function NovoIznajmljivanjeModal({ open, onClose }) {
  const { user } = useAuth()
  const toast = useToast()
  const kreiraj = useKreirajIznajmljivanje()

  const { data: klijenti, isLoading: klijentiLoading } = useKlijenti('')
  const { data: konzole, isLoading: konzoleLoading } = useKonzole('')

  const [klijentId, setKlijentId] = useState('')
  const [pretraga, setPretraga] = useState('')
  const [korpa, setKorpa] = useState([]) // [{ konzola, brojSati }]

  const dostupne = useMemo(() => {
    const list = (konzole ?? []).filter((k) => jeDostupna(k.stanje))
    if (!pretraga.trim()) return list
    const p = pretraga.toLowerCase()
    return list.filter(
      (k) =>
        k.naziv.toLowerCase().includes(p) ||
        k.model?.toLowerCase().includes(p) ||
        k.proizvodjac?.toLowerCase().includes(p)
    )
  }, [konzole, pretraga])

  const uKorpi = (id) => korpa.some((s) => s.konzola.id === id)

  const dodaj = (konzola) => {
    if (uKorpi(konzola.id)) return
    setKorpa((k) => [...k, { konzola, brojSati: 1 }])
  }
  const ukloni = (id) => setKorpa((k) => k.filter((s) => s.konzola.id !== id))
  const promeniSate = (id, delta) =>
    setKorpa((k) =>
      k.map((s) =>
        s.konzola.id === id ? { ...s, brojSati: Math.max(1, s.brojSati + delta) } : s
      )
    )
  const postaviSate = (id, value) =>
    setKorpa((k) =>
      k.map((s) =>
        s.konzola.id === id ? { ...s, brojSati: Math.max(1, Number(value) || 1) } : s
      )
    )

  const ukupno = korpa.reduce((sum, s) => sum + s.konzola.cena * s.brojSati, 0)

  const izabraniKlijent = useMemo(
    () => (klijenti ?? []).find((k) => k.id === Number(klijentId)),
    [klijenti, klijentId]
  )
  const kredit = izabraniKlijent?.kredit ?? 0
  const nedovoljnoKredita = !!klijentId && korpa.length > 0 && ukupno > kredit
  const manjak = Math.max(0, ukupno - kredit)

  const submit = async () => {
    if (!klijentId) {
      toast.error('Izaberi klijenta.')
      return
    }
    if (korpa.length === 0) {
      toast.error('Dodaj bar jednu konzolu u korpu.')
      return
    }
    if (nedovoljnoKredita) {
      toast.error(
        `Klijent nema dovoljno kredita. Potrebno je još ${dinar(manjak)} — mora da uplati kredit da bi nastavio.`
      )
      return
    }
    if (!user?.radnikId) {
      toast.error('Tvoj nalog nema vezan radnik profil, ne mogu da kreiram iznajmljivanje.')
      return
    }
    try {
      await kreiraj.mutateAsync({
        klijentId: Number(klijentId),
        radnikId: user.radnikId,
        stavke: korpa.map((s) => ({ opremaId: s.konzola.id, brojSati: s.brojSati })),
      })
      toast.success('Iznajmljivanje je kreirano.')
      onClose()
    } catch (err) {
      toast.error(pendingError(err))
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo iznajmljivanje"
      description="Izaberi klijenta i dodaj konzole u korpu."
      size="xl"
      footer={
        <div className="flex w-full items-center justify-between gap-4">
          <div className="text-sm text-ink-soft">
            Ukupno: <span className="text-base font-semibold text-ink">{dinar(ukupno)}</span>
            <span className="text-ink-faint"> / sat × broj sati</span>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} disabled={kreiraj.isPending}>
              Otkaži
            </Button>
            <Button
              onClick={submit}
              loading={kreiraj.isPending}
              disabled={!klijentId || korpa.length === 0 || nedovoljnoKredita}
            >
              <Check className="h-4 w-4" />
              Kreiraj iznajmljivanje
            </Button>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
        {/* Leva kolona — izbor */}
        <div className="flex flex-col gap-4">
          <Field label="Klijent" required>
            {klijentiLoading ? (
              <div className="flex h-11 items-center px-2">
                <Spinner />
              </div>
            ) : (
              <Select value={klijentId} onChange={(e) => setKlijentId(e.target.value)}>
                <option value="">— izaberi klijenta —</option>
                {(klijenti ?? []).map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.ime} {k.prezime} ({dinar(k.kredit)})
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {klijentId && (
            <div
              className={cx(
                'flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-[13px]',
                nedovoljnoKredita
                  ? 'border-danger/30 bg-danger/5 text-danger'
                  : 'border-line bg-surface-sunken text-ink-soft'
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="h-4 w-4" />
                Kredit klijenta
              </span>
              <span className="font-semibold">{dinar(kredit)}</span>
            </div>
          )}

          {nedovoljnoKredita && (
            <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-[12.5px] text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Nedovoljno kredita — potrebno je još <strong>{dinar(manjak)}</strong>. Klijent mora da
                uplati kredit da bi nastavio sa iznajmljivanjem.
              </span>
            </div>
          )}

          <div>
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                value={pretraga}
                onChange={(e) => setPretraga(e.target.value)}
                placeholder="Pretraži dostupne konzole…"
                className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-3 text-sm focus:border-accent focus-visible:shadow-focus"
              />
            </div>

            <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {konzoleLoading ? (
                <div className="py-8 text-center">
                  <Spinner className="mx-auto" />
                </div>
              ) : dostupne.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-faint">Nema dostupnih konzola.</p>
              ) : (
                dostupne.map((k) => {
                  const dodato = uKorpi(k.id)
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => dodaj(k)}
                      disabled={dodato}
                      className={cx(
                        'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                        dodato
                          ? 'border-accent/30 bg-accent/5'
                          : 'border-line bg-surface hover:border-accent/40 hover:bg-surface-sunken'
                      )}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-soft">
                        <Gamepad2 className="h-[18px] w-[18px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{k.naziv}</p>
                        <p className="truncate text-[12px] text-ink-faint">
                          {tipKonzoleNaziv(k.tip)} · {dinar(k.cena)}/sat
                        </p>
                      </div>
                      {dodato ? (
                        <Check className="h-5 w-5 text-accent" />
                      ) : (
                        <Plus className="h-5 w-5 text-ink-faint" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Desna kolona — korpa */}
        <div className="rounded-2xl border border-line/70 bg-surface-sunken p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
            <ShoppingCart className="h-4 w-4" />
            Korpa
            {korpa.length > 0 && (
              <span className="rounded-full bg-accent/12 px-2 py-0.5 text-[12px] font-semibold text-accent">
                {korpa.length}
              </span>
            )}
          </div>

          {korpa.length === 0 ? (
            <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center text-ink-faint">
              <ShoppingCart className="h-8 w-8" />
              <p className="text-sm">Korpa je prazna.</p>
              <p className="text-[12px]">Dodaj konzole sa leve strane.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {korpa.map((s) => (
                <div
                  key={s.konzola.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-ink">{s.konzola.naziv}</p>
                    <p className="text-[12px] text-ink-faint">
                      {dinar(s.konzola.cena)} × {s.brojSati}h = {dinar(s.konzola.cena * s.brojSati)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-line bg-surface-sunken">
                    <button
                      type="button"
                      onClick={() => promeniSate(s.konzola.id, -1)}
                      className="p-1.5 text-ink-soft hover:text-ink"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      value={s.brojSati}
                      onChange={(e) => postaviSate(s.konzola.id, e.target.value)}
                      className="w-9 bg-transparent text-center text-[13px] font-medium text-ink focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => promeniSate(s.konzola.id, 1)}
                      className="p-1.5 text-ink-soft hover:text-ink"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => ukloni(s.konzola.id)}
                    className="rounded-lg p-1.5 text-ink-faint hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
