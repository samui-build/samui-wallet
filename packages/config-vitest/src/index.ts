import { defineConfig } from 'vitest/config'

export const sharedConfig = defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
  },
})
