import { setEnv } from '@workspace/env/env'

setEnv({
  activeClusterId: import.meta.env.VITE_ACTIVE_CLUSTER_ID,
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
  clusterDevnet: import.meta.env.VITE_CLUSTER_DEVNET,
  clusterDevnetSubscriptions: import.meta.env.VITE_CLUSTER_DEVNET_SUBSCRIPTIONS,
  clusterLocalnet: import.meta.env.VITE_CLUSTER_LOCALNET,
  clusterLocalnetSubscriptions: import.meta.env.VITE_CLUSTER_LOCALNET_SUBSCRIPTIONS,
  clusterMainnet: import.meta.env.VITE_CLUSTER_MAINNET,
  clusterMainnetSubscriptions: import.meta.env.VITE_CLUSTER_MAINNET_SUBSCRIPTIONS,
  clusterTestnet: import.meta.env.VITE_CLUSTER_TESTNET,
  clusterTestnetSubscriptions: import.meta.env.VITE_CLUSTER_TESTNET_SUBSCRIPTIONS,
})
