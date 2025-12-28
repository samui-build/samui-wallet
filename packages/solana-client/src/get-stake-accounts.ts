import type { Address, Base58EncodedBytes, Lamports } from '@solana/kit'
import { STAKE_PROGRAM_ADDRESS } from './constants.ts'
import type { SolanaClient } from './solana-client.ts'

export interface StakeAccount {
  data: StakeAccountData
  lamports: Lamports
  pubkey: Address
}

export interface StakeAccountData {
  meta: {
    authorized: {
      staker: Address
      withdrawer: Address
    }
    lockup: {
      custodian: Address
      epoch: string
      unixTimestamp: string
    }
    rentExemptReserve: string
  }
  stake: {
    creditsObserved: string
    delegation: {
      activationEpoch: string
      deactivationEpoch: string
      stake: string
      voter: Address
      warmupCooldownRate: number
    }
  } | null
}

interface ParsedStakeAccountData {
  parsed: {
    info: StakeAccountData
  }
}

export async function getStakeAccounts(
  client: SolanaClient,
  { address }: { address: Address },
): Promise<StakeAccount[]> {
  const accounts = await client.rpc
    .getProgramAccounts(STAKE_PROGRAM_ADDRESS, {
      encoding: 'jsonParsed',
      filters: [
        {
          memcmp: {
            bytes: address.toString() as Base58EncodedBytes,
            encoding: 'base58',
            offset: 44n, // Offset for Withdraw Authority
          },
        },
      ],
    })
    .send()

  return accounts.flatMap((acc) => {
    const info = (acc.account.data as Partial<ParsedStakeAccountData>)?.parsed?.info
    if (!info) {
      return []
    }
    return [
      {
        data: info,
        lamports: acc.account.lamports,
        pubkey: acc.pubkey,
      },
    ]
  })
}
