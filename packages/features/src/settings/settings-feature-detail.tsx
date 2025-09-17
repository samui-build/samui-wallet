import { useParams } from 'react-router'
import { useSettingsDetail } from './data-access/use-settings-detail.js'
import { SettingsUiDetailGrid } from './ui/settings-ui-detail-grid.js'
import { SettingsUiCard } from './ui/settings-ui-card.js'

export function SettingsFeatureDetail() {
  const { groupId, itemId } = useParams() as { groupId: string; itemId: string }
  const { item } = useSettingsDetail({ groupId, itemId })

  return (
    <SettingsUiDetailGrid>
      <SettingsUiCard item={item} />
    </SettingsUiDetailGrid>
  )
}
