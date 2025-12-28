import {
  type Address,
  address,
  generateKeyPairSigner,
  type Lamports,
  type Signature,
  type TransactionSigner,
} from '@solana/kit'
import { getDelegateStakeInstruction, getInitializeInstruction } from '@solana-program/stake'
import { getCreateAccountInstruction } from '@solana-program/system'
import { STAKE_PROGRAM_ADDRESS } from './constants.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export const STAKE_ACCOUNT_SPACE = 200n
const STAKE_CONFIG_ADDRESS = address('StakeConfig11111111111111111111111111111111')

export interface CreateStakeAccountOptions {
  amount: Lamports
  latestBlockhash?: LatestBlockhash | undefined
  stakeAccount?: TransactionSigner
  transactionSigner: TransactionSigner
  vote: Address
}

export interface CreateStakeAccount {
  signature: Signature
  stakeAccount: Address
}

export async function createStakeAccount(
  client: SolanaClient,
  { amount, latestBlockhash, stakeAccount, transactionSigner, vote }: CreateStakeAccountOptions,
): Promise<CreateStakeAccount> {
  stakeAccount = stakeAccount ?? (await generateKeyPairSigner())

  const rent = await client.rpc.getMinimumBalanceForRentExemption(STAKE_ACCOUNT_SPACE).send()
  if (amount <= rent) {
    throw new Error(`Stake amount must be greater than the rent exempt reserve.`)
  }

  const createAccountInstruction = getCreateAccountInstruction({
    lamports: amount,
    newAccount: stakeAccount,
    payer: transactionSigner,
    programAddress: STAKE_PROGRAM_ADDRESS,
    space: STAKE_ACCOUNT_SPACE,
  })

  const initializeInstruction = getInitializeInstruction({
    arg0: {
      staker: transactionSigner.address,
      withdrawer: transactionSigner.address,
    },
    arg1: {
      custodian: transactionSigner.address,
      epoch: 0n,
      unixTimestamp: 0n,
    },
    stake: stakeAccount.address,
  })

  const delegateStakeInstruction = getDelegateStakeInstruction({
    stake: stakeAccount.address,
    stakeAuthority: transactionSigner,
    unused: STAKE_CONFIG_ADDRESS,
    vote,
  })

  const signature = await signAndSendTransaction(client, {
    instructions: [createAccountInstruction, initializeInstruction, delegateStakeInstruction],
    latestBlockhash,
    transactionSigner,
  })

  return {
    signature,
    stakeAccount: stakeAccount.address,
  }
}
