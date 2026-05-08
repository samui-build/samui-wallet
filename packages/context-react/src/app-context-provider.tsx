import type { AppContext } from '@workspace/context/app-context'
import { createContext, type ReactNode } from 'react'

export const AppContextReact = createContext<AppContext | null>(null)

export function AppContextProvider({ children, ctx }: { children: ReactNode; ctx: AppContext }) {
  return <AppContextReact.Provider value={ctx}>{children}</AppContextReact.Provider>
}
