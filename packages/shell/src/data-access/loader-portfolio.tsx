import { db } from '@workspace/db/db'
import { dbNetworkFindMany } from '@workspace/db/db-network-find-many'
import { dbWalletFindMany } from '@workspace/db/db-wallet-find-many'
import { redirect } from 'react-router'
import type { ShellMode } from '../shell-feature.tsx'
import { redirectToOnboarding } from './redirect-to-onboarding.tsx'

export function loaderPortfolio(mode: ShellMode) {
  return async () => {
    const [wallets, networks] = await Promise.all([dbWalletFindMany(db), dbNetworkFindMany(db)])
    if (!wallets.length) {
      return redirectToOnboarding(mode)
    }
    if (!networks.length) {
      return redirect('/settings/networks')
    }
    return null
  }
}
