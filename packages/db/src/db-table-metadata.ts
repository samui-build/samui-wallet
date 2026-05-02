import type { z } from 'zod'
import { accountCreateSchema } from './account/account-create-schema.ts'
import { accountInternalSchema } from './account/account-internal-schema.ts'
import { accountUpdateSchema } from './account/account-update-schema.ts'
import { bookmarkAccountCreateSchema } from './bookmark-account/bookmark-account-create-schema.ts'
import { bookmarkAccountSchema } from './bookmark-account/bookmark-account-schema.ts'
import { bookmarkAccountUpdateSchema } from './bookmark-account/bookmark-account-update-schema.ts'
import { bookmarkTransactionCreateSchema } from './bookmark-transaction/bookmark-transaction-create-schema.ts'
import { bookmarkTransactionSchema } from './bookmark-transaction/bookmark-transaction-schema.ts'
import { bookmarkTransactionUpdateSchema } from './bookmark-transaction/bookmark-transaction-update-schema.ts'
import type { Database } from './database.ts'
import { networkCreateSchema } from './network/network-create-schema.ts'
import { networkSchema } from './network/network-schema.ts'
import { networkUpdateSchema } from './network/network-update-schema.ts'
import { settingSchema } from './setting/setting-schema.ts'
import { walletCreateSchema } from './wallet/wallet-create-schema.ts'
import { walletInternalSchema } from './wallet/wallet-internal-schema.ts'
import { walletUpdateSchema } from './wallet/wallet-update-schema.ts'

export type DbRecord = Record<string, unknown> & { id: string }

export const dbTableNames = [
  'accounts',
  'bookmarkAccounts',
  'bookmarkTransactions',
  'networks',
  'settings',
  'wallets',
] as const

export type DbTableName = (typeof dbTableNames)[number]

export interface DbTableMetadata {
  createSchema: z.ZodObject
  name: DbTableName
  recordSchema: z.ZodObject
  updateSchema: z.ZodObject
}

const settingCreateSchema = settingSchema.pick({
  key: true,
  value: true,
})

const settingUpdateSchema = settingSchema
  .pick({
    value: true,
  })
  .partial()

export const dbTableMetadata: DbTableMetadata[] = [
  {
    createSchema: accountCreateSchema,
    name: 'accounts',
    recordSchema: accountInternalSchema,
    updateSchema: accountUpdateSchema,
  },
  {
    createSchema: bookmarkAccountCreateSchema,
    name: 'bookmarkAccounts',
    recordSchema: bookmarkAccountSchema,
    updateSchema: bookmarkAccountUpdateSchema,
  },
  {
    createSchema: bookmarkTransactionCreateSchema,
    name: 'bookmarkTransactions',
    recordSchema: bookmarkTransactionSchema,
    updateSchema: bookmarkTransactionUpdateSchema,
  },
  {
    createSchema: networkCreateSchema,
    name: 'networks',
    recordSchema: networkSchema,
    updateSchema: networkUpdateSchema,
  },
  {
    createSchema: settingCreateSchema,
    name: 'settings',
    recordSchema: settingSchema,
    updateSchema: settingUpdateSchema,
  },
  {
    createSchema: walletCreateSchema,
    name: 'wallets',
    recordSchema: walletInternalSchema,
    updateSchema: walletUpdateSchema,
  },
]

export function getDbTableMetadata(name: string | undefined): DbTableMetadata | undefined {
  return dbTableMetadata.find((metadata) => metadata.name === name)
}

export async function getDbTableRecord(db: Database, table: DbTableName, id: string): Promise<DbRecord | undefined> {
  return (await db.table(table).get(id)) as DbRecord | undefined
}

export function getDbTableRecords(db: Database, table: DbTableName): Promise<DbRecord[]> {
  return db.table(table).toArray() as Promise<DbRecord[]>
}
