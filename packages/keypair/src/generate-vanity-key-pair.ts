import { createKeyPairSignerFromPrivateKeyBytes, type KeyPairSigner } from '@solana/kit'

const MAX_ATTEMPTS = 20_000_000

export interface GenerateVanityKeyPairProps {
  caseSensitive?: boolean
  maxAttempts?: number
  prefix?: string
  suffix?: string
}

export async function generateVanityKeyPair({
  caseSensitive = true,
  maxAttempts,
  prefix = '',
  suffix = '',
}: GenerateVanityKeyPairProps): Promise<KeyPairSigner> {
  const sanitizedPrefix = prefix.slice(0, 4)
  const sanitizedSuffix = suffix.slice(0, 4)
  const hasPrefix = sanitizedPrefix.length > 0
  const hasSuffix = sanitizedSuffix.length > 0

  if (!hasPrefix && !hasSuffix) {
    throw new Error('generateVanityKeyPair requires a prefix or suffix')
  }

  const normalizedPrefix = caseSensitive ? sanitizedPrefix : sanitizedPrefix.toLowerCase()
  const normalizedSuffix = caseSensitive ? sanitizedSuffix : sanitizedSuffix.toLowerCase()

  const attemptsLimit =
    typeof maxAttempts === 'number' && Number.isFinite(maxAttempts) && maxAttempts > 0
      ? Math.min(Math.floor(maxAttempts), MAX_ATTEMPTS)
      : MAX_ATTEMPTS

  for (let attempts = 0; attempts < attemptsLimit; attempts += 1) {
    const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32))
    const signer = await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes, true)
    const address = caseSensitive ? signer.address : signer.address.toLowerCase()

    if (hasPrefix && !address.startsWith(normalizedPrefix)) {
      continue
    }

    if (hasSuffix && !address.endsWith(normalizedSuffix)) {
      continue
    }

    return signer
  }

  throw new Error(`No vanity match found within ${attemptsLimit} attempts, try a shorter pattern`)
}
