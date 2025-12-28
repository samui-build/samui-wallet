import type { Address } from '@solana/kit'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import { Button } from '@workspace/ui/components/button'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { Link } from 'react-router'
import type { StakeAccountActions } from './tools-ui-stake-account-action.tsx'
import { ToolsUiStakeAccountGrid } from './tools-ui-stake-account-grid.tsx'

export function ToolsUiStakeAccountsIndex({
  accounts,
  actions,
  authority,
}: {
  accounts: StakeAccount[]
  actions: StakeAccountActions
  authority: Address
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link to="./stake">Stake</Link>
        </Button>
      </div>
      {accounts.length ? (
        <ToolsUiStakeAccountGrid accounts={accounts} actions={actions} authority={authority} />
      ) : (
        <UiEmpty description="No stake accounts found for the active wallet." />
      )}
    </div>
  )
}
