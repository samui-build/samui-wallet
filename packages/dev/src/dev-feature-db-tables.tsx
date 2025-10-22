import { db } from '@workspace/db/db'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { useMemo } from 'react'

export function DevFeatureDbTables() {
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
