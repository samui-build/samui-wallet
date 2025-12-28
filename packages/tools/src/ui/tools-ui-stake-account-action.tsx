import type { Address } from '@solana/kit'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import { lamportsToSol } from '@workspace/solana-client/lamports-to-sol'
import { Button } from '@workspace/ui/components/button'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { canCloseStakeAccount, canDeactivateStakeAccount } from './tools-ui-stake-utils.ts'

export interface StakeAccountActions {
  close: (account: StakeAccount) => Promise<boolean>
  deactivate: (account: StakeAccount) => Promise<boolean>
  isPending: boolean
}

export function ToolsUiStakeAccountAction({
  account,
  actions,
  authority,
  close,
}: {
  account: StakeAccount
  actions: StakeAccountActions
  authority: Address
  close?: () => Promise<void>
}) {
  if (canCloseStakeAccount(account, authority)) {
    return (
      <UiConfirm
        action={
          close ??
          (async () => {
            await actions.close(account)
          })
        }
        actionLabel="Close"
        actionVariant="destructive"
        description={`Withdraw ${lamportsToSol(account.lamports)} SOL and close ${ellipsify(account.pubkey, 6, '...')}.`}
        title="Close stake account"
        trigger={
          <Button disabled={actions.isPending} size="sm" variant="outline">
            Close
          </Button>
        }
      />
    )
  }

  if (canDeactivateStakeAccount(account, authority)) {
    return (
      <UiConfirm
        action={async () => {
          await actions.deactivate(account)
        }}
        actionLabel="Unstake"
        description={`Deactivate ${lamportsToSol(BigInt(account.data.stake?.delegation.stake ?? 0))} SOL from ${ellipsify(
          account.pubkey,
          6,
          '...',
        )}.`}
        title="Unstake account"
        trigger={
          <Button disabled={actions.isPending} size="sm" variant="outline">
            Unstake
          </Button>
        }
      />
    )
  }

  return <span className="text-muted-foreground">-</span>
}
