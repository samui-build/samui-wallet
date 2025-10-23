import { db } from '@workspace/db/db'
import { dbAccountFindMany } from '@workspace/db/db-account-find-many'
import { dbClusterFindMany } from '@workspace/db/db-cluster-find-many'
import { redirect } from 'react-router'

export async function loaderPortfolio() {
  const [accounts, clusters] = await Promise.all([dbAccountFindMany(db), dbClusterFindMany(db)])
  if (!accounts.length) {
    return redirect('/settings/accounts')
  }
  if (!clusters.length) {
    return redirect('/settings/clusters')
  }
  return null
}
