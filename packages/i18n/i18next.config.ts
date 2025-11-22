import { defineConfig } from 'i18next-cli'

export default defineConfig({
  extract: {
    ignore: [
      '../**/node_modules/**',
      '../../**/node_modules/**',
      'node_modules/**',

      '../**/dist/**',
      '../../**/dist/**',
      'dist/**',

      '../../examples/**',
    ],
    ignoredAttributes: [
      'autoComplete',
      'autoCorrect',
      'icon',
      'rel',
      'orientation',
      'provider',
      'role',
      'size',
      'spellCheck',
      'step',
      'to',
      'variant',
    ],
    input: '../../**/*.{js,jsx,ts,tsx}',
    output: 'locales/{{language}}/{{namespace}}.json',
  },
  locales: ['en', 'es'],
  types: {
    enableSelector: true,
    input: ['locales/en/*.json'],
    output: 'src/i18next.d.ts',
    resourcesFile: 'src/resources.d.ts',
  },
})
