import { Command } from '@effect/cli'
import { list } from './list.ts'

export const wallets = Command.make('wallets').pipe(Command.withSubcommands([list]))
