import type { NetworkType } from '@workspace/db/network/network-type'
import { networkTypeOptions } from '@workspace/db/network/network-type-options'

export function getNetworkLabel(type: NetworkType): string {
  const found = networkTypeOptions.find((item) => item.value === type)
  if (!found) {
    return `Unknown network ${type}`
  }
  return found.label
}
