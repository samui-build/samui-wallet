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
    it('should create a network with a subscription endpoint', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput({ endpointSubscriptions: 'ws://127.0.0.1:8900' })

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
  })
})
