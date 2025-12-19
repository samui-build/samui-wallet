import type { UiWallet } from '@wallet-standard/react'
import { cn } from '@workspace/ui/lib/utils'
import type { ImgHTMLAttributes } from 'react'

export type WalletUiImg = React.DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

export interface WalletUiIconProps extends WalletUiImg {
  wallet?: Pick<UiWallet, 'icon' | 'name'>
}

export function WalletUiIcon({ className, wallet, ...props }: WalletUiIconProps) {
  if (!wallet) {
    return null
  }

  return (
    <img alt={wallet.name} className={cn('size-6', className)} data-wu="wallet-ui-icon" src={wallet.icon} {...props} />
  )
}
