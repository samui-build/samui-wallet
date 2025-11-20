import { zodResolver } from '@hookform/resolvers/zod'
import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { solanaSignatureSchema } from '@workspace/db/solana/solana-signature-schema'
import { Form, FormField, FormItem, FormMessage } from '@workspace/ui/components/form'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z
  .object({
    query: z
      .string()
      .refine(
        (query) => solanaAddressSchema.safeParse(query).success || solanaSignatureSchema.safeParse(query).success,
        'Invalid address or signature',
      ),
  })
  .transform((data) => {
    if (solanaAddressSchema.safeParse(data.query).success) {
      return { ...data, type: 'account' as const }
    }
    if (solanaSignatureSchema.safeParse(data.query).success) {
      return { ...data, type: 'tx' as const }
    }
    return z.NEVER
  })

export type ExplorerSearchInput = z.infer<typeof formSchema>

export function ExplorerUiSearch({ submit }: { submit: (input: ExplorerSearchInput) => Promise<void> }) {
  const form = useForm({
    defaultValues: { query: '' },
    mode: 'all',
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <InputGroup>
                <InputGroupAddon>
                  <UiIcon icon="search" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search account or transaction" {...field} />
                <InputGroupAddon align="inline-end" asChild>
                  <InputGroupButton
                    disabled={!field.value || Boolean(form.formState.errors.query)}
                    type="submit"
                    variant="secondary"
                  >
                    Search
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
