import { useSignIn } from '@solana/react'
import type { SolanaSignInInput } from '@solana/wallet-standard-features'
import type { UiWallet, UiWalletAccount } from '@wallet-standard/react'
import type { Network } from '@workspace/db/network/network'
import type { NetworkType } from '@workspace/db/network/network-type'
import { Button } from '@workspace/ui/components/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { Spinner } from '@workspace/ui/components/spinner'
import { LucideKey } from 'lucide-react'
import { type MouseEvent, type SyntheticEvent, useCallback, useMemo, useState } from 'react'

function PlaygroundUiPayload({
  data,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  label?: string
}) {
  return (
    <pre className="text-muted-foreground text-xs">
      {label ? `${label}: ` : ''}
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

const now = new Date()
const expiresAtSeconds = 10

function useSignInPayload({
  account,
  networkType,
  statement,
}: {
  account: UiWalletAccount
  networkType: NetworkType
  statement: string
}) {
  // https://github.com/phantom/sign-in-with-solana?tab=readme-ov-file#sign-in-input-fields
  const url = new URL(window.location.href)
  const domain = url.host
  const uri = url.origin
  const address = account.address
  const version = '1'
  const chainId = networkType
  const nonce = '12345678ABCDEFGH'
  const issuedAt = now.toISOString()
  const expirationTime = new Date(now.getTime() + expiresAtSeconds * 1000).toISOString()
  const notBefore = now.toISOString()
  const requestId = Math.random().toString().slice(2)
  const resources: string[] = useMemo(() => [`${uri}/foo`, `${uri}/bar`, `${uri}/baz`], [uri])

  const payload: SolanaSignInInput = useMemo(() => {
    return {
      address,
      chainId,
      domain,
      expirationTime,
      issuedAt,
      nonce,
      notBefore,
      requestId,
      resources: resources.length ? resources : [],
      statement,
      uri,
      version,
    }
  }, [
    address,
    uri,
    domain,
    networkType,
    version,
    chainId,
    nonce,
    issuedAt,
    expirationTime,
    notBefore,
    requestId,
    resources,
    statement,
  ])

  return {
    payload,
  }
}

export function PlaygroundUiWalletFeatureSignIn({
  account,
  network,
  onError,
  onSuccess,
  wallet,
}: {
  account: UiWalletAccount
  network: Network
  onError(err: unknown): void
  onSuccess(account: UiWalletAccount | undefined): void
  wallet: UiWallet
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState<string>('We hope you enjoy your stay!')
  const { payload } = useSignInPayload({ account, networkType: network.type, statement: text })
  const signIn = useSignIn(wallet)

  const handleSignInClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault()
      try {
        setIsLoading(true)
        try {
          const { account } = await signIn(payload)
          onSuccess(account)
        } finally {
          setIsLoading(false)
        }
      } catch (e) {
        onError(e)
      }
    },
    [signIn, onSuccess, onError, payload],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Test the Sign In feature</CardDescription>
        <CardAction>
          <Button disabled={isLoading} onClick={handleSignInClick} size="lg" variant="outline">
            {isLoading ? <Spinner /> : <LucideKey />}
            Sign in
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          onChange={(e: SyntheticEvent<HTMLInputElement>) => setText(e.currentTarget.value)}
          placeholder="Write the sign in statement"
          value={text}
        />

        <PlaygroundUiPayload data={payload} label="Sign In Payload" />
      </CardContent>
    </Card>
  )
}
