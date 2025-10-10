import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    web_accessible_resources: [
      {
        matches: ['*://*/*'],
        resources: ['injected.js'],
      },
    ],
  },
  modules: ['@wxt-dev/module-react'],
})
