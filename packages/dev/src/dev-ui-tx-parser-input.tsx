import { zodResolver } from '@hookform/resolvers/zod'
import type { Signature } from '@solana/kit'
import { solanaSignatureSchema } from '@workspace/db/solana/solana-signature-schema'
import { Form, FormField, FormItem, FormMessage } from '@workspace/ui/components/form'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const devTxParserSchema = z.object({
  signature: solanaSignatureSchema,
})
export type DevTxParserInput = z.input<typeof devTxParserSchema>
export type DevTxParserOutput = z.output<typeof devTxParserSchema>

export function DevUiTxParserInput({
  signature,
  submit,
}: {
  signature: Signature | null
  submit: (input: DevTxParserInput) => Promise<void>
}) {
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(devTxParserSchema),
    values: { signature: signature ?? '' },
  })

  return (
    <Form {...form}>
      <form className="space-y-2 md:space-y-6" onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name="signature"
          render={({ field }) => (
            <FormItem>
              <InputGroup>
                <InputGroupAddon>
                  <UiIcon icon="search" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Enter signature" {...field} />
                <InputGroupAddon align="inline-end" asChild>
                  <InputGroupButton
                    disabled={!field.value || Boolean(form.formState.errors.signature)}
                    type="submit"
                    variant="secondary"
                  >
                    Submit
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
