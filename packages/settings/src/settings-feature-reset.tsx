import { UiCard } from '@workspace/ui/components/ui-card'
import { UiPage } from '@workspace/ui/components/ui-page'
import { SettingsFeatureGeneralDangerDeleteDatabase } from './settings-feature-general-danger-delete-database.tsx'

export default function SettingsFeatureReset() {
  return (
    <UiPage className="p-1 md:p-4">
      <UiCard
        contentProps={{ className: 'space-y-6' }}
        description="Make sure that you have a copy of the data."
        title="Reset application database"
      >
        <div className="rounded-md border border-red-500 py-4 text-center font-bold text-red-500">
          THIS ACTION CAN NOT BE REVERSED
        </div>
        <SettingsFeatureGeneralDangerDeleteDatabase />
      </UiCard>
    </UiPage>
  )
}
