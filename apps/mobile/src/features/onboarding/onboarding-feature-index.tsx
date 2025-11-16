import { LucideDownload, LucideSparkle } from 'lucide-react-native'
import { View } from 'react-native'
import { UiSectionList } from '../../ui/ui-section-list.tsx'

export function OnboardingFeatureIndex() {
  return (
    <View className="p-4">
      <UiSectionList
        sections={[
          { icon: LucideSparkle, label: 'Generate new wallet', path: 'Generate' },
          { icon: LucideDownload, label: 'Import existing wallet', path: 'Import' },
        ]}
      />
    </View>
  )
}
