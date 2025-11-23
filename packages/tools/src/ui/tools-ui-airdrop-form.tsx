'use client'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Button } from '@workspace/ui/components/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
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
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { toastLoading } from '@workspace/ui/lib/toast-loading'
import { cn } from '@workspace/ui/lib/utils'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  address: z.string(),
  amount: z.number().int({ message: 'Amount must be an integer' }).min(0),
})

export type AirdropFormSchema = z.infer<typeof formSchema>

export function ToolsUiAirdropForm({
  accounts,
  disabled,
  submit,
}: {
  accounts: { label: string; value: string }[]
  disabled: boolean
  submit: (input: AirdropFormSchema) => Promise<void>
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    values: {
      address: accounts[0]?.value ?? '',
      amount: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { dismiss: dismissLoadingToast } = toastLoading('Submitting...')
    try {
      await submit(values)
    } catch (error) {
      console.error('Form submission error', error)
    } finally {
      dismissLoadingToast()
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-2 md:space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Address</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn('w-[200px] justify-between', !field.value && 'text-muted-foreground')}
                      role="combobox"
                      variant="outline"
                    >
                      {field.value ? accounts.find((item) => item.value === field.value)?.label : 'Select account'}
                      <UiIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" icon="chevronsUpDown" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search account..." />
                    <CommandList>
                      <CommandEmpty>No accounts found.</CommandEmpty>
                      <CommandGroup>
                        {accounts.map((item) => (
                          <CommandItem
                            key={item.value}
                            onSelect={() => {
                              form.setValue('address', item.value)
                            }}
                            value={item.label}
                          >
                            <UiIcon
                              className={cn('mr-2 h-4 w-4', item.value === field.value ? 'opacity-100' : 'opacity-0')}
                              icon="check"
                            />
                            {item.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>The public key of the account you want to airdrop to</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  className="w-[200px]"
                  placeholder="1"
                  step="1"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>Amount of SOL you want to airdrop</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={disabled} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
