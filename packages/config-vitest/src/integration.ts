import { defineConfig } from 'vitest/config'

export const integrationConfig = defineConfig({
  test: {
    globalSetup: ['../config-vitest/src/integration.setup.ts'],
    include: ['**/*.integration.test.ts'],
  },
})
