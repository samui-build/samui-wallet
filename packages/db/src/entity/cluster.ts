import { ClusterType } from './cluster-type'

export interface Cluster {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  endpoint: string
  type: ClusterType
}
