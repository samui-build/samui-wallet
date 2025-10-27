import type { Preference } from '@workspace/db/entity/preference'
import type { PreferenceKey } from '@workspace/db/entity/preference-key'
import type { ReactNode } from 'react'

import { useDbPreferenceLive } from '@workspace/db-react/use-db-preference-live'
import { Spinner } from '@workspace/ui/components/spinner'
import { createContext, useContext } from 'react'

export type PreferenceMap = Record<PreferenceKey, Preference>
export interface PreferencesProviderContext {
  preferenceMap: PreferenceMap
  preferences: Preference[]
}

const Context = createContext<PreferencesProviderContext>({} as PreferencesProviderContext)

export function PreferencesProvider({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const preferences = useDbPreferenceLive()

  if (!preferences.length) {
    return fallback ?? <Spinner />
  }

  const value: PreferencesProviderContext = {
    preferenceMap: getPreferenceMap(preferences),
    preferences,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function usePreference(key: PreferenceKey) {
  const { preferenceMap } = usePreferences()

  return preferenceMap[key] ?? ''
}

export function usePreferences() {
  return useContext(Context)
}

export function usePreferenceValue(key: PreferenceKey) {
  const { preferenceMap } = usePreferences()

  return preferenceMap[key]?.value ?? ''
}

function getPreferenceMap(prefs: Preference[]): PreferenceMap {
  return prefs.reduce((acc, curr) => {
    return { ...acc, [curr.key]: curr }
  }, {} as PreferenceMap)
}
