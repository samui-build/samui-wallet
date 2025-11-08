// @ts-expect-error css import
import './global.css'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppRoutes } from './app-routes.tsx'

export function App() {
  return (
    <SafeAreaProvider>
      <AppRoutes />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  )
}
