import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useSetting } from '@workspace/db-react/use-setting'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const apiSettingsSchema = z.object({
  apiEndpoint: z
    .url({ hostname: z.regexes.hostname, protocol: /^https?$/ })
    .trim()
    .nonempty(),
})

type ApiSettingsForm = z.infer<typeof apiSettingsSchema>

export function SettingsFeatureGeneralApiSettings() {
  const { t } = useTranslation('settings')
  const [apiEndpoint, setApiEndpoint] = useSetting('apiEndpoint')

  const form = useForm<ApiSettingsForm>({
    resolver: standardSchemaResolver(apiSettingsSchema),
    values: { apiEndpoint: apiEndpoint ?? '' },
  })

  async function submit(input: ApiSettingsForm) {
    await setApiEndpoint(input.apiEndpoint)
    toastSuccess('API Endpoint value updated')
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name="apiEndpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(($) => $.pageGeneralApiEndpoint)}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://api.samui.build" type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            disabled={!form.formState.isValid || !form.formState.dirtyFields.apiEndpoint || form.formState.isSubmitting}
            size="lg"
            type="submit"
          >
            {t(($) => $.actionSave)}
          </Button>
        </div>
      </form>
    </Form>
  )
}
