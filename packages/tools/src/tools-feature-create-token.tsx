import { type Address, generateKeyPairSigner, type Signature } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { useAccountReadSecretKey } from '@workspace/db-react/use-account-read-secret-key'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { getNetworkLabel } from '@workspace/settings/ui/get-network-label'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'
import type { SplToken2022CreateTokenMint } from '@workspace/solana-client/spl-token-2022-create-token-mint'
import type { SplTokenCreateTokenMint } from '@workspace/solana-client/spl-token-create-token-mint'
import { uiAmountToBigInt } from '@workspace/solana-client/ui-amount-to-big-int'
import { useSplTokenCreateToken2022Mint } from '@workspace/solana-client-react/use-spl-token-create-token-2022-mint'
import { useSplTokenCreateTokenMint } from '@workspace/solana-client-react/use-spl-token-create-token-mint'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Field, FieldDescription, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@workspace/ui/components/item'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useCallback, useId, useState } from 'react'
import { Link, useLocation } from 'react-router'

const SPL_TOKEN_PROGRAM: Record<Address, string> = {
  [TOKEN_PROGRAM_ADDRESS]: 'SPL Token',
  [TOKEN_2022_PROGRAM_ADDRESS]: 'SPL Token 2022',
}

export default function ToolsFeatureCreateToken(props: { account: Account; network: Network }) {
  const { pathname: from } = useLocation()
  const addressId = useId()
  const decimalsId = useId()
  const supplyId = useId()
  const tokenProgramId = useId()
  const closeMintId = useId()
  const permanentDelegateId = useId()
  const [decimals, setDecimals] = useState<number>(9)
  const [supply, setSupply] = useState<number>(1000)
  const [resultMint, setResultMint] = useState<null | Address>(null)
  const [resultTx, setResultTx] = useState<null | Signature>(null)
  const [resultAta, setResultAta] = useState<null | Address>(null)
  const [resultSupply, setResultSupply] = useState<null | Signature>(null)
  const [tokenProgram, setTokenProgram] = useState<Address>(TOKEN_PROGRAM_ADDRESS)
  const [enableCloseMint, setEnableCloseMint] = useState<boolean>(false)
  const [enablePermanentDelegate, setEnablePermanentDelegate] = useState<boolean>(false)
  const mutation = useSplTokenCreateTokenMint(props)
  const mutation2022 = useSplTokenCreateToken2022Mint(props)
  const readSecretKeyMutation = useAccountReadSecretKey()

  const queryKeypair = useQuery({
    queryFn: () => generateKeyPairSigner(),
    queryKey: ['generateKeyPairSigner'],
    refetchOnWindowFocus: false,
  })

  const handleCreateToken = useCallback(async (): Promise<void> => {
    if (!queryKeypair.data) {
      return
    }
    const secretKey = await readSecretKeyMutation.mutateAsync({ id: props.account.id })
    if (!secretKey) {
      throw new Error('Missing account secret key')
    }
    const transactionSigner = await createKeyPairSignerFromJson({ json: secretKey })
    let res: SplTokenCreateTokenMint | SplToken2022CreateTokenMint
    if (tokenProgram === TOKEN_2022_PROGRAM_ADDRESS) {
      const extensions = {
        closeMint: enableCloseMint,
        permanentDelegate: enablePermanentDelegate,
      }
      res = await mutation2022.mutateAsync({
        decimals,
        extensions,
        mint: queryKeypair.data,
        supply: supply > 0 ? uiAmountToBigInt(supply.toString(), decimals) : undefined,
        tokenProgram,
        transactionSigner,
      })
    } else {
      res = await mutation.mutateAsync({
        decimals,
        mint: queryKeypair.data,
        supply: supply > 0 ? uiAmountToBigInt(supply.toString(), decimals) : undefined,
        tokenProgram,
        transactionSigner,
      })
    }

    await queryKeypair.refetch()
    setResultMint(res.mint)
    setResultTx(res.signatureCreate)
    if (res.signatureSupply) {
      setResultSupply(res.signatureSupply)
    }
    if (res.ata) {
      setResultAta(res.ata)
    }
  }, [
    mutation,
    props.account,
    queryKeypair,
    decimals,
    supply,
    readSecretKeyMutation,
    tokenProgram,
    enableCloseMint,
    enablePermanentDelegate,
    mutation2022,
  ])

  return (
    <UiCard backButtonTo="/tools" title="Create Token">
      {resultMint && resultTx ? (
        <div className="flex flex-col gap-6">
          <div>Token created!</div>
          <div className="space-x-2">
            <Button asChild variant="secondary">
              <Link state={{ from }} to={`/explorer/address/${resultMint}`}>
                View Mint
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link state={{ from }} to={`/explorer/tx/${resultTx}`}>
                View Mint Transaction
              </Link>
            </Button>
            {resultAta ? (
              <Button asChild variant="secondary">
                <Link state={{ from }} to={`/explorer/address/${resultAta}`}>
                  View Token Account
                </Link>
              </Button>
            ) : null}
            {resultSupply ? (
              <Button asChild variant="secondary">
                <Link state={{ from }} to={`/explorer/tx/${resultSupply}`}>
                  View Supply Transaction
                </Link>
              </Button>
            ) : null}
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setResultMint(null)
                setResultTx(null)
                setResultAta(null)
                setResultSupply(null)
              }}
              variant="default"
            >
              Done
            </Button>
          </div>
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

          <Field>
            <FieldLabel htmlFor={tokenProgramId}>Token Program</FieldLabel>
            <FieldDescription>Select the token program to use</FieldDescription>
            <Select
              onValueChange={(value: Address) => {
                setTokenProgram(value)
                if (value === TOKEN_PROGRAM_ADDRESS) {
                  setEnableCloseMint(false)
                  setEnablePermanentDelegate(false)
                }
              }}
              value={tokenProgram}
            >
              <SelectTrigger id={tokenProgramId}>
                <SelectValue placeholder="Select token program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TOKEN_PROGRAM_ADDRESS}>{SPL_TOKEN_PROGRAM[TOKEN_PROGRAM_ADDRESS]}</SelectItem>
                <SelectItem value={TOKEN_2022_PROGRAM_ADDRESS}>
                  {SPL_TOKEN_PROGRAM[TOKEN_2022_PROGRAM_ADDRESS]}
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {tokenProgram === TOKEN_2022_PROGRAM_ADDRESS ? (
            <Field>
              <FieldLabel>Token Extensions</FieldLabel>
              <FieldDescription>Enable optional extensions for Token 2022</FieldDescription>
              <div className="mt-2 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={enableCloseMint}
                      id={closeMintId}
                      onCheckedChange={(checked) => setEnableCloseMint(checked === true)}
                    />
                    <label
                      className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor={closeMintId}
                    >
                      Close Mint
                    </label>
                  </div>
                  <p className="ml-6 text-muted-foreground text-xs">
                    Allow the mint account to be closed and rent reclaimed
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={enablePermanentDelegate}
                      id={permanentDelegateId}
                      onCheckedChange={(checked) => setEnablePermanentDelegate(checked === true)}
                    />
                    <label
                      className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor={permanentDelegateId}
                    >
                      Permanent Delegate
                    </label>
                  </div>
                  <p className="ml-6 text-muted-foreground text-xs">
                    Allow a permanent delegate with unlimited authority over any token account
                  </p>
                </div>
              </div>
            </Field>
          ) : null}

          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Summary</ItemTitle>
              <ItemDescription className="font-mono">Network: {getNetworkLabel(props.network.type)}</ItemDescription>
              <ItemDescription className="font-mono">
                Owner: {ellipsify(props.account.publicKey, 6, '...')}
              </ItemDescription>
              <ItemDescription className="font-mono">Decimals: {decimals}</ItemDescription>
              <ItemDescription className="font-mono">Supply: {supply}</ItemDescription>
              <ItemDescription className="font-mono">
                Token Program:{' '}
                {tokenProgram === TOKEN_PROGRAM_ADDRESS
                  ? SPL_TOKEN_PROGRAM[TOKEN_PROGRAM_ADDRESS]
                  : SPL_TOKEN_PROGRAM[TOKEN_2022_PROGRAM_ADDRESS]}
              </ItemDescription>
              {tokenProgram === TOKEN_2022_PROGRAM_ADDRESS && (enableCloseMint || enablePermanentDelegate) ? (
                <ItemDescription className="font-mono">
                  Extensions:{' '}
                  {[enableCloseMint && 'Close Mint', enablePermanentDelegate && 'Permanent Delegate']
                    .filter(Boolean)
                    .join(', ')}
                </ItemDescription>
              ) : null}
            </ItemContent>
          </Item>
          <ItemActions className="justify-end">
            <Button disabled={!queryKeypair.data || mutation.isPending} onClick={handleCreateToken}>
              {mutation.isPending ? <UiLoader className="size-4" /> : null}
              Create Token
            </Button>
          </ItemActions>
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
