import { Command } from '@effect/cli'
import { BunContext, BunRuntime } from '@effect/platform-bun'
import { start } from '@workspace/tui'
import { Effect } from 'effect'
import { wallets } from './commands/wallets/command.ts'

const command = Command.make('samui', {}, () => Effect.sync(() => start())).pipe(Command.withSubcommands([wallets]))

const cli = Command.run(command, {
  name: 'Samui Wallet CLI',
  version: 'v0.0.0',
})

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain)
