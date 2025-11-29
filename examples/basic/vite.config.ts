import path from 'node:path'
import { sharedConfig } from '@workspace/config-vite'
import { defineConfig, mergeConfig } from 'vite'

export default mergeConfig(
  sharedConfig,
  defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }),
)
