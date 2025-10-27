import type { StandardConnectInput, StandardConnectOutput } from '@wallet-standard/core'

import { SOLANA_CHAINS } from '@solana/wallet-standard-chains'
import {
  SolanaSignAndSendTransaction,
  type SolanaSignAndSendTransactionFeature,
  SolanaSignIn,
  type SolanaSignInFeature,
  SolanaSignMessage,
  type SolanaSignMessageFeature,
  SolanaSignTransaction,
  type SolanaSignTransactionFeature,
} from '@solana/wallet-standard-features'
import {
  type IdentifierArray,
  StandardConnect,
  type StandardConnectFeature,
  StandardDisconnect,
  type StandardDisconnectFeature,
  StandardEvents,
  type StandardEventsFeature,
  type Wallet,
  type WalletAccount,
  type WalletIcon,
  type WalletVersion,
} from '@wallet-standard/core'
import { sendMessage } from '@workspace/background/window'

import { on } from './features/events'
import { signAndSendTransaction } from './features/sign-and-send-transaction'
import { signIn } from './features/sign-in'
import { signMessage } from './features/sign-message'
import { signTransaction } from './features/sign-transaction'
import { icon } from './icon'

type WalletFeatures = SolanaSignAndSendTransactionFeature &
  SolanaSignInFeature &
  SolanaSignMessageFeature &
  SolanaSignTransactionFeature &
  StandardConnectFeature &
  StandardDisconnectFeature &
  StandardEventsFeature

export class SamuiWallet implements Wallet {
  get accounts(): readonly WalletAccount[] {
    return this.#accounts
  }

  get chains(): IdentifierArray {
    return SOLANA_CHAINS
  }

  get features(): WalletFeatures {
    return {
      [SolanaSignAndSendTransaction]: {
        signAndSendTransaction,
        supportedTransactionVersions: ['legacy', 0],
        version: this.version,
      },
      [SolanaSignIn]: {
        signIn,
        version: this.version,
      },
      [SolanaSignMessage]: {
        signMessage,
        version: this.version,
      },
      [SolanaSignTransaction]: {
        signTransaction,
        supportedTransactionVersions: ['legacy', 0],
        version: this.version,
      },
      [StandardConnect]: {
        connect: async (input?: StandardConnectInput): Promise<StandardConnectOutput> => {
          const response = await sendMessage('connect', input)
          this.#accounts = response.accounts

          return response
        },
        version: this.version,
      },
      [StandardDisconnect]: {
        disconnect: async (): Promise<void> => {
          await sendMessage('disconnect')
          this.#accounts = []
        },
        version: this.version,
      },
      [StandardEvents]: {
        on,
        version: this.version,
      },
    }
  }

  get icon(): WalletIcon {
    return icon
  }

  get name(): string {
    return 'Samui'
  }

  get version(): WalletVersion {
    return '1.0.0'
  }

  #accounts: readonly WalletAccount[] = []
}
