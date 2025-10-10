import type { DbClusterFindManyInput } from '@workspace/db/db-cluster-find-many'
import type { ClusterType } from '@workspace/db/entity/cluster-type'

import { useDbClusterFindMany } from '@workspace/db-react/use-db-cluster-find-many'
import { db } from '@workspace/db/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card.js'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select.js'
import { useMemo, useState } from 'react'

export default function DevRoutes() {
  return (
    <div className="space-y-6">
      <DevDbTables />
      <DevDbClusterFindMany />
    </div>
  )
}

function DevClusterSelect({ select }: { select: (type: ClusterType | undefined) => void }) {
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
function DevDbClusterFindMany() {
  const [input, setInput] = useState<DbClusterFindManyInput>({})
  const query = useDbClusterFindMany({ input })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>dbClusterFindMany</div>
          <DevClusterSelect select={(type: ClusterType | undefined) => setInput({ type })} />
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <pre>{JSON.stringify({ data: query.data, input }, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}

function DevDbTables() {
  const tables = useMemo(() => db.tables.map((table) => table.name), [db])

  return (
    <Card>
      <CardHeader>
        <CardTitle>db tables</CardTitle>
      </CardHeader>
      <CardContent>
        <pre>{JSON.stringify(tables, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}
