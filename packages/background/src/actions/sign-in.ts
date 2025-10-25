import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'

import { getRequestService } from '../services/request'

export async function signIn(inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]> {
  return await getRequestService().create('signIn', inputs)
}
