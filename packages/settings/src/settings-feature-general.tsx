import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { useDbPreferenceCreate } from '@workspace/db-react/use-db-preference-create'
import { useDbPreferenceFindUnique } from '@workspace/db-react/use-db-preference-find-unique-by-key'
import { useDbPreferenceUpdateByKey } from '@workspace/db-react/use-db-preference-update-by-key'

import { useSettingsPage } from './data-access/use-settings-page.js'
import { SettingsFeatureGeneralDangerDeleteDatabase } from './settings-feature-general-danger-delete-database.js'
import { SettingsFeatureGeneralWarningAcceptExperimental } from './settings-feature-general-warning-accept-experimental.js'
import { SettingsUiPageCard } from './ui/settings-ui-page-card.js'

export function SettingsFeatureGeneral() {
  const page = useSettingsPage({ pageId: 'general' })
  return (
    <SettingsUiPageCard page={page}>
      <SettingsFeatureGeneralWarningAcceptExperimental />
      <div className="border border-red-500 rounded-md p-4">
        <SettingsFeatureGeneralDangerDeleteDatabase />
      </div>
    </SettingsUiPageCard>
  )
}

export function usePreference(key: PreferenceKey) {
  const { data, refetch } = useDbPreferenceFindUnique({ key: key })
  const mutationCreate = useDbPreferenceCreate()
  const mutationUpdate = useDbPreferenceUpdateByKey(key)

  return {
    update: async (value: string) => {
      if (!data) {
        await mutationCreate.mutateAsync({ input: { key, value } })
        await refetch()
        return
      }
      await mutationUpdate.mutateAsync({ input: { value } })
      await refetch()
    },
    value: data?.value,
  }
}
