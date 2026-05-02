import { Badge } from '@workspace/ui/components/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { UiCard } from '@workspace/ui/components/ui-card'
import { Link } from 'react-router'
import type { DevDbTableConfig } from '../data-access/dev-db-table-config.ts'

export function DevDbUiTableIndex({ configs }: { configs: DevDbTableConfig[] }) {
  return (
    <UiCard title="Database">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table</TableHead>
            <TableHead>Fields</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.map((config) => (
            <TableRow key={config.name}>
              <TableCell className="font-medium">
                <Link className="hover:underline" to={config.name}>
                  {config.label}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {config.listFields.map((field) => (
                    <Badge key={field} variant="outline">
                      {field}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </UiCard>
  )
}
