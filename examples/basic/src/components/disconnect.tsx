import { StandardDisconnect, type StandardDisconnectFeature } from '@wallet-standard/core'
import { getWalletFeature, type UiWallet, type UiWalletAccount } from '@wallet-standard/react'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from './ui/button.tsx'

interface DisconnectProps {
  wallet: UiWallet
  setAccount: Dispatch<SetStateAction<UiWalletAccount | undefined>>
}

export function Disconnect({ wallet, setAccount }: DisconnectProps) {
  const { disconnect } = getWalletFeature(
    wallet,
    StandardDisconnect,
  ) as StandardDisconnectFeature[typeof StandardDisconnect]

  return (
    <Button
      onClick={async () => {
        await disconnect()
        setAccount(undefined)
      }}
    >
      Disconnect
    </Button>
  )
}
