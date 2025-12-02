import { createKeyPairSignerFromPrivateKeyBytes, type KeyPairSigner } from '@solana/kit'

export const VANITY_MAX_ATTEMPTS = 20_000_000

export interface GenerateVanityKeyPairOptions {
  attemptsHardCap?: number
  caseSensitive?: boolean
  maxAttempts?: number
  onAttempt?: (attempts: number) => void
  prefix?: string
  suffix?: string
}

export interface VanityKeyPairResult {
  attempts: number
  signer: KeyPairSigner
}

export async function generateVanityKeyPair({
  attemptsHardCap = VANITY_MAX_ATTEMPTS,
  caseSensitive = true,
  maxAttempts,
  onAttempt,
  prefix = '',
  suffix = '',
}: GenerateVanityKeyPairOptions): Promise<VanityKeyPairResult> {
  const sanitizedPrefix = prefix.slice(0, 4)
  const sanitizedSuffix = suffix.slice(0, 4)
  const hasPrefix = sanitizedPrefix.length > 0
  const hasSuffix = sanitizedSuffix.length > 0

  if (!hasPrefix && !hasSuffix) {
    throw new Error('generateVanityKeyPair requires a prefix or suffix')
  }

  const normalizedPrefix = caseSensitive ? sanitizedPrefix : sanitizedPrefix.toLowerCase()
  const normalizedSuffix = caseSensitive ? sanitizedSuffix : sanitizedSuffix.toLowerCase()

  const sanitizeAttempts = (value: number | undefined, max: number) => {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      return max
    }
    return Math.min(Math.floor(value), max)
  }

  const normalizedHardCap = sanitizeAttempts(attemptsHardCap, VANITY_MAX_ATTEMPTS)
  const attemptsLimit = sanitizeAttempts(maxAttempts, normalizedHardCap)

  for (let attempts = 1; attempts <= attemptsLimit; attempts += 1) {
    const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32))
    const signer = await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes, true)
    const address = caseSensitive ? signer.address : signer.address.toLowerCase()

    onAttempt?.(attempts)

    if (hasPrefix && !address.startsWith(normalizedPrefix)) {
      continue
    }

    if (hasSuffix && !address.endsWith(normalizedSuffix)) {
      continue
    }

    return { attempts, signer }
  }

  throw new Error(`No vanity match found within ${attemptsLimit} attempts, try a shorter pattern`)
}
