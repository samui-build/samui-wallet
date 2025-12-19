import { type UiWallet, useWallets } from '@wallet-standard/react'
import {
  useGetSolanaNetworkFromGenesisHash
} from '@workspace/solana-client-react/use-get-solana-network-from-genesis-hash'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useId, useState } from 'react'

export default function DevFeatureSolana() {
  return (
    <div className="space-y-6">
      <DevWallets />
      <DevGenesisHash />
    </div>
  )
}

function DevGenesisHash() {
  const endpointId = useId()
  const mutation = useGetSolanaNetworkFromGenesisHash()
  const [endpoint, setEndpoint] = useState<string>('')

  const options = [
    'https://api.devnet.solana.com',
    'http://localhost:8899',
    'https://api.mainnet-beta.solana.com',
    'https://api.testnet.solana.com',
  ]

  async function submit() {
    if (!endpoint.length) {
      return
    }
    await mutation.mutateAsync(endpoint)
  }

  return (
    <UiCard title="getNetworkFromGenesisHash">
      <div className="space-y-2">
        <div className="space-x-2 space-y-2">
          {options.map((option) => (
            <Button key={option} onClick={() => setEndpoint(option)} variant="outline">
              {option}
            </Button>
          ))}
        </div>
        <div>
          <Label htmlFor={endpointId}>Endpoint</Label>
          <Input
            disabled={mutation.isPending}
            id={endpointId}
            onChange={(e) => {
              setEndpoint(e.target.value)
            }}
            type="url"
            value={endpoint}
          />
          <Button onClick={submit}>Submit</Button>
        </div>
      </div>
      <pre>
        {JSON.stringify(
          {
            //
            data: mutation.data,
            error: mutation.error?.message,
            isError: mutation.isError,
            isPending: mutation.isPending,
          },
          null,
          2,
        )}
      </pre>
    </UiCard>
  )
}

export function useSolanaWallets() {
  return useWallets().filter(({ chains }) => chains.some((chain) => chain.startsWith('solana:')))
}
function DevWallets() {
  const [wallet, setWallet] = useState<UiWallet | null>(null)
  const wallets = useSolanaWallets()

  return (
    <UiCard title="Wallets">
      <div className="space-y-2">
        <div className="space-x-2 space-y-2">
          {wallets.map((item) => (
            <Button
              key={item.name}
              onClick={() => setWallet(item)}
              variant={item.name === wallet?.name ? 'default' : 'outline'}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
      <pre>
        {JSON.stringify(
          {
            wallet,
            wallets: wallets.map((wallet) => ({
              chains: wallet.chains,
              name: wallet.name,
            })),
          },
          null,
          2,
        )}
      </pre>
    </UiCard>
  )
}
