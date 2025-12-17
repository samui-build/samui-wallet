import { type Address, address, type Signature } from '@solana/kit'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { useWalletLive } from '@workspace/db-react/use-wallet-live'
import { ExplorerUiLinkAddress } from '@workspace/explorer/ui/explorer-ui-link-address'
import { ExplorerUiLinkSignature } from '@workspace/explorer/ui/explorer-ui-link-signature'
import { solToLamports } from '@workspace/solana-client/sol-to-lamports'
import { useRequestAirdrop } from '@workspace/solana-client-react/use-request-airdrop'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useState } from 'react'
import { ToolsUiAirdropForm } from './ui/tools-ui-airdrop-form.tsx'

export default function ToolsFeatureAirdrop(props: { account: Account; network: Network }) {
  const wallets = useWalletLive()
  const { isPending, mutateAsync } = useRequestAirdrop(props.network)
  const [results, setResults] = useState<AirdropResult[]>([])

  return (
    <UiCard backButtonTo="/tools" contentProps={{ className: 'space-y-2 md:space-y-6' }} title="Airdrop">
      <ToolsUiAirdropForm
        disabled={isPending}
        submit={async (input) => {
          const signature = await mutateAsync({
            address: address(input.address),
            amount: solToLamports(input.amount.toString()),
          })
          setResults((result) => [
            ...result,
            {
              address: address(input.address),
              amount: input.amount,
              signature,
            },
          ])
        }}
        wallets={wallets}
      />
      <ToolsUiAirdropResultTable results={results} />
    </UiCard>
  )
}

interface AirdropResult {
  address: Address
  amount: number
  signature: Signature
}
function ToolsUiAirdropResultTable({ results = [] }: { results: AirdropResult[] }) {
  if (!results.length) {
    return null
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Address</TableHead>
          <TableHead>Signature</TableHead>
          <TableHead className="w-[120px] text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map(({ address, amount, signature }) => (
          <TableRow className="hover:bg-transparent" key={signature}>
            <TableCell>
              <ExplorerUiLinkAddress address={address} basePath="/explorer" />
            </TableCell>
            <TableCell>
              <ExplorerUiLinkSignature basePath="/explorer" signature={signature} />
            </TableCell>
            <TableCell className="w-[120px] text-right">{amount} SOL</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
