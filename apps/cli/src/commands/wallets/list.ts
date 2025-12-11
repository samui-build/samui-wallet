import { Command } from '@effect/cli'
import { Console, Effect } from 'effect'

export const list = Command.make('list', {}, () =>
  Effect.all([
    Console.log('┌────────────────────────────────────────────────────────┐'),
    Console.log('│                        Wallets                         │'),
    Console.log('├────────────────────────────────────────────────────────┤'),
    Console.log('└────────────────────────────────────────────────────────┘'),
  ]),
)
