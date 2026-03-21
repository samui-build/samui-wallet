import type { RcFile } from 'syncpack'

const config: RcFile = {
  semverGroups: [
    {
      dependencies: ['**'],
      dependencyTypes: ['**'],
      packages: ['**'],
      range: '',
    },
  ],
}

export default config
