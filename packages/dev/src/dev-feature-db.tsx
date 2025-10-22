import { DevFeatureDbClusterFindMany } from './dev-feature-db-cluster-find-many.js'
import { DevFeatureDbTables } from './dev-feature-db-tables.js'

export default function DevFeatureDb() {
  return (
    <div className="space-y-6">
      <DevFeatureDbTables />
      <DevFeatureDbClusterFindMany />
    </div>
  )
}
