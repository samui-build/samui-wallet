import type {
  SolanaSignAndSendTransactionOutput,
  SolanaSignInInput,
  SolanaSignInOutput,
  SolanaSignMessageInput,
  SolanaSignMessageOutput,
  SolanaSignTransactionInput,
  SolanaSignTransactionOutput,
} from '@solana/wallet-standard-features'
import type { StandardConnectInput, StandardConnectOutput } from '@wallet-standard/core'
import type { ProtocolWithReturn } from 'webext-bridge'

import type { ACTIONS } from './src/actions'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    [ACTIONS.CONNECT]: ProtocolWithReturn<StandardConnectInput, Promise<StandardConnectOutput>>
    [ACTIONS.DISCONNECT]: ProtocolWithReturn<undefined, Promise<void>>
    [ACTIONS.SIGN_AND_SEND_TRANSACTION]: ProtocolWithReturn<
      SolanaSignAndSendTransactionInput[],
      Promise<SolanaSignAndSendTransactionOutput[]>
    >
    [ACTIONS.SIGN_IN]: ProtocolWithReturn<SolanaSignInInput[], Promise<SolanaSignInOutput[]>>
    [ACTIONS.SIGN_MESSAGE]: ProtocolWithReturn<SolanaSignMessageInput[], Promise<SolanaSignMessageOutput[]>>
    [ACTIONS.SIGN_TRANSACTION]: ProtocolWithReturn<SolanaSignTransactionInput[], Promise<SolanaSignTransactionOutput[]>>
  }
}
