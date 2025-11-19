import { useNetworkCreate } from '@workspace/db-react/use-network-create'
import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useNavigate } from 'react-router'
import { SettingsUiNetworkFormCreate } from './ui/settings-ui-network-form-create.tsx'

export function SettingsFeatureNetworkCreate() {
  const { t } = useTranslation('settings')
  const createMutation = useNetworkCreate()
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
