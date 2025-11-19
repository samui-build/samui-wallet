import type { NetworkFindManyInput } from '@workspace/db/network/network-find-many-input'
import type { NetworkType } from '@workspace/db/network/network-type'

import { useDbNetworkFindMany } from '@workspace/db-react/use-db-network-find-many'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useState } from 'react'

export function DevFeatureDbNetworkFindMany() {
  const [input, setInput] = useState<NetworkFindManyInput>({})
  const query = useDbNetworkFindMany({ input })

  return (
    <UiCard
      action={<NetworkSelect select={(type: NetworkType | undefined) => setInput({ type })} />}
      title="networkFindMany"
    >
      <pre>{JSON.stringify({ data: query.data, input }, null, 2)}</pre>
    </UiCard>
  )
}

function NetworkSelect({ select }: { select: (type: NetworkType | undefined) => void }) {
  const types: NetworkType[] = ['solana:devnet', 'solana:localnet', 'solana:mainnet', 'solana:testnet']
  return (
    <Select onValueChange={(type: 'all' | NetworkType) => select(type === 'all' ? undefined : type)}>
      <SelectTrigger>
        <SelectValue placeholder="Select a network" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Network</SelectLabel>
          <SelectItem value="all">All</SelectItem>
          {types.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
