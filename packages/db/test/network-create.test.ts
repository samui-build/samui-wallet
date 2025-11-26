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
    it('should create a network', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput()

      // ACT
      await networkCreate(db, input)

      // ASSERT
      const items = await networkFindMany(db)
      expect(items.map((i) => i.name)).toContain(input.name)
    })

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

    it.each([
      ['http://localhost:8899'],
      ['https://127.0.0.1:8900'],
      ['ftp://hostname'],
      ['not-a-websocket-url'],
      ['good://.com'],
    ])('should throw an error with invalid endpointSubscriptions value %s', async (invalidUrl) => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({ endpointSubscriptions: invalidUrl })

      // ACT & ASSERT
      await expect(networkCreate(db, input)).rejects.toThrow()
    })
  })
})
