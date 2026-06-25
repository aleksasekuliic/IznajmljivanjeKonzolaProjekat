import { useState, useEffect } from 'react'
import Modal from './Modal.jsx'
import { Button, Input, Select, Field } from './ui.jsx'
import {
  TIP_KONZOLE_LIST,
  STANJE_LIST,
  tipKonzoleNaziv,
  stanjeMeta,
  tipKonzoleIndex,
  stanjeIndex,
  tipKonzoleKey,
  stanjeKey,
} from '../lib/constants'

const PRAZNO = {
  naziv: '',
  proizvodjac: '',
  inventarskiBroj: '',
  cena: '',
  datumNabavke: new Date().toISOString().slice(0, 10),
  tip: 'PlayStation',
  model: '',
  kapacitetSkladistaGb: 1024,
  brojKontrolera: 1,
  podrzavaVr: false,
  stanje: 'Dostupno',
}

export default function KonzolaForm({ open, onClose, onSubmit, konzola, loading }) {
  const izmena = !!konzola
  const [form, setForm] = useState(PRAZNO)

  useEffect(() => {
    if (!open) return
    if (konzola) {
      setForm({
        naziv: konzola.naziv ?? '',
        proizvodjac: konzola.proizvodjac ?? '',
        inventarskiBroj: konzola.inventarskiBroj ?? '',
        cena: konzola.cena ?? '',
        datumNabavke: (konzola.datumNabavke ?? new Date().toISOString()).slice(0, 10),
        tip: tipKonzoleKey(konzola.tip) ?? 'PlayStation',
        model: konzola.model ?? '',
        kapacitetSkladistaGb: konzola.kapacitetSkladistaGb ?? 0,
        brojKontrolera: konzola.brojKontrolera ?? 1,
        podrzavaVr: !!konzola.podrzavaVr,
        stanje: stanjeKey(konzola.stanje) ?? 'Dostupno',
      })
    } else {
      setForm(PRAZNO)
    }
  }, [open, konzola])

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const base = {
      naziv: form.naziv.trim(),
      proizvodjac: form.proizvodjac.trim(),
      cena: Number(form.cena),
      tip: tipKonzoleIndex(form.tip),
      model: form.model.trim(),
      kapacitetSkladistaGb: Number(form.kapacitetSkladistaGb),
      brojKontrolera: Number(form.brojKontrolera),
      podrzavaVr: form.podrzavaVr,
    }
    const dto = izmena
      ? { ...base, stanje: stanjeIndex(form.stanje) }
      : {
          ...base,
          inventarskiBroj: form.inventarskiBroj.trim(),
          datumNabavke: new Date(form.datumNabavke).toISOString(),
        }
    onSubmit(dto)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={izmena ? 'Izmeni konzolu' : 'Nova konzola'}
      description={izmena ? konzola?.naziv : 'Dodaj novu konzolu u inventar.'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Otkaži
          </Button>
          <Button onClick={submit} loading={loading} form="konzola-form" type="submit">
            {izmena ? 'Sačuvaj' : 'Dodaj konzolu'}
          </Button>
        </>
      }
    >
      <form id="konzola-form" onSubmit={submit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Field label="Naziv" required>
            <Input value={form.naziv} onChange={set('naziv')} required autoFocus />
          </Field>
        </div>

        <Field label="Proizvođač" required>
          <Input value={form.proizvodjac} onChange={set('proizvodjac')} required />
        </Field>
        <Field label="Model" required>
          <Input value={form.model} onChange={set('model')} placeholder="PS5 Slim" required />
        </Field>

        <Field label="Tip">
          <Select value={form.tip} onChange={set('tip')}>
            {TIP_KONZOLE_LIST.map((t) => (
              <option key={t} value={t}>
                {tipKonzoleNaziv(t)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Cena po satu (RSD)" required>
          <Input type="number" min="0" step="1" value={form.cena} onChange={set('cena')} required />
        </Field>

        <Field label="Skladište (GB)">
          <Input
            type="number"
            min="0"
            value={form.kapacitetSkladistaGb}
            onChange={set('kapacitetSkladistaGb')}
          />
        </Field>
        <Field label="Broj kontrolera">
          <Input
            type="number"
            min="0"
            value={form.brojKontrolera}
            onChange={set('brojKontrolera')}
          />
        </Field>

        {izmena ? (
          <Field label="Stanje">
            <Select value={form.stanje} onChange={set('stanje')}>
              {STANJE_LIST.map((s) => (
                <option key={s} value={s}>
                  {stanjeMeta(s).label}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <>
            <Field label="Inventarski broj" required>
              <Input value={form.inventarskiBroj} onChange={set('inventarskiBroj')} required />
            </Field>
            <Field label="Datum nabavke" required>
              <Input type="date" value={form.datumNabavke} onChange={set('datumNabavke')} required />
            </Field>
          </>
        )}

        <div className="col-span-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface-sunken px-4 py-3">
            <input
              type="checkbox"
              checked={form.podrzavaVr}
              onChange={set('podrzavaVr')}
              className="h-4 w-4 accent-accent"
            />
            <span className="text-sm text-ink">Podržava VR</span>
          </label>
        </div>
      </form>
    </Modal>
  )
}
