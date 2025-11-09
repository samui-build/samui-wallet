import { ExtensionOnboardingCreate } from '@/features/shell/extension-onboarding-create.tsx'
import { ExtensionPortfolioIndex } from '@/features/shell/extension-portfolio-index.tsx'
import { useExtensionActiveWallet } from '@/features/shell/use-extension-active-wallet.tsx'

export function ExtensionContent() {
  const { data: active } = useExtensionActiveWallet()

  if (active) {
    return <ExtensionPortfolioIndex />
  }
  return <ExtensionOnboardingCreate />
}
