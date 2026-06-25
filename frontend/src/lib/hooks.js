import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api'

/* --------------------------------- Konzole ---------------------------------- */
export function useKonzole(q) {
  return useQuery({
    queryKey: ['konzole', q ?? ''],
    queryFn: async () => {
      const { data } = await api.get('/konzole', { params: q ? { q } : {} })
      return data
    },
  })
}

export function useKreirajKonzolu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto) => (await api.post('/konzole', dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['konzole'] }),
  })
}

export function useIzmeniKonzolu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }) => (await api.put(`/konzole/${id}`, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['konzole'] }),
  })
}

export function useObrisiKonzolu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => (await api.delete(`/konzole/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['konzole'] }),
  })
}

/* --------------------------------- Klijenti --------------------------------- */
export function useKlijenti(q) {
  return useQuery({
    queryKey: ['klijenti', q ?? ''],
    queryFn: async () => {
      const { data } = await api.get('/klijenti', { params: q ? { q } : {} })
      return data
    },
  })
}

export function useIzmeniKlijenta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }) => (await api.put(`/klijenti/${id}`, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['klijenti'] }),
  })
}

export function useDodajKredit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, iznos }) => (await api.post(`/klijenti/${id}/kredit`, { iznos })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['klijenti'] }),
  })
}

/* ------------------------------ Iznajmljivanja ------------------------------ */
export function useIznajmljivanja(filters = {}) {
  const { klijentId, status } = filters
  return useQuery({
    queryKey: ['iznajmljivanja', klijentId ?? null, status ?? null],
    queryFn: async () => {
      const params = {}
      if (klijentId != null) params.klijentId = klijentId
      if (status) params.status = status
      const { data } = await api.get('/iznajmljivanja', { params })
      return data
    },
  })
}

export function useKreirajIznajmljivanje() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto) => (await api.post('/iznajmljivanja', dto)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['iznajmljivanja'] })
      qc.invalidateQueries({ queryKey: ['konzole'] })
    },
  })
}

export function usePromeniStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }) => (await api.put(`/iznajmljivanja/${id}`, { status })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['iznajmljivanja'] })
      qc.invalidateQueries({ queryKey: ['konzole'] })
    },
  })
}
