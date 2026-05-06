import type { Address } from '@solana/kit'
import { ExplorerUiLinkAddress } from '@workspace/feature-explorer/ui/explorer-ui-link-address'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import { lamportsToSol } from '@workspace/solana-client/lamports-to-sol'
import { Badge } from '@workspace/ui/components/badge'
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table'
import { UiBackButton } from '@workspace/ui/components/ui-back-button'
import type { ReactNode } from 'react'
import { type StakeAccountActions, ToolsUiStakeAccountAction } from './tools-ui-stake-account-action.tsx'
import {
  formatDeactivationEpoch,
  formatStakeSol,
  getStakeAccountBadgeVariant,
  getStakeAccountStatus,
} from './tools-ui-stake-utils.ts'

export function ToolsUiStakeAccountDetail({
  account,
  actions,
  authority,
  close,
}: {
  account: StakeAccount
  actions: StakeAccountActions
  authority: Address
  close: () => Promise<void>
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <UiBackButton aria-label="Back to stake accounts" to="/tools/stake/accounts" />
          <div>
            <div className="text-muted-foreground text-sm">Stake account</div>
            <ExplorerUiLinkAddress address={account.pubkey} basePath="/explorer" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStakeAccountBadgeVariant(account)}>{getStakeAccountStatus(account)}</Badge>
          <ToolsUiStakeAccountAction account={account} actions={actions} authority={authority} close={close} />
        </div>
      </div>
      <Table>
        <TableBody>
          <ToolsUiStakeAccountDetailRow label="Balance" value={`${lamportsToSol(account.lamports)} SOL`} />
          <ToolsUiStakeAccountDetailRow label="Delegated stake" value={`${formatStakeSol(account)} SOL`} />
          <ToolsUiStakeAccountDetailRow label="Validator" value={<ToolsUiStakeValidatorLink account={account} />} />
          <ToolsUiStakeAccountDetailRow
            label="Stake authority"
            value={<ExplorerUiLinkAddress address={account.data.meta.authorized.staker} basePath="/explorer" />}
          />
          <ToolsUiStakeAccountDetailRow
            label="Withdraw authority"
            value={<ExplorerUiLinkAddress address={account.data.meta.authorized.withdrawer} basePath="/explorer" />}
          />
          <ToolsUiStakeAccountDetailRow
            label="Activation epoch"
            value={account.data.stake?.delegation.activationEpoch ?? '-'}
          />
          <ToolsUiStakeAccountDetailRow
            label="Deactivation epoch"
            value={formatDeactivationEpoch(account.data.stake?.delegation.deactivationEpoch)}
          />
          <ToolsUiStakeAccountDetailRow
            label="Rent exempt reserve"
            value={`${lamportsToSol(BigInt(account.data.meta.rentExemptReserve))} SOL`}
          />
        </TableBody>
      </Table>
    </div>
  )
}

function ToolsUiStakeAccountDetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className="w-[180px] text-muted-foreground">{label}</TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  )
}

function ToolsUiStakeValidatorLink({ account }: { account: StakeAccount }) {
  return account.data.stake ? (
    <ExplorerUiLinkAddress address={account.data.stake.delegation.voter} basePath="/explorer" />
  ) : (
    <span className="text-muted-foreground">-</span>
  )
}
