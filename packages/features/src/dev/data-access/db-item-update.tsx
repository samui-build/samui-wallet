import { Db } from '@workspace/db/db'
import { tryCatch } from '@workspace/core/try-catch'
import { DbAccountUpdateInput } from '@workspace/db/db-account'
import { DbClusterUpdateInput } from '@workspace/db/db-cluster'
import { DbWalletUpdateInput } from '@workspace/db/db-wallet'

export type DbItemUpdateInput = DbAccountUpdateInput | DbClusterUpdateInput | DbWalletUpdateInput

export interface DbItemUpdateProps {
  id: string
  input: DbItemUpdateInput
  table: string
}

export async function dbItemUpdate(db: Db, { id, input, table }: DbItemUpdateProps) {
  const item = {
    ...input,
    updatedAt: new Date(),
  }
  const { error } = await tryCatch(db.table(table).update(id, item))
  if (error) {
    console.error(error)
    return
  }
}
