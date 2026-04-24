import { queryOptions, useQuery } from '@tanstack/react-query'
import { parseTransactionInspectorInput } from '@workspace/solana-client/parse-transaction-inspector-input'

export function parseTransactionInspectorInputQueryOptions(input: string) {
  const normalizedInput = input.trim()

  return queryOptions({
    enabled: normalizedInput.length > 0,
    queryFn: () => parseTransactionInspectorInput(normalizedInput),
    queryKey: ['parseTransactionInspectorInput', normalizedInput],
  })
}

export function useParseTransactionInspectorInput(input: string) {
  const query = useQuery(parseTransactionInspectorInputQueryOptions(input))

  return {
    data: query.data,
    error: query.error ?? undefined,
    isLoading: query.isLoading,
  }
}
