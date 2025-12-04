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
  versionGroups: [
    {
      dependencies: ['react', '@types/react'],
      isIgnored: true,
      packages: ['mobile'],
    },
  ],
}

export default config
