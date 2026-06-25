import { useState } from 'react'
import { ChevronDown, User, Clock, CheckCircle2, XCircle, Receipt } from 'lucide-react'
import { Card, Button, cx } from './ui.jsx'
import { StatusBadge } from './StatusBadge.jsx'
import { dinar, datumVreme } from '../lib/format'
import { statusKey } from '../lib/constants'

export default function IznajmljivanjeCard({ iznajmljivanje: i, onZavrsi, onOtkazi, showKlijent = true }) {
  const [open, setOpen] = useState(false)
  const status = statusKey(i.status)
  const aktivno = status === 'Kreirano' || status === 'Aktivno'
  const radnik = onZavrsi || onOtkazi

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-muted text-ink-soft">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-[15px] font-semibold text-ink">#{i.id}</h3>
              <StatusBadge status={i.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12.5px] text-ink-soft">
              {showKlijent && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-ink-faint" />
                  {i.klijent}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-ink-faint" />
                {datumVreme(i.datumPocetka)}
              </span>
              <span className="text-ink-faint">
                {i.stavke?.length ?? 0} {(i.stavke?.length ?? 0) === 1 ? 'stavka' : 'stavke'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
          <p className="text-lg font-semibold tracking-tight text-ink">{dinar(i.ukupanIznos)}</p>
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline"
          >
            Detalji
            <ChevronDown className={cx('h-4 w-4 transition', open && 'rotate-180')} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line/70 bg-surface-sunken px-4 py-3 animate-fade-in">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-ink-faint">
                <th className="pb-1.5 font-medium">Oprema</th>
                <th className="pb-1.5 text-right font-medium">Cena/sat</th>
                <th className="pb-1.5 text-right font-medium">Sati</th>
                <th className="pb-1.5 text-right font-medium">Iznos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {i.stavke?.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 text-ink">{s.oprema}</td>
                  <td className="py-2 text-right text-ink-soft">{dinar(s.cena)}</td>
                  <td className="py-2 text-right text-ink-soft">{s.brojSati}h</td>
                  <td className="py-2 text-right font-medium text-ink">{dinar(s.iznos)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-3 text-[12.5px] text-ink-soft">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>Radnik: <span className="text-ink">{i.radnik ?? '—'}</span></span>
              {i.datumZavrsetka && (
                <span>Završeno: <span className="text-ink">{datumVreme(i.datumZavrsetka)}</span></span>
              )}
            </div>
            {radnik && aktivno && (
              <div className="flex gap-2">
                {onZavrsi && (
                  <Button size="sm" variant="secondary" onClick={() => onZavrsi(i)}>
                    <CheckCircle2 className="h-4 w-4" />
                    Završi
                  </Button>
                )}
                {onOtkazi && (
                  <Button size="sm" variant="dangerGhost" onClick={() => onOtkazi(i)}>
                    <XCircle className="h-4 w-4" />
                    Otkaži
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
