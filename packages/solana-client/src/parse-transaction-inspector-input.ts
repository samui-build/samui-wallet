import type { Address, CompiledTransactionMessage, ReadonlyUint8Array, Signature } from '@solana/kit'
import {
  getBase58Decoder,
  getBase58Encoder,
  getBase64Decoder,
  getBase64Encoder,
  getCompiledTransactionMessageDecoder,
  getTransactionDecoder,
  signatureBytes,
  verifySignature,
} from '@solana/kit'
import { tryCatch } from '@workspace/core/try-catch'

export const MIN_TRANSACTION_MESSAGE_LENGTH =
  3 + // header
  1 + // accounts length
  32 + // accounts, must have at least one address for fees
  32 + // recent blockhash
  1 // instructions length

export type TransactionInspectorEncoding = 'base58' | 'base64'

export interface TransactionInspectorAccountReference {
  address: Address | undefined
  key: string
  lookupTableAddress: Address | undefined
  lookupTableIndex: number | undefined
  source: 'readonly lookup' | 'static' | 'writable lookup'
}

export interface TransactionInspectorInstruction {
  accountAddresses: (Address | undefined)[]
  accountIndices: number[]
  accountReferences: (TransactionInspectorAccountReference | undefined)[]
  dataBase58: string
  dataBase64: string
  programAddress: Address | undefined
  programAddressIndex: number
  programAccountReference: TransactionInspectorAccountReference | undefined
}

export interface TransactionInspectorSignature {
  address: Address
  signature: Signature | undefined
  verified: boolean | undefined
}

export interface TransactionInspectorResult {
  accountReferences: TransactionInspectorAccountReference[]
  addressTableLookups: TransactionInspectorAddressTableLookup[]
  compiledMessage: CompiledTransactionMessage
  encoding: TransactionInspectorEncoding
  feePayer: Address | undefined
  instructions: TransactionInspectorInstruction[]
  rawMessage: ReadonlyUint8Array
  rawMessageBase64: string
  signatures: TransactionInspectorSignature[]
  sourceBytes: ReadonlyUint8Array
  sourceBytesLength: number
  version: CompiledTransactionMessage['version']
}

export interface TransactionInspectorAddressTableLookup {
  lookupTableAddress: Address
  readonlyIndexes: readonly number[]
  writableIndexes: readonly number[]
}

export interface TransactionInspectorAccountReferencesOptions {
  addressTableLookups: TransactionInspectorAddressTableLookup[]
  staticAccounts: Address[]
}

interface ParsedTransactionBytes {
  rawMessage: ReadonlyUint8Array
  signatures: TransactionInspectorSignature[]
}

interface ParsedTransactionInspectorInput extends ParsedTransactionBytes {
  compiledMessage: CompiledTransactionMessage
}

export async function parseTransactionInspectorInput(input: string): Promise<TransactionInspectorResult> {
  const { bytes, compiledMessage, encoding, rawMessage, signatures } = await decodeTransactionInspectorInput(input)
  const addressTableLookups = getAddressTableLookups(compiledMessage)
  const accountReferences = getTransactionInspectorAccountReferences({
    addressTableLookups,
    staticAccounts: compiledMessage.staticAccounts,
  })
  const staticAccounts = compiledMessage.staticAccounts
  const verifiedSignatures = await verifyTransactionSignatures({ rawMessage, signatures })

  return {
    accountReferences,
    addressTableLookups,
    compiledMessage,
    encoding,
    feePayer: staticAccounts[0],
    instructions: getInstructions(compiledMessage, accountReferences),
    rawMessage,
    rawMessageBase64: getBase64Decoder().decode(rawMessage),
    signatures: verifiedSignatures,
    sourceBytes: bytes,
    sourceBytesLength: bytes.length,
    version: compiledMessage.version,
  }
}

async function decodeTransactionInspectorInput(input: string): Promise<{
  bytes: ReadonlyUint8Array
  compiledMessage: CompiledTransactionMessage
  encoding: TransactionInspectorEncoding
  rawMessage: ReadonlyUint8Array
  signatures: TransactionInspectorSignature[]
}> {
  const normalizedInput = input.replace(/\s+/g, '')

  if (!normalizedInput) {
    throw new Error('Input is required.')
  }

  const decodedCandidates = (
    await Promise.all([
      decodeTransactionInspectorInputCandidate(normalizedInput, 'base58'),
      decodeTransactionInspectorInputCandidate(normalizedInput, 'base64'),
    ])
  ).filter((candidate) => candidate !== undefined)

  if (!decodedCandidates.length) {
    throw new Error('Input must be base58 or base64 encoded.')
  }

  const parsedCandidates = await Promise.all(
    decodedCandidates.map(async (candidate) => ({
      candidate,
      parsed: await tryCatch(Promise.resolve().then(() => parseTransactionInspectorBytes(candidate.bytes))),
    })),
  )
  const validCandidate = parsedCandidates.find(({ parsed }) => !parsed.error)

  if (validCandidate?.parsed.data) {
    return { ...validCandidate.candidate, ...validCandidate.parsed.data }
  }

  const parseError = parsedCandidates.find(({ parsed }) => parsed.error)?.parsed.error
  throw parseError ?? new Error('Input must be base58 or base64 encoded.')
}

async function decodeTransactionInspectorInputCandidate(
  input: string,
  encoding: TransactionInspectorEncoding,
): Promise<
  | {
      bytes: ReadonlyUint8Array
      encoding: TransactionInspectorEncoding
    }
  | undefined
> {
  const encoder = encoding === 'base58' ? getBase58Encoder() : getBase64Encoder()
  const { data: bytes, error } = await tryCatch(Promise.resolve().then(() => encoder.encode(input)))

  return error ? undefined : { bytes, encoding }
}

function getAddressTableLookups(message: CompiledTransactionMessage): TransactionInspectorAddressTableLookup[] {
  if (message.version !== 0 || !message.addressTableLookups) {
    return []
  }

  return message.addressTableLookups.map((lookup) => ({
    lookupTableAddress: lookup.lookupTableAddress,
    readonlyIndexes: lookup.readonlyIndexes,
    writableIndexes: lookup.writableIndexes,
  }))
}

export function getTransactionInspectorAccountReferences({
  addressTableLookups,
  staticAccounts,
}: TransactionInspectorAccountReferencesOptions): TransactionInspectorAccountReference[] {
  return [
    ...staticAccounts.map((address, index) => ({
      address,
      key: `static-${address}-${index}`,
      lookupTableAddress: undefined,
      lookupTableIndex: undefined,
      source: 'static' as const,
    })),
    ...addressTableLookups.flatMap((lookup, lookupIndex) => [
      ...lookup.writableIndexes.map((lookupTableIndex) => ({
        address: undefined,
        key: `writable-${lookupIndex}-${lookup.lookupTableAddress}-${lookupTableIndex}`,
        lookupTableAddress: lookup.lookupTableAddress,
        lookupTableIndex,
        source: 'writable lookup' as const,
      })),
      ...lookup.readonlyIndexes.map((lookupTableIndex) => ({
        address: undefined,
        key: `readonly-${lookupIndex}-${lookup.lookupTableAddress}-${lookupTableIndex}`,
        lookupTableAddress: lookup.lookupTableAddress,
        lookupTableIndex,
        source: 'readonly lookup' as const,
      })),
    ]),
  ]
}

function getInstructionAccounts(staticAccounts: Address[], accountIndices: number[]) {
  return accountIndices.map((index) => staticAccounts[index])
}

function getInstructions(
  message: CompiledTransactionMessage,
  accountReferences: TransactionInspectorAccountReference[],
): TransactionInspectorInstruction[] {
  const staticAccounts = message.staticAccounts

  if (message.version === 1) {
    return message.instructionHeaders.map((header, index) => {
      const payload = message.instructionPayloads[index]
      const accountIndices = payload?.instructionAccountIndices ?? []
      const data = payload?.instructionData ?? new Uint8Array()

      return {
        accountAddresses: getInstructionAccounts(staticAccounts, accountIndices),
        accountIndices,
        accountReferences: accountIndices.map((accountIndex) => accountReferences[accountIndex]),
        dataBase58: getBase58Decoder().decode(data),
        dataBase64: getBase64Decoder().decode(data),
        programAccountReference: accountReferences[header.programAccountIndex],
        programAddress: staticAccounts[header.programAccountIndex],
        programAddressIndex: header.programAccountIndex,
      }
    })
  }

  return message.instructions.map((instruction) => {
    const accountIndices = instruction.accountIndices ?? []
    const data = instruction.data ?? new Uint8Array()

    return {
      accountAddresses: getInstructionAccounts(staticAccounts, accountIndices),
      accountIndices,
      accountReferences: accountIndices.map((accountIndex) => accountReferences[accountIndex]),
      dataBase58: getBase58Decoder().decode(data),
      dataBase64: getBase64Decoder().decode(data),
      programAccountReference: accountReferences[instruction.programAddressIndex],
      programAddress: staticAccounts[instruction.programAddressIndex],
      programAddressIndex: instruction.programAddressIndex,
    }
  })
}

function parseTransactionInspectorBytes(bytes: ReadonlyUint8Array): ParsedTransactionInspectorInput {
  if (bytes.length < MIN_TRANSACTION_MESSAGE_LENGTH) {
    throw new Error('Input is not long enough to be a valid transaction message.')
  }

  const { rawMessage, signatures } = parseTransactionBytes(bytes)

  if (rawMessage.length < MIN_TRANSACTION_MESSAGE_LENGTH) {
    throw new Error('Input is not long enough to be a valid transaction message.')
  }

  const compiledMessage = getCompiledTransactionMessageDecoder().decode(rawMessage)

  return { compiledMessage, rawMessage, signatures }
}

function parseTransactionBytes(bytes: ReadonlyUint8Array): ParsedTransactionBytes {
  try {
    const transaction = getTransactionDecoder().decode(bytes as Uint8Array)

    return {
      rawMessage: transaction.messageBytes,
      signatures: Object.entries(transaction.signatures).map(([address, signature]) => {
        const rawSignature = signature ? signatureBytes(signature) : undefined

        return {
          address: address as Address,
          signature: rawSignature ? (getBase58Decoder().decode(rawSignature) as Signature) : undefined,
          verified: undefined,
        }
      }),
    }
  } catch {
    return { rawMessage: bytes, signatures: [] }
  }
}

async function createPublicKeyFromAddress(address: Address): Promise<CryptoKey> {
  return await crypto.subtle.importKey('raw', getBase58Encoder().encode(address), { name: 'Ed25519' }, false, [
    'verify',
  ])
}

async function verifyTransactionSignatures({
  rawMessage,
  signatures,
}: {
  rawMessage: ReadonlyUint8Array
  signatures: TransactionInspectorSignature[]
}): Promise<TransactionInspectorSignature[]> {
  return await Promise.all(
    signatures.map(async (item) => {
      if (!item.signature) {
        return item
      }

      const { data: publicKey, error: publicKeyError } = await tryCatch(createPublicKeyFromAddress(item.address))

      if (publicKeyError || !publicKey) {
        return { ...item, verified: false }
      }

      const { data: verified } = await tryCatch(
        verifySignature(publicKey, signatureBytes(getBase58Encoder().encode(item.signature)), rawMessage),
      )

      return { ...item, verified: verified ?? false }
    }),
  )
}
