import { describe, expect, it } from 'vitest'

import { createKeyPairSignerFromBip39 } from './create-key-pair-signer-from-bip39'

describe('create-key-pair-signer-from-bip39', () => {
  it('should create a keypair signer from a mnemonic', async () => {
    // ARRANGE
    expect.assertions(1)
    const mnemonic = 'afford canoe observe bone master venture shoot erode regular coffee dose cute'
    const address = 'SFYog9EU62yDjJUAAhwiWvehTkvXNhW4nAbBTFzou3T'
    // ACT
    const result = await createKeyPairSignerFromBip39({ mnemonic })
    // ASSERT
    expect(result.address).toEqual(address)
  })

  it('should create a keypair signer from a mnemonic with passphrase', async () => {
    // ARRANGE
    expect.assertions(1)
    const mnemonic = 'tower mandate pupil dance furnace scheme wisdom envelope next fantasy flavor merit'
    const address = 'SFDXaLas2FdpiGn9gtvaxx5jFG7L7QAwY8KvWCu6B5d'
    const passphrase = 'foobar'
    // ACT
    const result = await createKeyPairSignerFromBip39({ mnemonic, passphrase })
    // ASSERT
    expect(result.address).toEqual(address)
  })
})
