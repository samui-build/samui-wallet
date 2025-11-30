import { cloudflare } from '@cloudflare/vite-plugin'
import { sharedConfig } from '@workspace/config-vite'
import { defineConfig, mergeConfig } from 'vite'

export default mergeConfig(
  sharedConfig,
  defineConfig({
    plugins: [cloudflare()],
  }),
)
