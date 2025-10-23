import { useDbClusterCreate } from '@workspace/db-react/use-db-cluster-create'
import { UiBack } from '@workspace/ui/components/ui-back'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useNavigate } from 'react-router'

import { SettingsUiClusterFormCreate } from './ui/settings-ui-cluster-form-create.js'

export function SettingsFeatureClusterCreate() {
  const createMutation = useDbClusterCreate()
  const navigate = useNavigate()
  return (
    <UiCard
      contentProps={{ className: 'grid gap-6' }}
      title={
        <div className="flex items-center gap-2">
          <UiBack />
          Add Cluster
        </div>
      }
    >
      <SettingsUiClusterFormCreate
        submit={(input) =>
          createMutation.mutateAsync({ input }).then(() => {
            navigate('/settings/clusters')
          })
        }
      />
    </UiCard>
  )
}
