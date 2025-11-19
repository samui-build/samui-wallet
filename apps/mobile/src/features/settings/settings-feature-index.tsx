import { View } from 'react-native'
import { UiSectionList } from '../../ui/ui-section-list.tsx'

export function SettingsFeatureIndex() {
  return (
    <View className="p-4">
      <UiSectionList
        sections={[
          { icon: 'settings', label: 'General', path: 'General' },
          { icon: 'network', label: 'Networks', path: 'Networks' },
          { icon: 'wallet', label: 'Wallets', path: 'Wallets' },
        ]}
      />
    </View>
  )
}
