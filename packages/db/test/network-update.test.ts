import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { networkCreate } from '../src/network/network-create.ts'
import { networkFindUnique } from '../src/network/network-find-unique.ts'
import { networkUpdate } from '../src/network/network-update.ts'
import { createDbTest, randomName, testNetworkCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('network-update', () => {
  beforeEach(async () => {
    await db.networks.clear()
  })

  describe('expected behavior', () => {
    it('should update a network', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testNetworkCreateInput()
      const id = await networkCreate(db, input)
      const newName = randomName('newName')

      // ACT
      await networkUpdate(db, id, { name: newName })

      // ASSERT
      const updatedItem = await networkFindUnique(db, id)
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
      vi.spyOn(db.networks, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(networkUpdate(db, id, {})).rejects.toThrow(`Error updating network with id ${id}`)
    })

    it('should throw an error when updating a network with a too short name', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = await networkCreate(db, testNetworkCreateInput())

      // ACT & ASSERT
      await expect(networkUpdate(db, id, { name: '' })).rejects.toThrowErrorMatchingInlineSnapshot(`
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
      const id = await networkCreate(db, testNetworkCreateInput())

      // ACT & ASSERT
      await expect(networkUpdate(db, id, { name: 'a'.repeat(21) })).rejects.toThrowErrorMatchingInlineSnapshot(`
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
      const id = await networkCreate(db, testNetworkCreateInput())

      // ACT & ASSERT
      await expect(networkUpdate(db, id, { name: ' ' })).rejects.toThrowErrorMatchingInlineSnapshot(`
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
