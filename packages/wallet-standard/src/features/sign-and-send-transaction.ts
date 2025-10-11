import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignAndSendTransactionOutput,
} from '@solana/wallet-standard-features'

import { sendMessage } from '@workspace/background/window'

export async function signAndSendTransaction(
  ...inputs: SolanaSignAndSendTransactionInput[]
): Promise<SolanaSignAndSendTransactionOutput[]> {
  const response = await sendMessage('signAndSendTransaction', inputs)
  console.log('Sign and Send Transaction', response)

  return response
}
