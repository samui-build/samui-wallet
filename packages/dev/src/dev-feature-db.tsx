import { DevFeatureDbNetworkFindMany } from './dev-feature-db-network-find-many.tsx'
import { DevFeatureDbTables } from './dev-feature-db-tables.tsx'

export default function DevFeatureDb() {
  return (
    <div className="space-y-6">
      <DevFeatureDbTables />
      <DevFeatureDbNetworkFindMany />
    </div>
  )
}
