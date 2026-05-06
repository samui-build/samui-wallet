import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Textarea } from '@workspace/ui/components/textarea'
import { useForm } from 'react-hook-form'
import type { DevDbTableConfig } from '../data-access/dev-db-table-config.ts'
import {
  formatDevDbFieldLabel,
  getDevDbFieldInfo,
  getDevDbSchemaField,
  getDevDbSchemaFields,
} from './dev-db-ui-format.ts'

interface DevDbUiFormProps {
  config: DevDbTableConfig
  defaultValues: Record<string, unknown>
  mode: 'create' | 'update'
  onSubmit: (input: Record<string, unknown>) => Promise<void>
  submitting?: boolean
}

export function DevDbUiForm({ config, defaultValues, mode, onSubmit, submitting }: DevDbUiFormProps) {
  const schema = mode === 'create' ? config.createSchema : config.updateSchema
  const configuredFields = mode === 'create' ? config.createFields : config.updateFields
  const fieldNames = configuredFields ?? getDevDbSchemaFields(schema)
  const form = useForm<Record<string, unknown>>({
    resolver: standardSchemaResolver(schema),
    values: defaultValues,
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((input) => onSubmit(input))}>
        {fieldNames.map((fieldName) => (
          <FormField
            control={form.control}
            key={fieldName}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formatDevDbFieldLabel(fieldName)}</FormLabel>
                <FormControl>
                  <DevDbUiFormControl
                    fieldName={fieldName}
                    onChange={field.onChange}
                    schema={getDevDbSchemaField(schema, fieldName)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end">
          <Button disabled={submitting} size="sm" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

function DevDbUiFormControl({
  fieldName,
  onChange,
  schema,
  value,
}: {
  fieldName: string
  onChange: (value: unknown) => void
  schema: Parameters<typeof getDevDbFieldInfo>[0]
  value: unknown
}) {
  const fieldInfo = getDevDbFieldInfo(schema)

  if (fieldInfo.type === 'boolean') {
    return <Checkbox checked={value === true} onCheckedChange={(checked) => onChange(checked === true)} />
  }

  if (fieldInfo.type === 'date') {
    return (
      <Input
        onChange={(event) => onChange(event.target.value ? new Date(event.target.value) : undefined)}
        type="datetime-local"
        value={formatDateInputValue(value)}
      />
    )
  }

  if (fieldInfo.type === 'enum') {
    return (
      <Select onValueChange={(nextValue) => onChange(nextValue)} {...(typeof value === 'string' ? { value } : {})}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={formatDevDbFieldLabel(fieldName)} />
        </SelectTrigger>
        <SelectContent>
          {fieldInfo.values.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (fieldInfo.type === 'json' || fieldInfo.type === 'array') {
    return (
      <Textarea
        className="font-mono text-xs"
        onChange={(event) => onChange(parseJsonInputValue(event.target.value))}
        rows={6}
        value={formatJsonInputValue(value)}
      />
    )
  }

  if (fieldInfo.type === 'number') {
    return (
      <Input
        onChange={(event) => onChange(event.target.value === '' ? undefined : Number(event.target.value))}
        type="number"
        value={typeof value === 'number' ? value : ''}
      />
    )
  }

  return (
    <Input
      onChange={(event) => onChange(event.target.value)}
      type={getInputType(fieldName)}
      value={typeof value === 'string' ? value : ''}
    />
  )
}

function formatDateInputValue(value: unknown) {
  if (!(value instanceof Date) || Number.isNaN(value.valueOf())) {
    return ''
  }

  const day = padDatePart(value.getDate())
  const hours = padDatePart(value.getHours())
  const minutes = padDatePart(value.getMinutes())
  const month = padDatePart(value.getMonth() + 1)
  const year = value.getFullYear()

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function formatJsonInputValue(value: unknown) {
  if (value === undefined) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }

  return JSON.stringify(value, null, 2)
}

function getInputType(fieldName: string) {
  return fieldName.toLowerCase().includes('endpoint') ? 'url' : 'text'
}

function parseJsonInputValue(value: string) {
  if (!value.trim()) {
    return undefined
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function padDatePart(value: number) {
  return value.toString().padStart(2, '0')
}
