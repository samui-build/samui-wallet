import type { SolanaSignMessageInput, SolanaSignMessageOutput } from '@solana/wallet-standard-features'

import { getRequestService } from '../services/request.ts'

export async function signMessage(inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> {
  return await getRequestService().create('signMessage', inputs)
}
