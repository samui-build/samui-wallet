import type { PlopTypes } from '@turbo/gen'
import { generatorPkg } from './generator-pkg.ts'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('pkg', generatorPkg)
}
