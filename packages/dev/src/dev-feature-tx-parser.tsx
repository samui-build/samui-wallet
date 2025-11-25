import type { Base64EncodedBytes, Signature } from '@solana/kit'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { ExplorerUiLinkTx } from '@workspace/explorer/ui/explorer-ui-link-tx'
import { getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { useState } from 'react'
import { DevFeatureTxSelect } from './dev-feature-tx-select.tsx'
import {
  type DevTxParserInput,
  type DevTxParserOutput,
  DevUiTxParserInput,
  devTxParserSchema,
} from './dev-ui-tx-parser-input.tsx'
import { fetchAndDeserializeTransaction } from './fetch-and-deserialize-transaction.ts'

async function devTxParser(input: DevTxParserInput) {
  const parsed: DevTxParserOutput = devTxParserSchema.parse(input)
  return {
    ...parsed,
  }
}
function useDevTxParser() {
  return useMutation({
    mutationFn: (input: DevTxParserInput) => devTxParser(input),
  })
}
export default function DevFeatureTxParser() {
  const network = useNetworkActive()
  const account = useAccountActive()
  const txParserMutation = useDevTxParser()
  const [signature, setSignature] = useState<Signature | null>(null)

  return (
    <div className="space-y-6">
      <UiCard contentProps={{ className: 'space-y-2' }} title="Input">
        <DevFeatureTxSelect address={account.publicKey} network={network} select={setSignature} />
        <DevUiTxParserInput
          signature={signature}
          submit={async (input) => {
            await txParserMutation.mutateAsync(input)
          }}
        />
        {signature ? <ExplorerUiLinkTx basePath="/explorer" signature={signature} /> : null}
      </UiCard>
      <UiCard title="Output">
        <DevFeatureTxFetcher network={network} signature={signature} />
      </UiCard>
    </div>
  )
}

function useGetTxFromSignature({ network, signature }: { network: Network; signature: Signature | null }) {
  const client = useSolanaClient({ network })
  return useQuery({
    enabled: !!signature,
    queryFn: () => {
      if (!signature) {
        return
      }
      return fetchAndDeserializeTransaction(client.rpc, signature)
    },
    queryKey: ['devGetTxFromSignature', network.endpoint, signature],
  })
}

export function DevFeatureTxFetcher({ network, signature }: { network: Network; signature: Signature | null }) {
  const query = useGetTxFromSignature({ network, signature })

  const base64EncodedTx = query.data?.c_found?.transaction[0]

  return query.isEnabled ? (
    query.isLoading ? (
      <UiLoader />
    ) : (
      <div>
        {base64EncodedTx ? (
          <div className="flex gap-2">
            <UiTextCopyButton label="Copy Base64 encoded tx" text={base64EncodedTx} toast="Copied" variant="outline" />
            <ExplorerInspectorUrl message={base64EncodedTx} network={network} />
          </div>
        ) : null}
        <pre>{JSON.stringify({ data: query.data, error: query.error?.message }, null, 2)}</pre>
      </div>
    )
  ) : (
    <div>Waiting for signature...</div>
  )
}

function ExplorerInspectorUrl({ message, network }: { message: Base64EncodedBytes; network: Network }) {
  const url = new URL(getExplorerUrl({ network, path: `/tx/inspector`, provider: 'solana' }))
  url.searchParams.set('message', message)
  return (
    <Button asChild variant="outline">
      <a href={url.toString()} rel="noopener noreferrer" target="_blank">
        <UiIcon icon="externalLink" />
        Open in Solana Explorer Inspector
      </a>
    </Button>
  )
}
