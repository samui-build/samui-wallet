import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'

export async function signIn(...inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]> {
  console.log('signIn called', inputs)
  return Promise.resolve([])
}
