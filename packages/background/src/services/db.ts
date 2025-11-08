import { address, getAddressEncoder } from '@solana/kit'
import type { StandardConnectOutput } from '@wallet-standard/core'
import { defineProxyService } from '@webext-core/proxy-service'
import { db } from '@workspace/db/db'
import { dbAccountCreate } from '@workspace/db/db-account-create'
import { dbAccountFindUnique } from '@workspace/db/db-account-find-unique'
import { dbSettingGetValue } from '@workspace/db/db-setting-get-value'
import { dbWalletCreate } from '@workspace/db/db-wallet-create'
import type { WalletInputCreate } from '@workspace/db/dto/wallet-input-create'
import type { Account } from '@workspace/db/entity/account'
import { deriveFromMnemonicAtIndex } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

// TODO: Database abstraction layer to avoid duplicating this code from db and db-react packages
export const [registerDbService, getDbService] = defineProxyService('DbService', () => ({
  account: {
    active: async (): Promise<Account> => {
      const accountId = await dbSettingGetValue(db, 'activeAccountId')
      if (!accountId) {
        throw new Error('No active account set')
      }

      const account = await dbAccountFindUnique(db, accountId)
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
    createWithAccount: async (input: WalletInputCreate) => {
      // First, we see if we can derive the first account from this mnemonic
      const derivedAccount = await deriveFromMnemonicAtIndex({ mnemonic: input.mnemonic })
      // If so, we create the wallet
      const walletId = await dbWalletCreate(db, input)
      // After creating the wallet we can create the account
      await dbAccountCreate(db, {
        ...derivedAccount,
        name: ellipsify(derivedAccount.publicKey),
        type: 'Derived',
        walletId,
      })
      return walletId
    },
  },
}))
