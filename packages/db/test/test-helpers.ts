import 'fake-indexeddb/auto'
import { address, signature } from '@solana/kit'
import type { AccountCreateInput } from '../src/account/account-create-input.ts'
import type { BookmarkAccountCreateInput } from '../src/bookmark-account/bookmark-account-create-input.ts'
import type { BookmarkTransactionCreateInput } from '../src/bookmark-transaction/bookmark-transaction-create-input.ts'
import { createDb } from '../src/create-db.ts'
import type { Database } from '../src/database.ts'
import type { NetworkCreateInput } from '../src/network/network-create-input.ts'
import { randomId } from '../src/random-id.ts'
import type { SettingKey } from '../src/setting/setting-key.ts'
import type { WalletCreateInput } from '../src/wallet/wallet-create-input.ts'

export function createDbTest(): Database {
  return createDb({ name: 'test' })
}

export function randomName(prefix: string): string {
  return `${prefix}-${randomId(8)}`
}

export function testAccountCreateInput(input: { walletId: string } & Partial<AccountCreateInput>): AccountCreateInput {
  return {
    name: randomName('account'),
    publicKey: address('So11111111111111111111111111111111111111112'),
    type: 'Derived',
    ...input,
  }
}
export function testBookmarkAccountCreateInput(
  input: Partial<BookmarkAccountCreateInput> = {},
): BookmarkAccountCreateInput {
  return {
    address: address('So11111111111111111111111111111111111111112'),
    label: randomName('bookmarkAccount'),
    ...input,
  }
}
export function testBookmarkTransactionCreateInput(
  input: Partial<BookmarkTransactionCreateInput> = {},
): BookmarkTransactionCreateInput {
  return {
    label: randomName('bookmarkAccount'),
    signature: signature('2RHM8HGK1NaHrWPnfLMDeBsANJAUh1NWefpYctp4v9ZCgLWVjczA8bsjubm4hDEdrdB5XQLKfkHYUoghZftfo1mZ'),
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

export function testWalletCreateInput(input: Partial<WalletCreateInput> = {}): WalletCreateInput {
  return {
    derivationPath: 'd',
    mnemonic: 'baz',
    name: randomName('wallet'),
    secret: 'bar',
    ...input,
  }
}
