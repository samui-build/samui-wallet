import { db } from '@workspace/db/db'
import { useMemo } from 'react'

export function useDbTables() {
  return useMemo(() => db.tables.map((table) => table.name), [db])
}
