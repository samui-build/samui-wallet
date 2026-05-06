import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import type { Network } from '@workspace/db/network/network'
import { networkTypeOptions } from '@workspace/db/network/network-type-options'
import type { NetworkUpdateInput } from '@workspace/db/network/network-update-input'
import { networkUpdateSchema } from '@workspace/db/network/network-update-schema'
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
import { UiFormInputColor } from '@workspace/ui/components/ui-form-input-color'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { SettingsUiNetworkWarningMainnet } from './settings-ui-network-warning-mainnet.tsx'

export function SettingsUiNetworkFormUpdate({
  item,
  saveInPlace,
  submit,
}: {
  item: Network
  saveInPlace: (input: NetworkUpdateInput) => Promise<void>
  submit: (input: NetworkUpdateInput) => Promise<void>
}) {
  const { t } = useTranslation('settings')
  const form = useForm<NetworkUpdateInput>({
    resolver: standardSchemaResolver(networkUpdateSchema),
    values: item,
  })
  const saveInPlaceQueue = useRef(Promise.resolve())

  function queueSaveInPlace(input: NetworkUpdateInput) {
    saveInPlaceQueue.current = saveInPlaceQueue.current
      .catch(() => undefined)
      .then(() => saveInPlace(input))
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2 md:space-y-6"
        onSubmit={form.handleSubmit((input) => submit({ ...input, color: form.getValues('color') }))}
      >
        <FormItem className="flex w-full flex-col gap-2 py-1">
          <FormLabel>{t(($) => $.networkInputTypeLabel)}</FormLabel>
          <FormControl>
            <ToggleGroup
              className="flex flex-wrap items-center justify-start"
              defaultValue={item.type}
              disabled
              type="single"
              variant="outline"
            >
              {networkTypeOptions.map(({ label, value }) => (
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
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t(($) => $.networkInputColorLabel)}</FormLabel>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <FormDescription>{t(($) => $.networkInputColorDescription)}</FormDescription>
                {field.value !== undefined ? (
                  <Button
                    className="h-auto p-0"
                    onClick={() => {
                      field.onChange(undefined)
                      queueSaveInPlace({ color: undefined })
                    }}
                    size="sm"
                    type="button"
                    variant="link"
                  >
                    {t(($) => $.networkInputColorUnset)}
                  </Button>
                ) : null}
              </div>
              <FormControl>
                <UiFormInputColor
                  onChange={(color) => {
                    field.onChange(color)
                    queueSaveInPlace({ color })
                  }}
                  value={field.value}
                />
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
