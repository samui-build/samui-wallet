import type { WalletType } from '@workspace/db/entity/wallet-type'
import type { UiIconLucide } from '@workspace/ui/components/ui-icon'

import { UiIcon } from '@workspace/ui/components/ui-icon'
import { LucideEye, LucideImport, LucideLetterText } from 'lucide-react'

export function WalletUiIcon({ type }: { type: WalletType }) {
  return <UiIcon className="size-4" icon={getWalletUiIcon(type)} />
}
function getWalletUiIcon(type: WalletType): UiIconLucide {
  switch (type) {
    case 'Derived':
      return LucideLetterText
    case 'Imported':
      return LucideImport
    case 'Watched':
      return LucideEye
  }
}
