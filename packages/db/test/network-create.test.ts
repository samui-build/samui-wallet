import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { networkCreate } from '../src/network/network-create.ts'
import { networkFindMany } from '../src/network/network-find-many.ts'
import { createDbTest, testNetworkCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('network-create', () => {
  beforeEach(async () => {
    await db.networks.clear()
  })

  describe('expected behavior', () => {
    it.each([
      ['http://127.0.0.1:8899'],
      ['http://hostname'],
      ['http://localhost:8899'],
      ['https://127.0.0.1:8899'],
      ['https://api.devnet.solana.com'],
      ['https://hostname'],
      ['https://localhost:8899'],
    ])('should create a network with an endpoint %s', async (endpoint) => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({ endpoint })

      // ACT
      await networkCreate(db, input)

      // ASSERT
      const items = await networkFindMany(db)
      expect(items.map((i) => i.name)).toContain(input.name)
    })

    it.each([
      ['ws://127.0.0.1:8900'],
      ['ws://hostname'],
      ['ws://localhost:8900'],
      ['wss://127.0.0.1:8900'],
      ['wss://api.devnet.solana.com'],
      ['wss://hostname'],
      ['wss://localhost:8900'],
    ])('should create a network with a subscription endpoint %s', async (endpointSubscriptions) => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({ endpointSubscriptions })

      // ACT
      await networkCreate(db, input)

      // ASSERT
      const items = await networkFindMany(db)
      expect(items.map((i) => i.endpointSubscriptions)).toContain(input.endpointSubscriptions)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when creating a network fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput()
      vi.spyOn(db.networks, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(networkCreate(db, input)).rejects.toThrow('Error creating network')
    })

    it('should throw an error with an invalid endpoint', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({ endpoint: 'not-a-url' })

      // ACT & ASSERT
      await expect(networkCreate(db, input)).rejects.toThrow()
    })

    it('should throw an error with an invalid endpointSubscriptions', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({ endpointSubscriptions: 'not-a-websocket-url' })

      // ACT & ASSERT
      await expect(networkCreate(db, input)).rejects.toThrow()
    })

    it('should throw an error with a too short name', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({ name: '' })

      // ACT & ASSERT
      await expect(networkCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "origin": "string",
            "code": "too_small",
            "minimum": 1,
            "inclusive": true,
            "path": [
              "name"
            ],
            "message": "Too small: expected string to have >=1 characters"
          }
        ]]
      `)
    })

    it('should throw an error with a too long name', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({ name: 'a'.repeat(21) })

      // ACT & ASSERT
      await expect(networkCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "origin": "string",
            "code": "too_big",
            "maximum": 20,
            "inclusive": true,
            "path": [
              "name"
            ],
            "message": "Too big: expected string to have <=20 characters"
          }
        ]]
      `)
    })

    it('should throw an error with a name with only spaces', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({ name: ' ' })

      // ACT & ASSERT
      await expect(networkCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "origin": "string",
            "code": "too_small",
            "minimum": 1,
            "inclusive": true,
            "path": [
              "name"
            ],
            "message": "Too small: expected string to have >=1 characters"
          }
        ]]
      `)
    })

    it('should throw an error with an invalid type', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({
        // @ts-expect-error we override the type
        type: 'solana:custom',
      })

      // ACT & ASSERT
      await expect(networkCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_value",
            "values": [
              "solana:devnet",
              "solana:localnet",
              "solana:mainnet",
              "solana:testnet"
            ],
            "path": [
              "type"
            ],
            "message": "Invalid option: expected one of \\"solana:devnet\\"|\\"solana:localnet\\"|\\"solana:mainnet\\"|\\"solana:testnet\\""
          }
        ]]
      `)
    })
  })
})
