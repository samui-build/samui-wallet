import { Db } from '@workspace/db/db'
import { tryCatch } from '@workspace/core/try-catch'
import { DbAccountCreateInput } from '@workspace/db/db-account'
import { DbClusterCreateInput } from '@workspace/db/db-cluster'
import { DbWalletCreateInput } from '@workspace/db/db-wallet'

export type DbItemCreateInput = DbAccountCreateInput | DbClusterCreateInput | DbWalletCreateInput

export interface DbItemCreateProps {
  table: string
  input: DbItemCreateInput
}

export async function dbItemCreate(db: Db, { input, table }: DbItemCreateProps) {
  const item = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const { error } = await tryCatch(db.table(table).add(item))
  if (error) {
    console.error(error)
    return
  }
}
