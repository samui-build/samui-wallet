import {
  type Address,
  generateKeyPairSigner,
  type Instruction,
  type Signature,
  type TransactionSigner,
} from '@solana/kit'
import { getCreateAccountInstruction } from '@solana-program/system'
import {
  type ExtensionArgs,
  extension,
  getInitializeMintCloseAuthorityInstruction,
  getInitializeMintInstruction,
  getInitializePermanentDelegateInstruction,
  getMintSize,
  TOKEN_2022_PROGRAM_ADDRESS,
} from '@solana-program/token-2022'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'
import { splTokenMintTo } from './spl-token-mint-to.ts'

export interface SplToken2022CreateTokenMintOptions {
  decimals: number
  extensions?: {
    closeMint: boolean
    permanentDelegate: boolean
  }
  latestBlockhash?: LatestBlockhash | undefined
  mint?: TransactionSigner
  supply?: bigint | undefined
  tokenProgram?: Address
  transactionSigner: TransactionSigner
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
    decimals,
    extensions,
    latestBlockhash,
    mint,
    supply = 0n,
    tokenProgram = TOKEN_2022_PROGRAM_ADDRESS,
    transactionSigner,
  }: SplToken2022CreateTokenMintOptions,
): Promise<SplToken2022CreateTokenMint> {
  if (decimals < 0 || decimals > 9) {
    throw new Error(`Decimals must be between 0 and 9`)
  }

  mint = mint ?? (await generateKeyPairSigner())

  const extensionConfigs: ExtensionArgs[] = []
  const instructions: Instruction[] = []

  // Build extensions array for Token 2022
  if (extensions?.closeMint) {
    extensionConfigs.push(
      extension('MintCloseAuthority', {
        closeAuthority: transactionSigner.address,
      }),
    )
    const initializeCloseMintInstruction = getInitializeMintCloseAuthorityInstruction({
      closeAuthority: transactionSigner.address,
      mint: mint.address,
    })
    instructions.push(initializeCloseMintInstruction)
  }
  if (extensions?.permanentDelegate) {
    extensionConfigs.push(
      extension('PermanentDelegate', {
        delegate: transactionSigner.address,
      }),
    )
    const initializePermanentDelegateInstruction = getInitializePermanentDelegateInstruction({
      delegate: transactionSigner.address,
      mint: mint.address,
    })
    instructions.push(initializePermanentDelegateInstruction)
  }

  const space = getMintSize(extensionConfigs.length > 0 ? extensionConfigs : undefined)

  // Get minimum balance for rent exemption
  const rent = await client.rpc.getMinimumBalanceForRentExemption(BigInt(space)).send()

  // Instruction to create new account for mint
  const createAccountInstruction = getCreateAccountInstruction({
    lamports: rent,
    newAccount: mint,
    payer: transactionSigner,
    programAddress: tokenProgram,
    space,
  })

  const initializeMintInstruction = getInitializeMintInstruction({
    decimals,
    mint: mint.address,
    mintAuthority: transactionSigner.address,
  })

  // Get transaction signature
  const signatureCreate = await signAndSendTransaction(client, {
    instructions: [createAccountInstruction, ...instructions, initializeMintInstruction],
    latestBlockhash,
    transactionSigner,
  })

  if (supply > 0n) {
    const { ata, signature: signatureSupply } = await splTokenMintTo(client, {
      amount: supply,
      decimals,
      latestBlockhash,
      mint: mint.address,
      tokenProgram,
      transactionSigner,
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
