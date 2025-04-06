import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    },
    // Add this to disable WebSocket fallback
    ws: false
  }
})
