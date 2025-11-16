import { Link } from '@react-navigation/native'
import { Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// @ts-expect-error png
import logo from '../../../assets/icon.png'

export function LoadingFeatureIndex() {
  return (
    <SafeAreaView>
      <View className="flex flex-col h-full items-center justify-center bg-white dark:bg-neutral-900">
        <Image className="w-[128px] h-[128px]" source={logo} />
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Samui Wallet</Text>

        <View className="gap-6 mt-6">
          <Link params={{}} screen="Onboarding">
            <View className="p-2 bg-neutral-50 dark:bg-neutral-950 rounded-sm w-[200px] items-center">
              <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Go to onboarding</Text>
            </View>
          </Link>
          <Link params={{}} screen="App">
            <View className="p-2 bg-neutral-50 dark:bg-neutral-950 rounded-sm w-[200px] items-center">
              <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Go to the app</Text>
            </View>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}
