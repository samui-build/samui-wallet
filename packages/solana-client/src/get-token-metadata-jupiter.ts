import { z } from 'zod'
import { NATIVE_MINT } from './constants.ts'

const JUPITER_TOKEN_METADATA_BATCH_SIZE = 100

const jupiterTokenMetadataSchema = z.object({
  decimals: z.number(),
  icon: z.string().nullish(),
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  usdPrice: z.number().nullish(),
})

const jupiterTokenMetadataResponseSchema = z.array(jupiterTokenMetadataSchema)

type JupiterTokenMetadata = z.infer<typeof jupiterTokenMetadataSchema>

export interface TokenMetadata {
  decimals: number
  icon: string
  id: string
  name: string
  symbol: string
  usdPrice: number
}

export async function getTokenMetadataJupiter(mints: string[]): Promise<TokenMetadata[]> {
  const metadata: TokenMetadata[] = []
  const uniqueMints = [...new Set(mints)]

  for (const batch of chunkArray(uniqueMints, JUPITER_TOKEN_METADATA_BATCH_SIZE)) {
    metadata.push(...(await getTokenMetadataJupiterBatch(batch)))
  }

  return metadata
}

async function getTokenMetadataJupiterBatch(mints: string[]): Promise<TokenMetadata[]> {
  const url = new URL('https://lite-api.jup.ag/tokens/v2/search')
  url.searchParams.append('query', mints.join(','))

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Jupiter token metadata request failed: ${response.status} ${response.statusText}`)
  }

  const items = jupiterTokenMetadataResponseSchema.parse(await response.json())

  return items.map(mapTokenMetadataJupiter)
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

function mapTokenMetadataJupiter(item: JupiterTokenMetadata): TokenMetadata {
  return {
    decimals: item.decimals,
    icon: item.icon ?? '',
    id: item.id,
    name: item.id === NATIVE_MINT ? 'Solana' : item.name,
    symbol: item.symbol,
    usdPrice: item.usdPrice ?? 0,
  }
}
