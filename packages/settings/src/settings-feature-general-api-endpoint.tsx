import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useSetting } from '@workspace/db-react/use-setting'
import { useTranslation } from '@workspace/i18n'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const apiEndpointSchema = z.object({
  apiEndpoint: z.url({ hostname: z.regexes.hostname, protocol: /^https?$/ }).nonempty(),
})

type ApiEndpointForm = z.infer<typeof apiEndpointSchema>

export function SettingsFeatureGeneralApiEndpoint() {
  const { t } = useTranslation('settings')
  const [apiEndpoint, setApiEndpoint] = useSetting('apiEndpoint')

  const form = useForm<ApiEndpointForm>({
    mode: 'all',
    resolver: standardSchemaResolver(apiEndpointSchema),
    values: { apiEndpoint: apiEndpoint ?? '' },
  })

  const handleSave = async (value: string) => {
    const isValid = await form.trigger('apiEndpoint')
    if (isValid) {
      setApiEndpoint(value.trim())
      toastSuccess('API Endpoint value updated')
    }
  }

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="apiEndpoint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(($) => $.pageGeneralApiEndpoint)}</FormLabel>
            <FormControl>
              <Input
                {...field}
                onBlur={(e) => {
                  field.onBlur()
                  handleSave(e.target.value)
                }}
                placeholder="https://api.samui.build"
                type="url"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
