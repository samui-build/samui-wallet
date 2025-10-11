import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'

import { sendMessage } from '@workspace/background/window'

export async function signIn(...inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]> {
  const response = await sendMessage('signIn', inputs)
  console.log('Sign In', response)

  return response
}
