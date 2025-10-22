import type { ViteUserConfig } from 'vitest/config'

export const sharedConfig: ViteUserConfig = {
  test: {
    globals: true,
    environment: 'jsdom',
    passWithNoTests: true,
  },
}
