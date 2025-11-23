import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import type { Wallet } from '@workspace/db/wallet/wallet'
import type { WalletUpdateInput } from '@workspace/db/wallet/wallet-update-input'
import { walletUpdateSchema } from '@workspace/db/wallet/wallet-update-schema'
import { useTranslation } from '@workspace/i18n'
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
  const { t } = useTranslation('settings')
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
        <div className="flex justify-end items-center w-full pt-3">
          <Button className="rounded-lg" size="sm">
            {t(($) => $.actionSave)}
          </Button>
        </div>
      </form>
    </Form>
  )
}
