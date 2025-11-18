import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function OnboardingFeatureGenerate() {
  return (
    <SafeAreaView>
      <View className="flex flex-col h-full items-center justify-center">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Generate new wallet</Text>
      </View>
    </SafeAreaView>
  )
}
