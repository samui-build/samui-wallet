import { LucideCog, LucideNetwork, LucideWallet2 } from 'lucide-react-native'
import { View } from 'react-native'
import { UiSectionList } from '../../ui/ui-section-list.tsx'

export function SettingsFeatureIndex() {
  return (
    <View className="p-4">
      <UiSectionList
        sections={[
          { icon: LucideCog, label: 'General', path: 'General' },
          { icon: LucideNetwork, label: 'Networks', path: 'Networks' },
          { icon: LucideWallet2, label: 'Wallets', path: 'Wallets' },
        ]}
      />
    </View>
  )
}
