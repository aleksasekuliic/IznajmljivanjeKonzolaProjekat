// Mesta iz seed_mock.sql (backend nema GET /mesta endpoint, pa su hardkodirana).
export const MESTA = [
  { id: 1, naziv: 'Beograd', postanskiBroj: '11000' },
  { id: 2, naziv: 'Novi Sad', postanskiBroj: '21000' },
  { id: 3, naziv: 'Niš', postanskiBroj: '18000' },
  { id: 4, naziv: 'Kragujevac', postanskiBroj: '34000' },
  { id: 5, naziv: 'Subotica', postanskiBroj: '24000' },
]

export const ULOGE = { RADNIK: 'Radnik', KLIJENT: 'Klijent' }

/* ============================================================
   Enumi.
   Backend koristi default System.Text.Json (bez JsonStringEnumConverter),
   pa se enumi u JSON-u prenose kao BROJEVI. Sve helper funkcije
   prihvataju i broj i string da bi bile otporne na obe varijante.
   ============================================================ */

function key(value, list) {
  if (value == null) return null
  return typeof value === 'number' ? list[value] : value
}

/* --------------------------- StatusIznajmljivanja --------------------------- */
// enum { Kreirano, Aktivno, Zavrseno, Otkazano }
export const STATUS_LIST = ['Kreirano', 'Aktivno', 'Zavrseno', 'Otkazano']
const STATUS_META = {
  Kreirano: { label: 'Kreirano', tone: 'neutral' },
  Aktivno: { label: 'Aktivno', tone: 'success' },
  Zavrseno: { label: 'Završeno', tone: 'muted' },
  Otkazano: { label: 'Otkazano', tone: 'danger' },
}
export function statusKey(v) {
  return key(v, STATUS_LIST)
}
export function statusMeta(v) {
  return STATUS_META[statusKey(v)] ?? { label: String(v ?? '—'), tone: 'muted' }
}
export function statusIndex(k) {
  return STATUS_LIST.indexOf(k)
}

/* ------------------------------- StanjeOpreme ------------------------------- */
// enum { Dostupno, Iznajmljeno, NaServisu, Neispravno }
export const STANJE_LIST = ['Dostupno', 'Iznajmljeno', 'NaServisu', 'Neispravno']
const STANJE_META = {
  Dostupno: { label: 'Dostupno', tone: 'success' },
  Iznajmljeno: { label: 'Iznajmljeno', tone: 'warning' },
  NaServisu: { label: 'Na servisu', tone: 'neutral' },
  Neispravno: { label: 'Neispravno', tone: 'danger' },
}
export function stanjeKey(v) {
  return key(v, STANJE_LIST)
}
export function stanjeMeta(v) {
  return STANJE_META[stanjeKey(v)] ?? { label: String(v ?? '—'), tone: 'muted' }
}
export function stanjeIndex(k) {
  return STANJE_LIST.indexOf(k)
}
export function jeDostupna(v) {
  return stanjeKey(v) === 'Dostupno'
}

/* -------------------------------- TipKonzole -------------------------------- */
// enum { PlayStation, Xbox, Nintendo, VideoPlejer }
export const TIP_KONZOLE_LIST = ['PlayStation', 'Xbox', 'Nintendo', 'VideoPlejer']
const TIP_KONZOLE_LABEL = {
  PlayStation: 'PlayStation',
  Xbox: 'Xbox',
  Nintendo: 'Nintendo',
  VideoPlejer: 'Video plejer',
}
export function tipKonzoleKey(v) {
  return key(v, TIP_KONZOLE_LIST)
}
export function tipKonzoleNaziv(v) {
  const k = tipKonzoleKey(v)
  return TIP_KONZOLE_LABEL[k] ?? k ?? '—'
}
export function tipKonzoleIndex(k) {
  return TIP_KONZOLE_LIST.indexOf(k)
}
