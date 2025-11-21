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

  const normalizedPrefix = caseSensitive ? prefix : prefix.toLowerCase()
  const normalizedSuffix = caseSensitive ? suffix : suffix.toLowerCase()

  while (true) {
    const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32))
    const signer = await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes, true)
    const address = caseSensitive ? signer.address : signer.address.toLowerCase()

    let match = false

    if (hasPrefix && !address.startsWith(normalizedPrefix)) {
      continue
    }

    if (hasSuffix && !address.endsWith(normalizedSuffix)) {
      continue
    }

    match = true

    if (match) {
      return signer
    }
  }
}
