import type { DbTableInfo } from '@workspace/db/db-info'

import { useDbInfo } from '@workspace/db-react/use-db-info'
import { useDbItems } from '@workspace/db-react/use-db-items'
import { Spinner } from '@workspace/ui/components/spinner'
import { useParams } from 'react-router'

import { DbBrowserUiEmpty } from './db/ui/db-browser-ui-empty.js'
import { DbBrowserUiSidebar } from './db/ui/db-browser-ui-sidebar.js'
import { DbBrowserUiTableBrowser } from './db/ui/db-browser-ui-table-browser.js'

export default function DevFeatureDb() {
  const params = useParams() as { '*': string }
  const infoQuery = useDbInfo()
  const tables: DbTableInfo[] = infoQuery.data ?? []
  const table = tables.find((i) => i.name === params['*'])
  const itemsQuery = useDbItems(table?.name)
  const items: { id: string } & Record<string, unknown>[] = (itemsQuery.data ?? []) as { id: string } & Record<
    string,
    unknown
  >[]

  if (infoQuery.isLoading || itemsQuery.isLoading) {
    return <Spinner />
  }

  return (
    <div className="grid grid-cols-4 gap-2 h-full">
      <div className="col-span-1 h-full">
        <DbBrowserUiSidebar table={table} tables={tables} />
      </div>
      <div className="col-span-3  h-full overflow-auto">
        {table ? <DbBrowserUiTableBrowser items={items} table={table} /> : <DbBrowserUiEmpty />}
      </div>
    </div>
  )
}
