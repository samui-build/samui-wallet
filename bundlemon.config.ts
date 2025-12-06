import type { Config } from 'bundlemon/lib/main/types.d.ts'

const config: Config = {
  files: [
    {
      path: 'apps/desktop/dist/assets/*-<hash>.js',
    },
    {
      path: 'apps/extension/.output/chrome-mv3/chunks/*-<hash>.js',
    },
    {
      path: 'apps/web/dist/assets/*-<hash>.js',
    },
  ],
  groups: [
    {
      path: 'apps/desktop/dist/assets/*-<hash>.js',
    },
    {
      path: 'apps/extension/.output/chrome-mv3/chunks/*-<hash>.js',
    },
    {
      path: 'apps/web/dist/assets/*-<hash>.js',
    },
  ],
  reportOutput: ['github'],
}

export default config
