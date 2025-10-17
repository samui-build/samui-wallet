import { convertByteArrayToJson } from './convert-byte-array-to-json'
import { extractByteArrayFromCryptoKeyPair } from './extract-byte-array-from-crypto-key-pair'

export async function convertKeyPairToJson(keypair: CryptoKeyPair): Promise<string> {
  const byteArray = await extractByteArrayFromCryptoKeyPair(keypair)

  return convertByteArrayToJson(byteArray)
}
