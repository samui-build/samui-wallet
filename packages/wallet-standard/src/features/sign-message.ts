import type { SolanaSignMessageInput, SolanaSignMessageOutput } from '@solana/wallet-standard-features'

export async function signMessage(...inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> {
  console.log('signMessage called', inputs)
  return Promise.resolve([])
}
