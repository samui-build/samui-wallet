import { zodResolver } from '@hookform/resolvers/zod'
import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  addresses: z.array(z.object({ value: solanaAddressSchema })),
})

type FormSchemaType = z.infer<typeof formSchema>
export function DevFeatureUiInputsSolanaAddresses() {
  const { t } = useTranslation('ui')
  const [result, setResult] = useState<FormSchemaType | null>(null)

  const form = useForm({
    defaultValues: {
      addresses: [{ value: '' }],
    },
    mode: 'all',
    resolver: zodResolver(formSchema),
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'addresses',
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-2 md:space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <FormField
            control={form.control}
            key={field.id}
            name={`addresses.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="justify-between">Address {index + 1}</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput placeholder="Enter a Solana address" {...field} />
                    <InputGroupAddon align="inline-end">
                      <Button
                        disabled={index === 0}
                        onClick={() => remove(index)}
                        size="sm"
                        title={t(($) => $.actionRemove)}
                        type="button"
                        variant="ghost"
                      >
                        <UiIcon icon="x" />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end space-x-2">
          <Button
            disabled={fields.length > 9 || !form.formState.isValid}
            onClick={() => append({ value: '' })}
            type="button"
            variant="secondary"
          >
            <UiIcon icon="plus" /> {t(($) => $.actionAdd)}
          </Button>
          <Button disabled={!form.formState.isValid} type="submit">
            {t(($) => $.actionSave)}
          </Button>
        </div>
        {result ? <UiDebug data={result} /> : null}
      </form>
    </Form>
  )
}
