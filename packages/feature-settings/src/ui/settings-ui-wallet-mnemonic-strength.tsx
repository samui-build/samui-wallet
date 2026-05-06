import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'

export function SettingsUiWalletMnemonicStrength({
  setStrength,
  strength,
}: {
  setStrength: (strength: 128 | 256) => void
  strength: 128 | 256
}) {
  return (
    <ButtonGroup>
      <Button onClick={() => setStrength(128)} variant={strength === 128 ? 'secondary' : 'outline'}>
        12
      </Button>
      <Button onClick={() => setStrength(256)} variant={strength === 256 ? 'secondary' : 'outline'}>
        24
      </Button>
    </ButtonGroup>
  )
}
