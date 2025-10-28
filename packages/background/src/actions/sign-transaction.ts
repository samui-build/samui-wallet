import type { SolanaSignTransactionInput, SolanaSignTransactionOutput } from '@solana/wallet-standard-features'

import { getRequestService } from '../services/request'

export async function signTransaction(inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]> {
  return await getRequestService().create('signTransaction', inputs)
}
