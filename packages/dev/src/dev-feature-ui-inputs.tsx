import { UiCard } from '@workspace/ui/components/ui-card'
import { DevFeatureUiInputsSolanaAddress } from './dev-feature-ui-inputs-solana-address.tsx'
import { DevFeatureUiInputsSolanaAddresses } from './dev-feature-ui-inputs-solana-addresses.tsx'

export function DevFeatureUiInputs() {
  return (
    <UiCard title="ui inputs">
      <div className="space-y-2 md:space-y-6">
        <DevFeatureUiInputsSolanaAddress />
        <DevFeatureUiInputsSolanaAddresses />
      </div>
    </UiCard>
  )
}
