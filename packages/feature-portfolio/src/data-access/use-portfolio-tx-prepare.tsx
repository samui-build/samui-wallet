import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { getBalance } from '@workspace/solana-client/get-balance'
import { prepareTransactionSol } from '@workspace/solana-client/prepare-transaction-sol'
import { prepareTransactionSpl } from '@workspace/solana-client/prepare-transaction-spl'
import type { PreparedTransaction } from '@workspace/solana-client/send-prepared-transaction'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { GetTransactionSigner } from '@workspace/solana-client/transaction-signer'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'
import type { TokenBalance } from './use-get-token-balances.ts'

export interface PortfolioPreparedTransaction extends PreparedTransaction {
  mint: TokenBalance
  recipients: TransferRecipient[]
}

export interface PortfolioTxPrepareInput {
  mint: TokenBalance
  recipients: TransferRecipient[]
}

function portfolioTxPrepareQueryOptions({
  client,
  getTransactionSigner,
  input,
  network,
  transactionSignerAddress,
}: {
  client: SolanaClient
  getTransactionSigner: GetTransactionSigner
  input: PortfolioTxPrepareInput | undefined
  network: Network
  transactionSignerAddress: Address
}) {
  const recipients = input?.recipients.map(({ amount, destination }) => ({
    amount: amount.toString(),
    destination,
  }))

  return queryOptions({
    enabled: !!input,
    queryFn: async (): Promise<PortfolioPreparedTransaction> => {
      if (!input) {
        throw new Error('No transaction input')
      }

      const transactionSigner = await getTransactionSigner()
      const preparedTransaction =
        input.mint.mint === NATIVE_MINT
          ? prepareTransactionSol({
              recipients: input.recipients,
              senderBalance: await getBalance(client, { address: transactionSigner.address }).then((res) => res.value),
              transactionSigner,
            })
          : await prepareTransactionSpl(client, {
              mint: input.mint.mint,
              recipients: input.recipients,
              transactionSigner,
            })

      return {
        ...preparedTransaction,
        mint: input.mint,
        recipients: input.recipients,
      }
    },
    queryKey: ['portfolioTxPrepare', network.endpoint, transactionSignerAddress, input?.mint.mint, recipients],
  })
}

export function usePortfolioTxPrepare({
  getTransactionSigner,
  input,
  network,
  transactionSignerAddress,
}: {
  getTransactionSigner: GetTransactionSigner
  input: PortfolioTxPrepareInput | undefined
  network: Network
  transactionSignerAddress: Address
}) {
  const client = useSolanaClient({ network })

  return useQuery(
    portfolioTxPrepareQueryOptions({ client, getTransactionSigner, input, network, transactionSignerAddress }),
  )
}
