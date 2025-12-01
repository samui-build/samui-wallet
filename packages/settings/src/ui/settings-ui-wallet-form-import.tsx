import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { walletCreateSchema } from '@workspace/db/wallet/wallet-create-schema'
import { useTranslation } from '@workspace/i18n'
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
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'

export function SettingsUiWalletFormImport({
  name,
  submit,
}: {
  name: string
  submit: (input: WalletCreateInput, redirect: boolean) => Promise<void>
}) {
  const { t } = useTranslation('settings')
  const redirectId = useId()
  const [redirect, setRedirect] = useState(true)
  const form = useForm<WalletCreateInput>({
    resolver: standardSchemaResolver(walletCreateSchema),
    values: {
      derivationPath: derivationPaths.default,
      mnemonic: '',
      name,
      secret: '',
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-2 md:space-y-6" onSubmit={form.handleSubmit((input) => submit(input, redirect))}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t(($) => $.walletInputNameLabel)}</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={t(($) => $.walletInputNamePlaceholder)}
                  type="text"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>{t(($) => $.walletInputNameDescription)}</FormDescription>
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
              <FormLabel>{t(($) => $.walletInputMnemonicLabel)}</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={t(($) => $.walletInputMnemonicPlaceholder)}
                  type="text"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>{t(($) => $.walletInputMnemonicDescription)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: false }}
        />
        <div className="flex w-full items-center justify-end gap-4 pt-3">
          <div className="flex items-center space-x-2">
            <Switch checked={redirect} id={redirectId} onCheckedChange={setRedirect} />
            <Label htmlFor={redirectId}>{t(($) => $.walletInputRedirectLabel)}</Label>
          </div>
          <Button size="lg">{t(($) => $.actionImport)}</Button>
        </div>
      </form>
    </Form>
  )
}
