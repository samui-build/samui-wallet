import type { ClusterInputFindMany } from '@workspace/db/dto/cluster-input-find-many'
import type { ClusterType } from '@workspace/db/entity/cluster-type'

import { useDbClusterFindMany } from '@workspace/db-react/use-db-cluster-find-many'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { useState } from 'react'

export function DevFeatureDbClusterFindMany() {
  const [input, setInput] = useState<ClusterInputFindMany>({})
  const query = useDbClusterFindMany({ input })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>dbClusterFindMany</div>
          <ClusterSelect select={(type: ClusterType | undefined) => setInput({ type })} />
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <pre>{JSON.stringify({ data: query.data, input }, null, 2)}</pre>
      </CardContent>
    </Card>
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
