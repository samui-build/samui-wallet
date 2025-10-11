import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignAndSendTransactionOutput,
} from '@solana/wallet-standard-features'

import { sendSignAndSendTransactionMessage } from '@workspace/background/send-message'

export async function signAndSendTransaction(
  ...inputs: SolanaSignAndSendTransactionInput[]
): Promise<SolanaSignAndSendTransactionOutput[]> {
  const response = await sendSignAndSendTransactionMessage(inputs)
  console.log('Sign and Send Transaction', response)

  return response
}
