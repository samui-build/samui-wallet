import 'fake-indexeddb/auto'

import type { Db } from '../src/db'

import { createDb } from '../src/create-db'

export function createDbTest(): Db {
  return createDb({ name: 'test' })
}

export function randomName(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}
