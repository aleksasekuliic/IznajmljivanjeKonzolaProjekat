const dinFormat = new Intl.NumberFormat('sr-RS', {
  style: 'currency',
  currency: 'RSD',
  maximumFractionDigits: 0,
})

export function dinar(value) {
  if (value == null || isNaN(value)) return '—'
  return dinFormat.format(value)
}

const dateFormat = new Intl.DateTimeFormat('sr-RS', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const dateTimeFormat = new Intl.DateTimeFormat('sr-RS', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function datum(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d)) return '—'
  return dateFormat.format(d)
}

export function datumVreme(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d)) return '—'
  return dateTimeFormat.format(d)
}

export function inicijali(ime = '', prezime = '') {
  return `${ime?.[0] ?? ''}${prezime?.[0] ?? ''}`.toUpperCase() || '?'
}
