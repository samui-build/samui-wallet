import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { useId, useMemo, useState } from 'react'

import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'

import { PortfolioUiAccountFormTokenDropdown } from './portfolio-ui-account-form-token-dropdown.tsx'

export function PortfolioUiAccountFormSend({
  balances,
  isLoading,
  send,
}: {
  balances: TokenBalance[]
  isLoading: boolean
  send: (input: { amount: string; destination: string; mint: TokenBalance }) => Promise<void>
}) {
  const destinationId = useId()
  const amountId = useId()
  const [mintAddress, setMintAddress] = useState(NATIVE_MINT)
  const [amount, setAmount] = useState('0')
  const [destination, setDestination] = useState('')
  const mint = useMemo(() => {
    return balances.find((item) => item.mint === mintAddress)
  }, [balances, mintAddress])

  return (
    <div className="w-full max-w-md px-4">
      <form>
        <FieldGroup>
          <FieldSet>
            <PortfolioUiAccountFormTokenDropdown
              mint={mint}
              mintAddress={mintAddress}
              setMintAddress={setMintAddress}
              tokens={balances}
            />

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={destinationId}>Destination</FieldLabel>
                <Input
                  id={destinationId}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination"
                  type="text"
                  value={destination}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={amountId}>Amount</FieldLabel>
                <Input
                  id={amountId}
                  min="1"
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  required
                  step="any"
                  type="number"
                  value={amount}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field className="flex justify-end" orientation="horizontal">
            <Button
              disabled={!mint || !amount || !destination || isLoading}
              onClick={async (e) => {
                e.preventDefault()
                if (!mint) {
                  return
                }
                await send({ amount, destination, mint })
              }}
              type="button"
            >
              {isLoading ? <UiLoader className="size-4" /> : null}
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
