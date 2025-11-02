import type { ZodObject } from 'zod'

import type { Database } from './database.js'

import { accountSchemaCreate } from './schema/account-schema-create.js'
import { accountSchemaFindMany } from './schema/account-schema-find-many.js'
import { accountSchemaUpdate } from './schema/account-schema-update.js'
import { accountSchema } from './schema/account-schema.js'
import { clusterSchemaCreate } from './schema/cluster-schema-create.js'
import { clusterSchemaFindMany } from './schema/cluster-schema-find-many.js'
import { clusterSchemaUpdate } from './schema/cluster-schema-update.js'
import { clusterSchema } from './schema/cluster-schema.js'
import { preferenceSchemaCreate } from './schema/preference-schema-create.js'
import { preferenceSchemaFindMany } from './schema/preference-schema-find-many.js'
import { preferenceSchemaUpdate } from './schema/preference-schema-update.js'
import { preferenceSchema } from './schema/preference-schema.js'
import { walletSchemaCreate } from './schema/wallet-schema-create.js'
import { walletSchemaFindMany } from './schema/wallet-schema-find-many.js'
import { walletSchemaUpdate } from './schema/wallet-schema-update.js'
import { walletSchema } from './schema/wallet-schema.js'

export interface DbTableInfo {
  count: number
  name: string
  schema: DbTableSchemas
}

export interface DbTableSchemas {
  create: ZodObject
  findMany: ZodObject
  item: ZodObject
  update: ZodObject
}

export async function dbInfo(db: Database) {
  return db.transaction('r', db.accounts, db.clusters, db.preferences, db.wallets, async () => {
    const result: DbTableInfo[] = []
    for (const item of db.tables) {
      result.push({ count: await item.count(), name: item.name, schema: getTableSchema(item.name) })
    }
    return result
  })
}

export async function dbItems(db: Database, name: string) {
  const table = db.tables.find((t) => t.name === name)
  if (!table) {
    return null
  }
  return table.toArray()
}

function getTableSchema(table: string): DbTableSchemas {
  switch (table) {
    case 'accounts':
      return {
        create: accountSchemaCreate,
        findMany: accountSchemaFindMany,
        item: accountSchema,
        update: accountSchemaUpdate,
      }
    case 'clusters':
      return {
        create: clusterSchemaCreate,
        findMany: clusterSchemaFindMany,
        item: clusterSchema,
        update: clusterSchemaUpdate,
      }
    case 'preferences':
      return {
        create: preferenceSchemaCreate,
        findMany: preferenceSchemaFindMany,
        item: preferenceSchema,
        update: preferenceSchemaUpdate,
      }
    case 'wallets':
      return {
        create: walletSchemaCreate,
        findMany: walletSchemaFindMany,
        item: walletSchema,
        update: walletSchemaUpdate,
      }
    default:
      throw new Error(`Zod schema not found for table ${table}`)
  }
}
