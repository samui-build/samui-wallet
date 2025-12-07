import { type Address, assertIsAddress, generateKeyPairSigner, type KeyPairSigner, type Signature } from '@solana/kit'
import { getCreateAccountInstruction } from '@solana-program/system'
import { getInitializeMintInstruction, getMintSize, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'
import { splTokenTransfer } from './spl-token-transfer.ts'

export interface SplTokenCreateTokenMintOptions {
  decimals: number
  latestBlockhash?: LatestBlockhash | undefined
  feePayerSigner: KeyPairSigner
  mint?: KeyPairSigner
  tokenProgram?: Address
  supply?: bigint | undefined
}

export interface SplTokenCreateTokenMint {
  ata?: Address
  mint: Address
  signatureCreate: Signature
  signatureSupply?: Signature
}

export async function splTokenCreateTokenMint(
  client: SolanaClient,
  {
    latestBlockhash,
    decimals,
    mint,
    feePayerSigner,
    tokenProgram = TOKEN_PROGRAM_ADDRESS,
    supply = 0n,
  }: SplTokenCreateTokenMintOptions,
): Promise<SplTokenCreateTokenMint> {
  assertIsAddress(tokenProgram)
  if (decimals < 0 || decimals > 9) {
    throw new Error(`Decimals must be between 0 and 9`)
  }

  mint = mint ?? (await generateKeyPairSigner())

  // Get default mint account size (in bytes), no extensions enabled
  const space = BigInt(getMintSize())

  // Get minimum balance for rent exemption
  const rent = await client.rpc.getMinimumBalanceForRentExemption(space).send()

  // Instruction to create new account for mint (token program)
  const createAccountInstruction = getCreateAccountInstruction({
    lamports: rent,
    newAccount: mint,
    payer: feePayerSigner,
    programAddress: tokenProgram,
    space,
  })

  // Instruction to initialize mint account data
  const initializeMintInstruction = getInitializeMintInstruction({
    decimals,
    mint: mint.address,
    mintAuthority: feePayerSigner.address,
  })

  const signatureCreate = await signAndSendTransaction(client, {
    feePayerSigner,
    instructions: [createAccountInstruction, initializeMintInstruction],
    latestBlockhash,
  })

  if (supply > 0n) {
    const { ata, signature: signatureSupply } = await splTokenTransfer(client, {
      amount: supply,
      feePayerSigner,
      latestBlockhash,
      mint: mint.address,
      tokenProgram,
    })

    return {
      ata,
      mint: mint.address,
      signatureCreate,
      signatureSupply,
    }
  }

  return {
    mint: mint.address,
    signatureCreate,
  }
}
