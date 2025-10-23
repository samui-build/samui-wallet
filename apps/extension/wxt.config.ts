import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name: 'Samui',
    web_accessible_resources: [
      {
        matches: ['*://*/*'],
        resources: ['injected.js'],
      },
    ],
  },
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-react'],
})
