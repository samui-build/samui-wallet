import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { Account, Cluster, Db, Wallet } from '@workspace/db/db'
import { DbAccountCreateInput, DbAccountUpdateInput } from '@workspace/db/db-account'
import { DbClusterCreateInput, DbClusterUpdateInput } from '@workspace/db/db-cluster'
import { DbWalletCreateInput, DbWalletUpdateInput } from '@workspace/db/db-wallet'
import { dbItemCreate, DbItemCreateProps } from './db-item-create.js'
import { dbItemUpdate, DbItemUpdateProps } from './db-item-update.js'
import { dbItemDelete, DbItemDeleteProps } from './db-item-delete.js'
import { dbItemFindMany, DbItemFindManyProps } from './db-item-find-many.js'

export type DbItem = Account | Cluster | Wallet
export type DbItemCreateInput = DbAccountCreateInput | DbClusterCreateInput | DbWalletCreateInput
export type DbItemUpdateInput = DbAccountUpdateInput | DbClusterUpdateInput | DbWalletUpdateInput
export type DbItemInput = DbItemCreateInput | DbItemUpdateInput

export interface DbBrowserContext {
  db: Db
  itemCreate: (props: DbItemCreateProps) => Promise<void>
  itemDelete: (props: DbItemDeleteProps) => Promise<void>
  itemFindMany: (props: DbItemFindManyProps) => Promise<DbItem[] | undefined>
  itemUpdate: (props: DbItemUpdateProps) => Promise<void>
  tableHeaders: (table: string) => string[]
  tables: string[]
}

const Context = createContext<DbBrowserContext>({} as DbBrowserContext)

function tableHeaders(table: string) {
  switch (table) {
    case 'accounts':
      return ['id', 'createdAt', 'updatedAt', 'name', 'secret', 'mnemonic']
    case 'clusters':
      return ['id', 'createdAt', 'updatedAt', 'name', 'endpoint', 'type']
    case 'wallets':
      return ['id', 'createdAt', 'updatedAt', 'accountId', 'name', 'publicKey', 'secretKey', 'type']
    default:
      return []
  }
}

export function DbBrowserProvider({ children, db }: { children: ReactNode; db: Db }) {
  const tables = useMemo(() => db.tables.map((table) => table.name), [db])

  const value: DbBrowserContext = {
    db,
    itemCreate: async (props: DbItemCreateProps) => dbItemCreate(db, props),
    itemDelete: async (props: DbItemDeleteProps) => dbItemDelete(db, props),
    itemFindMany: async (props: DbItemFindManyProps) => dbItemFindMany(db, props),
    itemUpdate: async (props: DbItemUpdateProps) => dbItemUpdate(db, props),
    tableHeaders,
    tables,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useDbBrowser() {
  return useContext(Context)
}
