import { useDbClusterCreate } from '@workspace/db-react/use-db-cluster-create'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useNavigate } from 'react-router'

import { SettingsUiClusterFormCreate } from './ui/settings-ui-cluster-form-create.tsx'

export function SettingsFeatureClusterCreate() {
  const createMutation = useDbClusterCreate()
  const navigate = useNavigate()
  return (
    <UiCard backButtonTo=".." contentProps={{ className: 'grid gap-6' }} title="Add Cluster">
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
