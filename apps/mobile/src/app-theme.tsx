import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'
import { formatHex } from 'culori'
import { useCallback } from 'react'
import { Appearance } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'
import colors from 'tailwindcss/colors'
import { Uniwind } from 'uniwind'
import { storage } from './utils/storage.ts'

export function oklchToHex(oklchString: string) {
  return formatHex(oklchString) || '#000000'
}

export type UniwindThemes = typeof Uniwind.currentTheme | 'system'
type NativeColorScheme = 'light' | 'dark' | undefined
const SELECTED_THEME_KEY = 'SELECTED_THEME'

/**
 * Converts a Uniwind theme value to a React Native color scheme value.
 * Maps 'system' to undefined (which tells React Native to use system preference),
 * and passes through 'light' or 'dark' themes directly.
 *
 * @param theme - The Uniwind theme value ('light', 'dark', or 'system')
 * @returns The native color scheme ('light', 'dark', or undefined for system)
 */
export const getNativeColorScheme = (theme: UniwindThemes): NativeColorScheme => {
  const colorSchemeMap: Record<string, NativeColorScheme> = {
    system: undefined,
  }

  return colorSchemeMap[theme] ?? (theme as NativeColorScheme)
}

/**
 * React hook for managing the stored theme preference.
 * Provides the current stored theme and a function to update both the active theme
 * and the persisted theme preference.
 *
 * @returns An object containing:
 *   - `storedTheme`: The current stored theme ('light', 'dark', or 'system')
 *   - `storeAndSetTheme`: Function to set and persist a new theme
 */
export const useStoredTheme = () => {
  const [storedTheme, setStoredTheme] = useMMKVString(SELECTED_THEME_KEY, storage)

  const storeAndSetTheme = useCallback(
    (t: UniwindThemes) => {
      // Set the theme
      Uniwind.setTheme(t)

      // Store the theme
      setStoredTheme(t)
    },
    [setStoredTheme],
  )

  return {
    storeAndSetTheme,
    storedTheme: (storedTheme ?? 'system') as UniwindThemes,
  } as const
}

/**
 * Synchronously retrieves the stored theme preference from persistent storage.
 * Returns 'system' as the default if no theme has been stored.
 *
 * @returns The stored theme ('light', 'dark', or 'system')
 */
export const getStoredThemeSync = () => {
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
    background: oklchToHex(colors.neutral['900']),
    card: oklchToHex(colors.neutral['950']),
  },
}

/**
 * Gets the React Navigation theme object based on the Uniwind theme preference.
 * Maps Uniwind themes to corresponding React Navigation themes, handling the
 * 'system' case by checking the device's current color scheme.
 *
 * @param uniwindTheme - The Uniwind theme value ('light', 'dark', or 'system')
 * @returns The React Navigation Theme object configured for the specified theme
 */
export const getNavigationTheme = (uniwindTheme: UniwindThemes): Theme => {
  const themeMap: Record<UniwindThemes, Theme> = {
    dark: AppDarkTheme,
    light: AppLightTheme,
    system: Appearance.getColorScheme() === 'dark' ? DarkTheme : DefaultTheme,
  }
  return themeMap[uniwindTheme]
}
