import { spawn } from 'node:child_process'
import { SurfpoolContainer } from '@beeman/testcontainers'

const surfpool = await new SurfpoolContainer()
  .withBlockProductionMode('transaction')
  .withNoDeploy()
  .withSlotTime(100)
  .start()

const env = {
  ...process.env,
  VITE_NETWORK_LOCALNET: surfpool.url,
  VITE_NETWORK_LOCALNET_SUBSCRIPTIONS: surfpool.urlWs,
}

console.log(`Surfpool RPC: ${surfpool.url}`)
console.log(`Surfpool WS: ${surfpool.urlWs}`)

try {
  await run('bun', ['run', 'build'], env)
} catch (error) {
  await surfpool.stop()
  throw error
}

let isStopping = false
const preview = spawn('bun', ['run', 'preview'], { env, stdio: 'inherit' })

preview.on('error', (error) => {
  console.error('Preview process failed to start', error)
  void stop(1)
})

async function run(command: string, args: string[], env: NodeJS.ProcessEnv) {
  const child = spawn(command, args, { env, stdio: 'inherit' })

  return new Promise<void>((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} ${args.join(' ')} failed with ${signal ?? code}`))
    })
  })
}

async function stop(exitCode: number) {
  if (isStopping) {
    return
  }

  isStopping = true
  preview.kill()
  try {
    await surfpool.stop()
  } catch (error) {
    console.error('Failed to stop Surfpool', error)
  }
  process.exit(exitCode)
}

preview.on('exit', (code) => {
  void stop(code ?? 0)
})

process.on('SIGINT', () => {
  void stop(0)
})

process.on('SIGTERM', () => {
  void stop(0)
})
