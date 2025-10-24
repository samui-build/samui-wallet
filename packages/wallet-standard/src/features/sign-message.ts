import type { SolanaSignMessageInput, SolanaSignMessageOutput } from '@solana/wallet-standard-features'

import { sendMessage } from '@workspace/background/window'

export async function signMessage(...inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> {
  const outputs = await sendMessage('signMessage', inputs)

  return outputs.map((output) => ({
    signature: new Uint8Array(Object.values(output.signature)),
    signatureType: output.signatureType,
    signedMessage: new Uint8Array(Object.values(output.signedMessage)),
  }))
}
