import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { generateKeyPairSigner } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { PortfolioUiExplorerButton } from '@workspace/portfolio/ui/portfolio-ui-explorer-button'
import { getClusterLabel } from '@workspace/settings/ui/get-cluster-label'
import { useSplTokenCreateTokenMint } from '@workspace/solana-client-react/use-spl-token-create-token-mint'
import { getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldDescription, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@workspace/ui/components/item'
import { UiCard } from '@workspace/ui/components/ui-card'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { LucideRefreshCcw } from 'lucide-react'
import { useCallback, useState } from 'react'

export default function ToolsFeatureCreateToken(props: { cluster: Cluster; wallet: Wallet }) {
  const [decimals, setDecimals] = useState<number>(9)
  const [supply, setSupply] = useState<number>(0)
  const [resultMint, setResultMint] = useState<null | string>(null)
  const [resultTx, setResultTx] = useState<null | string>(null)
  const [resultSupply, setResultSupply] = useState<null | string>(null)
  const mutation = useSplTokenCreateTokenMint(props)

  const queryKeypair = useQuery({
    queryFn: () => generateKeyPairSigner(),
    queryKey: ['keypair'],
    refetchOnWindowFocus: false,
  })

  const handleCreateToken = useCallback(async (): Promise<void> => {
    if (!queryKeypair.data) {
      return
    }
    const res = await mutation.mutateAsync({
      decimals,
      mint: queryKeypair.data,
      supply,
    })
    await queryKeypair.refetch()
    setResultMint(res.mint)
    setResultTx(res.signature)
    console.log('Mint', getExplorerUrl({ cluster: props.cluster, path: `/address/${res.mint}` }))
    console.log('TX', getExplorerUrl({ cluster: props.cluster, path: `/tx/${res.signature}` }))
  }, [props.wallet, mutation, props.cluster, queryKeypair])

  return (
    <UiCard backButtonTo="/tools" title="Create Token">
      {resultMint && resultTx ? (
        <div className="flex flex-col gap-6">
          <div>Token created!</div>
          <div>
            <PortfolioUiExplorerButton cluster={props.cluster} label="View Mint" path={`/address/${resultMint}`} />
          </div>
          <div>
            <PortfolioUiExplorerButton cluster={props.cluster} label="View Mint Transaction" path={`/tx/${resultTx}`} />
          </div>
          {resultSupply ? (
            <div>
              <PortfolioUiExplorerButton
                cluster={props.cluster}
                label="View Supply Transaction"
                path={`/tx/${resultSupply}`}
              />
            </div>
          ) : null}
          <Button
            onClick={() => {
              setResultMint(null)
              setResultTx(null)
              setResultSupply(null)
            }}
            variant="default"
          >
            Done
          </Button>
        </div>
      ) : props.wallet.type === 'Derived' ? (
        <div className="flex flex-col gap-6">
          <Field>
            <FieldLabel htmlFor="address">Mint Address</FieldLabel>
            <FieldDescription>The address of the mint</FieldDescription>
            <div className="flex items-center gap-2">
              <Input id="address" readOnly required value={queryKeypair.data?.address} />
              <Button onClick={() => queryKeypair.refetch()} size="icon" variant="outline">
                <LucideRefreshCcw />
              </Button>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="decimals">Decimals</FieldLabel>
            <FieldDescription>The number of decimals for the token</FieldDescription>
            <Input
              id="decimals"
              max={9}
              min={0}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value > 9) {
                  setDecimals(9)
                  return
                }
                if (value < 0) {
                  setDecimals(0)
                  return
                }
                setDecimals(value)
              }}
              placeholder="Decimals"
              required
              step="1"
              type="number"
              value={decimals}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="supply">Mint Supply</FieldLabel>
            <FieldDescription>The amount of tokens to mint after creation</FieldDescription>
            <Input
              id="supply"
              min={0}
              onChange={(e) => setSupply(Number(e.target.value))}
              placeholder="Supply"
              required
              step="1"
              type="number"
              value={supply}
            />
          </Field>

          <Item variant="muted">
            <ItemTitle>Summary</ItemTitle>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Summary</ItemTitle>
              <ItemDescription className="font-mono">Cluster: {getClusterLabel(props.cluster.type)}</ItemDescription>
              <ItemDescription className="font-mono">
                Owner: {ellipsify(props.wallet.publicKey, 6, '...')}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button disabled={!queryKeypair.data} onClick={handleCreateToken}>
                Create Token
              </Button>
            </ItemActions>
          </Item>
        </div>
      ) : (
        <div>
          <p>You can&#39;t mint a token while wallet {props.wallet.name}</p>
          <p>Wallet of type {props.wallet.type} is not derived.</p>
        </div>
      )}
    </UiCard>
  )
}
