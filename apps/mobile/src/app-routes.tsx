import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigationTheme } from './app-theme.tsx'

function FeatureHome() {
  return (
    <SafeAreaView>
      <View className="p-2">
        <View className="bg-card border border-border p-4 rounded-lg">
          <Text className="text-foreground text-lg font-bold">Samui Wallet</Text>
          <Text className="text-foreground-secondary mt-2">This is Samui Wallet with Uniwind themes</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: { options: { headerShown: false }, screen: FeatureHome },
  },
})

const AppNavigation = createStaticNavigation(RootStack)

export function AppRoutes() {
  const theme = useNavigationTheme()

  return <AppNavigation theme={theme} />
}
