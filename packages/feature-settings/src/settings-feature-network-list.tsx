import { useNetworkDelete } from '@workspace/db-react/use-network-delete'
import { useNetworkLive } from '@workspace/db-react/use-network-live'
import { useSetting } from '@workspace/db-react/use-setting'
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
  const deleteMutation = useNetworkDelete({
    onError: (error) => toastError(error.message),
    onSuccess: () => toastSuccess('Network deleted'),
  })
  const networks = useNetworkLive()
  const [activeNetworkId] = useSetting('activeNetworkId')
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
        activeId={activeNetworkId}
        deleteItem={(input) => deleteMutation.mutateAsync({ id: input.id })}
        items={networks}
      />
    </UiCard>
  )
}
