import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NATIVE_MINT } from '../src/constants.ts'
import { getTokenMetadataJupiter } from '../src/get-token-metadata-jupiter.ts'

describe('get-token-metadata-jupiter', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('expected behavior', () => {
    it('should batch token metadata requests to 100 mints at a time', async () => {
      // ARRANGE
      expect.assertions(5)
      const mints = [NATIVE_MINT, ...Array.from({ length: 100 }, (_, index) => `Mint${index}`)]
      const fetchMock = vi.fn(async (input: Parameters<typeof fetch>[0]) => {
        const mints = getRequestMints(input)

        return Response.json(mints.map((mint) => createJupiterTokenMetadata({ id: mint })))
      })
      vi.spyOn(globalThis, 'fetch').mockImplementation(fetchMock)

      // ACT
      const result = await getTokenMetadataJupiter(mints)

      // ASSERT
      expect(result).toHaveLength(101)
      expect(result[0]?.name).toBe('Solana')
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(getRequestMints(fetchMock.mock.calls[0]?.[0])).toHaveLength(100)
      expect(getRequestMints(fetchMock.mock.calls[1]?.[0])).toHaveLength(1)
    })

    it('should normalize nullable Jupiter metadata fields', async () => {
      // ARRANGE
      expect.assertions(2)
      const fetchMock = vi.fn(async () =>
        Response.json([
          createJupiterTokenMetadata({
            icon: null,
            usdPrice: null,
          }),
        ]),
      )
      vi.spyOn(globalThis, 'fetch').mockImplementation(fetchMock)

      // ACT
      const result = await getTokenMetadataJupiter(['Mint'])

      // ASSERT
      expect(result[0]?.icon).toBe('')
      expect(result[0]?.usdPrice).toBe(0)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw when Jupiter returns an error response', async () => {
      // ARRANGE
      expect.assertions(1)
      const fetchMock = vi.fn(async () => new Response(null, { status: 500, statusText: 'Internal Server Error' }))
      vi.spyOn(globalThis, 'fetch').mockImplementation(fetchMock)

      // ACT & ASSERT
      await expect(getTokenMetadataJupiter(['Mint'])).rejects.toThrow(
        'Jupiter token metadata request failed: 500 Internal Server Error',
      )
    })
  })
})

function createJupiterTokenMetadata({
  decimals = 9,
  icon = 'icon',
  id = 'Mint',
  name = 'Token',
  symbol = 'TOKEN',
  usdPrice = 1,
}: {
  decimals?: number
  icon?: null | string
  id?: string
  name?: string
  symbol?: string
  usdPrice?: null | number
} = {}) {
  return {
    decimals,
    icon,
    id,
    name,
    symbol,
    usdPrice,
  }
}

function getRequestMints(input: Parameters<typeof fetch>[0] | undefined): string[] {
  if (!input) {
    return []
  }

  return new URL(input.toString()).searchParams.get('query')?.split(',') ?? []
}
