import { useDbClusterDelete } from '@workspace/db-react/use-db-cluster-delete'
import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbPreferenceFindUnique } from '@workspace/db-react/use-db-preference-find-unique-by-key'
import { useDbPreferenceUpdateByKey } from '@workspace/db-react/use-db-preference-update-by-key'
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
    onSuccess: () => toastSuccess('Cluster deleted'),
  })
  const items = useDbClusterLive()
  const { data } = useDbPreferenceFindUnique({ key: 'activeClusterId' })
  const { mutateAsync } = useDbPreferenceUpdateByKey('activeClusterId')
  return (
    <SettingsUiPageCard
      action={
        <Button asChild variant="outline">
          <Link to="create">Create</Link>
        </Button>
      }
      page={page}
    >
      <SettingsUiClusterList
        activeClusterId={data?.value ?? null}
        deleteItem={(input) => deleteMutation.mutateAsync({ id: input.id })}
        items={items}
        setActive={async (item) => {
          if (!data?.id) {
            return
          }
          await mutateAsync({ input: { value: item.id } })
        }}
      />
    </SettingsUiPageCard>
  )
}
