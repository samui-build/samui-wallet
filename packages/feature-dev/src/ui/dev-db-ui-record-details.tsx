import type { DbRecord } from '@workspace/db/db-table-metadata'
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table'
import type { DevDbTableConfig } from '../data-access/dev-db-table-config.ts'
import { formatDevDbFieldLabel } from './dev-db-ui-format.ts'
import { DevDbUiTableRecordFieldValue } from './dev-db-ui-table-record-field-value.tsx'

export function DevDbUiRecordDetails({ config, item }: { config: DevDbTableConfig; item: DbRecord }) {
  const fields = config.detailFields ?? Object.keys(item).sort()

  return (
    <Table>
      <TableBody>
        {fields.map((field) => (
          <TableRow key={field}>
            <TableCell className="w-48 font-medium">{formatDevDbFieldLabel(field)}</TableCell>
            <TableCell className="max-w-0 overflow-hidden text-ellipsis">
              <DevDbUiTableRecordFieldValue field={field} item={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
