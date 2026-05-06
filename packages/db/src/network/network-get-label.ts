import type { NetworkType } from './network-type.ts'
import { networkTypeOptions } from './network-type-options.ts'

export function networkGetLabel(type: NetworkType): string {
  const found = networkTypeOptions.find((item) => item.value === type)
  if (!found) {
    return `Unknown network ${type}`
  }
  return found.label
}
