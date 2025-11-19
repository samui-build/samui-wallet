import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { dbNetworkTypeOptions } from '@workspace/db/db-network-type-options'
import type { NetworkInputUpdate } from '@workspace/db/dto/network-input-update'
import type { Network } from '@workspace/db/entity/network'
import { networkSchemaUpdate } from '@workspace/db/schema/network-schema-update'
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
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group'
import { useForm } from 'react-hook-form'
import { SettingsUiNetworkWarningMainnet } from './settings-ui-network-warning-mainnet.tsx'

export function SettingsUiNetworkFormUpdate({
  item,
  submit,
}: {
  item: Network
  submit: (input: NetworkInputUpdate) => Promise<void>
}) {
  const { t } = useTranslation('settings')
  const form = useForm<NetworkInputUpdate>({
    resolver: standardSchemaResolver(networkSchemaUpdate),
    values: item,
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit((input) => submit(input))}>
        <FormItem className="flex flex-col gap-2 w-full py-1">
          <FormLabel>{t(($) => $.networkInputTypeLabel)}</FormLabel>
          <FormControl>
            <ToggleGroup
              className="flex justify-start items-center flex-wrap"
              defaultValue={item.type}
              disabled
              type="single"
              variant="outline"
            >
              {dbNetworkTypeOptions.map(({ label, value }) => (
                <ToggleGroupItem className="flex items-center gap-x-2" key={value} value={value}>
                  {label.replace('Solana ', '')}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormDescription>{t(($) => $.networkInputTypeDescription)}</FormDescription>
          <FormMessage />
          <SettingsUiNetworkWarningMainnet type={item.type} />
        </FormItem>
        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(($) => $.networkInputEndpointLabel)} * </FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={t(($) => $.networkInputEndpointPlaceholder)}
                  type="url"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>{t(($) => $.networkInputEndpointDescription)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: true }}
        />
        <FormField
          control={form.control}
          name="endpointSubscriptions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(($) => $.networkInputEndpointSubscriptionsLabel)}</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={t(($) => $.networkInputEndpointSubscriptionsPlaceholder)}
                  type="url"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>{t(($) => $.networkInputEndpointSubscriptionsDescription)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: false }}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t(($) => $.networkInputNameLabel)}</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={t(($) => $.networkInputNamePlaceholder)}
                  type="text"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>{t(($) => $.networkInputNameDescription)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: true }}
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
