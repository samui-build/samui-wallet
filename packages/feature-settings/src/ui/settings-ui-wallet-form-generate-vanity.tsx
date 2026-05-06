import { zodResolver } from '@hookform/resolvers/zod'
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
import { Switch } from '@workspace/ui/components/switch'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z
  .object({
    caseSensitive: z.boolean().default(true),
    prefix: z.string().max(4, 'Keep patterns to 4 characters max').optional().default(''),
    suffix: z.string().max(4, 'Keep patterns to 4 characters max').optional().default(''),
  })
  .superRefine((data, ctx) => {
    const prefix = data.prefix?.trim() ?? ''
    const suffix = data.suffix?.trim() ?? ''
    if (!prefix && !suffix) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a prefix or suffix',
        path: ['prefix'],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a prefix or suffix',
        path: ['suffix'],
      })
    }
  })

export type VanityWalletFormFields = z.input<typeof schema>

export function SettingsUiWalletFormGenerateVanity({
  disabled,
  submit,
}: {
  disabled?: boolean
  submit: (input: VanityWalletFormFields) => Promise<void>
}) {
  const form = useForm<VanityWalletFormFields>({
    defaultValues: {
      caseSensitive: true,
      prefix: '',
      suffix: '',
    },
    resolver: zodResolver(schema),
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(submit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prefix</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={disabled}
                    maxLength={4}
                    placeholder="Start with..."
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Characters the address should start with (max 4)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="suffix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suffix</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={disabled}
                    maxLength={4}
                    placeholder="End with..."
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Characters the address should end with (max 4)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="caseSensitive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Case Sensitive</FormLabel>
                <FormDescription>Match exact case (slower)</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value ?? true} disabled={disabled} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button disabled={disabled} size="lg" type="submit">
            {disabled ? 'Generating...' : 'Find Vanity Address'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
