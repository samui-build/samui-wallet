import type { AccountInputCreate } from '@workspace/db/dto/account-input-create'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { accountSchemaCreate } from '@workspace/db/schema/account-schema-create'
import { derivationPaths } from '@workspace/keypair/derivation-paths'
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

export function SettingsUiAccountFormImport({
  name,
  submit,
}: {
  name: string
  submit: (input: AccountInputCreate) => Promise<void>
}) {
  const form = useForm<AccountInputCreate>({
    resolver: standardSchemaResolver(accountSchemaCreate),
    values: {
      derivationPath: derivationPaths.default,
      mnemonic: '',
      name,
      secret: '',
    },
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
        <FormField
          control={form.control}
          name="mnemonic"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Mnemonic</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Account mnemonic"
                  type="text"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Provide the mnemonic of the account</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: false }}
        />
        <div className="flex justify-end items-center w-full pt-3">
          <Button size="lg">Import</Button>
        </div>
      </form>
    </Form>
  )
}
