import 'fake-indexeddb/auto'

import type { Database } from '../src/database'

import { createDb } from '../src/create-db'

export function createDbTest(): Database {
  return createDb({ name: 'test' })
}

export function randomName(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}
