import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  getSignatureFromTransaction,
  type KeyPairSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { getCreateAccountInstruction } from '@solana-program/system'
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstruction,
  getInitializeMintInstruction,
  getMintSize,
  getMintToInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token'

import type { SolanaClient } from './solana-client.ts'

export interface SplTokenCreateTokenMintOptions {
  decimals: number
  feePayer: KeyPairSigner
  mint: KeyPairSigner
  supply: number
}

export async function splTokenCreateTokenMint(
  client: SolanaClient,
  options: SplTokenCreateTokenMintOptions,
): Promise<{ mint: string; signature: string; supply?: string }> {
  // TODO: Add proper validation
  if (options.decimals < 0 || options.decimals > 9) {
    throw new Error(`Decimals must be between 0 and 9`)
  }
  const feePayer = options.feePayer
  const mint = options.mint

  // Get default mint account size (in bytes), no extensions enabled
  const space = BigInt(getMintSize())

  // Get minimum balance for rent exemption
  const rent = await client.rpc.getMinimumBalanceForRentExemption(space).send()

  // Instruction to create new account for mint (token program)
  // Invokes the system program
  const createAccountInstruction = getCreateAccountInstruction({
    lamports: rent,
    newAccount: mint,
    payer: feePayer,
    programAddress: TOKEN_PROGRAM_ADDRESS,
    space,
  })

  // Instruction to initialize mint account data
  // Invokes the token program
  const initializeMintInstruction = getInitializeMintInstruction({
    decimals: options.decimals,
    mint: mint.address,
    mintAuthority: feePayer.address,
  })

  const instructions = [createAccountInstruction, initializeMintInstruction]

  // Get latest blockhash to include in transaction
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()

  // Create transaction message
  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }), // Create transaction message
    (tx) => setTransactionMessageFeePayerSigner(feePayer, tx), // Set fee payer
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx), // Set transaction blockhash
    (tx) => appendTransactionMessageInstructions(instructions, tx), // Append instructions
  )

  // Sign transaction message with required signers (fee payer and mint keypair)
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage)
  assertIsTransactionWithBlockhashLifetime(signedTransaction)

  // @ts-expect-error rpc clients are scoped to their cluster, we need to figure out how to handle this
  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    signedTransaction,
    { commitment: 'confirmed' },
  )

  // Get transaction signature
  const transactionSignature = getSignatureFromTransaction(signedTransaction)

  if (options.supply > 0) {
    const [ataAddress] = await findAssociatedTokenPda({
      mint: mint.address,
      owner: feePayer.address,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    })

    const createAtaInstruction = getCreateAssociatedTokenInstruction({
      ata: ataAddress,
      mint: mint.address,
      owner: feePayer.address,
      payer: feePayer,
    })

    const mintAmount = BigInt(options.supply) * BigInt(10 ** options.decimals)

    const mintToInstruction = getMintToInstruction({
      amount: mintAmount,
      mint: mint.address,
      mintAuthority: feePayer,
      token: ataAddress,
    })

    const supplyTransactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions([createAtaInstruction, mintToInstruction], tx),
    )

    const signedSupplyTransaction = await signTransactionMessageWithSigners(supplyTransactionMessage)
    assertIsTransactionWithBlockhashLifetime(signedSupplyTransaction)

    // @ts-expect-error rpc clients are scoped to their cluster, we need to figure out how to handle this
    await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
      signedSupplyTransaction,
      { commitment: 'confirmed' },
    )

    const supplySignature = getSignatureFromTransaction(signedSupplyTransaction)

    return {
      mint: mint.address.toString(),
      signature: transactionSignature.toString(),
      supply: supplySignature.toString(),
    }
  }

  return {
    mint: mint.address.toString(),
    signature: transactionSignature.toString(),
  }
}
