import { accountCreate } from '@workspace/db/account/account-create'
import type { AccountCreateInput } from '@workspace/db/account/account-create-input'
import type { AccountUpdateInput } from '@workspace/db/account/account-update-input'
import { bookmarkAccountCreate } from '@workspace/db/bookmark-account/bookmark-account-create'
import type { BookmarkAccountCreateInput } from '@workspace/db/bookmark-account/bookmark-account-create-input'
import { bookmarkAccountUpdate } from '@workspace/db/bookmark-account/bookmark-account-update'
import type { BookmarkAccountUpdateInput } from '@workspace/db/bookmark-account/bookmark-account-update-input'
import { bookmarkTransactionCreate } from '@workspace/db/bookmark-transaction/bookmark-transaction-create'
import type { BookmarkTransactionCreateInput } from '@workspace/db/bookmark-transaction/bookmark-transaction-create-input'
import { bookmarkTransactionUpdate } from '@workspace/db/bookmark-transaction/bookmark-transaction-update'
import type { BookmarkTransactionUpdateInput } from '@workspace/db/bookmark-transaction/bookmark-transaction-update-input'
import type { DbContext } from '@workspace/db/db-context'
import type { DbRecord, DbTableMetadata, DbTableName } from '@workspace/db/db-table-metadata'
import { getDbTableMetadata, getDbTableRecord, getDbTableRecords } from '@workspace/db/db-table-metadata'
import { networkCreate } from '@workspace/db/network/network-create'
import type { NetworkCreateInput } from '@workspace/db/network/network-create-input'
import { networkUpdate } from '@workspace/db/network/network-update'
import type { NetworkUpdateInput } from '@workspace/db/network/network-update-input'
import { parseStrict } from '@workspace/db/parse-strict'
import type { SettingKey } from '@workspace/db/setting/setting-key'
import { settingKeySchema } from '@workspace/db/setting/setting-key-schema'
import { settingSetValue } from '@workspace/db/setting/setting-set-value'
import { walletCreate } from '@workspace/db/wallet/wallet-create'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { walletUpdate } from '@workspace/db/wallet/wallet-update'
import type { WalletUpdateInput } from '@workspace/db/wallet/wallet-update-input'

export interface DevDbTableConfig extends DbTableMetadata {
  create: (ctx: DbContext, input: Record<string, unknown>) => Promise<unknown>
  createFields?: string[]
  defaultValues?: Record<string, unknown>
  detailFields?: string[]
  label: string
  listFields: string[]
  titleField: string
  update: (ctx: DbContext, id: string, input: Record<string, unknown>) => Promise<unknown>
  updateFields?: string[]
}

const accountTableMetadata = getRequiredDbTableMetadata('accounts')
const bookmarkAccountTableMetadata = getRequiredDbTableMetadata('bookmarkAccounts')
const bookmarkTransactionTableMetadata = getRequiredDbTableMetadata('bookmarkTransactions')
const networkTableMetadata = getRequiredDbTableMetadata('networks')
const settingTableMetadata = getRequiredDbTableMetadata('settings')
const walletTableMetadata = getRequiredDbTableMetadata('wallets')

export const devDbTableConfigs: DevDbTableConfig[] = [
  {
    create: (ctx, input) => accountCreate(ctx, input as AccountCreateInput),
    createFields: ['derivationIndex', 'name', 'publicKey', 'secretKey', 'type', 'walletId'],
    createSchema: accountTableMetadata.createSchema,
    defaultValues: {
      derivationIndex: 0,
      name: '',
      publicKey: '',
      secretKey: '',
      type: 'Watched',
      walletId: '',
    },
    detailFields: ['createdAt', 'derivationIndex', 'id', 'name', 'order', 'publicKey', 'type', 'updatedAt', 'walletId'],
    label: 'Accounts',
    listFields: ['name', 'publicKey', 'type', 'walletId'],
    name: accountTableMetadata.name,
    recordSchema: accountTableMetadata.recordSchema,
    titleField: 'name',
    update: async (ctx, id, input) =>
      ctx.db.accounts.update(id, {
        ...parseStrict(accountTableMetadata.updateSchema.parse(input as AccountUpdateInput)),
        updatedAt: new Date(),
      }),
    updateFields: ['derivationIndex', 'name', 'order', 'publicKey', 'type', 'walletId'],
    updateSchema: accountTableMetadata.updateSchema,
  },
  {
    create: (ctx, input) => bookmarkAccountCreate(ctx, input as BookmarkAccountCreateInput),
    createFields: ['address', 'label'],
    createSchema: bookmarkAccountTableMetadata.createSchema,
    defaultValues: {
      address: '',
      label: '',
    },
    detailFields: ['address', 'createdAt', 'id', 'label', 'updatedAt'],
    label: 'Bookmark Accounts',
    listFields: ['label', 'address', 'updatedAt'],
    name: bookmarkAccountTableMetadata.name,
    recordSchema: bookmarkAccountTableMetadata.recordSchema,
    titleField: 'label',
    update: (ctx, id, input) => bookmarkAccountUpdate(ctx, id, input as BookmarkAccountUpdateInput),
    updateFields: ['label'],
    updateSchema: bookmarkAccountTableMetadata.updateSchema,
  },
  {
    create: (ctx, input) => bookmarkTransactionCreate(ctx, input as BookmarkTransactionCreateInput),
    createFields: ['label', 'signature'],
    createSchema: bookmarkTransactionTableMetadata.createSchema,
    defaultValues: {
      label: '',
      signature: '',
    },
    detailFields: ['createdAt', 'id', 'label', 'signature', 'updatedAt'],
    label: 'Bookmark Transactions',
    listFields: ['label', 'signature', 'updatedAt'],
    name: bookmarkTransactionTableMetadata.name,
    recordSchema: bookmarkTransactionTableMetadata.recordSchema,
    titleField: 'label',
    update: (ctx, id, input) => bookmarkTransactionUpdate(ctx, id, input as BookmarkTransactionUpdateInput),
    updateFields: ['label'],
    updateSchema: bookmarkTransactionTableMetadata.updateSchema,
  },
  {
    create: (ctx, input) => networkCreate(ctx, input as NetworkCreateInput),
    createFields: ['endpoint', 'endpointSubscriptions', 'name', 'type'],
    createSchema: networkTableMetadata.createSchema,
    defaultValues: {
      endpoint: '',
      endpointSubscriptions: '',
      name: '',
      type: 'solana:devnet',
    },
    detailFields: ['color', 'createdAt', 'endpoint', 'endpointSubscriptions', 'id', 'name', 'type', 'updatedAt'],
    label: 'Networks',
    listFields: ['endpoint', 'name', 'type'],
    name: networkTableMetadata.name,
    recordSchema: networkTableMetadata.recordSchema,
    titleField: 'name',
    update: (ctx, id, input) => networkUpdate(ctx, id, input as NetworkUpdateInput),
    updateFields: ['color', 'endpoint', 'endpointSubscriptions', 'name'],
    updateSchema: networkTableMetadata.updateSchema,
  },
  {
    create: async (ctx, input) => {
      const parsedInput = settingTableMetadata.createSchema.parse(input) as { key: SettingKey; value: string }
      await settingSetValue(ctx, parsedInput['key'], parsedInput['value'])
    },
    createFields: ['key', 'value'],
    createSchema: settingTableMetadata.createSchema,
    defaultValues: {
      key: settingKeySchema.options[0],
      value: '',
    },
    detailFields: ['createdAt', 'id', 'key', 'updatedAt', 'value'],
    label: 'Settings',
    listFields: ['key', 'value'],
    name: settingTableMetadata.name,
    recordSchema: settingTableMetadata.recordSchema,
    titleField: 'key',
    update: async (ctx, id, input) => {
      const item = await ctx.db.settings.get(id)
      const parsedInput = settingTableMetadata.updateSchema.parse(input) as { value?: string }
      if (!item) {
        throw new Error(`Setting not found: ${id}`)
      }
      await settingSetValue(ctx, item.key as SettingKey, parsedInput['value'] ?? item.value)
    },
    updateFields: ['value'],
    updateSchema: settingTableMetadata.updateSchema,
  },
  {
    create: (ctx, input) => walletCreate(ctx, input as WalletCreateInput),
    createFields: ['color', 'derivationPath', 'description', 'mnemonic', 'name'],
    createSchema: walletTableMetadata.createSchema,
    defaultValues: {
      derivationPath: "m/44'/501'/0'/0'",
      description: '',
      mnemonic: '',
      name: '',
    },
    detailFields: ['color', 'createdAt', 'derivationPath', 'description', 'id', 'name', 'order', 'updatedAt'],
    label: 'Wallets',
    listFields: ['name', 'description', 'order'],
    name: walletTableMetadata.name,
    recordSchema: walletTableMetadata.recordSchema,
    titleField: 'name',
    update: (ctx, id, input) => walletUpdate(ctx, id, input as WalletUpdateInput),
    updateFields: ['name', 'description', 'order'],
    updateSchema: walletTableMetadata.updateSchema,
  },
]

export function getDevDbTableConfig(name: string | undefined): DevDbTableConfig | undefined {
  return devDbTableConfigs.find((config) => config.name === name)
}

export function getDevDbTableRecords(ctx: DbContext, config: DevDbTableConfig): Promise<DbRecord[]> {
  return getDbTableRecords(ctx, config.name)
}

export async function getDevDbTableRecord(
  ctx: DbContext,
  config: DevDbTableConfig,
  id: string,
): Promise<DbRecord | undefined> {
  return getDbTableRecord(ctx, config.name, id)
}

function getRequiredDbTableMetadata(name: DbTableName) {
  const metadata = getDbTableMetadata(name)
  if (!metadata) {
    throw new Error(`DB table metadata not found: ${name}`)
  }

  return metadata
}
