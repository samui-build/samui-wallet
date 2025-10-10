import type { ClusterType } from './cluster-type'

export interface Cluster {
  createdAt: Date
  endpoint: string
  id: string
  name: string
  type: ClusterType
  updatedAt: Date
}
