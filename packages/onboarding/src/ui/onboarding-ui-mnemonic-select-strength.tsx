import { useTranslation } from '@workspace/i18n'
import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group'

export function OnboardingUiMnemonicSelectStrength({
  setStrength,
  strength,
}: {
  setStrength: (value: MnemonicStrength) => void
  strength: MnemonicStrength
}) {
  const { t } = useTranslation('onboarding')
  return (
    <ToggleGroup
      className="w-full"
      onValueChange={(s) => setStrength(parseInt(s, 10) as MnemonicStrength)}
      type="single"
      value={strength.toString()}
      variant="outline"
    >
      {[128, 256].map((value) => (
        <ToggleGroupItem key={value} value={value.toString()}>
          {t(($) => $.uiMnemonicWords, { words: value === 128 ? 12 : 24 })}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
