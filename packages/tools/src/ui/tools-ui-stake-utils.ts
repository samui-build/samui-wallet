import type { Lamports } from '@solana/kit'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import { lamportsToSol } from '@workspace/solana-client/lamports-to-sol'
import { solToLamports } from '@workspace/solana-client/sol-to-lamports'
import type { VoteAccount } from '@workspace/solana-client-react/use-get-vote-accounts'

const DEACTIVATION_EPOCH_INACTIVE = '18446744073709551615'
const STAKE_PERCENT_FORMATTER = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

export function canCloseStakeAccount(account: StakeAccount, authority: string) {
  return (
    account.data.meta.authorized.withdrawer === authority &&
    !account.data.stake &&
    !isStakeLockupInForce(account) &&
    account.lamports > 0n
  )
}

export function canDeactivateStakeAccount(account: StakeAccount, authority: string) {
  return (
    account.data.meta.authorized.staker === authority &&
    !!account.data.stake &&
    account.data.stake.delegation.deactivationEpoch === DEACTIVATION_EPOCH_INACTIVE
  )
}

export function compareVoteAccountsByStake(left: VoteAccount, right: VoteAccount) {
  const stakeDiff = toBigIntLamports(right.activatedStake) - toBigIntLamports(left.activatedStake)

  if (stakeDiff > 0n) {
    return 1
  }
  if (stakeDiff < 0n) {
    return -1
  }

  return left.votePubkey.toString().localeCompare(right.votePubkey.toString())
}

export function formatDeactivationEpoch(epoch: string | undefined) {
  return epoch && epoch !== DEACTIVATION_EPOCH_INACTIVE ? epoch : '-'
}

export function formatStakePercent(stake: bigint, total: bigint) {
  if (total === 0n) {
    return '0%'
  }

  const basisPoints = (stake * 10000n) / total
  return `${STAKE_PERCENT_FORMATTER.format(Number(basisPoints) / 100)}%`
}

export function formatStakeSol(account: StakeAccount) {
  if (!account.data.stake) {
    return '0'
  }

  return lamportsToSol(BigInt(account.data.stake.delegation.stake))
}

export function getPreferredVoteAccount(voteAccounts: readonly VoteAccount[]) {
  return voteAccounts.toSorted(compareVoteAccountsByStake)[0]
}

export function getSortedVoteAccounts(voteAccounts: readonly VoteAccount[]) {
  const preferredVoteAccount = getPreferredVoteAccount(voteAccounts)

  return voteAccounts.toSorted((left, right) => {
    if (preferredVoteAccount) {
      if (left.votePubkey === preferredVoteAccount.votePubkey) {
        return -1
      }
      if (right.votePubkey === preferredVoteAccount.votePubkey) {
        return 1
      }
    }

    return compareVoteAccountsByStake(left, right)
  })
}

export function getStakeAccountBadgeVariant(account: StakeAccount) {
  return getStakeAccountStatus(account) === 'Delegated' ? 'success' : 'secondary'
}

export function getStakeAccountStatus(account: StakeAccount) {
  if (!account.data.stake) {
    return 'Inactive'
  }

  return account.data.stake.delegation.deactivationEpoch === DEACTIVATION_EPOCH_INACTIVE ? 'Delegated' : 'Deactivating'
}

export function getStakeAmountValidation({
  amount,
  rentReserve,
  walletBalance,
}: {
  amount: string
  rentReserve: Lamports | undefined
  walletBalance: Lamports | undefined
}) {
  if (!amount.trim()) {
    return 'Enter an amount.'
  }

  let lamportsAmount: ReturnType<typeof solToLamports>
  try {
    lamportsAmount = solToLamports(amount)
  } catch {
    return 'Enter a valid stake amount.'
  }

  if (lamportsAmount <= 0n) {
    return 'Amount must be greater than 0 SOL.'
  }

  if (rentReserve !== undefined && lamportsAmount <= rentReserve) {
    return `Amount must be greater than the ${lamportsToSol(rentReserve)} SOL rent reserve.`
  }

  if (walletBalance !== undefined && lamportsAmount > walletBalance) {
    return 'Amount exceeds wallet balance.'
  }

  return undefined
}

export function toBigIntLamports(value: VoteAccount['activatedStake']) {
  return BigInt(value.toString())
}

function isStakeLockupInForce(account: StakeAccount) {
  const { epoch, unixTimestamp } = account.data.meta.lockup
  const now = BigInt(Math.floor(Date.now() / 1000))

  return epoch !== '0' || BigInt(unixTimestamp) > now
}
