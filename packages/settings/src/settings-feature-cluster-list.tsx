import { useDbClusterDelete } from '@workspace/db-react/use-db-cluster-delete'
import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { Button } from '@workspace/ui/components/button'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { Link } from 'react-router'

import { useSettingsPage } from './data-access/use-settings-page.js'
import { SettingsUiClusterList } from './ui/settings-ui-cluster-list.js'
import { SettingsUiPageCard } from './ui/settings-ui-page-card.js'

export function SettingsFeatureClusterList() {
  const page = useSettingsPage({ pageId: 'clusters' })
  const deleteMutation = useDbClusterDelete({
    onError: () => toastError('Error deleting cluster'),
    onSuccess: () => toastSuccess('Cluster deleted :)'),
  })
  const items = useDbClusterLive()

  return (
    <SettingsUiPageCard
      action={
        <Button asChild>
          <Link to="create">Create</Link>
        </Button>
      }
      page={page}
    >
      <SettingsUiClusterList deleteItem={(input) => deleteMutation.mutateAsync({ id: input.id })} items={items} />
    </SettingsUiPageCard>
  )
}
