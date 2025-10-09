import { Db } from '@workspace/db/db'
import { tryCatch } from '@workspace/core/try-catch'

export interface DbItemDeleteProps {
  id: string
  table: string
}

export async function dbItemDelete(db: Db, { id, table }: DbItemDeleteProps) {
  const { error } = await tryCatch(db.table(table).delete(id))
  if (error) {
    console.error(error)
    return
  }
}
