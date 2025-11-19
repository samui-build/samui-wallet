import { View } from 'react-native'
import { UiSectionList } from '../../ui/ui-section-list.tsx'

export function ToolsFeatureIndex() {
  return (
    <View className="p-4">
      <UiSectionList
        sections={[
          { icon: 'airdrop', label: 'Airdrop', path: 'Airdrop' },
          { icon: 'coins', label: 'Token Creator', path: 'Token Creator' },
        ]}
      />
    </View>
  )
}
