import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'
import type { ReactNode } from 'react'

import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { createContext, useContext, useMemo, useState } from 'react'

export interface OnboardingProviderContext {
  importMnemonic: (value: string) => void
  mnemonic: string
  setStrength: (value: MnemonicStrength) => void
  strength: MnemonicStrength
}

const Context = createContext<OnboardingProviderContext>({} as OnboardingProviderContext)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [importedMnemonic, setImportMnemonic] = useState<string | undefined>(undefined)
  const [strength, setStrength] = useState<MnemonicStrength>(128)

  const mnemonic = useMemo(() => {
    return importedMnemonic ? importedMnemonic : generateMnemonic({ strength })
  }, [importedMnemonic, strength])

  const value: OnboardingProviderContext = {
    importMnemonic: (value) => {
      if ([12, 24].includes(value.split(' ').length)) {
        setImportMnemonic(value)
      }
    },
    mnemonic,
    setStrength,
    strength,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useOnboarding() {
  return useContext(Context)
}
