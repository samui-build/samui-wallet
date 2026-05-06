import { ExplorerUiLinkAddress } from '@workspace/feature-explorer/ui/explorer-ui-link-address'
import type { VoteAccount } from '@workspace/solana-client-react/use-get-vote-accounts'
import { Badge } from '@workspace/ui/components/badge'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { cn } from '@workspace/ui/lib/utils'
import { ToolsUiStakeAccountCardField } from './tools-ui-stake-account-card-field.tsx'
import { formatStakePercent, toBigIntLamports } from './tools-ui-stake-utils.ts'

const LAMPORTS_PER_SOL = 1_000_000_000n
const SOL_FORMATTER = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })

export function ToolsUiStakeCreateValidatorCard({
  className,
  isPreferred,
  showAddressActions = false,
  totalActivatedStake,
  voteAccount,
}: {
  className?: string
  isPreferred: boolean
  showAddressActions?: boolean
  totalActivatedStake: bigint
  voteAccount: VoteAccount
}) {
  return (
    <div className={cn('rounded-md border bg-muted/20 p-3 text-left hover:bg-muted/30', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-muted-foreground text-xs">Validator</div>
          {showAddressActions ? (
            <ExplorerUiLinkAddress
              address={voteAccount.votePubkey}
              basePath="/explorer"
              className="min-w-0 [&>a]:truncate"
              label={ellipsify(voteAccount.votePubkey, 6, '...')}
            />
          ) : (
            <div className="truncate font-mono" title={voteAccount.votePubkey}>
              {ellipsify(voteAccount.votePubkey, 6, '...')}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isPreferred ? <Badge variant="success">Preferred</Badge> : null}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <ToolsUiStakeAccountCardField
          label="Active stake"
          value={`${SOL_FORMATTER.format(Number(toBigIntLamports(voteAccount.activatedStake) / LAMPORTS_PER_SOL))} SOL`}
        />
        <ToolsUiStakeAccountCardField
          label="Network stake"
          value={formatStakePercent(toBigIntLamports(voteAccount.activatedStake), totalActivatedStake)}
        />
      </div>
    </div>
  )
}
