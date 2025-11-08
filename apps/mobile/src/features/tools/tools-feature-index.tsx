import { LucideCoins, LucideUmbrella } from 'lucide-react-native'
import { View } from 'react-native'
import { UiSectionList } from '../../ui/ui-section-list.tsx'

export function ToolsFeatureIndex() {
  return (
    <View className="p-4">
      <UiSectionList
        sections={[
          { icon: LucideUmbrella, label: 'Airdrop', path: 'Airdrop' },
          { icon: LucideCoins, label: 'Token Creator', path: 'Token Creator' },
        ]}
      />
    </View>
  )
}
