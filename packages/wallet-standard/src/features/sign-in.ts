import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'

import { sendMessage } from '@workspace/background/window'
import { ensureUint8Array } from '@workspace/keypair/ensure-uint8array'

export async function signIn(...inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]> {
  const outputs = await sendMessage('signIn', inputs)

  return outputs.map((output) => ({
    ...output,
    signature: ensureUint8Array(output.signature),
    signedMessage: ensureUint8Array(output.signedMessage),
  }))
}
