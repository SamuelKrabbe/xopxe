import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Repassa as chamadas do backend para a porta 8080. O changeOrigin: false
// mantém o endereço localhost:5173, que é o cadastrado no Google como retorno.
const BACKEND = { target: 'http://localhost:8080', changeOrigin: false }

// https://vite.dev/config/
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
