import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      external: [
        'fs', 'path', 'os', 'events', 'child_process',
        'net', 'tls', 'assert', 'stream', 'zlib',
        'module', 'http', 'https', 'url', 'fsevents',
        'crypto', 'querystring'
      ]
    }
  }
})
