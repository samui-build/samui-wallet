import { defaultExclude, defineConfig } from 'vitest/config'

export const sharedConfig = defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [...defaultExclude, '**/*.integration.test.ts'],
    globals: true,
  },
})
