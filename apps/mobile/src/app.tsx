import './global.css'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Uniwind } from 'uniwind'
import { AppRoutes } from './app-routes.tsx'
import { getStoredThemeSync } from './app-theme.tsx'

// Set initial theme based on user preference
const initialTheme = getStoredThemeSync()
Uniwind.setTheme(initialTheme ?? 'system')

export function App() {
  return (
    <SafeAreaProvider>
      <AppRoutes />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  )
}
