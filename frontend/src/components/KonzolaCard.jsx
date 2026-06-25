import { Gamepad2, HardDrive, Headset, Cpu, Plus, Pencil, Trash2 } from 'lucide-react'
import { Card, Button } from './ui.jsx'
import { StanjeBadge } from './StatusBadge.jsx'
import { dinar } from '../lib/format'
import { tipKonzoleNaziv, tipKonzoleKey } from '../lib/constants'

// Mala ikonica/akcenat po tipu konzole
const TIP_STIL = {
  PlayStation: 'from-[#0070d1] to-[#00a3ff]',
  Xbox: 'from-[#107c10] to-[#23b923]',
  Nintendo: 'from-[#e60012] to-[#ff5a5f]',
  VideoPlejer: 'from-[#5e5ce6] to-[#8e8bff]',
}

export default function KonzolaCard({ konzola, onAdd, onEdit, onDelete, dostupnaZaKorpu }) {
  const gradient = TIP_STIL[tipKonzoleKey(konzola.tip)] ?? 'from-ink to-ink-soft'

  return (
    <Card className="group flex flex-col overflow-hidden">
      {/* Vizuelni header */}
      <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <Gamepad2 className="h-12 w-12 text-white/90" />
        <div className="absolute right-3 top-3">
          <StanjeBadge stanje={konzola.stanje} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold leading-tight text-ink">{konzola.naziv}</h3>
          </div>
          <p className="mt-0.5 text-[13px] text-ink-faint">
            {konzola.proizvodjac} · {tipKonzoleNaziv(konzola.tip)}
          </p>
        </div>

        {/* Specifikacije */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-ink-faint" />
            {konzola.model}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-ink-faint" />
            {konzola.kapacitetSkladistaGb} GB
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gamepad2 className="h-3.5 w-3.5 text-ink-faint" />
            {konzola.brojKontrolera}× kontroler
          </span>
          {konzola.podrzavaVr && (
            <span className="inline-flex items-center gap-1.5 text-accent">
              <Headset className="h-3.5 w-3.5" />
              VR
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-[18px] font-semibold tracking-tight text-ink">{dinar(konzola.cena)}</p>
            <p className="text-[11px] text-ink-faint">po satu</p>
          </div>

          <div className="flex items-center gap-1.5">
            {onEdit && (
              <button
                onClick={() => onEdit(konzola)}
                className="rounded-xl p-2 text-ink-faint transition hover:bg-surface-muted hover:text-ink"
                title="Izmeni"
              >
                <Pencil className="h-[18px] w-[18px]" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(konzola)}
                className="rounded-xl p-2 text-ink-faint transition hover:bg-danger/10 hover:text-danger"
                title="Obriši"
              >
                <Trash2 className="h-[18px] w-[18px]" />
              </button>
            )}
            {onAdd && (
              <Button
                size="sm"
                variant={dostupnaZaKorpu ? 'primary' : 'subtle'}
                disabled={!dostupnaZaKorpu}
                onClick={() => onAdd(konzola)}
              >
                <Plus className="h-4 w-4" />
                {dostupnaZaKorpu ? 'Dodaj' : 'Zauzeto'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
