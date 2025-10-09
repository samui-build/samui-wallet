import 'fake-indexeddb/auto'
import { Db } from '../src/db'
import { createDb } from '../src/create-db'

export function randomName(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

export function createDbTest(): Db {
  return createDb({ name: 'test' })
}
