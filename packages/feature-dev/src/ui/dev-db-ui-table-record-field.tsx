import type { DbRecord } from '@workspace/db/db-table-metadata'
import { Link } from 'react-router'
import { DevDbUiTableRecordFieldValue } from './dev-db-ui-table-record-field-value.tsx'

export function DevDbUiTableRecordField({
  field,
  item,
  to,
}: {
  field: string
  item: DbRecord
  to?: string | null | undefined
}) {
  const value = <DevDbUiTableRecordFieldValue field={field} item={item} />

  return to ? (
    <Link className="hover:underline" to={to}>
      {value}
    </Link>
  ) : (
    value
  )
}
