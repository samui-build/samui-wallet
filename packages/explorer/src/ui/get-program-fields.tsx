import type { Address } from '@solana/kit'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'
import { getInstructionType } from '@workspace/solana-client/get-instruction-type'
import type {
  GetTransactionResultInstruction,
  GetTransactionResultParsedInstruction,
} from '@workspace/solana-client/get-transaction'
import { assertGetTransactionResultParsedInstruction } from '@workspace/solana-client/get-transaction'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import type { ReactNode } from 'react'
import { formatBalance } from '../data-access/format-balance.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiProgramLabel } from './explorer-ui-program-label.tsx'

type ExplorerParsedInstruction = GetTransactionResultParsedInstruction & {
  parsed: GetTransactionResultParsedInstruction['parsed'] & {
    info: ExplorerParsedInstructionInfo
  }
}

type ExplorerParsedInstructionInfo = {
  account: Address
  authority: Address
  destination: Address
  extensionTypes?: readonly string[]
  lamports: bigint | number
  mint: Address
  mintAuthority: Address
  newAccount: Address
  owner: Address
  source: Address
  space: number
  systemProgram: Address
  tokenAmount: { uiAmount: number | null }
  tokenProgram: Address
  wallet: Address
}

function assertExplorerParsedInstruction(
  instruction: GetTransactionResultInstruction,
): asserts instruction is ExplorerParsedInstruction {
  assertGetTransactionResultParsedInstruction(instruction)
  const parsed = instruction.parsed as Partial<ExplorerParsedInstruction['parsed']>
  if (!parsed?.info) {
    throw new Error('Expected parsed transaction instruction info')
  }
}

function parsedField(handler: (info: ExplorerParsedInstructionInfo) => ReactNode) {
  return (instruction: GetTransactionResultInstruction) => {
    assertExplorerParsedInstruction(instruction)
    return handler(instruction.parsed.info)
  }
}

function getInstructionFields(
  basePath: string,
  instructionKey: string,
): Array<[string, (ix: GetTransactionResultInstruction) => ReactNode]> {
  function ExplorerLink({ address }: { address: Address }) {
    return (
      <ExplorerUiLinkAddress
        address={address}
        basePath={basePath}
        label={<ExplorerUiProgramLabel address={address} />}
      />
    )
  }

  switch (instructionKey) {
    case `${TOKEN_2022_PROGRAM_ADDRESS}.getAccountDataSize`:
    case `${TOKEN_PROGRAM_ADDRESS}.getAccountDataSize`:
      return [
        ['Mint', parsedField((info) => <ExplorerLink address={info.mint} />)],
        ['Extension types', parsedField((info) => <UiDebug data={info.extensionTypes?.join(', ')} />)],
      ]
    case `${TOKEN_2022_PROGRAM_ADDRESS}.initializeImmutableOwner`:
    case `${TOKEN_PROGRAM_ADDRESS}.initializeImmutableOwner`:
      return [['Account', parsedField((info) => <ExplorerLink address={info.account} />)]]
    case `${TOKEN_2022_PROGRAM_ADDRESS}.initializeAccount3`:
    case `${TOKEN_PROGRAM_ADDRESS}.initializeAccount3`:
      return [
        ['Account', parsedField((info) => <ExplorerLink address={info.account} />)],
        ['Mint', parsedField((info) => <ExplorerLink address={info.mint} />)],
        ['Owner', parsedField((info) => <ExplorerLink address={info.owner} />)],
      ]
    case `${TOKEN_2022_PROGRAM_ADDRESS}.mintToChecked`:
      return [
        ['Mint', parsedField((info) => <ExplorerLink address={info.mint} />)],
        ['Account', parsedField((info) => <ExplorerLink address={info.account} />)],
        ['Mint authority', parsedField((info) => <ExplorerLink address={info.mintAuthority} />)],
        ['Amount', parsedField((info) => info.tokenAmount.uiAmount)],
      ]
    case `${TOKEN_PROGRAM_ADDRESS}.transferChecked`:
      return [
        ['Authority', parsedField((info) => <ExplorerLink address={info.authority} />)],
        ['Destination', parsedField((info) => <ExplorerLink address={info.destination} />)],
        ['Mint', parsedField((info) => <ExplorerLink address={info.mint} />)],
        ['Source', parsedField((info) => <ExplorerLink address={info.source} />)],
        ['Amount', parsedField((info) => info.tokenAmount.uiAmount)],
      ]
    case `11111111111111111111111111111111.createAccount`:
      return [
        ['From Address', parsedField((info) => <ExplorerLink address={info.source} />)],
        ['New Address', parsedField((info) => <ExplorerLink address={info.newAccount} />)],
        ['Transfer amount', parsedField((info) => formatBalance({ balance: info.lamports, decimals: 9 }))],
        ['Allocated Data Size', parsedField((info) => info.space)],
        ['Assigned Program ID', parsedField((info) => <ExplorerLink address={info.owner} />)],
      ]
    case `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL.createIdempotent`:
    case `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL.create`:
      return [
        ['Source', parsedField((info) => <ExplorerLink address={info.source} />)],
        ['Account', parsedField((info) => <ExplorerLink address={info.account} />)],
        ['Mint', parsedField((info) => <ExplorerLink address={info.mint} />)],
        ['Wallet', parsedField((info) => <ExplorerLink address={info.wallet} />)],
        ['System Program', parsedField((info) => <ExplorerLink address={info.systemProgram} />)],
        ['Token Program', parsedField((info) => <ExplorerLink address={info.tokenProgram} />)],
      ]
    default:
      return []
  }
}

export function getProgramFields({
  basePath,
  instruction,
}: {
  basePath: string
  instruction: GetTransactionResultInstruction
}) {
  return getInstructionFields(basePath, `${instruction.programId}.${getInstructionType(instruction)}`)
}
