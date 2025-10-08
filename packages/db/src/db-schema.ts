import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  active: integer({ mode: 'boolean' }).default(false),
  name: text().notNull(),
  secret: text().notNull(),
  mnemonic: text().notNull(),
})

export const accountRelations = relations(account, ({ many }) => ({
  wallets: many(wallet),
}))

export const cluster = sqliteTable('cluster', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  name: text().notNull(),
  endpoint: text().notNull(),
  active: integer({ mode: 'boolean' }).default(false),
  type: text({ enum: ['SolanaDevnet', 'SolanaLocalnet', 'SolanaMainnet', 'SolanaTestnet'] }),
})

export const wallet = sqliteTable('wallet', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  // Each wallet belongs to an Account
  accountId: text('account_id').notNull(),
  active: integer({ mode: 'boolean' }).default(false),
  name: text().notNull(),
  publicKey: text().notNull(),
  secretKey: text(),
  type: text({ enum: ['Derived', 'Imported', 'Watched'] }),
})

export const walletRelations = relations(wallet, ({ one }) => ({
  account: one(account, {
    fields: [wallet.accountId],
    references: [account.id],
  }),
}))
