import type { Database } from './database.ts'

export async function dbSettingGetAll(db: Database) {
  return db.settings.toArray()
}
