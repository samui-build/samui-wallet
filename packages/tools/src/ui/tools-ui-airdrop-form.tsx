import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import type { Account } from '@workspace/db/account/account'
import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { Button } from '@workspace/ui/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { toastLoading } from '@workspace/ui/lib/toast-loading'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  address: solanaAddressSchema,
  amount: z.number().gt(0, 'Amount must be greater than 0'),
})

export type AirdropFormSchema = z.infer<typeof formSchema>

export function ToolsUiAirdropForm({
  disabled,
  submit,
  wallets,
}: {
  disabled: boolean
  submit: (input: AirdropFormSchema) => Promise<void>
  wallets: Wallet[]
}) {
  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    values: {
      address: '',
      amount: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { dismiss: dismissLoadingToast } = toastLoading('Submitting...')
    try {
      await submit(values)
    } catch (error) {
      console.error('Form submission error', error)
    } finally {
      dismissLoadingToast()
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-2 md:space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Select name={field.name} onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectGroup key={wallet.id}>
                        <SelectLabel>{wallet.name}</SelectLabel>
                        {uniqueAccounts(wallet.accounts ?? []).map((account) => (
                          <SelectItem key={account.id} value={account.publicKey}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>The public key of the account you want to airdrop to</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  className="w-[200px]"
                  min="0"
                  placeholder="Enter the amount of SOL to airdrop"
                  step="any"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>Amount of SOL you want to airdrop</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={disabled} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

function uniqueAccounts(accounts: Account[] = []): Account[] {
  return Array.from(new Map(accounts.map((account) => [account.publicKey, account])).values())
}
