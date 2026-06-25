import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { api, getToken, setToken } from './api'
import { readClaims, isExpired } from './jwt'
import { queryClient } from './queryClient'

const AuthContext = createContext(null)

function buildUser(token) {
  if (!token || isExpired(token)) return null
  const claims = readClaims(token)
  if (!claims) return null
  return {
    token,
    role: claims.role,
    name: claims.name,
    klijentId: claims.klijentId,
    radnikId: claims.radnikId,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => buildUser(getToken()))

  // Ako je token istekao prilikom učitavanja, počisti ga.
  useEffect(() => {
    const t = getToken()
    if (t && isExpired(t)) {
      setToken(null)
      setUser(null)
    }
  }, [])

  const apply = useCallback((token) => {
    setToken(token)
    setUser(buildUser(token))
  }, [])

  const login = useCallback(
    async (korisnickoIme, lozinka) => {
      const { data } = await api.post('/auth/login', { korisnickoIme, lozinka })
      apply(data.token)
      return data
    },
    [apply]
  )

  const register = useCallback(
    async (dto) => {
      const { data } = await api.post('/auth/register', dto)
      apply(data.token)
      return data
    },
    [apply]
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    queryClient.clear()
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isRadnik: user?.role === 'Radnik',
      isKlijent: user?.role === 'Klijent',
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth mora biti unutar AuthProvider-a')
  return ctx
}
