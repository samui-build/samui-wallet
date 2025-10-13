import { useDbClusterCreate } from '@workspace/db-react/use-db-cluster-create'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { UiBack } from '@workspace/ui/components/ui-back'
import { useNavigate } from 'react-router'

import { SettingsUiClusterFormCreate } from './ui/settings-ui-cluster-form-create.js'

export function SettingsFeatureClusterCreate() {
  const createMutation = useDbClusterCreate()
  const navigate = useNavigate()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UiBack />
          Add Cluster
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <SettingsUiClusterFormCreate
          submit={(input) =>
            createMutation.mutateAsync({ input }).then(() => {
              navigate('/settings/clusters')
            })
          }
        />
      </CardContent>
    </Card>
  )
}
