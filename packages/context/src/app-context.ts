import type { Database } from '@workspace/db/database'
import type { Vault } from '@workspace/vault/vault'

export interface AppContext {
  db: Database
  vault: Vault
}
