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
import { getInitializeMintInstruction, getMintSize, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import {
  extension,
  getInitializeMintCloseAuthorityInstruction,
  getInitializeMintInstruction as getInitializeMintInstructionToken2022,
  getInitializePermanentDelegateInstruction,
  getMintSize as getMintSizeToken2022,
  TOKEN_2022_PROGRAM_ADDRESS,
} from '@solana-program/token-2022'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'
import { splTokenMintTo } from './spl-token-min-to.ts'

export interface SplTokenCreateTokenMintOptions {
  decimals: number
  latestBlockhash?: LatestBlockhash | undefined
  feePayer: KeyPairSigner
  mint?: KeyPairSigner
  tokenProgram?: Address
  supply?: bigint | undefined
  extensions?:
    | {
        closeMint: { address?: Address } | undefined
        permanentDelegate: { address?: Address } | undefined
      }
    | undefined
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
    extensions,
  }: SplTokenCreateTokenMintOptions,
): Promise<SplTokenCreateTokenMint> {
  if (decimals < 0 || decimals > 9) {
    throw new Error(`Decimals must be between 0 and 9`)
  }

  mint = mint ?? (await generateKeyPairSigner())

  const isToken2022 = tokenProgram === TOKEN_2022_PROGRAM_ADDRESS
  const hasExtensions =
    isToken2022 && !!(extensions && (extensions.closeMint !== undefined || extensions.permanentDelegate !== undefined))

  let space: bigint

  if (isToken2022 && hasExtensions) {
    // Build extensions array for Token 2022
    const extensionConfigs = []
    if (extensions?.closeMint) {
      extensionConfigs.push(
        extension('MintCloseAuthority', {
          closeAuthority: (extensions.closeMint.address ?? feePayer.address) as Address,
        }),
      )
    }
    if (extensions?.permanentDelegate) {
      extensionConfigs.push(
        extension('PermanentDelegate', {
          delegate: (extensions.permanentDelegate.address ?? feePayer.address) as Address,
        }),
      )
    }
    // Get mint size with extensions
    space = BigInt(getMintSizeToken2022(extensionConfigs))
  } else {
    // Get default mint account size (no extensions)
    space = BigInt(getMintSize())
  }

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

  const instructions: Instruction[] = [createAccountInstruction]

  // Add extension initialization instructions
  if (isToken2022 && hasExtensions) {
    if (extensions?.closeMint) {
      const initializeCloseMintInstruction = getInitializeMintCloseAuthorityInstruction({
        closeAuthority: (extensions.closeMint.address ?? feePayer.address) as Address,
        mint: mint.address,
      })
      instructions.push(initializeCloseMintInstruction)
    }
    if (extensions?.permanentDelegate) {
      const initializePermanentDelegateInstruction = getInitializePermanentDelegateInstruction({
        delegate: (extensions.permanentDelegate.address ?? feePayer.address) as Address,
        mint: mint.address,
      })
      instructions.push(initializePermanentDelegateInstruction)
    }
  }

  // Initialize mint instruction
  if (isToken2022) {
    const initializeMintInstruction = getInitializeMintInstructionToken2022({
      decimals,
      mint: mint.address,
      mintAuthority: feePayer.address,
    })
    instructions.push(initializeMintInstruction)
  } else {
    const initializeMintInstruction = getInitializeMintInstruction({
      decimals,
      mint: mint.address,
      mintAuthority: feePayer.address,
    })
    instructions.push(initializeMintInstruction)
  }

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
