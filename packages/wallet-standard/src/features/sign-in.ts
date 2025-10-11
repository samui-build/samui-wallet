import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'

import { sendSignInMessage } from '@workspace/background/send-message'

export async function signIn(...inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]> {
  const response = await sendSignInMessage(inputs)
  console.log('Sign In', response)

  return response
}
