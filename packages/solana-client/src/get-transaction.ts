import type { Signature } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export interface GetTransactionOptions {
  signature: Signature
}

export async function getTransaction(client: SolanaClient, { signature }: GetTransactionOptions) {
  return client.rpc
    .getTransaction(signature, {
      encoding: 'jsonParsed',
      maxSupportedTransactionVersion: 0,
    })
    .send()
}

export type GetTransactionResponse = Awaited<ReturnType<typeof getTransaction>>
export type GetTransactionResult = NonNullable<GetTransactionResponse>
type GetTransactionResultInstructionUnion = GetTransactionResult['transaction']['message']['instructions'][number]
export type GetTransactionResultParsedInstruction = Extract<GetTransactionResultInstructionUnion, { parsed: unknown }>
export type GetTransactionResultInstruction = GetTransactionResultInstructionUnion & {
  parsed?: GetTransactionResultParsedInstruction['parsed']
}

export function assertGetTransactionResultParsedInstruction(
  instruction: GetTransactionResultInstruction,
): asserts instruction is GetTransactionResultParsedInstruction {
  if (!('parsed' in instruction)) {
    throw new Error('Expected parsed transaction instruction')
  }
}
