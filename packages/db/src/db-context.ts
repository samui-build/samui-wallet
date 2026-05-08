import type { Vault } from '@workspace/vault/vault'
import type { Database } from './database.ts'

export interface DbContext {
  db: Database
  vault: Vault
}
