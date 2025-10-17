export async function extractByteArrayFromCryptoKeyPair(keypair: CryptoKeyPair): Promise<Uint8Array> {
  const [rawPublicKey, privateKeyJwk] = await Promise.all([
    crypto.subtle.exportKey('raw', keypair.publicKey),
    crypto.subtle.exportKey('jwk', keypair.privateKey),
  ])

  if (!privateKeyJwk.d) {
    throw new Error('Failed to export private key from JWK.')
  }

  // JWK's 'd' property is Base64URL. It must be converted to standard Base64 before decoding.
  const base64 = privateKeyJwk.d.replace(/-/g, '+').replace(/_/g, '/')
  const binaryString = atob(base64)
  const privateKeyBytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0))

  const publicKeyBytes = new Uint8Array(rawPublicKey)

  // Concatenate the two Uint8Arrays.
  const combined = new Uint8Array(privateKeyBytes.length + publicKeyBytes.length)
  combined.set(privateKeyBytes)
  combined.set(publicKeyBytes, privateKeyBytes.length)

  return combined
}
