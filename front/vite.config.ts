import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: {
      rewrites: [
        { 
          from: /^\/howtouse/, 
          to: '/howtouse/index.html'
        },
        {
          from: /.*/,
          to: '/index.html'
        }
      ]
    }
  },
  base: '/',
  define: {
    'process.env.VITE_WEB3AUTH_CLIENT_ID': JSON.stringify(process.env.VITE_WEB3AUTH_CLIENT_ID)
  }
})