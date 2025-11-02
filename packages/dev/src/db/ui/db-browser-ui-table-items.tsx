import type { DbTableInfo } from '@workspace/db/db-info'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'

export function DbBrowserUiTableItems({
  items,
  table,
}: {
  items: { id: string } & Record<string, unknown>[]
  table: DbTableInfo
}) {
  return <DynamicTable items={items} table={table} />
}

function DynamicField({ type, value }: { type: string; value: Date | string | unknown }) {
  if (!value) {
    return '[empty]'
  }
  switch (type) {
    case 'date':
      return new Date(value.toString()).toLocaleTimeString()
  }
  return <div>{value?.toString()}</div>
}

function DynamicTable({ items, table }: { items: { id: string } & Record<string, unknown>[]; table: DbTableInfo }) {
  const shape = Object.entries(table.schema.item.shape)
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {shape.map(([col]) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id?.toString()}>
              {shape.map(([col, shape]) => (
                <TableCell key={col}>
                  <DynamicField type={shape.type} value={item[col]} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
