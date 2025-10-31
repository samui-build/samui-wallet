import { config } from '@workspace/config-eslint/react-internal'
import { defineConfig } from 'eslint/config'

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
  config,
  {
    rules: {
      // @opentui/react properties not recognised by eslint-plugin-react
      'react/no-unknown-property': 'off',
    },
  },
])
