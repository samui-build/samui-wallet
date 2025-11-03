import type { ViteUserConfig } from 'vitest/config'

export const sharedConfig: ViteUserConfig = {
  test: {
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
  },
}
