import { useDbClusterFindUnique } from '@workspace/db-react/use-db-cluster-find-unique'
import { useDbClusterUpdate } from '@workspace/db-react/use-db-cluster-update'
import { UiBack } from '@workspace/ui/components/ui-back'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useNavigate, useParams } from 'react-router'

import { SettingsUiClusterFormUpdate } from './ui/settings-ui-cluster-form-update.tsx'

export function SettingsFeatureClusterUpdate() {
  const navigate = useNavigate()
  const { clusterId } = useParams() as { clusterId: string }
  const updateMutation = useDbClusterUpdate()
  const { data: item, error, isError, isLoading } = useDbClusterFindUnique({ id: clusterId })

  if (isLoading) {
    return <UiLoader />
  }
  if (isError) {
    return <UiError message={error} />
  }
  if (!item) {
    return <UiNotFound />
  }

  return (
    <UiCard
      title={
        <div className="flex items-center gap-2">
          <UiBack />
          Edit Cluster
        </div>
      }
    >
      <SettingsUiClusterFormUpdate
        item={item}
        submit={async (input) => {
          return updateMutation.mutateAsync({ id: item.id, input }).then(() => {
            navigate('/settings/clusters')
          })
        }}
      />
    </UiCard>
  )
}
