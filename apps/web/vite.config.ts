import { cloudflare } from '@cloudflare/vite-plugin'
import { sharedConfig } from '@workspace/config-vite'
import { withAnalyzer } from '@workspace/config-vite/with-analyzer'
import { defineConfig, mergeConfig } from 'vite'

export default mergeConfig(
  sharedConfig,
  defineConfig({
    plugins: [withAnalyzer(), cloudflare()],
  }),
)
