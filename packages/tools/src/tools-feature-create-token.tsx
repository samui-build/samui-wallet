import { generateKeyPairSigner } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import type { Account } from '@workspace/db/entity/account'
import type { Network } from '@workspace/db/entity/network'
import { PortfolioUiExplorerButton } from '@workspace/portfolio/ui/portfolio-ui-explorer-button'
import { getNetworkLabel } from '@workspace/settings/ui/get-network-label'
import { getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { useSplTokenCreateTokenMint } from '@workspace/solana-client-react/use-spl-token-create-token-mint'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldDescription, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@workspace/ui/components/item'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useCallback, useId, useState } from 'react'

export default function ToolsFeatureCreateToken(props: { account: Account; network: Network }) {
  const addressId = useId()
  const decimalsId = useId()
  const supplyId = useId()
  const [decimals, setDecimals] = useState<number>(9)
  const [supply, setSupply] = useState<number>(0)
  const [resultMint, setResultMint] = useState<null | string>(null)
  const [resultTx, setResultTx] = useState<null | string>(null)
  const [resultSupply, setResultSupply] = useState<null | string>(null)
  const mutation = useSplTokenCreateTokenMint(props)

  const queryKeypair = useQuery({
    queryFn: () => generateKeyPairSigner(),
    queryKey: ['generateKeyPairSigner'],
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
    console.log('Mint', getExplorerUrl({ network: props.network, path: `/address/${res.mint}` }))
    console.log('TX', getExplorerUrl({ network: props.network, path: `/tx/${res.signature}` }))
  }, [mutation, props.network, queryKeypair, decimals, supply])

  return (
    <UiCard backButtonTo="/tools" title="Create Token">
      {resultMint && resultTx ? (
        <div className="flex flex-col gap-6">
          <div>Token created!</div>
          <div>
            <PortfolioUiExplorerButton label="View Mint" network={props.network} path={`/address/${resultMint}`} />
          </div>
          <div>
            <PortfolioUiExplorerButton label="View Mint Transaction" network={props.network} path={`/tx/${resultTx}`} />
          </div>
          {resultSupply ? (
            <div>
              <PortfolioUiExplorerButton
                label="View Supply Transaction"
                network={props.network}
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
      ) : props.account.type === 'Derived' ? (
        <div className="flex flex-col gap-6">
          <Field>
            <FieldLabel htmlFor={addressId}>Mint Address</FieldLabel>
            <FieldDescription>The address of the mint</FieldDescription>
            <div className="flex items-center gap-2">
              <Input id={addressId} readOnly required value={queryKeypair.data?.address} />
              <Button onClick={() => queryKeypair.refetch()} size="icon" variant="outline">
                <UiIcon icon="refresh" />
              </Button>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor={decimalsId}>Decimals</FieldLabel>
            <FieldDescription>The number of decimals for the token</FieldDescription>
            <Input
              id={decimalsId}
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
            <FieldLabel htmlFor={supplyId}>Mint Supply</FieldLabel>
            <FieldDescription>The amount of tokens to mint after creation</FieldDescription>
            <Input
              id={supplyId}
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
              <ItemDescription className="font-mono">Network: {getNetworkLabel(props.network.type)}</ItemDescription>
              <ItemDescription className="font-mono">
                Owner: {ellipsify(props.account.publicKey, 6, '...')}
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
          <p>You can&#39;t mint a token while account {props.account.name}</p>
          <p>Account of type {props.account.type} is not derived.</p>
        </div>
      )}
    </UiCard>
  )
}
