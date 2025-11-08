import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { dbNetworkTypeOptions } from '@workspace/db/db-network-type-options'
import type { NetworkInputUpdate } from '@workspace/db/dto/network-input-update'
import type { Network } from '@workspace/db/entity/network'
import { networkSchemaUpdate } from '@workspace/db/schema/network-schema-update'
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
  const form = useForm<NetworkInputUpdate>({
    resolver: standardSchemaResolver(networkSchemaUpdate),
    values: item,
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit((input) => submit(input))}>
        <FormItem className="flex flex-col gap-2 w-full py-1">
          <FormLabel>Network</FormLabel>
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
          <FormDescription>You can&#39;t change the type of network after you created it.</FormDescription>
          <FormMessage />
          <SettingsUiNetworkWarningMainnet type={item.type} />
        </FormItem>
        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint * </FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Network Endpoint"
                  type="url"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Provide the network endpoint</FormDescription>
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
              <FormLabel>Subscriptions Endpoint</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Network Endpoint for Subscriptions"
                  type="url"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Provide the network endpoint for subscriptions</FormDescription>
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
              <FormLabel>Name </FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Network name"
                  type="text"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Provide the name of the network</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: true }}
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
