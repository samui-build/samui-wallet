import { rootLoader } from '@workspace/db-react/root-loader'
import { i18n } from '@workspace/i18n'
import { type LoaderFunctionArgs, redirect } from 'react-router'
import { redirectToOnboarding } from './redirect-to-onboarding.tsx'

export function rootRouteLoader() {
  return async (args: LoaderFunctionArgs) => {
    const url = new URL(args.request.url)
    const pathname = url.pathname

    const result = await rootLoader()
    const { settings, networks } = result

    const activeWalletId = settings.find((s) => s.key === 'activeWalletId')?.value
    if (!activeWalletId && !pathname.startsWith('/onboarding')) {
      return redirectToOnboarding()
    }

    if (!networks.length) {
      return redirect('/settings/networks')
    }
    const theme = settings.find((s) => s.key === 'theme')?.value ?? 'dark'
    document.documentElement.classList.toggle('dark', theme === 'dark')

    const language = settings.find((s) => s.key === 'language')?.value ?? 'en'
    await i18n.changeLanguage(language)

    return result
  }
}
