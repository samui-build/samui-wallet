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
import { getColorByName, uiColorNames } from '@workspace/ui/lib/get-initials-colors'
import { cn } from '@workspace/ui/lib/utils'
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
      <form className="space-y-2 md:space-y-6" onSubmit={form.handleSubmit((input) => submit(input))}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t(($) => $.walletInputNameLabel)}</FormLabel>
              <FormControl>
                <Input
                  maxLength={20}
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
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t(($) => $.walletInputDescriptionLabel)}</FormLabel>
              <FormControl>
                <Input
                  maxLength={50}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={t(($) => $.walletInputDescriptionPlaceholder)}
                  type="text"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>{t(($) => $.walletInputDescriptionDescription)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: false }}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t(($) => $.walletInputColorLabel)}</FormLabel>
              <FormDescription>{t(($) => $.walletInputColorDescription)}</FormDescription>
              <FormControl>
                <div className="grid grid-cols-6 gap-4">
                  {uiColorNames.map((uiColorName) => {
                    const { bg, text } = getColorByName(uiColorName)
                    return (
                      <button
                        className={cn(`flex aspect-square cursor-pointer items-center justify-center`, text, bg, {
                          'font-bold': field.value === uiColorName,
                        })}
                        disabled={field.value === uiColorName}
                        key={uiColorName}
                        onClick={() => field.onChange(uiColorName)}
                        type="button"
                      >
                        {uiColorName}
                      </button>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: false }}
        />
        <div className="flex w-full items-center justify-end pt-3">
          <Button className="rounded-lg" size="sm">
            {t(($) => $.actionSave)}
          </Button>
        </div>
      </form>
    </Form>
  )
}
