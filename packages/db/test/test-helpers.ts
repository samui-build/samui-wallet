import 'fake-indexeddb/auto'
import { address } from '@solana/kit'
import type { AccountCreateInput } from '../src/account/account-create-input.ts'
import { createDb } from '../src/create-db.ts'
import type { Database } from '../src/database.ts'
import type { WalletInputCreate } from '../src/dto/wallet-input-create.ts'
import type { NetworkCreateInput } from '../src/network/network-create-input.ts'
import type { SettingKey } from '../src/setting/setting-key.ts'

export function createDbTest(): Database {
  return createDb({ name: 'test' })
}

export function randomName(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

export function testAccountCreateInput(input: { walletId: string } & Partial<AccountCreateInput>): AccountCreateInput {
  return {
    name: randomName('account'),
    publicKey: address('So11111111111111111111111111111111111111112'),
    type: 'Derived',
    ...input,
  }
}

export function testNetworkCreateInput(input: Partial<NetworkCreateInput> = {}): NetworkCreateInput {
  return {
    endpoint: 'http://localhost:8899',
    name: randomName('network'),
    type: 'solana:localnet',
    ...input,
  }
}
export function testSettingSetInput(value?: string): [SettingKey, string] {
  return ['activeNetworkId', value ?? randomName('setting')]
}

export function testWalletInputCreate(input: Partial<WalletInputCreate> = {}): WalletInputCreate {
  return {
    derivationPath: 'd',
    mnemonic: 'baz',
    name: randomName('wallet'),
    secret: 'bar',
    ...input,
  }
}
