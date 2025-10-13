import { useDbClusterFindUnique } from '@workspace/db-react/use-db-cluster-find-unique'
import { useDbClusterUpdate } from '@workspace/db-react/use-db-cluster-update'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Spinner } from '@workspace/ui/components/spinner'
import { UiBack } from '@workspace/ui/components/ui-back'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useNavigate, useParams } from 'react-router'

import { SettingsUiClusterFormUpdate } from './ui/settings-ui-cluster-form-update.js'

export function SettingsFeatureClusterUpdate() {
  const navigate = useNavigate()
  const { clusterId } = useParams() as { clusterId: string }
  const updateMutation = useDbClusterUpdate()
  const { data: item, error, isError, isLoading } = useDbClusterFindUnique({ id: clusterId })

  if (isLoading) {
    return <Spinner />
  }
  if (isError) {
    return <UiError message={error} />
  }
  if (!item) {
    return <UiNotFound />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UiBack />
          Edit Cluster
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <SettingsUiClusterFormUpdate
          item={item}
          submit={async (input) => {
            return updateMutation.mutateAsync({ id: item.id, input }).then(() => {
              navigate('/settings/clusters')
            })
          }}
        />
      </CardContent>
    </Card>
  )
}
