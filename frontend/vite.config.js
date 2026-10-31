import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Repassa as chamadas do backend para a porta 8080. changeOrigin: false
// mantém localhost:5173, o endereço cadastrado no Google.
const BACKEND = { target: 'http://localhost:8080', changeOrigin: false }

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': BACKEND,
      '/oauth2': BACKEND,
      '/login/oauth2': BACKEND,
    },
  },
})
