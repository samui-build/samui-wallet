import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'

import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group'

export function OnboardingUiMnemonicSelectStrength({
  setStrength,
  strength,
}: {
  setStrength: (value: MnemonicStrength) => void
  strength: MnemonicStrength
}) {
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
          {value === 128 ? '12' : '24'} words
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
