import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignInInput,
  SolanaSignMessageInput,
  SolanaSignTransactionInput,
} from '@solana/wallet-standard-features'
import type { StandardConnectOutput } from '@wallet-standard/core'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { registerSignService } from '../src/services/sign.ts'

const mocks = vi.hoisted(() => ({
  accountActive: vi.fn(),
  accountKeyPair: vi.fn(),
  accountWalletAccounts: vi.fn(),
  assertIsSendableTransaction: vi.fn(),
  base58Encode: vi.fn(),
  createProxyService: vi.fn(),
  createSignInMessage: vi.fn(),
  createSolanaRpc: vi.fn(() => ({ url: 'https://api.devnet.solana.com' })),
  getBase58Encoder: vi.fn(),
  getDbService: vi.fn(),
  getSignatureFromTransaction: vi.fn(),
  getTransactionDecoder: vi.fn(),
  getTransactionEncoder: vi.fn(),
  registerService: vi.fn(),
  sendTransaction: vi.fn(),
  sendTransactionWithoutConfirmingFactory: vi.fn(),
  signBytes: vi.fn(),
  signTransaction: vi.fn(),
  transactionDecode: vi.fn(),
  transactionEncode: vi.fn(),
}))

vi.mock('@solana/kit', () => ({
  assertIsSendableTransaction: mocks.assertIsSendableTransaction,
  createSolanaRpc: mocks.createSolanaRpc,
  getBase58Encoder: mocks.getBase58Encoder,
  getSignatureFromTransaction: mocks.getSignatureFromTransaction,
  getTransactionDecoder: mocks.getTransactionDecoder,
  getTransactionEncoder: mocks.getTransactionEncoder,
  sendTransactionWithoutConfirmingFactory: mocks.sendTransactionWithoutConfirmingFactory,
  signBytes: mocks.signBytes,
  signTransaction: mocks.signTransaction,
}))

vi.mock('@solana/wallet-standard-util', () => ({
  createSignInMessage: mocks.createSignInMessage,
}))

vi.mock('@webext-core/proxy-service', () => ({
  createProxyService: mocks.createProxyService,
  registerService: mocks.registerService,
}))

vi.mock('../src/services/db.ts', () => ({
  getDbService: mocks.getDbService,
}))

const activeAccount = { publicKey: 'active-public-key' }
const decodedTransaction = { id: 'decoded-transaction' }
const encodedTransactionBytes = new Uint8Array([14, 15])
const privateKey = { id: 'private-key' } as unknown as CryptoKey
const signature = new Uint8Array([10, 11])
const signatureBytes = new Uint8Array([12, 13])
const signatureValue = 'transaction-signature'
const signedMessage = new Uint8Array([8, 9])
const signedTransaction = { id: 'signed-transaction' }
const transactionBytes = new Uint8Array([5, 6])
const keyPair = { privateKey } as CryptoKeyPair
const walletAccount = {
  address: activeAccount.publicKey,
  chains: [],
  features: [],
  publicKey: new Uint8Array([7]),
}
const walletAccounts = { accounts: [walletAccount] } as unknown as StandardConnectOutput

describe('sign-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.accountActive.mockResolvedValue(activeAccount)
    mocks.accountKeyPair.mockResolvedValue(keyPair)
    mocks.accountWalletAccounts.mockResolvedValue(walletAccounts)
    mocks.base58Encode.mockReturnValue(signatureBytes)
    mocks.createSignInMessage.mockReturnValue(signedMessage)
    mocks.getBase58Encoder.mockReturnValue({ encode: mocks.base58Encode })
    mocks.getDbService.mockReturnValue({
      account: {
        active: mocks.accountActive,
        keyPair: mocks.accountKeyPair,
        walletAccounts: mocks.accountWalletAccounts,
      },
    })
    mocks.getSignatureFromTransaction.mockReturnValue(signatureValue)
    mocks.getTransactionDecoder.mockReturnValue({ decode: mocks.transactionDecode })
    mocks.getTransactionEncoder.mockReturnValue({ encode: mocks.transactionEncode })
    mocks.sendTransaction.mockResolvedValue(undefined)
    mocks.sendTransactionWithoutConfirmingFactory.mockReturnValue(mocks.sendTransaction)
    mocks.signBytes.mockResolvedValue(signature)
    mocks.signTransaction.mockResolvedValue(signedTransaction)
    mocks.transactionDecode.mockReturnValue(decodedTransaction)
    mocks.transactionEncode.mockReturnValue(encodedTransactionBytes)
  })

  describe('expected behavior', () => {
    it('should sign and send a transaction with the active secret key', async () => {
      // ARRANGE
      expect.assertions(6)
      const service = registerSignService()
      const input = { transaction: transactionBytes } as SolanaSignAndSendTransactionInput

      // ACT
      const result = await service.signAndSendTransaction([input])

      // ASSERT
      expect(mocks.accountKeyPair).toHaveBeenCalledTimes(1)
      expect(mocks.assertIsSendableTransaction).toHaveBeenCalledWith(signedTransaction)
      expect(mocks.base58Encode).toHaveBeenCalledWith(signatureValue)
      expect(mocks.sendTransaction).toHaveBeenCalledWith(signedTransaction, { commitment: 'confirmed' })
      expect(mocks.signTransaction).toHaveBeenCalledWith([keyPair], decodedTransaction)
      expect(result).toEqual([{ signature: signatureBytes }])
    })

    it('should sign in with the active secret key', async () => {
      // ARRANGE
      expect.assertions(5)
      const service = registerSignService()
      const input = {} as SolanaSignInInput

      // ACT
      const result = await service.signIn([input])

      // ASSERT
      expect(mocks.accountActive).toHaveBeenCalledTimes(1)
      expect(mocks.accountKeyPair).toHaveBeenCalledTimes(1)
      expect(mocks.createSignInMessage).toHaveBeenCalledWith({
        address: activeAccount.publicKey,
        domain: 'localhost',
      })
      expect(mocks.signBytes).toHaveBeenCalledWith(privateKey, signedMessage)
      expect(result).toEqual([
        {
          account: walletAccount,
          signature,
          signatureType: 'ed25519',
          signedMessage,
        },
      ])
    })

    it('should sign a message with the active secret key', async () => {
      // ARRANGE
      expect.assertions(3)
      const service = registerSignService()
      const input = { message: transactionBytes } as SolanaSignMessageInput

      // ACT
      const result = await service.signMessage([input])

      // ASSERT
      expect(mocks.accountKeyPair).toHaveBeenCalledTimes(1)
      expect(mocks.signBytes).toHaveBeenCalledWith(privateKey, transactionBytes)
      expect(result).toEqual([{ signature, signatureType: 'ed25519', signedMessage: transactionBytes }])
    })

    it('should sign a transaction with the active secret key', async () => {
      // ARRANGE
      expect.assertions(4)
      const service = registerSignService()
      const input = { transaction: transactionBytes } as SolanaSignTransactionInput

      // ACT
      const result = await service.signTransaction([input])

      // ASSERT
      expect(mocks.accountKeyPair).toHaveBeenCalledTimes(1)
      expect(mocks.signTransaction).toHaveBeenCalledWith([keyPair], decodedTransaction)
      expect(mocks.transactionEncode).toHaveBeenCalledWith(signedTransaction)
      expect(result).toEqual([{ signedTransaction: encodedTransactionBytes }])
    })
  })

  describe('unexpected behavior', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    it('should throw an error when the active account key pair is not available', async () => {
      // ARRANGE
      expect.assertions(2)
      mocks.accountKeyPair.mockRejectedValue(new Error('Active account secretKey not found'))
      const service = registerSignService()
      const input = { message: transactionBytes } as SolanaSignMessageInput

      // ACT & ASSERT
      await expect(service.signMessage([input])).rejects.toThrow('Active account secretKey not found')
      expect(mocks.signBytes).not.toHaveBeenCalled()
    })
  })
})
