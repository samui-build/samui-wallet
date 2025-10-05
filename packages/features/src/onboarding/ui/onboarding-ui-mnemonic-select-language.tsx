import { MnemonicLanguage } from '@workspace/keypair/get-mnemonic-wordlist'
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group.js'
import { enumOptions } from '../../core/enum-options.js'
import { useOnboarding } from '../data-access/onboarding-provider.js'

export function OnboardingUiMnemonicSelectLanguage() {
  const { language, setLanguage } = useOnboarding()
  return (
    <ToggleGroup
      variant="outline"
      className="w-full"
      type="single"
      value={language}
      onValueChange={(s: MnemonicLanguage) => setLanguage(s)}
    >
      {enumOptions(MnemonicLanguage).map(({ name, value }) => (
        <ToggleGroupItem key={value} value={value}>
          {name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
