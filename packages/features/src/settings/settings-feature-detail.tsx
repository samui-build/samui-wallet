import { useParams } from 'react-router'

import { useSettingsDetail } from './data-access/use-settings-detail.js'
import { SettingsUiDetailGrid } from './ui/settings-ui-detail-grid.js'
import { SettingsUiGroupCard } from './ui/settings-ui-group-card.js'

export function SettingsFeatureDetail() {
  const { groupId } = useParams() as { groupId: string }
  const group = useSettingsDetail({ groupId })

  return (
    <SettingsUiDetailGrid>
      <SettingsUiGroupCard group={group} />
    </SettingsUiDetailGrid>
  )
}
