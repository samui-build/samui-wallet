import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name: 'Samui',
    permissions: ['storage'],
    web_accessible_resources: [
      {
        matches: ['*://*/*'],
        resources: ['injected.js'],
      },
    ],
  },
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-react'],
  react: {
    vite: {
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    },
  },
  srcDir: 'src',
  // @ts-expect-error wxt types are incorrect for vite
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
