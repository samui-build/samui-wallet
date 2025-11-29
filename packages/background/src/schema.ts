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
import type { Request } from './services/request.ts'

export interface Schema {
  connect(input?: StandardConnectInput): Promise<StandardConnectOutput>
  disconnect(): Promise<void>
  onRequestCreate(request: Request): void
  onRequestReset(): void
  signAndSendTransaction(inputs: SolanaSignAndSendTransactionInput[]): Promise<SolanaSignAndSendTransactionOutput[]>
  signIn(inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]>
  signMessage(inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]>
  signTransaction(inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]>
}
