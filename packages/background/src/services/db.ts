import { address, createKeyPairFromBytes, getAddressEncoder } from '@solana/kit'
import { SOLANA_CHAINS } from '@solana/wallet-standard-chains'
import {
  SolanaSignAndSendTransaction,
  SolanaSignIn,
  SolanaSignMessage,
  SolanaSignTransaction,
} from '@solana/wallet-standard-features'
import type { StandardConnectOutput } from '@wallet-standard/core'
import type { ProxyService, ProxyServiceKey } from '@webext-core/proxy-service'
import { createProxyService, registerService } from '@webext-core/proxy-service'
import type { Account } from '@workspace/db/account/account'
import { accountCreate } from '@workspace/db/account/account-create'
import { accountFindUnique } from '@workspace/db/account/account-find-unique'
import { accountReadSecretKey } from '@workspace/db/account/account-read-secret-key'
import type { AppContext } from '@workspace/db/app-context'
import { createAppContext } from '@workspace/db/create-app-context'
import { settingFindUnique } from '@workspace/db/setting/setting-find-unique'
import { walletCreate } from '@workspace/db/wallet/wallet-create'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { deriveFromMnemonicAtIndex } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

// TODO: Database abstraction layer to avoid duplicating this code from db and db-react packages
function createDbService(ctx: AppContext) {
  return {
    account: {
      active: async (): Promise<Account> => {
        const accountId = (await settingFindUnique(ctx, 'activeAccountId'))?.value
        if (!accountId) {
          throw new Error('No active account set')
        }

        const account = await accountFindUnique(ctx, accountId)
        if (!account) {
          throw new Error('Active account not found')
        }

        return account
      },
      keyPair: async (): Promise<CryptoKeyPair> => {
        const secretKey = await getDbService().account.secretKey()

        return await createKeyPairFromBytes(new Uint8Array(JSON.parse(secretKey)))
      },
      secretKey: async (): Promise<string> => {
        const accountId = (await settingFindUnique(ctx, 'activeAccountId'))?.value
        if (!accountId) {
          throw new Error('No active account set')
        }

        const secretKey = await accountReadSecretKey(ctx, accountId)
        if (!secretKey) {
          throw new Error('Active account secretKey not found')
        }

        return secretKey
      },
      walletAccounts: async (): Promise<StandardConnectOutput> => {
        const account = await getDbService().account.active()

        return {
          accounts: [
            {
              address: account.publicKey,
              chains: SOLANA_CHAINS,
              features: [SolanaSignAndSendTransaction, SolanaSignIn, SolanaSignMessage, SolanaSignTransaction],
              // icon: undefined,
              // label: undefined,
              publicKey: getAddressEncoder().encode(address(account.publicKey)),
            },
          ],
        }
      },
    },
    wallet: {
      createWithAccount: async (input: WalletCreateInput) => {
        // First, we see if we can derive the first account from this mnemonic
        const derivedAccount = await deriveFromMnemonicAtIndex({ mnemonic: input.mnemonic })
        // If so, we create the wallet
        const walletId = await walletCreate(ctx, input)
        // After creating the wallet we can create the account
        await accountCreate(ctx, {
          ...derivedAccount,
          name: ellipsify(derivedAccount.publicKey),
          type: 'Derived',
          walletId,
        })
        return walletId
      },
    },
  }
}

type DbService = ReturnType<typeof createDbService>

const dbServiceKey = 'DbService' as ProxyServiceKey<DbService>
let dbService: DbService | undefined

export function getDbService(): ProxyService<DbService> {
  return (dbService ?? createProxyService(dbServiceKey)) as ProxyService<DbService>
}

export function registerDbService(): DbService {
  const ctx = createAppContext()
  dbService = createDbService(ctx)
  registerService(dbServiceKey, dbService)
  return dbService
}
