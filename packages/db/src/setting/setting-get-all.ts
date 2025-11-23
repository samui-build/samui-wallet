import type { Database } from '../database.ts'

export async function settingGetAll(db: Database) {
  return db.settings.toArray()
}
