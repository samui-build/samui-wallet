import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignAndSendTransactionOutput,
  SolanaSignInInput,
  SolanaSignInOutput,
  SolanaSignMessageInput,
  SolanaSignMessageOutput,
  SolanaSignTransactionInput,
  SolanaSignTransactionOutput,
} from '@solana/wallet-standard-features'
import type { StandardConnectInput, StandardConnectOutput } from '@wallet-standard/core'

export interface Schema {
  connect(input?: StandardConnectInput): Promise<StandardConnectOutput>
  disconnect(): Promise<void>
  signAndSendTransaction(inputs: SolanaSignAndSendTransactionInput[]): Promise<SolanaSignAndSendTransactionOutput[]>
  signIn(inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]>
  signMessage(inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]>
  signTransaction(inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]>
  invalidateRequest(): void
}
