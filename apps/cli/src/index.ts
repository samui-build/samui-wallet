import { Command } from '@effect/cli'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Console, Effect } from 'effect'

const example = Command.make('example', {}, () => Console.log('Samui Wallet'))

const command = Command.make('samui').pipe(Command.withSubcommands([example]))

const cli = Command.run(command, {
  name: 'Samui Wallet CLI',
  version: 'v0.0.0',
})

cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain)
