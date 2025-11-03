import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignAndSendTransactionOutput,
} from '@solana/wallet-standard-features'

import { getRequestService } from '../services/request.ts'

export async function signAndSendTransaction(
  inputs: SolanaSignAndSendTransactionInput[],
): Promise<SolanaSignAndSendTransactionOutput[]> {
  return await getRequestService().create('signAndSendTransaction', inputs)
}
