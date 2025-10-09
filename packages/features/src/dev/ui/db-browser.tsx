import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card.js'
import { DbTableSelect } from './db-table-select.js'
import { DbTableDetail } from './db-table-detail.js'
import { DbBrowserEmpty } from './db-browser-empty.js'
import { DbBrowserContext } from '../data-access/db-browser-provider.js'
import { useMemo } from 'react'

export interface DbBrowserProps extends DbBrowserContext {
  item?: string
  table?: string
  selectItem: (item: string) => void
  selectTable: (table: string) => void
}

export function DbBrowser({ item, table, selectItem, selectTable, ...context }: DbBrowserProps) {
  const headers = useMemo(() => context.tableHeaders(table ?? ''), [context, table])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Browser</CardTitle>
        <CardDescription>Select a table from the sidebar to view and manage its data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] md:gap-6">
          <DbTableSelect table={table} tables={context.tables} selectTable={selectTable} />
          <main className="mt-6 md:mt-0">
            {table ? (
              <DbTableDetail {...context} headers={headers} table={table} item={item} selectItem={selectItem} />
            ) : (
              <DbBrowserEmpty />
            )}
          </main>
        </div>
      </CardContent>
    </Card>
  )
}
