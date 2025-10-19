import 'fake-indexeddb/auto'

import type { Database } from '../src/database'
import type { AccountInputCreate } from '../src/dto/account-input-create'
import type { ClusterInputCreate } from '../src/dto/cluster-input-create'
import type { PreferenceInputCreate } from '../src/dto/preference-input-create'
import type { WalletInputCreate } from '../src/dto/wallet-input-create'

import { createDb } from '../src/create-db'

export function createDbTest(): Database {
  return createDb({ name: 'test' })
}

export function randomName(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

export function testAccountInputCreate(input: Partial<AccountInputCreate> = {}): AccountInputCreate {
  return {
    derivationPath: 'd',
    mnemonic: 'baz',
    name: randomName('account'),
    secret: 'bar',
    ...input,
  }
}

export function testClusterInputCreate(input: Partial<ClusterInputCreate> = {}): ClusterInputCreate {
  return {
    endpoint: 'http://localhost:8899',
    name: randomName('cluster'),
    type: 'solana:localnet',
    ...input,
  }
}

export function testPreferenceInputCreate(input: Partial<PreferenceInputCreate> = {}): PreferenceInputCreate {
  return {
    key: 'activeClusterId',
    value: randomName('preference'),
    ...input,
  }
}

export function testWalletInputCreate(input: { accountId: string } & Partial<WalletInputCreate>): WalletInputCreate {
  return {
    name: randomName('wallet'),
    publicKey: crypto.randomUUID(),
    type: 'Derived',
    ...input,
  }
}
