import type { Address } from '@solana/kit'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'
import { getInstructionType } from '@workspace/solana-client/get-instruction-type'
import type { GetTransactionResultInstruction } from '@workspace/solana-client/get-transaction'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import type { ReactNode } from 'react'
import { formatBalance } from '../data-access/format-balance.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiProgramLabel } from './explorer-ui-program-label.tsx'

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
        ['Mint', (instruction) => <ExplorerLink address={instruction.parsed.info.mint} />],
        ['Extension types', (instruction) => <UiDebug data={instruction.parsed.info?.extensionTypes?.join(', ')} />],
      ]
    case `${TOKEN_2022_PROGRAM_ADDRESS}.initializeImmutableOwner`:
    case `${TOKEN_PROGRAM_ADDRESS}.initializeImmutableOwner`:
      return [['Account', (instruction) => <ExplorerLink address={instruction.parsed.info.account} />]]
    case `${TOKEN_2022_PROGRAM_ADDRESS}.initializeAccount3`:
    case `${TOKEN_PROGRAM_ADDRESS}.initializeAccount3`:
      return [
        ['Account', (instruction) => <ExplorerLink address={instruction.parsed.info.account} />],
        ['Mint', (instruction) => <ExplorerLink address={instruction.parsed.info.mint} />],
        ['Owner', (instruction) => <ExplorerLink address={instruction.parsed.info.owner} />],
      ]
    case `${TOKEN_2022_PROGRAM_ADDRESS}.mintToChecked`:
      return [
        ['Mint', (instruction) => <ExplorerLink address={instruction.parsed.info.mint} />],
        ['Account', (instruction) => <ExplorerLink address={instruction.parsed.info.account} />],
        ['Mint authority', (instruction) => <ExplorerLink address={instruction.parsed.info.mintAuthority} />],
        ['Amount', (instruction) => instruction.parsed.info.tokenAmount.uiAmount],
      ]
    case `${TOKEN_PROGRAM_ADDRESS}.transferChecked`:
      return [
        ['Authority', (instruction) => <ExplorerLink address={instruction.parsed.info.authority} />],
        ['Destination', (instruction) => <ExplorerLink address={instruction.parsed.info.destination} />],
        ['Mint', (instruction) => <ExplorerLink address={instruction.parsed.info.mint} />],
        ['Source', (instruction) => <ExplorerLink address={instruction.parsed.info.source} />],
        ['Amount', (instruction) => instruction.parsed.info.tokenAmount.uiAmount],
      ]
    case `11111111111111111111111111111111.createAccount`:
      return [
        ['From Address', (instruction) => <ExplorerLink address={instruction.parsed.info.source} />],
        ['New Address', (instruction) => <ExplorerLink address={instruction.parsed.info.newAccount} />],
        ['Transfer amount', (instruction) => formatBalance({ balance: instruction.parsed.info.lamports, decimals: 9 })],
        ['Allocated Data Size', (instruction) => instruction.parsed.info.space],
        ['Assigned Program ID', (instruction) => <ExplorerLink address={instruction.parsed.info.owner} />],
      ]
    case `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL.createIdempotent`:
    case `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL.create`:
      return [
        ['Source', (instruction) => <ExplorerLink address={instruction.parsed.info.source} />],
        ['Account', (instruction) => <ExplorerLink address={instruction.parsed.info.account} />],
        ['Mint', (instruction) => <ExplorerLink address={instruction.parsed.info.mint} />],
        ['Wallet', (instruction) => <ExplorerLink address={instruction.parsed.info.wallet} />],
        ['System Program', (instruction) => <ExplorerLink address={instruction.parsed.info.systemProgram} />],
        ['Token Program', (instruction) => <ExplorerLink address={instruction.parsed.info.tokenProgram} />],
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
