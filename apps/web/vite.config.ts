import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig({
  plugins: [
    analyzer({
      enabled: !!process.env['ANALYZE'],
    }),
    cloudflare(),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
  ],
})
