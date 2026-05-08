import type { AppContext } from '@workspace/context/app-context'
import { useContext } from 'react'
import { AppContextReact } from './app-context-provider.tsx'

export function useAppContext(): AppContext {
  const value = useContext(AppContextReact)
  if (!value) {
    throw new Error('AppContextProvider is missing')
  }
  return value
}
