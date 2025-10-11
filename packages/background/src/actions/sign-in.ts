import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'

export async function signIn(inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]> {
  console.log('Sign In', inputs)

  return Promise.resolve([])
}
