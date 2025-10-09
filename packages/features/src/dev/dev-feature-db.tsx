import { useDbBrowser } from './data-access/db-browser-provider.js'
import { DbBrowser } from './ui/db-browser.js'
import { useSearchParams } from 'react-router'

export function DevFeatureDb() {
  const context = useDbBrowser()
  const [searchParams, setSearchParams] = useSearchParams()
  const table = searchParams.get('table') ?? ''
  const item = searchParams.get('item') ?? ''
  return (
    <DbBrowser
      {...context}
      item={item}
      selectItem={(item) => setSearchParams({ table, item })}
      table={table}
      selectTable={(table) => setSearchParams({ table })}
    />
  )
}
