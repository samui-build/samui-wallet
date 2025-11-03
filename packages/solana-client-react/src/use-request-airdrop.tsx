import type { Address } from "@solana/kit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Cluster } from "@workspace/db/entity/cluster";
import { requestAirdrop } from "@workspace/solana-client/request-airdrop";

import { toastError } from "../../ui/src/lib/toast-error.ts";
import { toastSuccess } from "../../ui/src/lib/toast-success.ts";
import { getAccountInfoQueryOptions } from "./use-get-account-info.tsx";
import { getBalanceQueryOptions } from "./use-get-balance.tsx";
import { useSolanaClient } from "./use-solana-client.tsx";

export function useRequestAirdrop(cluster: Cluster) {
  const client = useSolanaClient({ cluster });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address }: { address: Address }) => {
      return requestAirdrop(client, address);
    },
    onError: () => {
      toastError("Failed to request airdrop. Please try the faucet directly.");
    },
    onSuccess: (_, { address }) => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, cluster }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, cluster })
          .queryKey,
      });

      toastSuccess("Airdrop requested successfully");
    },
  });
}
