import type { SolanaSignMessageInput, SolanaSignMessageOutput } from '@solana/wallet-standard-features'

export async function signMessage(inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> {
  console.log('Sign Message', inputs)

  return Promise.resolve([])
}
