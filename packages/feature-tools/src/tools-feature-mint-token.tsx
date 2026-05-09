import { UiCard } from '@workspace/ui/components/ui-card'

export default function ToolsFeatureMintToken() {
  return (
    <UiCard backButtonProps={{ className: 'md:hidden' }} backButtonTo="/tools" title="Mint Token">
      Mint Token
    </UiCard>
  )
}
