import { sharedConfig } from '@workspace/config-vitest'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  ...sharedConfig,
  test: {
    ...sharedConfig.test,
    // Package-specific overrides if needed
  },
})
