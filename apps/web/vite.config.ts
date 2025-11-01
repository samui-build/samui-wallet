import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    analyzer({
      enabled: process.argv.includes('--analyze'),
    }),
    cloudflare(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
})
