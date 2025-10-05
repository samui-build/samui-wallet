import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'

import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group.js'

import { useOnboarding } from '../data-access/onboarding-provider.js'

export function OnboardingUiMnemonicSelectStrength() {
  const { setStrength, strength } = useOnboarding()
  return (
    <ToggleGroup
      className="w-full"
      onValueChange={(s) => setStrength(parseInt(s) as MnemonicStrength)}
      type="single"
      value={strength.toString()}
      variant="outline"
    >
      {[128, 256].map((value) => (
        <ToggleGroupItem key={value} value={value.toString()}>
          {value} words
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
