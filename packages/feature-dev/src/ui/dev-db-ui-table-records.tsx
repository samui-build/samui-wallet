import type { DbRecord } from '@workspace/db/db-table-metadata'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import type { DevDbTableConfig } from '../data-access/dev-db-table-config.ts'
import { formatDevDbFieldLabel } from './dev-db-ui-format.ts'
import { DevDbUiTableRecordField } from './dev-db-ui-table-record-field.tsx'

export function DevDbUiTableRecords({ config, items }: { config: DevDbTableConfig; items: DbRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {config.listFields.map((field) => (
            <TableHead key={field}>{formatDevDbFieldLabel(field)}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            {config.listFields.map((field, index) => (
              <TableCell className="max-w-64 overflow-hidden text-ellipsis" key={field}>
                <DevDbUiTableRecordField field={field} item={item} to={index === 0 ? item.id : null} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
