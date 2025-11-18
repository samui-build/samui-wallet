import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'
import { Appearance } from 'react-native'
import { type Uniwind, useUniwind } from 'uniwind'
import { storage } from './utils/storage.ts'

export type UniwindThemes = typeof Uniwind.currentTheme | 'system'
const SELECTED_THEME_KEY = 'SELECTED_THEME'

/**
 * Synchronously retrieves the stored theme preference from persistent storage.
 * Returns 'system' as the default if no theme has been stored.
 *
 * @returns The stored theme ('light', 'dark', or 'system')
 */
export function getStoredThemeSync() {
  const theme = storage.getString(SELECTED_THEME_KEY) as UniwindThemes | undefined

  return theme ?? 'system'
}

// Theme definitions
const AppLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
}

const AppDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
  },
}

/**
 * Gets the React Navigation theme object based on the Uniwind theme preference.
 * Maps Uniwind themes to corresponding React Navigation themes, handling the
 * 'system' case by checking the device's current color scheme.
 *
 * @returns The React Navigation Theme object configured for the specified theme
 */
export function useNavigationTheme(): Theme {
  const { theme } = useUniwind()
  const themeMap: Record<UniwindThemes, Theme> = {
    dark: AppDarkTheme,
    light: AppLightTheme,
    system: Appearance.getColorScheme() === 'dark' ? DarkTheme : DefaultTheme,
  }
  return themeMap[theme]
}
