import { useDbAccountFindUnique } from '@workspace/db-react/use-db-account-find-unique'
import { useDbAccountUpdate } from '@workspace/db-react/use-db-account-update'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useNavigate, useParams } from 'react-router'

import { SettingsUiAccountFormUpdate } from './ui/settings-ui-account-form-update.tsx'

export function SettingsFeatureAccountUpdate() {
  const navigate = useNavigate()
  const { accountId } = useParams() as { accountId: string }
  const updateMutation = useDbAccountUpdate()
  const { data: item, error, isError, isLoading } = useDbAccountFindUnique({ id: accountId })

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
    <UiCard backButtonTo={`/settings/accounts/${item.id}`} title="Edit Account">
      <SettingsUiAccountFormUpdate
        item={item}
        submit={async (input) =>
          await updateMutation.mutateAsync({ id: item.id, input }).then(() => {
            navigate(`/settings/accounts/${item.id}`)
          })
        }
      />
    </UiCard>
  )
}
