import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LucideHammer, LucidePieChart, LucideSettings } from 'lucide-react-native'
import { useUniwind } from 'uniwind'
import { getNavigationTheme } from './app-theme.tsx'
import { LoadingFeatureIndex } from './features/loading/loading-feature-index.tsx'
import { OnboardingFeatureGenerate } from './features/onboarding/onboarding-feature-generate.tsx'
import { OnboardingFeatureImport } from './features/onboarding/onboarding-feature-import.tsx'
import { OnboardingFeatureIndex } from './features/onboarding/onboarding-feature-index.tsx'
import { PortfolioFeatureIndex } from './features/portfolio/portfolio-feature-index.tsx'
import { SettingsFeatureGeneral } from './features/settings/settings-feature-general.tsx'
import { SettingsFeatureIndex } from './features/settings/settings-feature-index.tsx'
import { SettingsFeatureNetworks } from './features/settings/settings-feature-networks.tsx'
import { SettingsFeatureWallets } from './features/settings/settings-feature-wallets.tsx'
import { ToolsFeatureAirdrop } from './features/tools/tools-feature-airdrop.tsx'
import { ToolsFeatureIndex } from './features/tools/tools-feature-index.tsx'
import { ToolsFeatureTokenCreator } from './features/tools/tools-feature-token-creator.tsx'

const SettingsNavigator = createNativeStackNavigator({
  initialRouteName: 'Index',
  screens: {
    General: {
      options: { headerTitle: 'General' },
      screen: SettingsFeatureGeneral,
    },
    Index: {
      options: { headerTitle: 'Settings' },
      screen: SettingsFeatureIndex,
    },
    Networks: {
      options: { headerTitle: 'Networks' },
      screen: SettingsFeatureNetworks,
    },
    Wallets: {
      options: { headerTitle: 'Wallets' },
      screen: SettingsFeatureWallets,
    },
  },
})

const PortfolioNavigator = createNativeStackNavigator({
  initialRouteName: 'Index',
  screens: {
    Index: {
      options: { headerTitle: 'Portfolio' },
      screen: PortfolioFeatureIndex,
    },
  },
})

const OnboardingNavigator = createNativeStackNavigator({
  initialRouteName: 'Index',
  screens: {
    Generate: {
      options: { headerTitle: 'Generate' },
      screen: OnboardingFeatureGenerate,
    },
    Import: {
      options: { headerTitle: 'Import' },
      screen: OnboardingFeatureImport,
    },
    Index: {
      options: { headerTitle: 'Onboarding' },
      screen: OnboardingFeatureIndex,
    },
  },
})
const ToolsNavigator = createNativeStackNavigator({
  initialRouteName: 'Index',
  screens: {
    Airdrop: {
      options: { headerTitle: 'Airdrop' },
      screen: ToolsFeatureAirdrop,
    },
    Index: {
      options: { headerTitle: 'Tools' },
      screen: ToolsFeatureIndex,
    },
    TokenCreator: {
      options: { headerTitle: 'Token Creator' },
      screen: ToolsFeatureTokenCreator,
    },
  },
})

const AppTabsNavigator = createBottomTabNavigator({
  initialRouteName: 'Portfolio',
  // biome-ignore assist/source/useSortedKeys: Key order determines tab order
  screens: {
    Portfolio: {
      options: {
        headerShown: false,
        tabBarIcon: ({ color }) => <LucidePieChart color={color} />,
      },
      screen: PortfolioNavigator,
    },
    Tools: {
      options: {
        headerShown: false,
        tabBarIcon: ({ color }) => <LucideHammer color={color} />,
      },
      screen: ToolsNavigator,
    },
    Settings: {
      options: {
        headerShown: false,
        tabBarIcon: ({ color }) => <LucideSettings color={color} />,
      },
      screen: SettingsNavigator,
    },
  },
})

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Loading',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    App: {
      options: { headerShown: false },
      screen: AppTabsNavigator,
    },
    Loading: LoadingFeatureIndex,
    Onboarding: OnboardingNavigator,
  },
})

const AppNavigation = createStaticNavigation(RootStack)

export function AppRoutes() {
  const { theme } = useUniwind()
  const navigationTheme = getNavigationTheme(theme)

  return <AppNavigation theme={navigationTheme} />
}
