import {
  type Address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  type Instruction,
  type KeyPairSigner,
  pipe,
  type Signature,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { getCreateAccountInstruction } from '@solana-program/system'
import {
  extension,
  getInitializeMintCloseAuthorityInstruction,
  getInitializeMintInstruction,
  getInitializePermanentDelegateInstruction,
  getMintSize,
  TOKEN_2022_PROGRAM_ADDRESS,
} from '@solana-program/token-2022'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'
import { splTokenMintTo } from './spl-token-mint-to.ts'

export interface SplToken2022CreateTokenMintOptions {
  decimals: number
  latestBlockhash?: LatestBlockhash | undefined
  feePayer: KeyPairSigner
  mint?: KeyPairSigner
  tokenProgram?: Address
  supply?: bigint | undefined
  extensions?: {
    closeMint: boolean
    permanentDelegate: boolean
  }
}

// Compatibility alias for tests expecting the generic name
export type SplTokenCreateTokenMintOptions = SplToken2022CreateTokenMintOptions

export interface SplToken2022CreateTokenMint {
  ata?: Address
  mint: Address
  signatureCreate: Signature
  signatureSupply?: Signature
}

export async function splToken2022CreateTokenMint(
  client: SolanaClient,
  {
    latestBlockhash,
    decimals,
    mint,
    feePayer,
    tokenProgram = TOKEN_2022_PROGRAM_ADDRESS,
    supply = 0n,
    extensions,
  }: SplToken2022CreateTokenMintOptions,
): Promise<SplToken2022CreateTokenMint> {
  if (decimals < 0 || decimals > 9) {
    throw new Error(`Decimals must be between 0 and 9`)
  }

  mint = mint ?? (await generateKeyPairSigner())

  const extensionConfigs = []
  let instructions: Instruction[] = []

  // Build extensions array for Token 2022
  if (extensions?.closeMint) {
    extensionConfigs.push(
      extension('MintCloseAuthority', {
        closeAuthority: feePayer.address,
      }),
    )
    const initializeCloseMintInstruction = getInitializeMintCloseAuthorityInstruction({
      closeAuthority: feePayer.address,
      mint: mint.address,
    })
    instructions.push(initializeCloseMintInstruction)
  }
  if (extensions?.permanentDelegate) {
    extensionConfigs.push(
      extension('PermanentDelegate', {
        delegate: feePayer.address,
      }),
    )
    const initializePermanentDelegateInstruction = getInitializePermanentDelegateInstruction({
      delegate: feePayer.address,
      mint: mint.address,
    })
    instructions.push(initializePermanentDelegateInstruction)
  }

  const space = BigInt(extensionConfigs.length > 0 ? getMintSize(extensionConfigs) : getMintSize())

  // Get minimum balance for rent exemption
  const rent = await client.rpc.getMinimumBalanceForRentExemption(space).send()

  // Instruction to create new account for mint
  const createAccountInstruction = getCreateAccountInstruction({
    lamports: rent,
    newAccount: mint,
    payer: feePayer,
    programAddress: tokenProgram,
    space,
  })

  instructions = [createAccountInstruction, ...instructions]

  const initializeMintInstruction = getInitializeMintInstruction({
    decimals,
    mint: mint.address,
    mintAuthority: feePayer.address,
  })
  instructions.push(initializeMintInstruction)

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
    const { ata, signature: signatureSupply } = await splTokenMintTo(client, {
      amount: supply,
      decimals,
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
