import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'
import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import { useEffect, useReducer } from 'react'

interface State {
  error?: Error | undefined
  success: boolean
}

type Action = { type: 'migrating' } | { type: 'migrated'; payload: true } | { type: 'error'; payload: Error }
export const useMigrations = (
  db: ExpoSQLiteDatabase<any>,
  migrations: {
    journal: {
      entries: { idx: number; when: number; tag: string; breakpoints: boolean }[]
    }
    migrations: Record<string, string>
  },
): State => {
  const initialState: State = {
    error: undefined,
    success: false,
  }

  const fetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'migrating': {
        return { ...initialState }
      }
      case 'migrated': {
        return { ...initialState, success: action.payload }
      }
      case 'error': {
        return { ...initialState, error: action.payload }
      }
      default: {
        return state
      }
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, initialState)

  // biome-ignore lint/correctness/useExhaustiveDependencies: it should only run once
  useEffect(() => {
    dispatch({ type: 'migrating' })
    migrate(db, migrations as any)
      .then(() => {
        dispatch({ payload: true, type: 'migrated' })
      })
      .catch((error) => {
        dispatch({ payload: error as Error, type: 'error' })
      })
  }, [])

  return state
}
