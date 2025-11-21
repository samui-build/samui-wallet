import { createKeyPairSignerFromPrivateKeyBytes, type KeyPairSigner } from '@solana/kit'

export interface GenerateVanityKeyPairProps {
  caseSensitive?: boolean
  prefix?: string
  suffix?: string
}

export async function generateVanityKeyPair({
  caseSensitive = true,
  prefix = '',
  suffix = '',
}: GenerateVanityKeyPairProps): Promise<KeyPairSigner> {
  const hasPrefix = typeof prefix === 'string' && prefix.length > 0
  const hasSuffix = typeof suffix === 'string' && suffix.length > 0

  if (!hasPrefix && !hasSuffix) {
    throw new Error('generateVanityKeyPair requires a prefix or suffix')
  }

  // We can't report progress from here directly without a callback or generator
  // But for the worker implementation, we will rewrite the loop there.
  // This function stays as a utility for simple synchronous usage (though it's async due to createKeyPairSignerFromPrivateKeyBytes)

  while (true) {
    const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32))
    const signer = await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes, true)
    const address = signer.address

    let match = true
    if (hasPrefix) {
      if (caseSensitive) {
        if (!address.startsWith(prefix)) match = false
      } else {
        if (!address.toLowerCase().startsWith(prefix.toLowerCase())) match = false
      }
    }

    if (match && hasSuffix) {
      if (caseSensitive) {
        if (!address.endsWith(suffix)) match = false
      } else {
        if (!address.toLowerCase().endsWith(suffix.toLowerCase())) match = false
      }
    }

    if (match) {
      return signer
    }
  }
}
