import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['apps/*/vitest.config.mts', 'packages/*/vitest.config.mts'],
  },
})
