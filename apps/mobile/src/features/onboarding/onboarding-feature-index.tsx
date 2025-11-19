import { View } from 'react-native'
import { UiSectionList } from '../../ui/ui-section-list.tsx'

export function OnboardingFeatureIndex() {
  return (
    <View className="p-4">
      <UiSectionList
        sections={[
          { icon: 'mnemonic', label: 'Generate new wallet', path: 'Generate' },
          { icon: 'import', label: 'Import existing wallet', path: 'Import' },
        ]}
      />
    </View>
  )
}
