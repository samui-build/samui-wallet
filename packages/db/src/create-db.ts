import { Db, DbConfig } from './db'

export function createDb(config: DbConfig) {
  return new Db(config)
}
