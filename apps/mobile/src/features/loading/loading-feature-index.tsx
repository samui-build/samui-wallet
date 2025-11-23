import { Link } from '@react-navigation/native'
import { Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import logo from '../../../assets/icon.png'

export function LoadingFeatureIndex() {
  return (
    <SafeAreaView>
      <View className="flex h-full flex-col items-center justify-center">
        <Image className="h-[128px] w-[128px]" source={logo} />
        <Text className="font-bold text-2xl text-neutral-900 dark:text-neutral-100">Samui Wallet</Text>
        <View className="mt-6 flex items-center gap-6">
          <Link params={{}} screen="Onboarding">
            <View className="items-center rounded-lg bg-neutral-50 px-6 py-4 dark:bg-neutral-900">
              <Text className="text-center text-lg text-neutral-900 dark:text-neutral-100">Go to onboarding</Text>
            </View>
          </Link>
          <Link params={{}} screen="App">
            <View className="items-center rounded-lg bg-neutral-50 px-6 py-4 dark:bg-neutral-900">
              <Text className="text-lg text-neutral-900 dark:text-neutral-100">Go to the app</Text>
            </View>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}
