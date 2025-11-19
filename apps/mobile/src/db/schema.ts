import { sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const networksTable = sqliteTable('networks', {
  createdAt: text().default(sql`(CURRENT_DATE)`),
  endpoint: text().notNull(),
  endpointSubscriptions: text(),
  id: text()
    .primaryKey()
    .$defaultFn(() => {
      const id = Math.random().toString()
      console.log(` new network with id ${id}`)
      return id
    }),
  name: text().notNull(),
  type: text({ enum: ['solana:devnet', 'solana:localnet', 'solana:mainnet', 'solana:testnet'] }),
  updatedAt: text().default(sql`(CURRENT_DATE)`),
})

export type Network = typeof networksTable.$inferSelect
