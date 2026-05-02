import { stringify } from '@workspace/ui/lib/stringify'
import { z } from 'zod'

export interface DevDbFieldInfo {
  isOptional: boolean
  type: 'array' | 'boolean' | 'date' | 'enum' | 'json' | 'number' | 'string'
  values: string[]
}

export function formatDevDbFieldLabel(field: string) {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim()
}

export function formatDevDbTablePath(table: string) {
  return `/dev/db/${table}`
}

export function formatDevDbValue(value: unknown) {
  if (value instanceof Date) {
    return value.toLocaleString()
  }
  if (Array.isArray(value)) {
    return `${value.length} item${value.length === 1 ? '' : 's'}`
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  if (typeof value === 'object' && value !== null) {
    return stringify(value)
  }
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  return String(value)
}

export function getDevDbFieldInfo(schema: z.ZodType | undefined): DevDbFieldInfo {
  const { isOptional, schema: fieldSchema } = unwrapDevDbSchema(schema)

  if (fieldSchema instanceof z.ZodArray) {
    return { isOptional, type: 'array', values: [] }
  }
  if (fieldSchema instanceof z.ZodBoolean) {
    return { isOptional, type: 'boolean', values: [] }
  }
  if (fieldSchema instanceof z.ZodDate) {
    return { isOptional, type: 'date', values: [] }
  }
  if (fieldSchema instanceof z.ZodEnum) {
    return { isOptional, type: 'enum', values: fieldSchema.options.map((option) => String(option)).sort() }
  }
  if (fieldSchema instanceof z.ZodNumber) {
    return { isOptional, type: 'number', values: [] }
  }
  if (fieldSchema instanceof z.ZodString || fieldSchema instanceof z.ZodURL || isStringUnionSchema(fieldSchema)) {
    return { isOptional, type: 'string', values: [] }
  }

  return { isOptional, type: 'json', values: [] }
}

export function getDevDbSchemaField(schema: z.ZodObject, field: string): z.ZodType | undefined {
  return schema.shape[field]
}

export function getDevDbSchemaFields(schema: z.ZodObject) {
  return Object.keys(schema.shape).sort()
}

export function getDevDbTitle(item: Record<string, unknown>, titleField: string) {
  const value = item[titleField]
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
    ? formatDevDbValue(item['id'])
    : formatDevDbValue(value)
}

function unwrapDevDbSchema(schema: z.ZodType | undefined) {
  let current = schema
  let isOptional = false

  while (current) {
    if (current instanceof z.ZodDefault || current instanceof z.ZodOptional) {
      current = current.unwrap() as z.ZodType
      isOptional = true
      continue
    }
    if (current instanceof z.ZodNullable) {
      current = current.unwrap() as z.ZodType
      continue
    }

    return { isOptional, schema: current }
  }

  return { isOptional: true, schema: z.unknown() as z.ZodType }
}

function isStringLiteralSchema(schema: z.ZodType) {
  return schema instanceof z.ZodLiteral && [...schema.values].every((value) => typeof value === 'string')
}

function isStringUnionSchema(schema: z.ZodType) {
  return (
    schema instanceof z.ZodUnion &&
    schema.options.every((option) => {
      const { schema: unionSchema } = unwrapDevDbSchema(option as z.ZodType)
      return unionSchema instanceof z.ZodString || unionSchema instanceof z.ZodURL || isStringLiteralSchema(unionSchema)
    })
  )
}
