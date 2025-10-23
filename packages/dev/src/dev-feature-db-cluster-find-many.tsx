import type { ClusterInputFindMany } from '@workspace/db/dto/cluster-input-find-many'
import type { ClusterType } from '@workspace/db/entity/cluster-type'

import { useDbClusterFindMany } from '@workspace/db-react/use-db-cluster-find-many'
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

export function DevFeatureDbClusterFindMany() {
  const [input, setInput] = useState<ClusterInputFindMany>({})
  const query = useDbClusterFindMany({ input })

  return (
    <UiCard
      action={<ClusterSelect select={(type: ClusterType | undefined) => setInput({ type })} />}
      title="dbClusterFindMany"
    >
      <pre>{JSON.stringify({ data: query.data, input }, null, 2)}</pre>
    </UiCard>
  )
}

function ClusterSelect({ select }: { select: (type: ClusterType | undefined) => void }) {
  const types: ClusterType[] = ['solana:devnet', 'solana:localnet', 'solana:mainnet', 'solana:testnet']
  return (
    <Select onValueChange={(type: 'all' | ClusterType) => select(type === 'all' ? undefined : type)}>
      <SelectTrigger>
        <SelectValue placeholder="Select a cluster" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cluster</SelectLabel>
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
