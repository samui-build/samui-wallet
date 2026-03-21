import type { Config } from 'bundlemon/lib/main/types.d.ts'

const config: Config = {
  files: [
    {
      path: 'apps/extension/.output/chrome-mv3/**/*-<hash>.js',
    },
    {
      path: 'apps/web/dist/**/*-<hash>.js',
    },
  ],
  groups: [
    {
      path: 'apps/extension/.output/chrome-mv3/**/*-<hash>.js',
    },
    {
      path: 'apps/web/dist/**/*-<hash>.js',
    },
  ],
  pathLabels: {
    hash: '[a-zA-Z0-9\\-_]+',
  },
  reportOutput: ['github'],
}

export default config
