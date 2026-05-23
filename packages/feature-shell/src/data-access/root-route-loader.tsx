import type { AppContext } from '@workspace/context/app-context'
import type { Account } from '@workspace/db/account/account'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { rootLoader } from '@workspace/db-react/root-loader'
import { i18n } from '@workspace/i18n'
import { type LoaderFunctionArgs, redirect } from 'react-router'
import { redirectToOnboarding } from './redirect-to-onboarding.tsx'

export function rootRouteLoader(ctx: AppContext) {
  return async (args: LoaderFunctionArgs) => {
    const url = new URL(args.request.url)
    const hashPath = getHashPath(url)
    const hashPathname = hashPath.split('?')[0] || '/'

    const result = await rootLoader(ctx)
    const { accounts, networks, settings, wallets } = result

    const activeAccountId = settings.find((s) => s.key === 'activeAccountId')?.value
    if (!activeAccountId && !isRouteMatch(hashPathname, '/onboarding')) {
      return redirectToOnboarding()
    }

    if (!networks.length && !isRouteMatch(hashPathname, '/onboarding')) {
      return redirect('/settings/networks')
    }
    const theme = settings.find((s) => s.key === 'theme')?.value ?? 'dark'
    document.documentElement.classList.toggle('dark', theme === 'dark')

    const language = settings.find((s) => s.key === 'language')?.value ?? 'en'
    await i18n.changeLanguage(language)

    if (
      !isLockGuardExempt(hashPathname) &&
      (await shouldRedirectToUnlock({ accounts, activeAccountId, ctx, wallets }))
    ) {
      return redirect(`/unlock?next=${encodeURIComponent(hashPath)}`)
    }

    return result
  }
}

function getHashPath(url: URL): string {
  return url.hash.replace(/^#/, '') || `${url.pathname}${url.search}` || '/'
}

function isLockGuardExempt(hashPathname: string): boolean {
  return (
    isRouteMatch(hashPathname, '/onboarding') ||
    isRouteMatch(hashPathname, '/request') ||
    hashPathname === '/security/migrate' ||
    hashPathname === '/settings/security' ||
    hashPathname === '/unlock'
  )
}

function isRouteMatch(hashPathname: string, route: string): boolean {
  return hashPathname === route || hashPathname.startsWith(`${route}/`)
}

async function shouldRedirectToUnlock({
  accounts,
  activeAccountId,
  ctx,
  wallets,
}: {
  accounts: Account[]
  activeAccountId: string | undefined
  ctx: AppContext
  wallets: Wallet[]
}): Promise<boolean> {
  const account = accounts.find((item) => item.id === activeAccountId)
  if (!account) {
    return false
  }

  const wallet = wallets.find((item) => item.id === account.walletId)
  if (!wallet || wallet.protectionMode === 'unsecured') {
    return false
  }

  try {
    await ctx.vault.requireWalletKey({ walletId: wallet.id })
    return false
  } catch {
    return true
  }
}
