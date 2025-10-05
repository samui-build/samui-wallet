import { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group.js'
import { enumOptions } from '../../core/enum-options.js'
import { useOnboarding } from '../data-access/onboarding-provider.js'

export function OnboardingUiMnemonicSelectStrength() {
  const { strength, setStrength } = useOnboarding()
  return (
    <ToggleGroup
      variant="outline"
      className="w-full"
      type="single"
      value={strength}
      onValueChange={(s: MnemonicStrength) => setStrength(s)}
    >
      {enumOptions(MnemonicStrength).map(({ value }) => (
        <ToggleGroupItem key={value} value={value}>
          {value} words
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
