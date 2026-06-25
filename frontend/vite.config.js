import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Backend (ASP.NET) sluša na http://localhost:5070.
// Sve API rute proksiramo kroz Vite dev server da bismo izbegli CORS
// (browser misli da je isti origin), pa backend ne moramo da diramo.
const API_TARGET = 'http://localhost:5070'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': API_TARGET,
      '/konzole': API_TARGET,
      '/klijenti': API_TARGET,
      '/iznajmljivanja': API_TARGET,
    },
  },
})
