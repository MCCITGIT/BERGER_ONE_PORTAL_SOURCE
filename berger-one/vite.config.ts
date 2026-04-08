import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import pkg from './package.json'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/BERGERONE/',
  /** Outside `node_modules` so the pre-bundle cache is not orphaned after installs / antivirus locks. */
  cacheDir: '.vite',
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
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
