import {
  type EncryptedValue,
  encryptedValueSchema,
  PASSWORD_KDF_MIN_ITERATIONS,
  VAULT_PASSWORD_MAX_LENGTH,
  VAULT_PASSWORD_MIN_LENGTH,
} from './encrypted-value-schema.ts'

const AUTH_TAG_LENGTH_BYTES = 16
const IV_LENGTH_BYTES = 12
const SALT_LENGTH_BYTES = 16
const VAULT_KEY_LENGTH_BYTES = 32

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

type CryptoBytes = Uint8Array<ArrayBuffer>

export async function decryptWithCredential(input: { credential: string; encrypted: string }): Promise<string> {
  try {
    const encryptedValue = encryptedValueSchema.parse(JSON.parse(input.encrypted))
    if (encryptedValue.kdf !== 'pbkdf2-sha256') {
      throw new Error('Unsupported encrypted value')
    }
    const key = await derivePasswordKey({
      credential: input.credential,
      iterations: encryptedValue.kdfparams.iterations,
      salt: decodeBase64Url(encryptedValue.kdfparams.salt),
    })
    return await decryptWithKey({ encryptedValue, key })
  } catch (error) {
    throw new Error('Unable to decrypt value', { cause: error })
  }
}

export async function decryptWithPassword(input: { encrypted: string; password: string }): Promise<string> {
  assertCredentialLength({
    credential: input.password,
    label: 'Password',
    maxLength: VAULT_PASSWORD_MAX_LENGTH,
    minLength: VAULT_PASSWORD_MIN_LENGTH,
  })

  return await decryptWithCredential({ credential: input.password, encrypted: input.encrypted })
}

export async function decryptWithVaultKey(input: { encrypted: string; key: CryptoKey }): Promise<string> {
  try {
    const encryptedValue = encryptedValueSchema.parse(JSON.parse(input.encrypted))
    if (encryptedValue.kdf !== 'direct') {
      throw new Error('Unsupported encrypted value')
    }

    return await decryptWithKey({ encryptedValue, key: input.key })
  } catch (error) {
    throw new Error('Unable to decrypt value', { cause: error })
  }
}

export async function encryptWithCredential(input: {
  credential: string
  label?: string
  maxLength?: number
  minLength: number
  value: string
}): Promise<string> {
  assertCredentialLength({
    credential: input.credential,
    label: input.label ?? 'Credential',
    maxLength: input.maxLength,
    minLength: input.minLength,
  })

  const salt = randomBytes(SALT_LENGTH_BYTES)
  const key = await derivePasswordKey({
    credential: input.credential,
    iterations: PASSWORD_KDF_MIN_ITERATIONS,
    salt,
  })

  return await encryptWithKey({
    kdf: 'pbkdf2-sha256',
    kdfparams: {
      dklen: VAULT_KEY_LENGTH_BYTES,
      hash: 'sha256',
      iterations: PASSWORD_KDF_MIN_ITERATIONS,
      salt: encodeBase64Url(salt),
    },
    key,
    value: input.value,
  })
}

export async function encryptWithPassword(input: { password: string; value: string }): Promise<string> {
  return await encryptWithCredential({
    credential: input.password,
    label: 'Password',
    maxLength: VAULT_PASSWORD_MAX_LENGTH,
    minLength: VAULT_PASSWORD_MIN_LENGTH,
    value: input.value,
  })
}

export async function encryptWithVaultKey(input: { key: CryptoKey; value: string }): Promise<string> {
  return await encryptWithKey({
    kdf: 'direct',
    key: input.key,
    value: input.value,
  })
}

export function generateVaultKeyMaterial(): string {
  return encodeBase64Url(randomBytes(VAULT_KEY_LENGTH_BYTES))
}

export async function importVaultKey(input: { keyMaterial: string }): Promise<CryptoKey> {
  const keyMaterial = decodeBase64Url(input.keyMaterial)
  if (keyMaterial.length !== VAULT_KEY_LENGTH_BYTES) {
    throw new Error('Invalid vault key material')
  }

  return await crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, ['decrypt', 'encrypt'])
}

export function isEncryptedValue(value: string): boolean {
  try {
    return encryptedValueSchema.safeParse(JSON.parse(value)).success
  } catch {
    return false
  }
}

function assertCredentialLength(input: {
  credential: string
  label: string
  maxLength: number | undefined
  minLength: number
}): void {
  if (input.credential.length < input.minLength) {
    throw new Error(`${input.label} must be at least ${input.minLength} characters`)
  }
  if (input.maxLength !== undefined && input.credential.length > input.maxLength) {
    throw new Error(`${input.label} must be at most ${input.maxLength} characters`)
  }
}

function decodeBase64Url(value: string): CryptoBytes {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

async function decryptWithKey(input: { encryptedValue: EncryptedValue; key: CryptoKey }): Promise<string> {
  const ciphertext = decodeBase64Url(input.encryptedValue.ciphertext)
  const authTag = decodeBase64Url(input.encryptedValue.auth_tag)
  const encrypted: CryptoBytes = new Uint8Array(ciphertext.length + authTag.length)
  encrypted.set(ciphertext)
  encrypted.set(authTag, ciphertext.length)
  const decrypted = await crypto.subtle.decrypt(
    { iv: decodeBase64Url(input.encryptedValue.cipherparams.iv), name: 'AES-GCM' },
    input.key,
    encrypted,
  )

  return textDecoder.decode(decrypted)
}

async function derivePasswordKey(input: {
  credential: string
  iterations: number
  salt: CryptoBytes
}): Promise<CryptoKey> {
  const key = await crypto.subtle.importKey('raw', textEncoder.encode(input.credential), 'PBKDF2', false, ['deriveKey'])
  return await crypto.subtle.deriveKey(
    {
      hash: 'SHA-256',
      iterations: input.iterations,
      name: 'PBKDF2',
      salt: input.salt,
    },
    key,
    { length: 256, name: 'AES-GCM' },
    false,
    ['decrypt', 'encrypt'],
  )
}

async function encryptWithKey(
  input:
    | {
        kdf: 'direct'
        key: CryptoKey
        value: string
      }
    | {
        kdf: 'pbkdf2-sha256'
        kdfparams: Extract<EncryptedValue, { kdf: 'pbkdf2-sha256' }>['kdfparams']
        key: CryptoKey
        value: string
      },
): Promise<string> {
  const iv = randomBytes(IV_LENGTH_BYTES)
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt({ iv, name: 'AES-GCM' }, input.key, textEncoder.encode(input.value)),
  )
  const authTag = encrypted.slice(encrypted.length - AUTH_TAG_LENGTH_BYTES)
  const ciphertext = encrypted.slice(0, encrypted.length - AUTH_TAG_LENGTH_BYTES)

  if (input.kdf === 'direct') {
    return JSON.stringify({
      auth_tag: encodeBase64Url(authTag),
      cipher: 'aes-256-gcm',
      cipherparams: {
        iv: encodeBase64Url(iv),
      },
      ciphertext: encodeBase64Url(ciphertext),
      kdf: input.kdf,
      version: 1,
    })
  }

  return JSON.stringify({
    auth_tag: encodeBase64Url(authTag),
    cipher: 'aes-256-gcm',
    cipherparams: {
      iv: encodeBase64Url(iv),
    },
    ciphertext: encodeBase64Url(ciphertext),
    kdf: input.kdf,
    kdfparams: input.kdfparams,
    version: 1,
  })
}

function encodeBase64Url(value: Uint8Array): string {
  const binary = Array.from(value, (byte) => String.fromCharCode(byte)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function randomBytes(length: number): CryptoBytes {
  return crypto.getRandomValues(new Uint8Array(length))
}
