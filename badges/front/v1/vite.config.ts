import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global': 'globalThis'
  },
  resolve: {
    alias: {
      process: resolve(__dirname, 'node_modules/process/browser.js'),
      stream: resolve(__dirname, 'node_modules/stream-browserify'),
      zlib: resolve(__dirname, 'node_modules/browserify-zlib'),
      util: resolve(__dirname, 'node_modules/util')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})