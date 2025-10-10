import type { DbConfig } from './db';

import { Db } from './db'

export function createDb(config: DbConfig) {
  return new Db(config)
}
