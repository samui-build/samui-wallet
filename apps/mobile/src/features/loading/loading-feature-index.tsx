import { Link } from '@react-navigation/native'
import { Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import logo from '../../../assets/icon.png'

export function LoadingFeatureIndex() {
  return (
    <SafeAreaView>
      <View className="flex flex-col h-full items-center justify-center">
        <Image className="w-[128px] h-[128px]" source={logo} />
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Samui Wallet</Text>
        <View className="gap-6 mt-6 flex items-center">
          <Link params={{}} screen="Onboarding">
            <View className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg items-center">
              <Text className="text-lg text-center text-neutral-900 dark:text-neutral-100 ">Go to onboarding</Text>
            </View>
          </Link>
          <Link params={{}} screen="App">
            <View className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg items-center">
              <Text className="text-lg text-neutral-900 dark:text-neutral-100">Go to the app</Text>
            </View>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}
