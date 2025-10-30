import { useDbClusterDelete } from '@workspace/db-react/use-db-cluster-delete'
import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { Link } from 'react-router'

import { useSettingsPage } from './data-access/use-settings-page.js'
import { SettingsUiClusterList } from './ui/settings-ui-cluster-list.js'

export function SettingsFeatureClusterList() {
  const page = useSettingsPage({ pageId: 'clusters' })
  const deleteMutation = useDbClusterDelete({
    onError: () => toastError('Error deleting cluster'),
    onSuccess: () => toastSuccess('Cluster deleted'),
  })
  const items = useDbClusterLive()
  const [activeId] = useDbPreference('activeClusterId')
  return (
    <UiCard
      action={
        <Button asChild variant="outline">
          <Link to="create">Create</Link>
        </Button>
      }
      description={page.description}
      title={page.name}
    >
      <SettingsUiClusterList
        activeId={activeId}
        deleteItem={(input) => deleteMutation.mutateAsync({ id: input.id })}
        items={items}
      />
    </UiCard>
  )
}
