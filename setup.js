import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const apps = ['web', 'api']

for (const app of apps) {
  const appDir = resolve(import.meta.dir, 'apps', app)
  const envPath = resolve(appDir, '.env')
  const examplePath = resolve(appDir, '.env.example')

  // Skip gracefully if no .env.example
  if (!existsSync(examplePath)) continue

  // Create .env only if it doesn't exist
  if (!existsSync(envPath)) {
    copyFileSync(examplePath, envPath)
    console.log(`✓ apps/${app}: Created .env`)
  }
  // Silent skip if exists (no output clutter)
}
