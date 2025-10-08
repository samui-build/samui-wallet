import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './db-schema'
import { createClient } from '@libsql/client/web'

export async function dbConnect(url: string = 'file:./samui-wallet-local.db') {
  const client = createClient({ url })

  return drizzle({ client, schema })
}

export type Db = Awaited<ReturnType<typeof dbConnect>>
