import {
  type Address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  type KeyPairSigner,
  pipe,
  type Signature,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { getCreateAccountInstruction } from '@solana-program/system'
import { getInitializeMintInstruction, getMintSize, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'
import { splTokenTransfer } from './spl-token-transfer.ts'

export interface SplTokenCreateTokenMintOptions {
  decimals: number
  latestBlockhash?: LatestBlockhash | undefined
  feePayer: KeyPairSigner
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
    feePayer,
    tokenProgram = TOKEN_PROGRAM_ADDRESS,
    supply = 0n,
  }: SplTokenCreateTokenMintOptions,
): Promise<SplTokenCreateTokenMint> {
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
    payer: feePayer,
    programAddress: tokenProgram,
    space,
  })

  // Instruction to initialize mint account data
  const initializeMintInstruction = getInitializeMintInstruction({
    decimals,
    mint: mint.address,
    mintAuthority: feePayer.address,
  })

  const instructions = [createAccountInstruction, initializeMintInstruction]

  latestBlockhash = latestBlockhash ?? (await getLatestBlockhash(client))

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  )

  // Sign transaction message with required signers (fee payer and mint keypair)
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage)
  assertIsTransactionWithBlockhashLifetime(signedTransaction)

  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    signedTransaction,
    { commitment: 'confirmed' },
  )

  // Get transaction signature
  const signatureCreate = getSignatureFromTransaction(signedTransaction)

  if (supply > 0n) {
    const { ata, signature: signatureSupply } = await splTokenTransfer(client, {
      amount: supply,
      feePayer,
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
