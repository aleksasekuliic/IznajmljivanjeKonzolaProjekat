// Dekodira JWT payload bez verifikacije (samo za čitanje claim-ova na klijentu).
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const NAME_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/name'

export function decodeJwt(token) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

// Izvuče korisničke podatke iz tokena: uloga, ime, klijentId, radnikId.
export function readClaims(token) {
  const p = decodeJwt(token)
  if (!p) return null

  let role = p[ROLE_CLAIM] ?? p.role ?? null
  if (Array.isArray(role)) role = role[0]

  const name = p[NAME_CLAIM] ?? p.name ?? p.unique_name ?? null

  const exp = typeof p.exp === 'number' ? p.exp * 1000 : null

  return {
    role,
    name,
    klijentId: p.klijentId ? Number(p.klijentId) : null,
    radnikId: p.radnikId ? Number(p.radnikId) : null,
    exp,
  }
}

export function isExpired(token) {
  const claims = readClaims(token)
  if (!claims?.exp) return false
  return Date.now() >= claims.exp
}
