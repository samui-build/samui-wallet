import type { ClusterInputCreate } from '@workspace/db/dto/cluster-input-create'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { dbClusterTypeOptions } from '@workspace/db/db-cluster-type-options'
import { clusterSchemaCreate } from '@workspace/db/schema/cluster-schema-create'
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

export function SettingsUiClusterFormCreate({ submit }: { submit: (input: ClusterInputCreate) => Promise<void> }) {
  const form = useForm<ClusterInputCreate>({
    resolver: standardSchemaResolver(clusterSchemaCreate),
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit((input) => submit(input))}>
        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint * </FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => {
                    const val = e.target.value
                    field.onChange(val)
                  }}
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
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 w-full py-1">
              <FormLabel>Cluster *</FormLabel>
              <FormControl>
                <ToggleGroup
                  className="flex justify-start items-center flex-wrap"
                  onValueChange={field.onChange}
                  type="single"
                  value={field.value}
                  variant="outline"
                >
                  {dbClusterTypeOptions.map(({ label, value }) => (
                    <ToggleGroupItem className="flex items-center gap-x-2" key={value} value={value}>
                      {label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormDescription>Select the type of cluster</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name </FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => {
                    const val = e.target.value
                    field.onChange(val)
                  }}
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
