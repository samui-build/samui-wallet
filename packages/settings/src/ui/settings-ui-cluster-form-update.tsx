import type { ClusterInputUpdate } from '@workspace/db/dto/cluster-input-update'
import type { Cluster } from '@workspace/db/entity/cluster'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { dbClusterTypeOptions } from '@workspace/db/db-cluster-type-options'
import { clusterSchemaUpdate } from '@workspace/db/schema/cluster-schema-update'
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

import { SettingsUiClusterWarningMainnet } from './settings-ui-cluster-warning-mainnet.js'

export function SettingsUiClusterFormUpdate({
  item,
  submit,
}: {
  item: Cluster
  submit: (input: ClusterInputUpdate) => Promise<void>
}) {
  const form = useForm<ClusterInputUpdate>({
    resolver: standardSchemaResolver(clusterSchemaUpdate),
    values: item,
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit((input) => submit(input))}>
        <FormItem className="flex flex-col gap-2 w-full py-1">
          <FormLabel>Cluster</FormLabel>
          <FormControl>
            <ToggleGroup
              className="flex justify-start items-center flex-wrap"
              defaultValue={item.type}
              disabled
              type="single"
              variant="outline"
            >
              {dbClusterTypeOptions.map(({ label, value }) => (
                <ToggleGroupItem className="flex items-center gap-x-2" key={value} value={value}>
                  {label.replace('Solana ', '')}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormDescription>You can&#39;t change the type of cluster after you created it.</FormDescription>
          <FormMessage />
          <SettingsUiClusterWarningMainnet type={item.type} />
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
                  placeholder="Cluster Endpoint"
                  type="url"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Provide the cluster endpoint</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: true }}
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
                  placeholder="Cluster name"
                  type="text"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Provide the name of the cluster</FormDescription>
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
