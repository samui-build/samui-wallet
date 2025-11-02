import type { DbTableInfo } from '@workspace/db/db-info'

import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { ChevronRightIcon, LucideTable } from 'lucide-react'
import { Link } from 'react-router'

export function DbBrowserUiSidebar({ table, tables }: { table: DbTableInfo | undefined; tables: DbTableInfo[] }) {
  return (
    <div className="space-y-2">
      {tables.map((item) => (
        <Item asChild key={item.name} variant={table === item ? 'muted' : 'outline'}>
          <Link to={`/dev/db/${item.name}`}>
            <ItemMedia variant="icon">
              <LucideTable />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemDescription>{item.count} rows</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ItemActions>
                <ChevronRightIcon className="size-4" />
              </ItemActions>
            </ItemActions>
          </Link>
        </Item>
      ))}
    </div>
  )
}
