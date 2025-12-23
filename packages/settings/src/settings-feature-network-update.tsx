import { useNetworkFindUnique } from '@workspace/db-react/use-network-find-unique'
import { useNetworkUpdate } from '@workspace/db-react/use-network-update'
import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useNavigate, useParams } from 'react-router'
import { SettingsUiNetworkFormUpdate } from './ui/settings-ui-network-form-update.tsx'

export function SettingsFeatureNetworkUpdate() {
  const { t } = useTranslation('settings')
  const navigate = useNavigate()
  const { networkId } = useParams<{ networkId: string }>()
  const updateMutation = useNetworkUpdate()
  const network = useNetworkFindUnique({ id: networkId })

  if (!networkId) {
    return <UiError message={new Error('Network ID parameter is unknown')} title="No network ID" />
  }

  if (!network) {
    return <UiNotFound />
  }

  return (
    <UiCard backButtonTo=".." title={t(($) => $.networkPageEditTitle)}>
      <SettingsUiNetworkFormUpdate
        item={network}
        submit={async (input) => {
          return updateMutation.mutateAsync({ id: network.id, input }).then(() => {
            navigate('/settings/networks')
          })
        }}
      />
    </UiCard>
  )
}
