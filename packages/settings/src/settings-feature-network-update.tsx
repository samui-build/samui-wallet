import { useDbNetworkFindUnique } from '@workspace/db-react/use-db-network-find-unique'
import { useDbNetworkUpdate } from '@workspace/db-react/use-db-network-update'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useNavigate, useParams } from 'react-router'

import { SettingsUiNetworkFormUpdate } from './ui/settings-ui-network-form-update.tsx'

export function SettingsFeatureNetworkUpdate() {
  const navigate = useNavigate()
  const { networkId } = useParams() as { networkId: string }
  const updateMutation = useDbNetworkUpdate()
  const { data: item, error, isError, isLoading } = useDbNetworkFindUnique({ id: networkId })

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
    <UiCard backButtonTo=".." title="Edit Network">
      <SettingsUiNetworkFormUpdate
        item={item}
        submit={async (input) => {
          return updateMutation.mutateAsync({ id: item.id, input }).then(() => {
            navigate('/settings/networks')
          })
        }}
      />
    </UiCard>
  )
}
