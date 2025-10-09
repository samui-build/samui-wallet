import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignAndSendTransactionOutput,
} from '@solana/wallet-standard-features'

export async function signAndSendTransaction(
  ...inputs: SolanaSignAndSendTransactionInput[]
): Promise<SolanaSignAndSendTransactionOutput[]> {
  console.log('signAndSendTransaction called', inputs)
  return Promise.resolve([])
}
