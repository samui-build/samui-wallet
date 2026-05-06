import type { Address } from '@solana/kit'
import type { VoteAccount } from '@workspace/solana-client-react/use-get-vote-accounts'
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@workspace/ui/components/combobox'
import { useState } from 'react'
import { ToolsUiStakeCreateValidatorCard } from './tools-ui-stake-create-validator-card.tsx'

const VALIDATOR_RESULT_LIMIT = 50

export function ToolsUiStakeCreateValidatorCombobox({
  onSelect,
  preferredVoteAccount,
  selectedVoteAddress,
  totalActivatedStake,
  validators,
}: {
  onSelect: (address: Address) => void
  preferredVoteAccount: VoteAccount | undefined
  selectedVoteAddress: Address | undefined
  totalActivatedStake: bigint
  validators: readonly VoteAccount[]
}) {
  const [search, setSearch] = useState('')
  const selectedVoteAccount = validators.find((validator) => validator.votePubkey === selectedVoteAddress)

  return (
    <Combobox
      autoComplete="list"
      inputValue={search}
      isItemEqualToValue={(item, value) => item.votePubkey === value.votePubkey}
      items={validators}
      itemToStringLabel={(item) => item.votePubkey}
      itemToStringValue={(item) => item.votePubkey}
      limit={VALIDATOR_RESULT_LIMIT}
      onInputValueChange={setSearch}
      onOpenChange={(open) => {
        if (!open) {
          setSearch('')
        }
      }}
      onValueChange={(value) => {
        if (!value) {
          return
        }
        onSelect(value.votePubkey)
        setSearch('')
      }}
      value={selectedVoteAccount ?? null}
    >
      <ComboboxTrigger
        aria-label="Validator"
        className="relative block w-full rounded-md text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>[data-slot=combobox-trigger-icon]]:absolute [&>[data-slot=combobox-trigger-icon]]:top-4 [&>[data-slot=combobox-trigger-icon]]:right-4"
        nativeButton={false}
        render={<div />}
      >
        {selectedVoteAccount ? (
          <ToolsUiStakeCreateValidatorCard
            className="pr-12"
            isPreferred={selectedVoteAccount.votePubkey === preferredVoteAccount?.votePubkey}
            totalActivatedStake={totalActivatedStake}
            voteAccount={selectedVoteAccount}
          />
        ) : (
          <div className="rounded-md border bg-muted/20 p-3 pr-12 text-left">
            <div className="text-muted-foreground text-xs">Validator</div>
            <div className="font-medium">Select validator</div>
          </div>
        )}
      </ComboboxTrigger>
      <ComboboxContent className="max-h-[60vh] min-w-0">
        <ComboboxInput
          autoFocus
          className="w-[calc(100%-0.5rem)]"
          placeholder="Search validator pubkey"
          showClear={!!search}
          showTrigger={false}
        />
        <ComboboxEmpty>No validators found.</ComboboxEmpty>
        <ComboboxList className="overflow-x-hidden">
          <ComboboxCollection>
            {(validator: VoteAccount, index: number) => (
              <ComboboxItem
                className="block h-auto w-full cursor-pointer overflow-hidden p-1 pr-1 data-highlighted:bg-transparent data-highlighted:text-foreground [&>[data-slot=combobox-item-indicator]]:hidden"
                index={index}
                key={validator.votePubkey}
                value={validator}
              >
                <ToolsUiStakeCreateValidatorCard
                  className="pr-12"
                  isPreferred={validator.votePubkey === preferredVoteAccount?.votePubkey}
                  totalActivatedStake={totalActivatedStake}
                  voteAccount={validator}
                />
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
