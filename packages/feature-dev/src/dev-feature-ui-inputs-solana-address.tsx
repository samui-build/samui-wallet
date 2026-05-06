import { zodResolver } from '@hookform/resolvers/zod'
import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { Button } from '@workspace/ui/components/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { cn } from '@workspace/ui/lib/utils'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  address: solanaAddressSchema,
})

type FormSchemaType = z.infer<typeof formSchema>
export function DevFeatureUiInputsSolanaAddress() {
  const [result, setResult] = useState<FormSchemaType | null>(null)

  const form = useForm({
    defaultValues: {
      address: '',
    },
    mode: 'all',
    resolver: zodResolver(formSchema),
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput placeholder="Enter a Solana address" {...field} />
                  <InputGroupAddon align="inline-end">
                    <UiIcon className={cn({ 'text-green-400': !!field.value && !fieldState.invalid })} icon="check" />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button disabled={!form.formState.isValid} type="submit">
            Submit
          </Button>
        </div>
        {result ? <UiDebug data={result} /> : null}
      </form>
    </Form>
  )
}
