import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { generateMnemonic, MnemonicStrength } from '@workspace/keypair/generate-mnemonic'
import { MnemonicLanguage } from '@workspace/keypair/get-mnemonic-wordlist'

export interface OnboardingProviderContext {
  importMnemonic: (value: string) => void
  language: MnemonicLanguage
  mnemonic: string
  setLanguage: (value: MnemonicLanguage) => void
  setStrength: (value: MnemonicStrength) => void
  strength: MnemonicStrength
}

const Context = createContext<OnboardingProviderContext>({} as OnboardingProviderContext)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [importedMnemonic, setImportMnemonic] = useState<string | undefined>(undefined)
  const [strength, setStrength] = useState<MnemonicStrength>(MnemonicStrength.Single)
  const [language, setLanguage] = useState<MnemonicLanguage>(MnemonicLanguage.English)

  const mnemonic = useMemo(() => {
    return importedMnemonic ? importedMnemonic : generateMnemonic({ language, strength })
  }, [importedMnemonic, language, strength])

  const value: OnboardingProviderContext = {
    importMnemonic: (value) => {
      if ([12, 24].includes(value.split(' ').length)) {
        setImportMnemonic(value)
      }
    },
    language,
    mnemonic,
    setLanguage,
    setStrength,
    strength,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useOnboarding() {
  return useContext(Context)
}
