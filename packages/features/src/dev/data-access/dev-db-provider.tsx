import { createContext, type ReactNode, useContext, useState } from 'react'
import { Db, dbConnect } from '@workspace/db/db-connect'
import { tryCatch } from '@workspace/core/try-catch'

export interface DevDbProviderContext {
  tables: string[]
  db?: Db
  connect: () => Promise<boolean>
  connected: boolean
}

const Context = createContext<DevDbProviderContext>({} as DevDbProviderContext)

export function DevDbProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Db | undefined>(undefined)
  const value: DevDbProviderContext = {
    tables: ['table1', 'table2'],
    db,
    connect: async () => {
      const { data, error } = await tryCatch(dbConnect())
      if (error) {
        console.error(error)
        return false
      }
      setDb(data)
      return true
    },
    connected: !!db,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useDevDb() {
  return useContext(Context)
}
