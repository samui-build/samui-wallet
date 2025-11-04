import { dbClusterTypeOptions } from '@workspace/db/db-cluster-type-options'
import type { ClusterType } from '@workspace/db/entity/cluster-type'

export function getClusterLabel(type: ClusterType): string {
  const found = dbClusterTypeOptions.find((item) => item.value === type)
  if (!found) {
    return `Unknown cluster ${type}`
  }
  return found.label
}
