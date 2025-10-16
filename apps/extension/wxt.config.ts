import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    host_permissions: [],
    permissions: [],
    web_accessible_resources: [
      {
        matches: ['*://*/*'],
        resources: ['injected.js'],
      },
    ],
  },
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
