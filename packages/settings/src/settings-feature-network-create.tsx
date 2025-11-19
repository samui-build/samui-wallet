import { useDbNetworkCreate } from '@workspace/db-react/use-db-network-create'
import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useNavigate } from 'react-router'
import { SettingsUiNetworkFormCreate } from './ui/settings-ui-network-form-create.tsx'

export function SettingsFeatureNetworkCreate() {
  const { t } = useTranslation('settings')
  const createMutation = useDbNetworkCreate()
  const navigate = useNavigate()
  return (
    <UiCard backButtonTo=".." contentProps={{ className: 'grid gap-6' }} title={t(($) => $.networkPageAddTitle)}>
      <SettingsUiNetworkFormCreate
        submit={(input) =>
          createMutation.mutateAsync({ input }).then(() => {
            navigate('/settings/networks')
          })
        }
      />
    </UiCard>
  )
}
