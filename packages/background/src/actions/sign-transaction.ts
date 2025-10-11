import type { SolanaSignTransactionInput, SolanaSignTransactionOutput } from '@solana/wallet-standard-features'

export async function signTransaction(inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]> {
  console.log('Sign Transaction', inputs)

  return Promise.resolve([])
}
