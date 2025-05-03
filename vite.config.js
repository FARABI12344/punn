import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        'fs',
        'path',
        'crypto',
        'os',
        'stream',
        'util',
        'net',
        'assert',
        'child_process',
        'fsevents',
        'tls',
        'zlib',
        'http',
        'https',
        'module',
        'events'
      ]
    }
  }
})
