import { Command } from '@effect/cli'
import { BunContext, BunRuntime } from '@effect/platform-bun'
import { start } from '@workspace/tui'
import { Console, Effect } from 'effect'

const example = Command.make('example', {}, () => Console.log('Samui Wallet'))

const command = Command.make('samui', {}, () => Effect.sync(() => start())).pipe(Command.withSubcommands([example]))

const cli = Command.run(command, {
  name: 'Samui Wallet CLI',
  version: 'v0.0.0',
})

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain)
