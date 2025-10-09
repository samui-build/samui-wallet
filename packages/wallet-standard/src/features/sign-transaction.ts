import type { SolanaSignTransactionInput, SolanaSignTransactionOutput } from '@solana/wallet-standard-features'

export async function signTransaction(...inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]> {
  console.log('signTransaction called', inputs)
  return Promise.resolve([])
}
