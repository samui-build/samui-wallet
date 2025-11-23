import { address, getAddressEncoder } from '@solana/kit'
import type { StandardConnectOutput } from '@wallet-standard/core'
import { defineProxyService } from '@webext-core/proxy-service'
import type { Account } from '@workspace/db/account/account'
import { accountCreate } from '@workspace/db/account/account-create'
import { accountFindUnique } from '@workspace/db/account/account-find-unique'
import { db } from '@workspace/db/db'
import { settingGetValue } from '@workspace/db/setting/setting-get-value'
import { walletCreate } from '@workspace/db/wallet/wallet-create'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { deriveFromMnemonicAtIndex } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

// TODO: Database abstraction layer to avoid duplicating this code from db and db-react packages
export const [registerDbService, getDbService] = defineProxyService('DbService', () => ({
  account: {
    active: async (): Promise<Account> => {
      const accountId = await settingGetValue(db, 'activeAccountId')
      if (!accountId) {
        throw new Error('No active account set')
      }

      const account = await accountFindUnique(db, accountId)
      if (!account) {
        throw new Error('Active account not found')
      }

      return account
    },
    walletAccounts: async (): Promise<StandardConnectOutput> => {
      const account = await getDbService().account.active()

      return {
        accounts: [
          {
            address: account.publicKey,
            chains: ['solana:devnet'],
            features: ['solana:signTransaction', 'solana:signAndSendTransaction'],
            // icon: '',
            label: account.name,
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
