import { StandardConnect, type StandardConnectFeature } from '@wallet-standard/core'
import { getWalletFeature, type UiWallet, type UiWalletAccount } from '@wallet-standard/react'
import {
  getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from '@wallet-standard/ui-registry'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from './ui/button.tsx'

interface ConnectProps {
  wallet: UiWallet
  setAccount: Dispatch<SetStateAction<UiWalletAccount | undefined>>
}

export function Connect({ wallet, setAccount }: ConnectProps) {
  const { connect } = getWalletFeature(wallet, StandardConnect) as StandardConnectFeature[typeof StandardConnect]

  return (
    <Button
      onClick={async () => {
        const response = await connect()
        if (response.accounts[0] === undefined) {
          throw new Error('No account returned from connect')
        }

        setAccount(
          getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(
            getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(wallet),
            response.accounts[0],
          ),
        )
      }}
    >
      Connect
    </Button>
  )
}
