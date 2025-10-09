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
  StandardConnect,
  type StandardConnectFeature,
  StandardDisconnect,
  type StandardDisconnectFeature,
  StandardEvents,
  type StandardEventsFeature,
  type Wallet,
  type WalletIcon,
  type WalletVersion,
  type IdentifierArray,
  type WalletAccount,
} from '@wallet-standard/core'
import { connect } from './features/connect'
import { disconnect } from './features/disconnect'
import { on } from './features/events'
import { signAndSendTransaction } from './features/sign-and-send-transaction'
import { signTransaction } from './features/sign-transaction'
import { signMessage } from './features/sign-message'
import { signIn } from './features/sign-in'
import { icon } from './icon'

type WalletFeatures = StandardConnectFeature &
  StandardDisconnectFeature &
  StandardEventsFeature &
  SolanaSignAndSendTransactionFeature &
  SolanaSignTransactionFeature &
  SolanaSignMessageFeature &
  SolanaSignInFeature

export class SamuiWallet implements Wallet {
  get version(): WalletVersion {
    return '1.0.0'
  }

  get name(): string {
    return 'Samui'
  }

  get icon(): WalletIcon {
    return icon
  }

  get chains(): IdentifierArray {
    return SOLANA_CHAINS
  }

  get features(): WalletFeatures {
    return {
      [StandardConnect]: {
        version: this.version,
        connect,
      },
      [StandardDisconnect]: {
        version: this.version,
        disconnect,
      },
      [StandardEvents]: {
        version: this.version,
        on,
      },
      [SolanaSignAndSendTransaction]: {
        version: this.version,
        supportedTransactionVersions: ['legacy', 0],
        signAndSendTransaction,
      },
      [SolanaSignTransaction]: {
        version: this.version,
        supportedTransactionVersions: ['legacy', 0],
        signTransaction,
      },
      [SolanaSignMessage]: {
        version: this.version,
        signMessage,
      },
      [SolanaSignIn]: {
        version: this.version,
        signIn,
      },
    }
  }

  get accounts(): readonly WalletAccount[] {
    return []
  }
}
