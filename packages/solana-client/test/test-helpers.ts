import { generateKeyPairSigner, type KeyPairSigner } from '@solana/kit'
import { createSolanaClient } from '../src/create-solana-client.ts'
import { getLatestBlockhash, type LatestBlockhash } from '../src/get-latest-blockhash.ts'
import { requestAirdrop } from '../src/request-airdrop.ts'
import { solToLamports } from '../src/sol-to-lamports.ts'
import type { SolanaClient } from '../src/solana-client.ts'
import {
  type SplTokenCreateTokenMint,
  type SplTokenCreateTokenMintOptions,
  splTokenCreateTokenMint,
} from '../src/spl-token-create-token-mint.ts'
import { uiAmountToBigInt } from '../src/ui-amount-to-big-int.ts'

export interface IntegrationTestContext {
  client: SolanaClient
  feePayerSigner: KeyPairSigner
  latestBlockhash: LatestBlockhash
}

export async function setupIntegrationTestContext(): Promise<IntegrationTestContext> {
  const client = createSolanaClient({
    url: 'http://localhost:8899',
    urlSubscriptions: 'ws://localhost:8900',
  })
  const [latestBlockhash, feePayerSigner] = await Promise.all([getLatestBlockhash(client), generateKeyPairSigner()])
  await requestAirdrop(client, { address: feePayerSigner.address, amount: solToLamports('1') })

  return { client, feePayerSigner, latestBlockhash }
}

export interface IntegrationTestMint {
  input: SplTokenCreateTokenMintOptions
  result: SplTokenCreateTokenMint
}

export async function setupIntegrationTestMint({
  client,
  feePayerSigner,
  latestBlockhash,
}: IntegrationTestContext): Promise<IntegrationTestMint> {
  const newTokenMint = await generateKeyPairSigner()
  const decimals = 6
  const supply = 420
  const input: SplTokenCreateTokenMintOptions = {
    decimals,
    feePayerSigner,
    latestBlockhash,
    mint: newTokenMint,
    supply: uiAmountToBigInt(supply.toString(), decimals),
  }

  const result = await splTokenCreateTokenMint(client, input)

  return { input, result }
}
