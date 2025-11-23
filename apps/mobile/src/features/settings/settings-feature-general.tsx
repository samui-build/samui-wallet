import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function SettingsFeatureGeneral() {
  return (
    <SafeAreaView>
      <View className="flex h-full flex-col items-center justify-center">
        <Text className="font-bold text-2xl text-neutral-900 dark:text-neutral-100">General</Text>
      </View>
    </SafeAreaView>
  )
}
