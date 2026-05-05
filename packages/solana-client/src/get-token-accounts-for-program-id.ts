import type { Address, JsonParsedTokenAccount, Lamports, Slot } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export interface GetTokenAccountsForProgramIdOptions {
  address: Address
  programId: Address
}

export type GetTokenAccountsByOwnerResult = Readonly<{
  context: Readonly<{
    slot: Slot
  }>
  value: readonly TokenAccountsByOwnerAccount[]
}>

export interface TokenAccountsByOwnerAccount {
  account: Readonly<{
    data: Readonly<{
      parsed: {
        info: JsonParsedTokenAccount
        type: 'account'
      }
      program: Address
      space: bigint
    }>
    executable: boolean
    lamports: Lamports
    owner: Address
    space: bigint
  }>
  pubkey: Address
}

export type GetTokenAccountsForProgramIdResult = GetTokenAccountsByOwnerResult

export async function getTokenAccountsForProgramId(
  client: SolanaClient,
  { address, programId }: GetTokenAccountsForProgramIdOptions,
): Promise<GetTokenAccountsForProgramIdResult> {
  return await client.rpc
    .getTokenAccountsByOwner(address, { programId }, { commitment: 'confirmed', encoding: 'jsonParsed' })
    .send()
}
