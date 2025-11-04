import type { PlopTypes } from '@turbo/gen'
import { validateName } from './helpers.ts'

const TARGET_DIR = 'packages'
const TEMPLATE_ROOT = 'templates/pkg'

export const generatorPkg: PlopTypes.PlopGeneratorConfig = {
  actions: [
    {
      base: `./${TEMPLATE_ROOT}/{{type}}`,
      destination: `{{turbo.paths.root}}/${TARGET_DIR}/{{ dashCase name }}`,
      templateFiles: `./${TEMPLATE_ROOT}/{{type}}/**/*`,
      type: 'addMany',
    },
  ],
  description: `Generate a package in the ${TARGET_DIR} directory`,
  prompts: [
    {
      choices: ['base', 'react-ui'],
      message: 'What type of package should be created?',
      name: 'type',
      type: 'list',
    },
    {
      default: ({ type }: { type: string }) => type,
      message: 'What is the name of the package?',
      name: 'name',
      type: 'input',
      validate: (input: string) => {
        return validateName(input)
      },
    },
  ],
}
