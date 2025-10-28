import type { StandardConnectOutput } from '@wallet-standard/core'
import type { AccountInputCreate } from '@workspace/db/dto/account-input-create'
import type { Wallet } from '@workspace/db/entity/wallet'

import { address, getAddressEncoder } from '@solana/kit'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- https://github.com/aklinker1/webext-core/pull/117
import { defineProxyService } from '@webext-core/proxy-service'
import { db } from '@workspace/db/db'
import { dbAccountCreate } from '@workspace/db/db-account-create'
import { dbPreferenceGetValue } from '@workspace/db/db-preference-get-value'
import { dbWalletCreate } from '@workspace/db/db-wallet-create'
import { dbWalletFindUnique } from '@workspace/db/db-wallet-find-unique'
import { deriveFromMnemonicAtIndex } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

// TODO: Database abstraction layer to avoid duplicating this code from db and db-react packages
export const [registerDbService, getDbService] = defineProxyService('DbService', () => ({
  account: {
    createWithWallet: async (input: AccountInputCreate) => {
      // First, we see if we can derive the first wallet from this mnemonic
      const derivedWallet = await deriveFromMnemonicAtIndex({ mnemonic: input.mnemonic })
      // If so, we create the account
      const accountId = await dbAccountCreate(db, input)
      // After creating the account we can create the wallet
      await dbWalletCreate(db, {
        ...derivedWallet,
        accountId,
        name: ellipsify(derivedWallet.publicKey),
        type: 'Derived',
      })
      return accountId
    },
  },
  wallet: {
    active: async (): Promise<Wallet> => {
      const walletId = await dbPreferenceGetValue(db, 'activeWalletId')
      if (!walletId) {
        throw new Error('No active wallet set')
      }

      const wallet = await dbWalletFindUnique(db, walletId)
      if (!wallet) {
        throw new Error('Active wallet not found')
      }

      return wallet
    },
    walletAccounts: async (): Promise<StandardConnectOutput> => {
      const wallet = await getDbService().wallet.active()

      return {
        accounts: [
          {
            address: wallet.publicKey,
            chains: ['solana:devnet'],
            features: ['solana:signTransaction', 'solana:signAndSendTransaction'],
            // icon: '',
            label: wallet.name,
            publicKey: getAddressEncoder().encode(address(wallet.publicKey)),
          },
        ],
      }
    },
  },
}))
