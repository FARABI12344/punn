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
        'path',
        'fs',
        'os',
        'crypto',
        'stream',
        'util',
        'child_process',
        'assert',
        'net',
        'tls',
        'http',
        'https',
        'zlib',
        'fsevents',
        'module',
        'url'
      ]
    }
  }
})
