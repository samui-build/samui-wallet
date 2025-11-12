import { defineConfig } from 'vitest/config'

// TODO: Update config after Vitest v4.1 release
// https://github.com/vitest-dev/vitest/issues/8544
export default defineConfig({
  test: {
    globalSetup: ['./packages/config-vitest/src/integration.setup.ts'],
    projects: ['apps/*/vitest.integration.config.ts', 'packages/*/vitest.integration.config.ts'],
  },
})
