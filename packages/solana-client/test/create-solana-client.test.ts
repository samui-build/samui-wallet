import { describe, expect, it } from 'vitest'

import { createSolanaClient } from '../src/create-solana-client.ts'

describe('create-solana-client', () => {
  describe('expected behavior', () => {
    it('should initialize a client', () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const client = createSolanaClient({ url: 'http://localhost:8899' })

      // ASSERT
      expect(client).toHaveProperty('rpc')
      expect(client).toHaveProperty('rpcSubscriptions')
      expect(Object.keys(client).length).toBe(2)
    })

    it('should initialize a client with a subscriptions url', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const client = createSolanaClient({
        url: 'http://localhost:8899',
        urlSubscriptions: 'ws://localhost:8900',
      })

      // ASSERT
      expect(client).toBeDefined()
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error if an invalid url is passed', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      expect(() =>
        createSolanaClient({
          url: 'not-a-url',
        }),
      ).toThrow('Invalid url')
    })

    it('should throw an error if an invalid subscriptions url is passed', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      expect(() =>
        createSolanaClient({
          url: 'http://localhost:8899',
          urlSubscriptions: 'not-a-url',
        }),
      ).toThrow('Invalid subscription url')
    })
  })
})
