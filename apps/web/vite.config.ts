import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const externalDependencies = [
  '@floating-ui',
  '@radix-react',
  '@solana',
  '@tanstack',
  '@wallet-standard',
  'dexie',
  'i18next',
  'lucide-react',
  'react',
  'react-dom',
  'react-router',
  'sonner',
  'tailwind-merge',
  'zod',
]

export default defineConfig({
  build: {
    rollupOptions: {
      external: externalDependencies.map((dep) => new RegExp(`^${dep}(\\/.*)?$`)),
    },
  },
  plugins: [cloudflare(), react(), tailwindcss(), tsconfigPaths()],
})
