import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import type { AccountInputUpdate } from '@workspace/db/dto/account-input-update'
import type { Account } from '@workspace/db/entity/account'
import { accountSchemaUpdate } from '@workspace/db/schema/account-schema-update'
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

export function SettingsUiAccountFormUpdate({
  item,
  submit,
}: {
  item: Account
  submit: (input: AccountInputUpdate) => Promise<void>
}) {
  const form = useForm<AccountInputUpdate>({
    resolver: standardSchemaResolver(accountSchemaUpdate),
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
                  placeholder="Account name"
                  type="text"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Provide the name of the account</FormDescription>
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
