import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { networkCreate } from '../src/network/network-create.ts'
import { networkDelete } from '../src/network/network-delete.ts'
import { networkFindUnique } from '../src/network/network-find-unique.ts'
import { settingSetValue } from '../src/setting/setting-set-value.ts'
import { createDbTest, testNetworkCreateInput, testSettingSetInput } from './test-helpers.ts'

const db = createDbTest()

describe('network-delete', () => {
  beforeEach(async () => {
    await db.networks.clear()
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should delete a network', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput()
      const id = await networkCreate(db, input)

      // ACT
      await networkDelete(db, id)

      // ASSERT
      const deletedItem = await networkFindUnique(db, id)
      expect(deletedItem).toBeNull()
    })

    it('should not delete an active network', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput()
      const id = await networkCreate(db, input)
      const [_, value] = testSettingSetInput(id)

      await settingSetValue(db, 'activeNetworkId', value)

      // ACT & ASSERT
      await expect(networkDelete(db, id)).rejects.toThrow(
        'You cannot delete the active network. Please change networks and try again.',
      )
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when deleting a network fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.networks, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(networkDelete(db, id)).rejects.toThrow(`Error deleting network with id ${id}`)
    })
  })
})
