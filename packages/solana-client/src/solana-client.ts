import type {
  ClusterUrl,
  Rpc,
  RpcSubscriptions,
  RpcTransportFromClusterUrl,
  SolanaRpcApiFromTransport,
  SolanaRpcSubscriptionsApi,
} from '@solana/kit'

export type SolanaRpcMethodsFromClusterUrl<TClusterUrl extends ClusterUrl> = SolanaRpcApiFromTransport<
  RpcTransportFromClusterUrl<TClusterUrl>
>

export type SolanaClient<TClusterUrl extends ClusterUrl = string> = {
  rpc: Rpc<SolanaRpcMethodsFromClusterUrl<TClusterUrl>>
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>
}
