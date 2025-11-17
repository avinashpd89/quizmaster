import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy any request starting with `/api` to the backend to avoid CORS in dev
    proxy: {
      '/api': {
        target: 'http://44.222.203.3:3000',
        changeOrigin: true,
        secure: false,
        // rewrite not required since we want to keep the `/api` prefix
      },
    },
  },
})
