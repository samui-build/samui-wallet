import type { Address } from '@solana/kit'
import { ExplorerUiLinkAddress } from '@workspace/explorer/ui/explorer-ui-link-address'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import { lamportsToSol } from '@workspace/solana-client/lamports-to-sol'
import { Badge } from '@workspace/ui/components/badge'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { Link } from 'react-router'
import { type StakeAccountActions, ToolsUiStakeAccountAction } from './tools-ui-stake-account-action.tsx'
import { ToolsUiStakeAccountCardField } from './tools-ui-stake-account-card-field.tsx'
import { formatStakeSol, getStakeAccountBadgeVariant, getStakeAccountStatus } from './tools-ui-stake-utils.ts'

export function ToolsUiStakeAccountGrid({
  accounts,
  actions,
  authority,
}: {
  accounts: StakeAccount[]
  actions: StakeAccountActions
  authority: Address
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {accounts
        .toSorted((left, right) => left.pubkey.toString().localeCompare(right.pubkey.toString()))
        .map((account) => (
          <div className="flex min-w-0 flex-col rounded-md border bg-muted/20 p-3" key={account.pubkey}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-muted-foreground text-xs">Account</div>
                <Link
                  className="block truncate font-mono text-primary text-sm hover:underline"
                  to={`./${account.pubkey}`}
                >
                  {ellipsify(account.pubkey, 6, '...')}
                </Link>
              </div>
              <Badge variant={getStakeAccountBadgeVariant(account)}>{getStakeAccountStatus(account)}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <ToolsUiStakeAccountCardField label="Stake" value={`${formatStakeSol(account)} SOL`} />
              <ToolsUiStakeAccountCardField label="Balance" value={`${lamportsToSol(account.lamports)} SOL`} />
              <ToolsUiStakeAccountCardField
                className="col-span-2"
                label="Validator"
                value={
                  <div className="min-w-0">
                    {account.data.stake ? (
                      <ExplorerUiLinkAddress
                        address={account.data.stake.delegation.voter}
                        basePath="/explorer"
                        className="min-w-0 [&>a]:truncate"
                        label={ellipsify(account.data.stake.delegation.voter, 6, '...')}
                      />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                }
              />
            </div>
            <div className="mt-4 flex justify-end">
              <ToolsUiStakeAccountAction account={account} actions={actions} authority={authority} />
            </div>
          </div>
        ))}
    </div>
  )
}
