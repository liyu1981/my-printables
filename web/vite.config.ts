import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const dev = mode === 'development'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': 'http://localhost:8200',
      },
    },
    build: {
      outDir: '../internal/web/dist',
      emptyOutDir: true,
      // Dev builds keep readable names + inline source maps for browser
      // debugging. Release builds strip source maps and minify.
      sourcemap: dev ? 'inline' : false,
      minify: dev ? false : 'oxc',
      target: 'es2022',
    },
  }
})
