import axios from 'axios'

// baseURL je prazan: pozivi idu na isti origin (Vite dev server),
// koji proksira /auth, /konzole, /klijenti, /iznajmljivanja na backend.
export const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
})

const TOKEN_KEY = 'ik_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

// Zakači JWT na svaki zahtev
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Pretvori backend greške u čitljivu poruku
export function pendingError(err) {
  const data = err?.response?.data
  if (!data) return err?.message || 'Greška u komunikaciji sa serverom.'
  if (typeof data === 'string') return data
  // FluentValidation ToDictionary() -> { Polje: [poruke] }
  if (typeof data === 'object') {
    const messages = []
    for (const value of Object.values(data)) {
      if (Array.isArray(value)) messages.push(...value)
      else if (typeof value === 'string') messages.push(value)
    }
    if (messages.length) return messages.join(' ')
  }
  return 'Došlo je do greške.'
}
