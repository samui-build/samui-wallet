import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import type { Wallet } from '@workspace/db/wallet/wallet'
import type { WalletUpdateInput } from '@workspace/db/wallet/wallet-update-input'
import { walletUpdateSchema } from '@workspace/db/wallet/wallet-update-schema'
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
import { useForm } from 'react-hook-form'

export function SettingsUiWalletFormUpdate({
  item,
  submit,
}: {
  item: Wallet
  submit: (input: WalletUpdateInput) => Promise<void>
}) {
  const form = useForm<WalletUpdateInput>({
    resolver: standardSchemaResolver(walletUpdateSchema),
    values: item,
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit((input) => submit(input))}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Wallet name"
                  type="text"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Provide the name of the wallet</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: false }}
        />
        <div className="flex justify-end items-center w-full pt-3">
          <Button className="rounded-lg" size="sm">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
