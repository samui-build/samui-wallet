import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function PortfolioFeatureIndex() {
  return (
    <SafeAreaView>
      <View className="flex flex-col h-full items-center justify-center bg-white dark:bg-neutral-900">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Portfolio</Text>
      </View>
    </SafeAreaView>
  )
}
