import type { Address, Lamports } from '@solana/kit'
import { ExplorerUiLinkAddress } from '@workspace/explorer/ui/explorer-ui-link-address'
import { lamportsToSol } from '@workspace/solana-client/lamports-to-sol'
import { solToLamports } from '@workspace/solana-client/sol-to-lamports'
import type { CreateStakeAccountInput } from '@workspace/solana-client-react/use-create-stake-account'
import type { VoteAccount } from '@workspace/solana-client-react/use-get-vote-accounts'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { UiBackButton } from '@workspace/ui/components/ui-back-button'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { type FormEvent, useId, useMemo, useState } from 'react'
import { ToolsUiStakeAccountCardField } from './tools-ui-stake-account-card-field.tsx'
import { ToolsUiStakeCreateValidatorCombobox } from './tools-ui-stake-create-validator-combobox.tsx'
import { getSortedVoteAccounts, getStakeAmountValidation, toBigIntLamports } from './tools-ui-stake-utils.ts'

export function ToolsUiStakeCreateForm({
  address,
  createStake,
  isPending,
  rentReserve,
  rentReserveIsLoading,
  validators,
  validatorsError,
  validatorsIsLoading,
  walletBalance,
  walletBalanceIsLoading,
}: {
  address: Address
  createStake: (input: CreateStakeAccountInput) => Promise<void>
  isPending: boolean
  rentReserve: Lamports | undefined
  rentReserveIsLoading: boolean
  validators: readonly VoteAccount[]
  validatorsError: unknown
  validatorsIsLoading: boolean
  walletBalance: Lamports | undefined
  walletBalanceIsLoading: boolean
}) {
  const stakeAmountInputId = useId()
  const [selectedVoteAccount, setSelectedVoteAccount] = useState<Address | undefined>()
  const [stakeAmount, setStakeAmount] = useState('2')
  const sortedVoteAccounts = useMemo(() => getSortedVoteAccounts(validators), [validators])
  const preferredVoteAccount = sortedVoteAccounts[0]
  const selectedVoteAddress = selectedVoteAccount ?? preferredVoteAccount?.votePubkey
  const totalActivatedStake = useMemo(
    () => sortedVoteAccounts.reduce((total, item) => total + toBigIntLamports(item.activatedStake), 0n),
    [sortedVoteAccounts],
  )
  const stakeAmountValidation = getStakeAmountValidation({
    amount: stakeAmount,
    rentReserve,
    walletBalance,
  })
  const canSubmitStake =
    !!selectedVoteAddress &&
    !isPending &&
    !rentReserveIsLoading &&
    !stakeAmountValidation &&
    !walletBalanceIsLoading &&
    rentReserve !== undefined &&
    walletBalance !== undefined
  const prerequisiteFailure =
    !rentReserveIsLoading && rentReserve === undefined
      ? 'Unable to compute rent reserve. Please retry.'
      : !walletBalanceIsLoading && walletBalance === undefined
        ? 'Wallet balance unavailable. Reconnect your wallet.'
        : undefined

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedVoteAddress) {
      return
    }

    let amount: ReturnType<typeof solToLamports>
    try {
      if (stakeAmountValidation) {
        throw new Error(stakeAmountValidation)
      }
      amount = solToLamports(stakeAmount)
    } catch {
      toastError(stakeAmountValidation ?? 'Enter a valid stake amount.')
      return
    }

    try {
      await createStake({
        amount,
        vote: selectedVoteAddress,
      })
    } catch {
      // The mutation onError callback shows the failure toast.
      return
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <UiBackButton aria-label="Back to stake accounts" to="/tools/stake/accounts" />
        <div>
          <div className="font-semibold text-lg">Stake SOL</div>
        </div>
      </div>
      {validatorsIsLoading ? (
        <UiLoader />
      ) : validatorsError ? (
        <UiDebug data={validatorsError} />
      ) : sortedVoteAccounts.length ? (
        <div className="grid gap-2">
          <div className="font-medium text-sm">Validator</div>
          <ToolsUiStakeCreateValidatorCombobox
            onSelect={setSelectedVoteAccount}
            preferredVoteAccount={preferredVoteAccount}
            selectedVoteAddress={selectedVoteAddress}
            totalActivatedStake={totalActivatedStake}
            validators={sortedVoteAccounts}
          />
        </div>
      ) : (
        <UiEmpty description="No validators found." />
      )}
      <div className="grid gap-2">
        <label className="font-medium text-sm" htmlFor={stakeAmountInputId}>
          Amount
        </label>
        <Input
          id={stakeAmountInputId}
          min="0"
          onChange={(event) => setStakeAmount(event.target.value)}
          step="0.000000001"
          type="number"
          value={stakeAmount}
        />
        {stakeAmountValidation ? <div className="text-destructive text-sm">{stakeAmountValidation}</div> : null}
      </div>
      <div className="grid gap-3 rounded-md border bg-muted/20 p-3 sm:grid-cols-2">
        <ToolsUiStakeAccountCardField
          label="From"
          value={<ExplorerUiLinkAddress address={address} basePath="/explorer" label={ellipsify(address, 6, '...')} />}
        />
        <ToolsUiStakeAccountCardField
          label="Balance"
          value={
            walletBalanceIsLoading
              ? 'Loading...'
              : walletBalance === undefined
                ? '-'
                : `${lamportsToSol(walletBalance)} SOL`
          }
        />
      </div>
      <div className="flex justify-end">
        <Button disabled={!canSubmitStake} type="submit">
          Stake
        </Button>
      </div>
      {prerequisiteFailure ? <div className="text-destructive text-sm">{prerequisiteFailure}</div> : null}
    </form>
  )
}
