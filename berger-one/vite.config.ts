import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/BERGERONE/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        'entry-server': './src/entry-server.tsx'
      }
    },
    target: 'esnext',
    minify: 'esbuild'
  },
  css: {
    devSourcemap: true
  },
  ssr: {
    noExternal: [
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/dates',
      '@mantine/modals',
      'mantine-react-table',
      'zustand',
      'react-router-dom'
    ]
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
  }
})
