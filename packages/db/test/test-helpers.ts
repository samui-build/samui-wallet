import 'fake-indexeddb/auto'
import { address } from '@solana/kit'
import { createDb } from '../src/create-db.ts'
import type { Database } from '../src/database.ts'
import type { AccountInputCreate } from '../src/dto/account-input-create.ts'
import type { ClusterInputCreate } from '../src/dto/cluster-input-create.ts'
import type { WalletInputCreate } from '../src/dto/wallet-input-create.ts'
import type { SettingKey } from '../src/entity/setting-key.ts'

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

export function testSettingInputSet(value?: string): [SettingKey, string] {
  return ['activeClusterId', value ?? randomName('setting')]
}

export function testWalletInputCreate(input: { accountId: string } & Partial<WalletInputCreate>): WalletInputCreate {
  return {
    name: randomName('wallet'),
    publicKey: address('So11111111111111111111111111111111111111112'),
    type: 'Derived',
    ...input,
  }
}
