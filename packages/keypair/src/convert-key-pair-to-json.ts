import { convertByteArrayToJson } from './convert-byte-array-to-json.ts'
import { extractByteArrayFromCryptoKeyPair } from './extract-byte-array-from-crypto-key-pair.ts'

export async function convertKeyPairToJson(keypair: CryptoKeyPair): Promise<string> {
  const byteArray = await extractByteArrayFromCryptoKeyPair(keypair)

  return convertByteArrayToJson(byteArray)
}
