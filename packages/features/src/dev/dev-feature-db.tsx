import { Button } from '@workspace/ui/components/button.js'
import { useDevDb } from './data-access/dev-db-provider.js'

export function DevFeatureDb() {
  const { tables, connected, connect } = useDevDb()
  function test(table: string) {
    console.log(`Test table ${table}`)
  }
  return (
    <div>
      <div className="flex justify-between">
        <div className="text-lg">Database</div>
        {connected ? <Button disabled>Connected</Button> : <Button onClick={connect}>Connect</Button>}
      </div>
      <div>
        <div>
          {tables.map((table) => (
            <div key={table} className="text-sm">
              {table}
              <Button variant="outline" onClick={() => test(table)}>
                Test
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
