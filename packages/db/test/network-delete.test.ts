import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { networkCreate } from '../src/network/network-create.ts'
import { networkDelete } from '../src/network/network-delete.ts'
import { networkFindUnique } from '../src/network/network-find-unique.ts'
import { settingSetValue } from '../src/setting/setting-set-value.ts'
import { createAppContextTest, testNetworkCreateInput, testSettingSetInput } from './test-helpers.ts'

const ctx = createAppContextTest()

describe('network-delete', () => {
  beforeEach(async () => {
    await ctx.db.networks.clear()
    await ctx.db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should delete a network', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput()
      const id = await networkCreate(ctx, input)

      // ACT
      await networkDelete(ctx, id)

      // ASSERT
      const deletedItem = await networkFindUnique(ctx, id)
      expect(deletedItem).toBeNull()
    })

    it('should not delete an active network', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkCreateInput()
      const id = await networkCreate(ctx, input)
      const [_, value] = testSettingSetInput(id)

      await settingSetValue(ctx, 'activeNetworkId', value)

      // ACT & ASSERT
      await expect(networkDelete(ctx, id)).rejects.toThrow(
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
      vi.spyOn(ctx.db.networks, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(networkDelete(ctx, id)).rejects.toThrow(`Error deleting network with id ${id}`)
    })
  })
})
