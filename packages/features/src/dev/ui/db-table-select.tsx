import { Button } from '@workspace/ui/components/button.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select.js'

interface DbTableSelectProps {
  selectTable: (table: string) => void
  tables: string[]
  table?: string
}

export function DbTableSelect({ selectTable, table, tables }: DbTableSelectProps) {
  return (
    <>
      <div className="md:hidden">
        <Select value={table || undefined} onValueChange={selectTable}>
          <SelectTrigger>
            <SelectValue placeholder="Select a table..." />
          </SelectTrigger>
          <SelectContent>
            {tables?.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <aside className="hidden md:flex md:flex-col md:gap-1">
        {tables.map((name) => (
          <Button
            key={name}
            variant={table === name ? 'secondary' : 'ghost'}
            className="justify-start"
            onClick={() => selectTable(name)}
          >
            {name}
          </Button>
        ))}
      </aside>
    </>
  )
}
