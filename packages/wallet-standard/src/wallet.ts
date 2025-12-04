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
import type {
  StandardConnectInput,
  StandardConnectOutput,
  StandardEventsListeners,
  StandardEventsNames,
  StandardEventsOnMethod,
} from '@wallet-standard/core'
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

import { on } from './features/events.ts'
import { signAndSendTransaction } from './features/sign-and-send-transaction.ts'
import { signIn } from './features/sign-in.ts'
import { signMessage } from './features/sign-message.ts'
import { signTransaction } from './features/sign-transaction.ts'
import { icon } from './icon.ts'
import { ensureUint8Array } from '@workspace/keypair/ensure-uint8array'

type WalletFeatures = SolanaSignAndSendTransactionFeature &
  SolanaSignInFeature &
  SolanaSignMessageFeature &
  SolanaSignTransactionFeature &
  StandardConnectFeature &
  StandardDisconnectFeature &
  StandardEventsFeature

export class SamuiWallet implements Wallet {
  readonly #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } = {}

  #on: StandardEventsOnMethod = (event, listener) => {
    this.#listeners[event]?.push(listener) || (this.#listeners[event] = [listener])
    return (): void => this.#off(event, listener)
  }

  #emit<E extends StandardEventsNames>(event: E, ...args: Parameters<StandardEventsListeners[E]>): void {
    // eslint-disable-next-line prefer-spread
    this.#listeners[event]?.forEach((listener) => listener.apply(null, args))
  }

  #off<E extends StandardEventsNames>(event: E, listener: StandardEventsListeners[E]): void {
    this.#listeners[event] = this.#listeners[event]?.filter((existingListener) => listener !== existingListener)
  }

  get accounts(): readonly WalletAccount[] {
    console.log('hello accounts', this.#accounts)
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
          const accounts = response.accounts.map((account) => ({
            ...account,
            publicKey: ensureUint8Array(account.publicKey),
          }))
          console.log('new accounts')

          this.#accounts = accounts

          this.#emit('change', { accounts: this.#accounts })

          return {
            accounts,
          }
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
        on: this.#on,
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
