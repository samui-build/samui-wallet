import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { networkCreate } from '../src/network/network-create.ts'
import { networkFindUnique } from '../src/network/network-find-unique.ts'
import { networkUpdate } from '../src/network/network-update.ts'
import { createDbContextTest, randomName, testNetworkCreateInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('network-update', () => {
  beforeEach(async () => {
    await ctx.db.networks.clear()
  })

  describe('expected behavior', () => {
    it('should unset a network color', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testNetworkCreateInput({ color: 'green' })
      const id = await networkCreate(ctx, input)

      // ACT
      await networkUpdate(ctx, id, { color: undefined })

      // ASSERT
      const updatedItem = await networkFindUnique(ctx, id)
      expect(updatedItem).toBeDefined()
      expect(updatedItem?.color).toBeUndefined()
    })

    it('should update a network', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testNetworkCreateInput()
      const id = await networkCreate(ctx, input)
      const newName = randomName('newName')

      // ACT
      await networkUpdate(ctx, id, { name: newName })

      // ASSERT
      const updatedItem = await networkFindUnique(ctx, id)
      expect(updatedItem).toBeDefined()
      expect(updatedItem?.name).toBe(newName)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when updating a network fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(ctx.db.networks, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(networkUpdate(ctx, id, {})).rejects.toThrow(`Error updating network with id ${id}`)
    })

    it('should throw an error when updating a network with a too short name', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = await networkCreate(ctx, testNetworkCreateInput())

      // ACT & ASSERT
      await expect(networkUpdate(ctx, id, { name: '' })).rejects.toThrowErrorMatchingInlineSnapshot(`
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

    it('should throw an error when updating a network with a too long name', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = await networkCreate(ctx, testNetworkCreateInput())

      // ACT & ASSERT
      await expect(networkUpdate(ctx, id, { name: 'a'.repeat(21) })).rejects.toThrowErrorMatchingInlineSnapshot(`
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

    it('should throw an error when updating a network with name with only spaces', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = await networkCreate(ctx, testNetworkCreateInput())

      // ACT & ASSERT
      await expect(networkUpdate(ctx, id, { name: ' ' })).rejects.toThrowErrorMatchingInlineSnapshot(`
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
  })
})
