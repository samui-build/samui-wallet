import { db } from '@workspace/db/db'
import { dbNetworkFindMany } from '@workspace/db/db-network-find-many'
import { walletFindMany } from '@workspace/db/wallet/wallet-find-many'
import { redirect } from 'react-router'

export async function loaderPortfolio() {
  const [wallets, networks] = await Promise.all([walletFindMany(db), dbNetworkFindMany(db)])
  if (!wallets.length) {
    return redirect('/onboarding')
  }
  if (!networks.length) {
    return redirect('/settings/networks')
  }
  return null
}
