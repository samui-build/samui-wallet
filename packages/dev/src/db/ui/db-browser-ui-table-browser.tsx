import type { DbTableInfo } from '@workspace/db/db-info'

import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { LucidePlus } from 'lucide-react'

import { DbBrowserUiTableItems } from './db-browser-ui-table-items.js'

export function DbBrowserUiTableBrowser({
  items,
  table,
}: {
  items: { id: string } & Record<string, unknown>[]
  table: DbTableInfo
}) {
  return (
    <UiCard
      action={
        <Button
          onClick={() => {
            console.log(`ADD TO TABLE ${table?.name}`)
          }}
          variant="outline"
        >
          <LucidePlus /> Add
        </Button>
      }
      cardProps={{
        className: 'h-full overflow-auto pb-0',
      }}
      contentProps={{
        className: 'h-full overflow-auto',
      }}
      description={`${table.count} rows`}
      title={table.name}
    >
      <DbBrowserUiTableItems items={items} table={table} />
    </UiCard>
  )
}
