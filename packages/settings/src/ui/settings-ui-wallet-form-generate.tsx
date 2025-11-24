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
import { useForm } from 'react-hook-form'

export function SettingsUiWalletFormGenerate({
  mnemonic,
  name,
  submit,
}: {
  mnemonic: string
  name: string
  submit: (input: WalletCreateInput) => Promise<void>
}) {
  const { t } = useTranslation('settings')
  const form = useForm<WalletCreateInput>({
    resolver: standardSchemaResolver(walletCreateSchema),
    values: {
      derivationPath: derivationPaths.default,
      mnemonic,
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
          name="derivationPath"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t(($) => $.walletInputDerivationPathLabel)}</FormLabel>
              <FormControl>
                <Input disabled onChange={(e) => field.onChange(e.target.value)} type="text" value={field.value} />
              </FormControl>
              <FormDescription>{t(($) => $.walletInputDerivationPathDescription)}</FormDescription>
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
                <Input onChange={(e) => field.onChange(e.target.value)} type="text" value={field.value} />
              </FormControl>
              <FormDescription>{t(($) => $.walletInputMnemonicDescription)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: false }}
        />
        <div className="flex w-full items-center justify-end pt-3">
          <Button size="lg">{t(($) => $.actionGenerate)}</Button>
        </div>
      </form>
    </Form>
  )
}
