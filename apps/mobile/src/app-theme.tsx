import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import { formatHex } from 'culori'
import { useColorScheme } from 'react-native'
import colors from 'tailwindcss/colors'

export function oklchToHex(oklchString: string) {
  return formatHex(oklchString) || '#000000'
}

const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
}

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: oklchToHex(colors.neutral['900']),
    card: oklchToHex(colors.neutral['950']),
  },
}

export function useAppTheme() {
  const scheme = useColorScheme()

  return scheme === 'dark' ? AppDarkTheme : AppLightTheme
}
