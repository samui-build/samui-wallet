import { db } from '@workspace/db/db'
import { dbAccountFindMany } from '@workspace/db/db-account-find-many'
import { dbNetworkFindMany } from '@workspace/db/db-network-find-many'
import { redirect } from 'react-router'

export async function loaderPortfolio() {
  const [accounts, networks] = await Promise.all([dbAccountFindMany(db), dbNetworkFindMany(db)])
  if (!accounts.length) {
    return redirect('/onboarding')
  }
  if (!networks.length) {
    return redirect('/settings/networks')
  }
  return null
}
