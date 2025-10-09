import { Db } from '@workspace/db/db'
import { tryCatch } from '@workspace/core/try-catch'
import { DbItem } from './db-browser-provider.js'

export interface DbItemFindManyProps {
  table: string
}

export async function dbItemFindMany(db: Db, { table }: DbItemFindManyProps) {
  const { data, error } = await tryCatch(db.table(table).toArray())
  if (error) {
    console.error(error)
    return
  }
  return data as DbItem[]
}
