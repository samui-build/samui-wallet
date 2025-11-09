import { spawn } from 'node:child_process'
import waitOn from 'wait-on'

let surfpoolStarted = false
let surfpool: ReturnType<typeof spawn>

export async function setup() {
  if (surfpoolStarted) {
    return
  }

  try {
    await fetch('http://localhost:8899')
  } catch {
    surfpool = spawn('surfpool', ['start', '--offline', '--no-tui'])
    surfpoolStarted = true

    await waitOn({
      resources: ['tcp:localhost:8899', 'tcp:localhost:8900'],
    })
  }
}

export async function teardown() {
  surfpool?.kill('SIGKILL')
}
