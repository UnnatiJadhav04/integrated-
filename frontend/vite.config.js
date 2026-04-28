import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:8101',
      '/user': 'http://127.0.0.1:8101',
      '/email-accounts': 'http://127.0.0.1:8101',
      '/keywords': 'http://127.0.0.1:8101',
      '/alerts': 'http://127.0.0.1:8101',
    },
  },
})
