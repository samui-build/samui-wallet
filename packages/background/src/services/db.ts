import { address, getAddressEncoder } from '@solana/kit'
import { SOLANA_CHAINS } from '@solana/wallet-standard-chains'
import {
  SolanaSignAndSendTransaction,
  SolanaSignIn,
  SolanaSignMessage,
  SolanaSignTransaction,
} from '@solana/wallet-standard-features'
import type { StandardConnectOutput } from '@wallet-standard/core'
import { defineProxyService } from '@webext-core/proxy-service'
import type { Account } from '@workspace/db/account/account'
import { accountCreate } from '@workspace/db/account/account-create'
import { accountFindUnique } from '@workspace/db/account/account-find-unique'
import { accountReadSecretKey } from '@workspace/db/account/account-read-secret-key'
import { db } from '@workspace/db/db'
import { settingFindUnique } from '@workspace/db/setting/setting-find-unique'
import { walletCreate } from '@workspace/db/wallet/wallet-create'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { deriveFromMnemonicAtIndex } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

// TODO: Database abstraction layer to avoid duplicating this code from db and db-react packages
export const [registerDbService, getDbService] = defineProxyService('DbService', () => ({
  account: {
    active: async (): Promise<Account> => {
      const accountId = (await settingFindUnique(db, 'activeAccountId'))?.value
      if (!accountId) {
        throw new Error('No active account set')
      }

      const account = await accountFindUnique(db, accountId)
      if (!account) {
        throw new Error('Active account not found')
      }

      return account
    },
    secretKey: async (): Promise<string> => {
      const accountId = (await settingFindUnique(db, 'activeAccountId'))?.value
      if (!accountId) {
        throw new Error('No active account set')
      }

      const secretKey = await accountReadSecretKey(db, accountId)
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
      const walletId = await walletCreate(db, input)
      // After creating the wallet we can create the account
      await accountCreate(db, {
        ...derivedAccount,
        name: ellipsify(derivedAccount.publicKey),
        type: 'Derived',
        walletId,
      })
      return walletId
    },
  },
}))
