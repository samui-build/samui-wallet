import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function OnboardingFeatureGenerate() {
  const mnemonic = generateMnemonic()
  // @TODO: Delete me when working on this screen. This is just to ensure crypto + workspace imports work.
  console.log('generated mnemonic', mnemonic)
  return (
    <SafeAreaView>
      <View className="flex flex-col h-full items-center justify-center bg-white dark:bg-neutral-900">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Generate new wallet</Text>
      </View>
    </SafeAreaView>
  )
}
