import { setEnv } from '@workspace/env/env'

setEnv({
  activeClusterId: import.meta.env.VITE_ACTIVE_CLUSTER_ID,
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
  clusterDevnet: import.meta.env.VITE_CLUSTER_DEVNET,
  clusterLocalnet: import.meta.env.VITE_CLUSTER_LOCALNET,
  clusterMainnet: import.meta.env.VITE_CLUSTER_MAINNET,
  clusterTestnet: import.meta.env.VITE_CLUSTER_TESTNET,
})
