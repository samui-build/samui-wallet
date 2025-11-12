import { dbNetworkTypeOptions } from '@workspace/db/db-network-type-options'
import type { NetworkType } from '@workspace/db/entity/network-type'

export function getNetworkLabel(type: NetworkType): string {
  const found = dbNetworkTypeOptions.find((item) => item.value === type)
  if (!found) {
    return `Unknown network ${type}`
  }
  return found.label
}
