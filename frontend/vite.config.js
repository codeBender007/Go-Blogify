// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'   // ✅ sahi
import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react-swc' // (optional, faster)

export default defineConfig({
  plugins: [react(),tailwindcss(),
  ],
  server: { port: 5173 },
})
