import { describe, expect, it } from 'vitest'

import { createKeyPairSignerFromBip44 } from './create-key-pair-signer-from-bip44'

describe('create-key-pair-signer-from-bip44', () => {
  it('should create a keypair signer from a mnemonic set', async () => {
    // ARRANGE
    expect.assertions(2)
    const mnemonic = 'kid search occur scrub tumble dove transfer prevent mirror brush gravity fork'
    const addresses = [
      'Sse6jwfCWiULhm9JYZ8zRCYQW39FavVdsDG3BEPqPLP',
      'GNmrTk9RSmkbith158xKQoF9jwRwz9jxsPE2xNrvVeGG',
      '3tsF1zkbPPzyxaBZMGKYFuUA5NHzWEwyLAK6XYhUa8eP',
      '3fSmpZ2PrWj9ijMpWQKLM7wetzTJmU5GonHbrpSq9v3x',
    ]
    // ACT
    const result = await createKeyPairSignerFromBip44({ mnemonic, to: 4 })
    // ASSERT
    expect(result.map((s) => s.address)).toEqual(addresses)
    expect(result.length).toEqual(4)
  })

  it('should create a keypair signer from a mnemonic set with passphrase', async () => {
    // ARRANGE
    expect.assertions(2)
    const mnemonic = 'toy inner shy cup come mansion nurse curtain anger spatial blush vessel'
    const addresses = [
      'SBsMscGCqSQiD8YKygSr3zyU9S41EFCMGBbsqDdh4Jx',
      'Hrue7ZeLn51qKf5N8xX3QYfJS6xXzZCgv2LkKunUfsXs',
      '7EsaA27a4742Hy5CpEfH8SXKHhiDaDL8JGsSsh1raipS',
      'EMkbgVEkJpvFXBrceJNJgaioA7bYL3BrafvjZAorfpuy',
    ]
    const passphrase = 'foobar'
    // ACT
    const result = await createKeyPairSignerFromBip44({ mnemonic, passphrase, to: 4 })
    // ASSERT
    expect(result.map((s) => s.address)).toEqual(addresses)
    expect(result.length).toEqual(4)
  })
})
