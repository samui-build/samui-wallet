import type { DataTag, DefaultError, QueryClient, QueryKey, UndefinedInitialDataOptions } from '@tanstack/react-query'

export async function dbGetOrFetchQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  queryOptions: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> & {
    queryKey: DataTag<TQueryKey, TQueryFnData, TError>
  },
) {
  const state = queryClient.getQueryState(queryOptions.queryKey)
  const data = queryClient.getQueryData(queryOptions.queryKey)
  if (!state || state.isInvalidated || !data) {
    return await queryClient.fetchQuery(queryOptions)
  }

  return data
}
