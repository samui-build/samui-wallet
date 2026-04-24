import { type Address, getBase64Decoder, getBase64Encoder } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getTransactionInspectorAccountReferences,
  parseTransactionInspectorInput,
} from '../src/parse-transaction-inspector-input.ts'

const DEVNET_TRANSACTION_BASE58 =
  '3vniymnVePee2wjJptnvNVpnNPAJqzUpuhdEFf67AFZNjn4YjKSTLMckESMmaAWU1MdTkS7N2HW5psF5t4RnnMHdFCKFBuLdwbzD4tZ6tGpHrXWch5Kn9nimKP3ZEyuj7fHHzNXpqRA7Q7Z4ZDr5L6i1ugmS4NXFZY2P18ahfJLn54NLtgDxnTU59bkFDtiL1gqAPyW8bPk5aUUnjNM2Np6NM2KkKBs1w99S9tnSuART2qDpNVdX2wKJN5zvhxsDNnZskV1BnMDmPtmrjXMQH6oJ5KQra5BTffMPd'
const DEVNET_TRANSACTION_BASE64 =
  'AQ6bxHQd02AvW2jIzS9oRjbxqj+ST2jvbsBy9yJre+uSbRrVecKhE6ejj7lS0JU6aP9Br/w43ol+yueyRddNRAcBAAEDQMJrwX8tEY9Hthtph0uMLm0j4fV5vU4/955t0/r1c3nd1vbjXabKYKyz/QkZfCENNQUwIffPl8dY6fbLsKu9rQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI2ST38CdjGDzn6ocuQJnEIFUWOvGRsHgKTwkWkRC9/MBAgIAAQwCAAAA6AMAAAAAAAA='
const DEVNET_TRANSACTION_SIGNATURE =
  'HwXNNDpDQHPh66GrcsopydvPNWxtED97PHPGyWoww21XXZKMW1iaNZnPDbUWjMPC8pRoWXr3y8QdpEJskdR8WEi'
const OVERLAPPING_ALPHABET_BASE64_MESSAGE =
  'AAAAATAs9qo8CPVRVn6pNt65hdk41Zr16ZEXkERFuExsMXwYuX9bvxkBGL228i69T2fAUAWnwho52RCkEcLwvYoquhkA'

describe('parse-transaction-inspector-input', () => {
  describe('expected behavior', () => {
    it('should parse a devnet base64 encoded transaction', async () => {
      // ARRANGE
      expect.assertions(12)

      // ACT
      const result = await parseTransactionInspectorInput(DEVNET_TRANSACTION_BASE64)

      // ASSERT
      expect(result.accountReferences).toHaveLength(3)
      expect(result.accountReferences[0]).toStrictEqual({
        address: '5Mo3HtvCT73PmRdzoQVFuU6o7U862BDGeRd8jafzgGSC',
        key: 'static-5Mo3HtvCT73PmRdzoQVFuU6o7U862BDGeRd8jafzgGSC-0',
        lookupTableAddress: undefined,
        lookupTableIndex: undefined,
        source: 'static',
      })
      expect(result.encoding).toBe('base64')
      expect(result.feePayer).toBe('5Mo3HtvCT73PmRdzoQVFuU6o7U862BDGeRd8jafzgGSC')
      expect(result.instructions).toHaveLength(1)
      expect(result.instructions[0]?.programAccountReference).toBe(result.accountReferences[2])
      expect(result.rawMessageBase64).toBe(
        'AQABA0DCa8F/LRGPR7YbaYdLjC5tI+H1eb1OP/eebdP69XN53db2412mymCss/0JGXwhDTUFMCH3z5fHWOn2y7Crva0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACNkk9/AnYxg85+qHLkCZxCBVFjrxkbB4Ck8JFpEQvfzAQICAAEMAgAAAOgDAAAAAAAA',
      )
      expect(result.signatures).toHaveLength(1)
      expect(result.signatures[0]?.signature).toBe(DEVNET_TRANSACTION_SIGNATURE)
      expect(result.signatures[0]?.verified).toBe(true)
      expect(result.sourceBytesLength).toBe(215)
      expect(result.version).toBe('legacy')
    })

    it('should build account references with static and lookup accounts in message index order', () => {
      // ARRANGE
      expect.assertions(1)
      const lookupTableAddress = '7CZdLj9f5bgLwv77JRMSoravvVGyEpEJndRbWNsJCkUB' as Address
      const staticAccount = '11111111111111111111111111111111' as Address

      // ACT
      const result = getTransactionInspectorAccountReferences({
        addressTableLookups: [
          {
            lookupTableAddress,
            readonlyIndexes: [3, 5],
            writableIndexes: [2],
          },
        ],
        staticAccounts: [staticAccount],
      })

      // ASSERT
      expect(result).toStrictEqual([
        {
          address: staticAccount,
          key: `static-${staticAccount}-0`,
          lookupTableAddress: undefined,
          lookupTableIndex: undefined,
          source: 'static',
        },
        {
          address: undefined,
          key: `writable-0-${lookupTableAddress}-2`,
          lookupTableAddress,
          lookupTableIndex: 2,
          source: 'writable lookup',
        },
        {
          address: undefined,
          key: `readonly-0-${lookupTableAddress}-3`,
          lookupTableAddress,
          lookupTableIndex: 3,
          source: 'readonly lookup',
        },
        {
          address: undefined,
          key: `readonly-0-${lookupTableAddress}-5`,
          lookupTableAddress,
          lookupTableIndex: 5,
          source: 'readonly lookup',
        },
      ])
    })

    it('should parse a devnet base58 encoded transaction', async () => {
      // ARRANGE
      expect.assertions(5)

      // ACT
      const result = await parseTransactionInspectorInput(DEVNET_TRANSACTION_BASE58)

      // ASSERT
      expect(result.encoding).toBe('base58')
      expect(result.instructions[0]?.programAddress).toBe('11111111111111111111111111111111')
      expect(result.signatures[0]?.signature).toBe(DEVNET_TRANSACTION_SIGNATURE)
      expect(result.signatures[0]?.verified).toBe(true)
      expect(result.version).toBe('legacy')
    })

    it('should parse a valid base64 transaction message when base58 decoding also succeeds', async () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result = await parseTransactionInspectorInput(OVERLAPPING_ALPHABET_BASE64_MESSAGE)

      // ASSERT
      expect(result.encoding).toBe('base64')
      expect(result.sourceBytesLength).toBe(69)
      expect(result.version).toBe('legacy')
    })

    it('should mark a tampered devnet transaction signature as invalid', async () => {
      // ARRANGE
      expect.assertions(2)
      const bytes = new Uint8Array(getBase64Encoder().encode(DEVNET_TRANSACTION_BASE64))
      bytes[bytes.length - 1] = (bytes[bytes.length - 1] ?? 0) ^ 1

      // ACT
      const result = await parseTransactionInspectorInput(getBase64Decoder().decode(bytes))

      // ASSERT
      expect(result.signatures[0]?.signature).toBe(DEVNET_TRANSACTION_SIGNATURE)
      expect(result.signatures[0]?.verified).toBe(false)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when input is empty', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(parseTransactionInspectorInput('')).rejects.toThrow('Input is required.')
    })

    it('should throw an error when input is not encoded transaction data', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(parseTransactionInspectorInput('not-valid-transaction-data')).rejects.toThrow(
        'Input must be base58 or base64 encoded.',
      )
    })

    it('should throw an error when input is whitespace only', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(parseTransactionInspectorInput('   \n\t  ')).rejects.toThrow('Input is required.')
    })
  })
})
