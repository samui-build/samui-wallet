import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignAndSendTransactionOutput,
} from '@solana/wallet-standard-features'

export async function signAndSendTransaction(
  inputs: SolanaSignAndSendTransactionInput[],
): Promise<SolanaSignAndSendTransactionOutput[]> {
  console.log('Sign and Send Transaction', inputs)

  return Promise.resolve([])
}
