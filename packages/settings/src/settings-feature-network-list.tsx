import { useDbNetworkDelete } from '@workspace/db-react/use-db-network-delete'
import { useDbNetworkLive } from '@workspace/db-react/use-db-network-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { Link } from 'react-router'
import { useSettingsPage } from './data-access/use-settings-page.tsx'
import { SettingsUiNetworkList } from './ui/settings-ui-network-list.tsx'

export function SettingsFeatureNetworkList() {
  const { t } = useTranslation('settings')
  const page = useSettingsPage({ pageId: 'networks' })
  const deleteMutation = useDbNetworkDelete({
    onError: () => toastError('Error deleting network'),
    onSuccess: () => toastSuccess('Network deleted'),
  })
  const items = useDbNetworkLive()
  const [activeId] = useDbSetting('activeNetworkId')
  return (
    <UiCard
      action={
        <Button asChild variant="outline">
          <Link to="create">{t(($) => $.actionCreate)}</Link>
        </Button>
      }
      description={page.description}
      title={page.name}
    >
      <SettingsUiNetworkList
        activeId={activeId}
        deleteItem={(input) => deleteMutation.mutateAsync({ id: input.id })}
        items={items}
      />
    </UiCard>
  )
}
