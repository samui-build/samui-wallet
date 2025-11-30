import { sharedConfig } from '@workspace/config-vite'
import { defineConfig, mergeConfig } from 'vite'

const host = process.env['TAURI_DEV_HOST']

export default mergeConfig(
  sharedConfig,
  defineConfig({
    clearScreen: false,
    server: {
      hmr: host
        ? {
            host,
            port: 1421,
            protocol: 'ws',
          }
        : false,
      host: host || false,
      port: 1420,
      strictPort: true,
      watch: {
        ignored: ['**/src-tauri/**'],
      },
    },
  }),
)
