import type { Address } from '@solana/kit'
import { tryCatch } from '@workspace/core/try-catch'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import { useCloseStakeAccount } from '@workspace/solana-client-react/use-close-stake-account'
import { useCreateStakeAccount } from '@workspace/solana-client-react/use-create-stake-account'
import { useDeactivateStakeAccount } from '@workspace/solana-client-react/use-deactivate-stake-account'
import { useGetBalance } from '@workspace/solana-client-react/use-get-balance'
import { useGetStakeAccountRentReserve } from '@workspace/solana-client-react/use-get-stake-account-rent-reserve'
import { useGetStakeAccounts } from '@workspace/solana-client-react/use-get-stake-accounts'
import { useGetVoteAccounts } from '@workspace/solana-client-react/use-get-vote-accounts'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router'
import type { StakeAccountActions } from './ui/tools-ui-stake-account-action.tsx'
import { ToolsUiStakeAccountDetail } from './ui/tools-ui-stake-account-detail.tsx'
import { ToolsUiStakeAccountsIndex } from './ui/tools-ui-stake-accounts-index.tsx'
import { ToolsUiStakeCreateForm } from './ui/tools-ui-stake-create-form.tsx'

export default function ToolsFeatureStake({ account, network }: { account: Account; network: Network }) {
  return (
    <div className="space-y-2 md:space-y-6">
      <UiCard backButtonTo="/tools" contentProps={{ className: 'space-y-2 md:space-y-6' }} title="Stake">
        <Routes>
          <Route element={<Navigate replace to="/tools/stake/accounts" />} index />
          <Route element={<ToolsFeatureStakeAccounts account={account} network={network} />} path="accounts/*" />
          <Route element={<Navigate replace to="/tools/stake/accounts" />} path="*" />
        </Routes>
      </UiCard>
    </div>
  )
}

export function ToolsFeatureStakeAccounts({ account, network }: { account: Account; network: Network }) {
  const accountsQuery = useGetStakeAccounts({ address: account.publicKey, network })
  const closeStakeAccountMutation = useCloseStakeAccount({ account, network })
  const deactivateStakeAccountMutation = useDeactivateStakeAccount({ account, network })
  const accounts = accountsQuery.data ?? []
  const actions: StakeAccountActions = {
    close: async (stakeAccount) => {
      const { error } = await tryCatch(closeStakeAccountMutation.mutateAsync(stakeAccount))
      return !error
    },
    deactivate: async (stakeAccount) => {
      const { error } = await tryCatch(deactivateStakeAccountMutation.mutateAsync(stakeAccount))
      return !error
    },
    isPending: closeStakeAccountMutation.isPending || deactivateStakeAccountMutation.isPending,
  }

  return accountsQuery.isLoading ? (
    <UiLoader />
  ) : accountsQuery.error ? (
    <UiDebug data={accountsQuery.error} />
  ) : (
    <Routes>
      <Route
        element={<ToolsUiStakeAccountsIndex accounts={accounts} actions={actions} authority={account.publicKey} />}
        index
      />
      <Route element={<ToolsFeatureStakeCreate account={account} network={network} />} path="stake" />
      <Route
        element={<ToolsFeatureStakeAccountDetail accounts={accounts} actions={actions} authority={account.publicKey} />}
        path=":address"
      />
      <Route element={<Navigate replace to="." />} path="*" />
    </Routes>
  )
}

function ToolsFeatureStakeAccountDetail({
  accounts,
  actions,
  authority,
}: {
  accounts: StakeAccount[]
  actions: StakeAccountActions
  authority: Address
}) {
  const { address } = useParams<{ address: string }>()
  const navigate = useNavigate()
  const stakeAccount = accounts.find((item) => item.pubkey.toString() === address)

  if (!stakeAccount) {
    return <UiEmpty description="Stake account not found for the active wallet." />
  }

  return (
    <ToolsUiStakeAccountDetail
      account={stakeAccount}
      actions={actions}
      authority={authority}
      close={async () => {
        const closed = await actions.close(stakeAccount)
        if (closed) {
          navigate('/tools/stake/accounts')
        }
      }}
    />
  )
}

function ToolsFeatureStakeCreate({ account, network }: { account: Account; network: Network }) {
  const createStakeAccountMutation = useCreateStakeAccount({ account, network })
  const navigate = useNavigate()
  const rentReserveQuery = useGetStakeAccountRentReserve({ network })
  const voteAccountsQuery = useGetVoteAccounts({ network })
  const walletBalanceQuery = useGetBalance({ address: account.publicKey, network })

  return (
    <ToolsUiStakeCreateForm
      address={account.publicKey}
      createStake={async (input) => {
        const { data: result, error } = await tryCatch(createStakeAccountMutation.mutateAsync(input))
        if (error) {
          throw error
        }
        if (!result) {
          throw new Error('Failed to stake SOL.')
        }
        navigate(`/tools/stake/accounts/${result.stakeAccount}`)
      }}
      isPending={createStakeAccountMutation.isPending}
      rentReserve={rentReserveQuery.data}
      rentReserveIsLoading={rentReserveQuery.isLoading}
      validators={voteAccountsQuery.data ?? []}
      validatorsError={voteAccountsQuery.error}
      validatorsIsLoading={voteAccountsQuery.isLoading}
      walletBalance={walletBalanceQuery.data?.value}
      walletBalanceIsLoading={walletBalanceQuery.isLoading}
    />
  )
}
